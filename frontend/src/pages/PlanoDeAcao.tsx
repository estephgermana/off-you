import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

// Função para decodificar token JWT e extrair payload
function parseJwt(token: string | null) {
    if (!token) return null;
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch {
        return null;
    }
}

export default function PlanoDeAcao() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token") || "";
    const payload = parseJwt(token);
    const userId = payload?.id_usuario;

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
            const response = await axios.get<PlanoApi>('https://off-you.onrender.com/v1/obterPlanoUsuario', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data;

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
                    // ignorar erro JSON
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
            setErrorMsg(error.response?.data?.message || error.message || "Erro desconhecido ao carregar plano.");
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
            const response = await axios.post('https://off-you.onrender.com/v1/diario-atividade', {
                id_atividade: activity.id_atividade,
                id_plano: planoAtual.id_plano,
                feita: activity.feita,
                comentario: activity.comentario,
                avaliacao: activity.avaliacao,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status !== 200 && response.status !== 201) {
                alert(`Erro ao salvar atividade no servidor: ${response.statusText}`);
                return false;
            }

            return true;

        } catch (error: any) {
            alert(error.response?.data?.message || "Erro de rede ao salvar atividade.");
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
                <button onClick={() => navigate('/login')}>Voltar ao login</button>
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

            <div className="tab-navigation">
                <button
                    className={activeTab === "sugestoes" ? "active-tab" : ""}
                    onClick={() => setActiveTab("sugestoes")}
                >
                    Sugestões de Atividades ({activitiesToDisplay.filter(a => !a.saved).length})
                </button>
                <button
                    className={activeTab === "realizadas" ? "active-tab" : ""}
                    onClick={() => setActiveTab("realizadas")}
                >
                    Atividades Realizadas ({activitiesToDisplay.filter(a => a.saved).length})
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
                        Você ainda não concluiu ou salvou nenhuma atividade. Comece marcando as sugestões!
                    </p>
                )}

                {activitiesToDisplay.length === 0 && activeTab === "sugestoes" && !allActivitiesAreSaved && (
                    <p className="no-activities-message">
                        Todas as atividades sugeridas foram salvas. Verifique a aba "Atividades Realizadas".
                    </p>
                )}

                {activitiesToDisplay.map((activity) => {
                    const idx = activity.originalIndex;
                    const descricao = planoAtual.sugestoes[idx];
                    if (descricao === undefined) {
                        console.warn(`Descrição indefinida para originalIndex ${idx}. Pulando.`);
                        return null;
                    }

                    const isSaveButtonEnabled =
                        !activity.saved &&
                        activity.feita &&
                        (activity.avaliacao > 0 || activity.comentario.trim() !== "");

                    return (
                        <div className="card" key={idx}>
                            <h4>
                                Atividade {idx + 1}
                                {activity.saved && (
                                    <span className="activity-status"> Concluída! ✅</span>
                                )}
                            </h4>
                            <p>{descricao}</p>

                            <div className="atividade-detalhe">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={activity.feita}
                                        disabled={activity.saved}
                                        onChange={() => toggleActivity(idx)}
                                    />
                                    Marcar como concluída
                                </label>
                            </div>

                            {(activity.feita || activity.saved) && (
                                <>
                                    <div className="avaliacao-box">
                                        <label>Avalie a atividade:</label>
                                        <div className="avaliacao-botoes">
                                            {[1, 2, 3, 4, 5].map((nota) => (
                                                <button
                                                    key={nota}
                                                    className={activity.avaliacao === nota ? "selecionado" : ""}
                                                    onClick={() => updateRating(idx, nota)}
                                                    disabled={activity.saved}
                                                >
                                                    {nota}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="comentario-box-card">
                                        <label>Fale mais sobre a experiência:</label>
                                        <textarea
                                            placeholder="Escreva sua experiência com essa atividade..."
                                            value={activity.comentario}
                                            onChange={(e) => updateComment(idx, e.target.value)}
                                            disabled={activity.saved}
                                        />
                                    </div>

                                    <button
                                        className="salvar-atividade-individual"
                                        onClick={() => saveActivity(activity)}
                                        disabled={!isSaveButtonEnabled}
                                    >
                                        Salvar Atividade
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
