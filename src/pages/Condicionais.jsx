import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";

// Importing the api service to fetch products from the backend
import { getCondicionais } from "../services/condicionais.js";

export default function Condicionais() {
    const [condicionais, setCondicionais] = useState([]);
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;
    const [filtro, setFiltro] = useState("aberto");

    useEffect(() => {
        loadCondicionais();
    }, []);

    async function loadCondicionais() {
        try {
            const response = await getCondicionais();
            setCondicionais(response.data);
        } catch (error) {
            console.error("Erro ao carregar condicionais:", error);
        }
    }

    const condicionaisFiltrados = condicionais.filter((c) => {
        if (filtro === "todos") return true;
        return c.status_condicional === filtro;
    });

    function formatarData(dataStr) {
        const data = new Date(dataStr);
        return data.toLocaleDateString("pt-BR");
    }

    return (
        <div className={`min-h-screen ${t.bgPagina} flex flex-col`}>
            <div
                className={`${t.bgTopbar} border-b ${t.bordaTopbar} px-5 lg:px-10 py-4 flex items-center gap-3 sticky top-0 z-10`}
            >
                <button
                    onClick={() => navigate("/menu")}
                    className={`w-9 h-9 rounded-lg border ${t.botaoVoltar} flex items-center justify-center transition`}
                >
                    ←
                </button>
                <span
                    className={`font-semibold text-base lg:text-lg flex-1 ${t.textoTopbar}`}
                >
                    Condicionais
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
                <div className="flex gap-2 mb-6 flex-wrap">
                    {[
                        ["aberto", "Abertos"],
                        ["encerrado", "Encerrados"],
                        ["todos", "Todos"],
                    ].map(([val, label]) => (
                        <button
                            key={val}
                            onClick={() => setFiltro(val)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filtro === val ? t.filtroAtivo : t.filtroInativo}`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    {condicionaisFiltrados.length === 0 && (
                        <div
                            className={`col-span-2 text-center py-16 ${t.textoSecundario}`}
                        >
                            <div className="text-4xl mb-3">📭</div>
                            <div className="text-sm">
                                Nenhum condicional encontrado
                            </div>
                        </div>
                    )}

                    {condicionaisFiltrados.map((c) => (
                        <button
                            key={c.id}
                            onClick={() => navigate(`/condicionais/${c.id}`)}
                            className={`${t.bgCard} border rounded-xl p-4 lg:p-5 text-left hover:shadow-lg hover:-translate-y-0.5 transition ${t.hoverCard}  w-full 
                ${c.status_condicional === "aberto" ? t.bordaAccent : t.bordaCard}
                ${c.status_condicional === "encerrado" ? "opacity-60" : ""}`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div
                                        className={`font-semibold text-sm lg:text-base ${t.textoPrimario}`}
                                    >
                                        {c.nome_cliente}
                                    </div>
                                    <div
                                        className={`text-xs lg:text-sm ${t.textoSecundario} mt-0.5`}
                                    >
                                        📞 {c.telefone}
                                    </div>
                                </div>
                                <span
                                    className={`text-xs font-mono font-semibold px-2.5 py-1 rounded-full ${c.status_condicional === "aberto" ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-800"}`}
                                >
                                    {c.status_condicional === "aberto"
                                        ? "ABERTO"
                                        : "ENCERRADO"}
                                </span>
                            </div>
                            <div
                                className={`flex justify-between items-center mt-4 pt-4 border-t ${t.bordaCard}`}
                            >
                                <span
                                    className={`text-xs lg:text-sm ${t.textoSecundario}`}
                                >
                                    Saiu em {formatarData(c.data_condicional)}{" "}
                                </span>
                                {c.status_condicional === "aberto" ? (
                                    <span className="text-xs lg:text-sm font-semibold text-amber-500">
                                        Aguardando devolução
                                    </span>
                                ) : (
                                    <span className="text-xs lg:text-sm font-semibold text-green-700">
                                        Devolvido
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div
                className={`${t.bgBottomBar} border-t ${t.bordaBottomBar} px-5 lg:px-10 py-4 max-w-5xl w-full mx-auto`}
            >
                <button
                    onClick={() => navigate("/condicionais/novo")}
                    className={`w-full py-2.5 rounded-xl ${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover} text-sm lg:text-base font-semibold transition`}
                >
                    + Novo Condicional
                </button>
            </div>
        </div>
    );
}
