import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import '../styles/PlanoDeAcao.css';

type Grau = "Uso saudável" | "Dependência leve" | "Dependência moderada" | "Dependência severa";
type FaixaEtaria = "0-4 anos" | "5-9 anos";
type ActiveTab = "sugestoes" | "realizadas";

interface ActivityState {
    feita: boolean;
    comentario: string;
    avaliacao: number;
    saved: boolean;
    originalIndex: number;
    id_atividade?: number;
    id_plano?: number;
}

interface PlanoApi {
    titulo: string;
    sugestoes: string[];
    grauDependencia: Grau;
    faixaEtaria: FaixaEtaria;
    id_plano?: number;
    atividades?: { id_atividade: number; descricao: string }[];
}

export default function PlanoDeAcao() {
    const location = useLocation();
    const navigate = useNavigate();

    // Pega userId do location.state
    const userId = location.state?.userId;

    // Suponha que você tenha um jeito de pegar o token (ex: contexto, localStorage, etc)
    // Ajuste esta linha conforme seu fluxo de autenticação:
    const token = localStorage.getItem("token") || "";

    const [planoAtual, setPlanoAtual] = useState<PlanoApi | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [activitiesState, setActivitiesState] = useState<ActivityState[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("sugestoes");

    const getStorageKey = (faixaEtaria: FaixaEtaria, grauDependencia: Grau) => {
        const cleanFaixaEtaria = faixaEtaria.replace(/[^a-zA-Z0-9]/g, '');
        const cleanGrauDependencia = grauDependencia.replace(/[^a-zA-Z0-9]/g, '');
        return `registros_${cleanFaixaEtaria}_${cleanGrauDependencia}_${userId || "anon"}`;
    };

    const createDefaultActivityState = (index: number): ActivityState => ({
        feita: false,
        comentario: "",
        avaliacao: 0,
        saved: false,
        originalIndex: index,
    });

    const fetchPlanoUsuario = async () => {
        if (!userId) {
            setErrorMsg("Usuário não identificado. Faça login novamente.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/obterPlanoUsuario', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`Erro na API: ${response.statusText}`);
            }

            const data: PlanoApi = await response.json();

            if (!data || !data.sugestoes || !data.titulo) {
                throw new Error("Plano inválido recebido da API.");
            }

            setPlanoAtual(data);

            const storageKey = getStorageKey(data.faixaEtaria, data.grauDependencia);
            const registroSalvo = localStorage.getItem(storageKey);
            let initialActivities: ActivityState[] = [];

            if (registroSalvo) {
                try {
                    const progressoAtual = JSON.parse(registroSalvo);
                    if (
                        progressoAtual &&
                        progressoAtual.activities &&
                        progressoAtual.grau === data.grauDependencia &&
                        progressoAtual.faixaEtaria === data.faixaEtaria
                    ) {
                        initialActivities = progressoAtual.activities.filter((activity: ActivityState) =>
                            typeof activity.originalIndex === 'number' &&
                            activity.originalIndex < data.sugestoes.length
                        );
                    }
                } catch {
                    // ignorar erro de JSON
                }
            }

            const mergedActivities = data.sugestoes.map((_, index) => {
                const savedActivity = initialActivities.find(act => act.originalIndex === index);
                const defaultActivity = createDefaultActivityState(index);

                const id_atividade = data.atividades && data.atividades[index]?.id_atividade;

                return {
                    ...defaultActivity,
                    ...savedActivity,
                    id_atividade,
                    id_plano: data.id_plano,
                };
            });

            setActivitiesState(mergedActivities);

        } catch (error: any) {
            setErrorMsg(error.message || "Erro desconhecido ao carregar plano.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlanoUsuario();
    }, []);

    const toggleActivity = (originalIndex: number) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const idx = newState.findIndex(act => act.originalIndex === originalIndex);
            if (idx === -1) return prev;
            const current = newState[idx];
            if (!current.saved) {
                const updated = { ...current, feita: !current.feita };
                if (!updated.feita) {
                    updated.comentario = "";
                    updated.avaliacao = 0;
                }
                newState[idx] = updated;
            }
            return newState;
        });
    };

    const updateComment = (originalIndex: number, text: string) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const idx = newState.findIndex(act => act.originalIndex === originalIndex);
            if (idx === -1) return prev;
            const current = newState[idx];
            if (!current.saved) {
                newState[idx] = { ...current, comentario: text };
            }
            return newState;
        });
    };

    const updateRating = (originalIndex: number, nota: number) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const idx = newState.findIndex(act => act.originalIndex === originalIndex);
            if (idx === -1) return prev;
            const current = newState[idx];
            if (!current.saved) {
                newState[idx] = { ...current, avaliacao: nota };
            }
            return newState;
        });
    };

    const enviarAtividadeParaBackend = async (activity: ActivityState) => {
        if (!userId || !planoAtual) {
            alert("Usuário ou plano não encontrado para salvar atividade no servidor.");
            return false;
        }
        if (activity.id_atividade == null || planoAtual.id_plano == null) {
            alert("IDs da atividade ou plano não encontrados.");
            return false;
        }

        try {
            const response = await fetch('/api/diario-atividade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_atividade: activity.id_atividade,
                    id_plano: planoAtual.id_plano,
                    feita: activity.feita,
                    comentario: activity.comentario,
                    avaliacao: activity.avaliacao,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                alert(`Erro ao salvar atividade no servidor: ${errorData.message || response.statusText}`);
                return false;
            }

            return true;

        } catch (error) {
            alert("Erro de rede ao salvar atividade.");
            return false;
        }
    };

    const saveActivity = async (activityToSave: ActivityState) => {
        if (!planoAtual) return;

        if (!activityToSave.feita || (activityToSave.avaliacao === 0 && activityToSave.comentario.trim() === "")) {
            alert("Para salvar, marque a atividade como concluída E adicione uma avaliação/comentário.");
            return;
        }
        if (activityToSave.saved) {
            alert("Esta atividade já foi salva e não pode ser alterada.");
            return;
        }

        const sucesso = await enviarAtividadeParaBackend(activityToSave);
        if (!sucesso) return;

        setActivitiesState(prev => {
            const newState = prev.map(activity => {
                if (activity.originalIndex === activityToSave.originalIndex) {
                    return { ...activity, saved: true };
                }
                return activity;
            });

            const registroParaSalvar = {
                grau: planoAtual.grauDependencia,
                faixaEtaria: planoAtual.faixaEtaria,
                activities: newState,
                data: new Date().toLocaleString(),
            };

            const storageKey = getStorageKey(planoAtual.faixaEtaria, planoAtual.grauDependencia);
            localStorage.setItem(storageKey, JSON.stringify(registroParaSalvar));
            alert("Atividade salva com sucesso!");
            return newState;
        });
    };

    if (loading) {
        return <div>Carregando plano de ação...</div>;
    }

    if (errorMsg) {
        return (
            <div>
                <p>Erro: {errorMsg}</p>
                <button onClick={() => navigate('/questionario')}>Voltar ao questionário</button>
            </div>
        );
    }

    if (!planoAtual) {
        return <div>Plano de ação não encontrado.</div>;
    }

    const allActivitiesAreSaved = activitiesState.length > 0 && activitiesState.every(activity => activity.saved);

    const activitiesToDisplay = activeTab === "sugestoes"
        ? activitiesState.filter(activity => !activity.saved)
        : activitiesState.filter(activity => activity.saved);

    return (
        <div className="plano-container">
            <h2>{planoAtual.titulo}</h2>
            <h4>Grau de Dependência: {planoAtual.grauDependencia}</h4>
            <h4>Faixa Etária: {planoAtual.faixaEtaria}</h4>

            <div className="tab-navigation">
                <button
                    className={activeTab === "sugestoes" ? "active-tab" : ""}
                    onClick={() => setActiveTab("sugestoes")}
                >
                    Sugestões de Atividades ({activitiesState.filter(a => !a.saved).length})
                </button>
                <button
                    className={activeTab === "realizadas" ? "active-tab" : ""}
                    onClick={() => setActiveTab("realizadas")}
                >
                    Atividades Realizadas ({activitiesState.filter(a => a.saved).length})
                </button>
            </div>

            <div className="plan-of-action">
                {allActivitiesAreSaved && activeTab === "sugestoes" && (
                    <div className="completion-message">
                        <h3>Parabéns! Todas as atividades sugeridas foram concluídas!</h3>
                        <p>
                            Sua dedicação é fundamental para o desenvolvimento saudável da criança. Lembre-se de que o acompanhamento é um processo contínuo.
                            <b> Continue realizando atividades offline e buscando novas experiências com seu filho(a).</b>
                        </p>
                        <p>
                            Para um suporte mais aprofundado e personalizado, <b>recomendamos o acompanhamento de um profissional qualificado, como um psicólogo infantil ou pedagogo.</b> Eles podem oferecer orientações valiosas para a jornada da criança e da família.
                        </p>
                    </div>
                )}

                {activitiesToDisplay.length === 0 && activeTab === "realizadas" && !allActivitiesAreSaved && (
                    <p className="no-activities-message">
                        Você ainda não concluiu ou salvou nenhuma atividade. Comece marcando as sugestões no painel "Sugestões de Atividades".
                    </p>
                )}

                {activitiesToDisplay.length === 0 && activeTab === "sugestoes" && (
                    <p className="no-activities-message">
                        Não há atividades sugeridas para mostrar.
                    </p>
                )}

                {activitiesToDisplay.map(activity => {
                    const index = activity.originalIndex;
                    return (
                        <div
                            key={index}
                            className={`activity-item ${activity.saved ? "saved-activity" : ""}`}
                        >
                            <div className="activity-header">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={activity.feita}
                                        disabled={activity.saved}
                                        onChange={() => toggleActivity(index)}
                                    />{" "}
                                    {planoAtual.sugestoes[index]}
                                </label>
                            </div>

                            {activity.feita && (
                                <div className="activity-details">
                                    <textarea
                                        placeholder="Comentário (opcional)"
                                        disabled={activity.saved}
                                        value={activity.comentario}
                                        onChange={e => updateComment(index, e.target.value)}
                                    />
                                    <div className="rating-container">
                                        <span>Avaliação: </span>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                disabled={activity.saved}
                                                className={activity.avaliacao >= star ? "star-selected" : "star"}
                                                onClick={() => updateRating(index, star)}
                                                type="button"
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                    {!activity.saved && (
                                        <button
                                            className="save-button"
                                            onClick={() => saveActivity(activity)}
                                        >
                                            Salvar Atividade
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
