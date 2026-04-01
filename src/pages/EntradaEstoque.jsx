import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import ModalPin from "../components/ModalPin";

// Importing the API service functions to interact with the backend
import { getProdutos, updateProdutoEntrada } from "../services/produtos";

export default function EntradaEstoque() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;
    const isSonhoInfantil = loja === "sonhoInfantil";
    const tipo = isSonhoInfantil ? "roupas" : "perfumes";

    const [busca, setBusca] = useState("");
    const [itens, setItens] = useState([]);
    const [observacao, setObservacao] = useState("");
    const [modalPin, setModalPin] = useState(false);
    const [erros, setErros] = useState({});

    useEffect(() => {
        loadProdutos(tipo);
    }, [tipo]);

    async function loadProdutos(tipo) {
        try {
            const response = await getProdutos(tipo);
            setItens(response.data.map((p) => ({ ...p, qtdEntrada: 0 })));
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        }
    }

    function alterarQtd(id, delta) {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const nova = item.qtdEntrada + delta;
                if (nova < 0) return item;
                return { ...item, qtdEntrada: nova };
            }),
        );
    }

    function setQtdDigitada(id, valor) {
        const num = parseInt(valor.replace(/\D/g, "")) || 0;
        setItens((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qtdEntrada: num } : item,
            ),
        );
    }

    const itensSelecionados = itens.filter((i) => i.qtdEntrada > 0);
    const totalEntrada = itensSelecionados.reduce(
        (acc, i) => acc + i.qtdEntrada,
        0,
    );

    function validar() {
        const novosErros = {};
        if (itensSelecionados.length === 0)
            novosErros.itens = "Selecione ao menos um produto.";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function handleConfirmar(atendente) {
        setModalPin(false);
        try {
            for (const item of itensSelecionados) {
                await updateProdutoEntrada(tipo, item.id, item.qtdEntrada);
            }
            navigate("/estoque");
        } catch (error) {
            console.error("Erro ao registrar entrada:", error);
        }
    }

    function iconeGenero(genero) {
        if (loja === "amoreMio") return "🌸";
        if (genero === "M") return "👕";
        if (genero === "F") return "👗";
        return "🧥";
    }

    const itensFiltrados = itens.filter((i) =>
        i.nome.toLowerCase().includes(busca.toLowerCase()),
    );

    return (
        <div className={`min-h-screen ${t.bgPagina} flex flex-col`}>
            <div
                className={`${t.bgTopbar} border-b ${t.bordaTopbar} px-5 lg:px-10 py-4 flex items-center gap-3 sticky top-0 z-10`}
            >
                <button
                    onClick={() => navigate("/estoque")}
                    className={`w-9 h-9 rounded-lg border ${t.botaoVoltar} flex items-center justify-center transition`}
                >
                    ←
                </button>
                <span
                    className={`font-semibold text-base lg:text-lg flex-1 ${t.textoTopbar}`}
                >
                    Entrada de Estoque
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-3xl w-full mx-auto">
                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition mb-4`}
                />

                {erros.itens && (
                    <div className="text-xs text-red-400 mb-4">
                        {erros.itens}
                    </div>
                )}

                <div className="flex flex-col gap-3 mb-6">
                    {itensFiltrados.map((item) => (
                        <div
                            key={item.id}
                            className={`border rounded-xl px-4 py-4 flex items-center gap-4 transition
                ${item.qtdEntrada > 0 ? "border-green-400 bg-green-50" : `${t.bgCard} ${t.bordaCard}`}`}
                        >
                            <div
                                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${t.bgLight}`}
                            >
                                {iconeGenero(item.genero)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`font-semibold text-sm lg:text-base ${t.textoPrimario} truncate`}
                                >
                                    {item.nome}
                                </div>
                                <div
                                    className={`text-xs ${t.textoSecundario} mt-0.5`}
                                >
                                    Tam. {item.tamanho} · {item.genero} ·{" "}
                                    {item.quantidade} em estoque
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => alterarQtd(item.id, -1)}
                                    className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                >
                                    −
                                </button>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={item.qtdEntrada || ""}
                                    onChange={(e) =>
                                        setQtdDigitada(item.id, e.target.value)
                                    }
                                    placeholder="0"
                                    className={`w-10 text-center font-mono font-semibold text-sm border ${t.bordaInput} rounded-lg py-1 outline-none focus:border-green-400 ${t.bgInput} ${t.textoPrimario} transition`}
                                />
                                <button
                                    onClick={() => alterarQtd(item.id, 1)}
                                    className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <label
                        className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                    >
                        Observação{" "}
                        <span className="font-normal">(opcional)</span>
                    </label>
                    <textarea
                        placeholder="Ex: Reposição do fornecedor Silva, NF 1234..."
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        rows={3}
                        className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition resize-none`}
                    />
                </div>

                {totalEntrada > 0 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex justify-between items-center">
                        <span className="text-sm text-green-700 font-medium">
                            Total entrando
                        </span>
                        <span className="font-bold text-base lg:text-lg text-green-700">
                            {totalEntrada} unidades
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`${t.bgBottomBar} border-t ${t.bordaBottomBar} px-5 lg:px-10 py-4 max-w-3xl w-full mx-auto`}
            >
                <button
                    onClick={() => {
                        if (validar()) setModalPin(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm lg:text-base font-semibold transition"
                >
                    📥 Confirmar entrada
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo="Registrar entrada de estoque"
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
