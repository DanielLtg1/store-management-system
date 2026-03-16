import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import sonhoInfantilImg from "../assets/sonhoinfantil.jpg";
import amoreMioImg from "../assets/amoremio.jpg";

export default function Menu() {
    const navigate = useNavigate();
    const { loja, setLoja } = useApp();

    const t = temas[loja] || temas.sonhoInfantil;
    const isSonho = loja === "sonhoInfantil";
    const lojaTitle = isSonho ? "Sonho Infantil Store" : "Amore Mio Cosméticos";
    const lojaImg = isSonho ? sonhoInfantilImg : amoreMioImg;

    return (
        <div className={`min-h-screen ${t.bgPagina} flex flex-col`}>
            <div
                className={`${t.bgTopbar} border-b ${t.bordaTopbar} px-5 lg:px-10 py-4 flex items-center gap-3 sticky top-0 z-10`}
            >
                <button
                    onClick={() => {
                        setLoja(null);
                        navigate("/loja");
                    }}
                    className={`w-11 h-11 rounded-lg border ${t.botaoVoltar} flex items-center justify-center transition`}
                >
                    ←
                </button>
                <div className={`w-11 h-11 rounded-xl overflow-hidden shrink-0 border ${t.bordaLogo} transition ${t.hoverCard}`}>
                    <img
                        src={lojaImg}
                        alt={lojaTitle}
                        className="w-full h-full object-cover"
                    />
                </div>
                <span
                    className={`font-semibold text-base lg:text-2xl flex-1 ${t.textoTopbar}`}
                >
                    {lojaTitle}
                </span>
                <button
                    onClick={() => navigate("/configuracoes")}
                    className={`w-10 h-10 lg:text-xl rounded-lg border ${t.botaoVoltar} flex items-center justify-center transition mr-1`}
                >
                    ⚙️
                </button>
                <span
                    className={`text-xs lg:text-sm font-mono font-semibold px-3 py-2 rounded-full ${t.badgeBg} ${t.badgeTexto} flex items-center justify-center content-center`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
                <h2
                    className={`text-xl lg:text-3xl font-bold ${t.textoPrimario}`}
                >
                    O que deseja fazer?
                </h2>
                <p
                    className={`text-sm lg:text-lg ${t.textoSecundario} mt-1 mb-6 lg:mb-10`}
                >
                    Escolha uma opção abaixo
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-5">
                    <button
                        onClick={() => navigate("/estoque")}
                        className={`${t.bgCard} border ${t.bordaCard} rounded-xl p-5 lg:p-8 text-left hover:shadow-lg transition ${t.hoverCard} flex flex-col gap-3 lg:gap-5`}
                    >
                        <div
                            className={`w-11 h-11 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl lg:text-3xl ${t.bgLight}`}
                        >
                            📦
                        </div>
                        <div>
                            <div
                                className={`font-semibold text-sm lg:text-xl ${t.textoPrimario}`}
                            >
                                Estoque
                            </div>
                            <div
                                className={`text-xs lg:text-lg ${t.textoSecundario} mt-1 leading-relaxed`}
                            >
                                Produtos, entradas e saídas
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate("/condicionais")}
                        className={`${t.bgCard} border ${t.bordaCard} rounded-xl p-5 lg:p-8 text-left hover:shadow-lg transition ${t.hoverCard} flex flex-col gap-3 lg:gap-5`}
                    >
                        <div
                            className={`w-11 h-11 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl lg:text-3xl ${t.bgLight}`}
                        >
                            🛍️
                        </div>
                        <div>
                            <div
                                className={`font-semibold text-sm lg:text-xl ${t.textoPrimario}`}
                            >
                                Condicionais
                            </div>
                            <div
                                className={`text-xs lg:text-lg ${t.textoSecundario} mt-1 leading-relaxed`}
                            >
                                Peças para provar
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate("/condicionais")}
                        className={`col-span-2 lg:col-span-1 ${t.bgCard} border ${t.bordaAccent} rounded-xl p-5 lg:p-8 text-left hover:shadow-lg transition ${t.hoverCard} flex lg:flex-col items-center lg:items-start gap-4 lg:gap-5`}
                    >
                        <div
                            className={`w-11 h-11 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center text-xl lg:text-3xl ${t.bgLight} shrink-0`}
                        >
                            📋
                        </div>
                        <div className="flex-1">
                            <div
                                className={`font-semibold text-sm lg:text-xl ${t.textoPrimario}`}
                            >
                                Condicionais Abertos
                            </div>
                            <div
                                className={`text-xs lg:text-lg ${t.textoSecundario} mt-1`}
                            >
                                Aguardando devolução
                            </div>
                        </div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                    </button>
                </div>
            </div>
        </div>
    );
}
