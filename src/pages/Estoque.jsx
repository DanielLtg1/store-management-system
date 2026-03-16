import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import ModalPin from "../components/ModalPin";

const produtosMock = [
    {
        id: 1,
        nome: "Vestido Floral Rosa",
        tamanho: "4",
        genero: "Feminino",
        preco: 89.9,
        quantidade: 2,
    },
    {
        id: 2,
        nome: "Conjunto Listrado",
        tamanho: "6",
        genero: "Masculino",
        preco: 74.9,
        quantidade: 8,
    },
    {
        id: 3,
        nome: "Casaco de Moletom",
        tamanho: "8",
        genero: "Unissex",
        preco: 119.9,
        quantidade: 5,
    },
    {
        id: 4,
        nome: "Body Bordado Branco",
        tamanho: "M",
        genero: "Feminino",
        preco: 49.9,
        quantidade: 12,
    },
];

export default function Estoque() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;

    const [busca, setBusca] = useState("");
    const [filtroGenero, setFiltroGenero] = useState("Todos");
    const [modalPin, setModalPin] = useState(false);
    const [acaoPin, setAcaoPin] = useState(null);

    const filtros = ["Todos", "Feminino", "Masculino", "Unissex"];

    const produtosFiltrados = produtosMock.filter((p) => {
        const buscaOk = p.nome.toLowerCase().includes(busca.toLowerCase());
        const generoOk = filtroGenero === "Todos" || p.genero === filtroGenero;
        return buscaOk && generoOk;
    });

    function handleConfirmar(atendente) {
        setModalPin(false);
        console.log(`Ação "${acaoPin}" confirmada por ${atendente.nome}`);
    }

    function iconeGenero(genero) {
        if (loja === "amoreMio") return "🌸";
        if (genero === "Masculino") return "👕";
        if (genero === "Feminino") return "👗";
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
                                        {produto.preco.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </div>
                                    <div
                                        className={`text-xs lg:text-sm mt-1 font-medium ${estoqueBaixo ? "text-amber-500" : t.textoSecundario}`}
                                    >
                                        {produto.quantidade} un.
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
