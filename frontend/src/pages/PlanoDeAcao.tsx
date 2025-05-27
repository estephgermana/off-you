import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
}

const planosDeAcaoDetalhado: Record<FaixaEtaria, Record<Grau, { titulo: string; sugestoes: string[] }>> = {
    '0-4 anos': {
        'Uso saudável': {
            titulo: 'Plano de Ação: Uso Saudável (0-4 anos)',
            sugestoes: [
                'Mantenha o ambiente familiar rico em estímulos offline (brinquedos, livros, atividades ao ar livre).',
                'Limite o tempo de tela para no máximo 1 hora por dia, sempre com supervisão.',
                'Priorize brincadeiras interativas e tempo de qualidade em família.',
                'Crie momentos de "desconexão" programados para toda a família.',
                'Apresente novas texturas e sons através de brincadeiras sensoriais.',
                'Incentive o uso de blocos e encaixes para desenvolver coordenação.'
            ]
        },
        'Dependência leve': {
            titulo: 'Plano de Ação: Dependência Leve (0-4 anos)',
            sugestoes: [
                'Crie rotinas bem definidas para o uso de telas, com horários fixos e curtos.',
                'Ofereça alternativas divertidas e envolventes longe das telas, como pintura, massinha, blocos de montar.',
                'Aumente o tempo de interação um-a-um com a criança, com brincadeiras que estimulem a criatividade e a coordenação motora.',
                'Utilize temporizadores visíveis para o tempo de tela.',
                'Comece a explorar parques e playgrounds como principal fonte de diversão.',
                'Cante músicas e leia livros interativos para desviar o foco das telas.'
            ]
        },
        'Dependência moderada': {
            titulo: 'Plano de Ação: Dependência Moderada (0-4 anos)',
            sugestoes: [
                'Reduza drasticamente o tempo de tela, preferencialmente eliminando-o temporariamente para reeducação.',
                'Busque atividades sensoriais e motoras que capturem a atenção da criança (parques, natação, caça ao tesouro).',
                'Considere a busca por apoio profissional (pediatra, psicólogo infantil) para orientação e manejo do comportamento.',
                'Crie um "canto offline" em casa com brinquedos e livros convidativos.',
                'Organize encontros com outras crianças para brincadeiras em grupo.',
                'Pratique jogos de imitação e faz de conta para estimular a criatividade.'
            ]
        },
        'Dependência severa': {
            titulo: 'Plano de Ação: Dependência Severa (0-4 anos)',
            sugestoes: [
                'Intervenção imediata: corte total do acesso às telas e remoção de dispositivos eletrônicos do ambiente da criança.',
                'Busque apoio psicológico e pedagógico especializado para a criança e a família.',
                'Crie um ambiente rico em estímulos não digitais e promova o máximo de interação social e física.',
                'Trabalhe com o profissional para um "detox digital" gradual ou abrupto, conforme a recomendação.',
                'Priorize terapias de brincadeira e desenvolvimento infantil.',
                'Documente e compartilhe os comportamentos e avanços com os especialistas.'
            ]
        }
    },
    '5-9 anos': {
        'Uso saudável': {
            titulo: 'Plano de Ação: Uso Saudável (5-9 anos)',
            sugestoes: [
                'Incentive o uso consciente da internet para aprendizado e lazer, com supervisão parental.',
                'Estimule hobbies e atividades extracurriculares (esportes, música, artes).',
                'Mantenha o diálogo aberto sobre os perigos e benefícios da internet, ensinando sobre segurança online.',
                'Estabeleça "zonas livres de tela" em casa, como a mesa de jantar.',
                'Promova jogos de tabuleiro e atividades em grupo sem tecnologia.',
                'Incentive a leitura de livros de acordo com a idade e interesses.'
            ]
        },
        'Dependência leve': {
            titulo: 'Plano de Ação: Dependência Leve (5-9 anos)',
            sugestoes: [
                'Defina regras claras de tempo de tela e conteúdo, com acordos e consequências.',
                'Incentive a participação em atividades em grupo e brincadeiras ao ar livre com amigos.',
                'Explore novos interesses e talentos da criança que não envolvam telas, como leitura, jogos de tabuleiro ou culinária.',
                'Crie um "contrato de tela" com a criança, com metas e recompensas.',
                'Ajude a criança a encontrar amigos para brincar presencialmente.',
                'Limitem o uso de telas antes de dormir para melhorar a qualidade do sono.'
            ]
        },
        'Dependência moderada': {
            titulo: 'Plano de Ação: Dependência Moderada (5-9 anos)',
            sugestoes: [
                'Estabeleça um cronograma rigoroso de uso da internet, com períodos de "desintoxicação digital".',
                'Aumente o envolvimento em atividades familiares e sociais, buscando reconectar a criança com o mundo real.',
                'Considere a busca por aconselhamento psicológico para a criança e orientação para os pais.',
                'Implemente "dias sem tela" ou "períodos de tela zero".',
                'Incentive a participação em esportes ou clubes que exijam foco e disciplina.',
                'Ensine a criança a identificar e expressar suas emoções, buscando alternativas à fuga para as telas.'
            ]
        },
        'Dependência severa': {
            titulo: 'Plano de Ação: Dependência Severa (5-9 anos)',
            sugestoes: [
                'Intervenção profissional é crucial: procure um psicólogo infantil ou psiquiatra especializado em dependência digital.',
                'Restrição total ou quase total do acesso à internet, com acompanhamento e supervisão constante.',
                'Implemente um plano de reabilitação que inclua terapias, atividades sociais e educacionais, e apoio familiar intensivo.',
                'Crie um ambiente que favoreça a interação social e atividades físicas, longe de dispositivos.',
                'Colabore ativamente com a escola para monitorar o comportamento e o desempenho.',
                'Prepare-se para possíveis resistências e trabalhe com a criança e a família para entender a raiz da dependência.'
            ]
        }
    }
};

export default function PlanoDeAcao() {
    const location = useLocation();
    const navigate = useNavigate();
    const { faixaEtaria: faixaEtariaParam } = useParams<{ faixaEtaria: string }>();

    const grauDependencia = (location.state?.grau as Grau) || "Uso saudável";
    const faixaEtaria = (faixaEtariaParam as FaixaEtaria) || "0-4 anos";

    const planoAtual = planosDeAcaoDetalhado[faixaEtaria]?.[grauDependencia];

    const [activitiesState, setActivitiesState] = useState<ActivityState[]>([]);
    const [activeTab, setActiveTab] = useState<ActiveTab>("sugestoes");

    const getStorageKey = (fe: FaixaEtaria, gd: Grau) => {
        const cleanFaixaEtaria = fe.replace(/[^a-zA-Z0-9]/g, '');
        const cleanGrauDependencia = gd.replace(/[^a-zA-Z0-9]/g, '');
        return `registros_${cleanFaixaEtaria}_${cleanGrauDependencia}`;
    };

    const createDefaultActivityState = (index: number): ActivityState => ({
        feita: false,
        comentario: "",
        avaliacao: 0,
        saved: false,
        originalIndex: index,
    });

    useEffect(() => {
        if (!planoAtual || !Object.keys(planosDeAcaoDetalhado).includes(faixaEtaria)) {
            console.warn("Plano de ação não encontrado para a combinação de faixa etária e grau. Redirecionando.");
            navigate('/questionario');
            return;
        }

        const storageKey = getStorageKey(faixaEtaria, grauDependencia);
        const registroSalvo = localStorage.getItem(storageKey);

        let initialActivities: ActivityState[] = [];

        if (registroSalvo) {
            try {
                const progressoAtual = JSON.parse(registroSalvo);
                if (progressoAtual && progressoAtual.activities &&
                    progressoAtual.grau === grauDependencia &&
                    progressoAtual.faixaEtaria === faixaEtaria) {
                    initialActivities = progressoAtual.activities.filter((activity: ActivityState) =>
                        typeof activity.originalIndex === 'number' && activity.originalIndex < planoAtual.sugestoes.length
                    );
                } else {
                    console.log("Mismatched or invalid saved data, initializing new activities.");
                }
            } catch (e) {
                console.error("Erro ao parsear registro do localStorage, inicializando novas atividades:", e);
            }
        }

        const mergedActivities = planoAtual.sugestoes.map((_, index) => {
            const savedActivity = initialActivities.find(act => act.originalIndex === index);
            return savedActivity || createDefaultActivityState(index);
        });

        setActivitiesState(mergedActivities);

    }, [planoAtual, faixaEtaria, grauDependencia, navigate]);


    const toggleActivity = (originalIndex: number) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const activityIndexInState = newState.findIndex(act => act.originalIndex === originalIndex);

            if (activityIndexInState === -1) {
                console.warn(`Activity with originalIndex ${originalIndex} not found in state.`);
                return prev;
            }

            const currentActivity = newState[activityIndexInState];

            if (!currentActivity.saved) {
                const updatedActivity = { ...currentActivity, feita: !currentActivity.feita };
                if (!updatedActivity.feita) {
                    updatedActivity.comentario = "";
                    updatedActivity.avaliacao = 0;
                }
                newState[activityIndexInState] = updatedActivity;
            }
            return newState;
        });
    };

    const updateComment = (originalIndex: number, text: string) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const activityIndexInState = newState.findIndex(act => act.originalIndex === originalIndex);
            if (activityIndexInState === -1) return prev;

            const currentActivity = newState[activityIndexInState];
            if (!currentActivity.saved) {
                newState[activityIndexInState] = { ...currentActivity, comentario: text };
            }
            return newState;
        });
    };

    const updateRating = (originalIndex: number, nota: number) => {
        setActivitiesState(prev => {
            const newState = [...prev];
            const activityIndexInState = newState.findIndex(act => act.originalIndex === originalIndex);
            if (activityIndexInState === -1) return prev;

            const currentActivity = newState[activityIndexInState];
            if (!currentActivity.saved) {
                newState[activityIndexInState] = { ...currentActivity, avaliacao: nota };
            }
            return newState;
        });
    };

    const saveActivity = (activityToSave: ActivityState) => {
        if (!planoAtual) {
            console.warn("Plano de ação não disponível, não é possível salvar.");
            return;
        }

        if (!activityToSave.feita || (activityToSave.avaliacao === 0 && activityToSave.comentario.trim() === "")) {
            alert("Para salvar, marque a atividade como concluída E adicione uma avaliação/comentário.");
            return;
        }

        if (activityToSave.saved) {
            alert("Esta atividade já foi salva e não pode ser alterada.");
            return;
        }

        setActivitiesState(prev => {
            const newState = prev.map(activity => {
                if (activity.originalIndex === activityToSave.originalIndex) {
                    return { ...activity, saved: true };
                }
                return activity;
            });

            const registroParaSalvar = {
                grau: grauDependencia,
                faixaEtaria: faixaEtaria,
                activities: newState,
                data: new Date().toLocaleString(),
            };

            const storageKey = getStorageKey(faixaEtaria, grauDependencia);
            localStorage.setItem(storageKey, JSON.stringify(registroParaSalvar));
            console.log(`Atividade ${activityToSave.originalIndex + 1} salva para ${faixaEtaria} - ${grauDependencia}`);
            alert("Atividade salva com sucesso!");
            return newState;
        });
    };

    if (!planoAtual) {
        return <div>Carregando Plano de Ação ou redirecionando...</div>;
    }

    const allActivitiesAreSaved = activitiesState.length > 0 && activitiesState.every(activity => activity.saved);

    const activitiesToDisplay = activeTab === "sugestoes"
        ? activitiesState.filter(activity => !activity.saved)
        : activitiesState.filter(activity => activity.saved);

    return (
        <div className="plano-container">
            <h2>{planoAtual.titulo}</h2>
            <h4>Grau de Dependência: {grauDependencia}</h4>
            <h4>Faixa Etária: {faixaEtaria}</h4>

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
                            **Continue realizando atividades offline e buscando novas experiências com seu filho(a).**
                        </p>
                        <p>
                            Para um suporte mais aprofundado e personalizado, **recomendamos o acompanhamento de um profissional qualificado, como um psicólogo infantil ou pedagogo.** Eles podem oferecer orientações valiosas para a jornada da criança e da família.
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
                    const suggestionText = planoAtual.sugestoes[activity.originalIndex];

                    if (suggestionText === undefined) {
                        console.warn(`Suggestion text undefined for originalIndex ${activity.originalIndex}. Skipping card.`);
                        return null;
                    }

                    const isSaveButtonEnabled =
                        !activity.saved &&
                        activity.feita &&
                        (activity.avaliacao > 0 || activity.comentario.trim() !== "");

                    return (
                        <div className="card" key={activity.originalIndex}>
                            <h4>
                                Atividade {activity.originalIndex + 1}
                                {activity.saved && (
                                    <span className="activity-status"> Concluída! ✅</span>
                                )}
                            </h4>
                            <p>{suggestionText}</p>

                            <div className="atividade-detalhe">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={activity.feita}
                                        onChange={() => toggleActivity(activity.originalIndex)}
                                        disabled={activity.saved}
                                    />
                                    Marcar como concluída
                                </label>
                            </div>

                            { (activity.feita || activity.saved) && (
                                <>
                                    <div className="avaliacao-box">
                                        <label>Avalie a atividade:</label>
                                        <div className="avaliacao-botoes">
                                            {[1, 2, 3, 4, 5].map((nota) => (
                                                <button
                                                    key={nota}
                                                    className={activity.avaliacao === nota ? "selecionado" : ""}
                                                    onClick={() => updateRating(activity.originalIndex, nota)}
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
                                            value={activity.comentario}
                                            onChange={(e) => updateComment(activity.originalIndex, e.target.value)}
                                            placeholder="Escreva sua experiência com essa atividade..."
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
