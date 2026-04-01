import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import ModalPin from "../components/ModalPin";

// Importing the API service functions to interact with the backend
import { getProdutos } from "../services/produtos.js";

export default function Estoque() {
    const [produtos, setProdutos] = useState([]);

    const navigate = useNavigate();
    const { loja } = useApp();
    const isSonhoInfantil = loja === "sonhoInfantil";
    const tipo = isSonhoInfantil ? "roupas" : "perfumes";
    const t = temas[loja] || temas.sonhoInfantil;
    const corIcons = isSonhoInfantil ? "#171717" : "#f5f5f5";

    const [busca, setBusca] = useState("");
    const [filtroGenero, setFiltroGenero] = useState("Todos");
    const [modalPin, setModalPin] = useState(false);
    const [acaoPin, setAcaoPin] = useState(null);

    const filtros = ["Todos", "Feminino", "Masculino", "Unissex"];

    const produtosFiltrados = produtos.filter((p) => {
        const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase());
        const generoOk = filtroGenero === "Todos" || p.genero === filtroGenero;
        return buscaOk && generoOk;
    });

    useEffect(() => {
        loadProdutos(tipo);
    }, [tipo]);

    async function loadProdutos(tipo) {
        try {
            const response = await getProdutos(tipo);
            setProdutos(response.data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }
    function handleConfirmar(atendente) {
        setModalPin(false);
        console.log(`Ação "${acaoPin}" confirmada por ${atendente.nome}`);
    }

    function iconeGenero(genero) {
        if (loja === "amoreMio") return "🌸";
        if (genero === "M") return "👕";
        if (genero === "F") return "👗";
        return "🧥";
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
                    Estoque
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
                <div className="flex gap-3 mb-4">
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className={`flex-1 border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition`}
                    />
                    <button
                        onClick={() => navigate("/estoque/novo")}
                        className={`${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover} text-sm lg:text-base font-semibold px-4 py-2.5 rounded-xl transition`}
                    >
                        + Novo
                    </button>
                </div>

                <div className="flex gap-2 mb-6 flex-wrap">
                    {filtros.map((f) => (
                        <button
                            key={f}
                            onClick={() => setFiltroGenero(f)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${filtroGenero === f ? t.filtroAtivo : t.filtroInativo}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    {produtosFiltrados.length === 0 && (
                        <div
                            className={`col-span-2 text-center py-16 ${t.textoSecundario}`}
                        >
                            <div className="text-4xl mb-3">📭</div>
                            <div className="text-sm">
                                Nenhum produto encontrado
                            </div>
                        </div>
                    )}

                    {produtosFiltrados.map((produto) => {
                        const estoqueBaixo = produto.quantidade <= 3;
                        return (
                            <div
                                key={produto.id}
                                className={`${t.bgCard} border ${t.bordaCard} rounded-xl px-4 py-4 flex items-center gap-4`}
                            >
                                <div
                                    className={`w-11 h-11 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-xl lg:text-2xl flex-shrink-0 ${estoqueBaixo ? "bg-amber-50" : t.bgLight}`}
                                >
                                    {iconeGenero(produto.genero)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div
                                        className={`font-semibold text-sm lg:text-base ${t.textoPrimario} truncate`}
                                    >
                                        {produto.nome}
                                    </div>
                                    <div
                                        className={`text-xs lg:text-sm ${t.textoSecundario} mt-0.5`}
                                    >
                                        Tam. {produto.tamanho}
                                    </div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoSecundario}`}
                                        >
                                            {produto.tamanho}
                                        </span>
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoAccent}`}
                                        >
                                            {produto.genero}
                                        </span>
                                        {estoqueBaixo ? (
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">
                                                ⚠ Estoque baixo
                                            </span>
                                        ) : (
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                                                ✓ Em estoque
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div
                                        className={`font-bold text-sm lg:text-base ${t.textoPrimario}`}
                                    >
                                        {parseFloat(
                                            produto.preco,
                                        ).toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </div>
                                    <div
                                        className={`text-xs lg:text-sm mt-1 font-medium ${estoqueBaixo ? "text-amber-500" : t.textoSecundario}`}
                                    >
                                        {produto.quantidade} un.
                                    </div>
                                    <div className="flex flex-row">
                                        <div
                                            className="mt-3 w-7 h-7 cursor-pointer ml-auto"
                                            onClick={() => {
                                                setAcaoPin("editar");
                                                setModalPin(true);
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-full h-full"
                                            >
                                                <path
                                                    d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8"
                                                    fill="none"
                                                    stroke={`${corIcons}`}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                />

                                                <polygon
                                                    fill="none"
                                                    points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                                                    stroke={`${corIcons}`}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                        <div
                                            className="mt-3 w-7 h-7 cursor-pointer ml-auto"
                                            onClick={() => {
                                                setAcaoPin("deletar");
                                                setModalPin(true);
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke={`${corIcons}`}
                                                className="w-full h-full"
                                            >
                                                <path
                                                    d="M10 12L14 16M14 12L10 16M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                className={`${t.bgBottomBar} border-t ${t.bordaBottomBar} px-5 lg:px-10 py-4 flex gap-3 max-w-5xl w-full mx-auto`}
            >
                <button
                    onClick={() => navigate("/estoque/entrada")}
                    className={`flex-1 py-2.5 rounded-xl border ${t.bordaCard} ${t.bgLight} text-sm lg:text-base font-semibold ${t.textoPrimario} hover:opacity-80 transition`}
                >
                    📥 Entrada
                </button>
                <button
                    onClick={() => navigate("/estoque/saida")}
                    className={`flex-1 py-2.5 rounded-xl ${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover} text-sm lg:text-base font-semibold transition`}
                >
                    📤 Saída
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo={
                    acaoPin === "entrada"
                        ? "Registrar entrada"
                        : acaoPin === "saida"
                          ? "Registrar saída"
                          : "Cadastrar novo produto"
                }
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
