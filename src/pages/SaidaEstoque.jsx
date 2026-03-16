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

export default function SaidaEstoque() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;

    const [busca, setBusca] = useState("");
    const [itens, setItens] = useState(
        produtosMock.map((p) => ({ ...p, qtdSaida: 0 })),
    );
    const [observacao, setObservacao] = useState("");
    const [modalPin, setModalPin] = useState(false);
    const [erros, setErros] = useState({});

    function alterarQtd(id, delta) {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const nova = item.qtdSaida + delta;
                if (nova < 0 || nova > item.quantidade) return item;
                return { ...item, qtdSaida: nova };
            }),
        );
    }

    function setQtdDigitada(id, valor) {
        const num = parseInt(valor.replace(/\D/g, "")) || 0;
        setItens((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                return { ...item, qtdSaida: Math.min(num, item.quantidade) };
            }),
        );
    }

    const itensSelecionados = itens.filter((i) => i.qtdSaida > 0);
    const totalSaida = itensSelecionados.reduce(
        (acc, i) => acc + i.qtdSaida,
        0,
    );
    const valorTotal = itensSelecionados.reduce(
        (acc, i) => acc + i.qtdSaida * i.preco,
        0,
    );

    function validar() {
        const novosErros = {};
        if (itensSelecionados.length === 0)
            novosErros.itens = "Selecione ao menos um produto.";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    function handleConfirmar(atendente) {
        setModalPin(false);
        navigate("/estoque");
    }

    function iconeGenero(genero) {
        if (loja === "amoreMio") return "🌸";
        if (genero === "Masculino") return "👕";
        if (genero === "Feminino") return "👗";
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
                    Saída de Estoque
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
                    {itensFiltrados.map((item) => {
                        const semEstoque = item.quantidade === 0;
                        return (
                            <div
                                key={item.id}
                                className={`border rounded-xl px-4 py-4 flex items-center gap-4 transition
                  ${item.qtdSaida > 0 ? `${t.bordaAccent} ${t.bgLight}` : `${t.bgCard} ${t.bordaCard}`}
                  ${semEstoque ? "opacity-40 pointer-events-none" : ""}`}
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
                                        Tam. {item.tamanho} · {item.genero}
                                    </div>
                                    <div className="flex gap-2 mt-1.5">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoSecundario}`}
                                        >
                                            {item.quantidade} disponíveis
                                        </span>
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoAccent} font-semibold`}
                                        >
                                            {item.preco.toLocaleString(
                                                "pt-BR",
                                                {
                                                    style: "currency",
                                                    currency: "BRL",
                                                },
                                            )}
                                        </span>
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
                                        value={item.qtdSaida || ""}
                                        onChange={(e) =>
                                            setQtdDigitada(
                                                item.id,
                                                e.target.value,
                                            )
                                        }
                                        placeholder="0"
                                        className={`w-10 text-center font-mono font-semibold text-sm border ${t.bordaInput} rounded-lg py-1 outline-none ${t.bordaFocus} ${t.bgInput} ${t.textoPrimario} transition`}
                                    />
                                    <button
                                        onClick={() => alterarQtd(item.id, 1)}
                                        className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div>
                    <label
                        className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                    >
                        Observação{" "}
                        <span className="font-normal">(opcional)</span>
                    </label>
                    <textarea
                        placeholder="Ex: Venda balcão, cliente João..."
                        value={observacao}
                        onChange={(e) => setObservacao(e.target.value)}
                        rows={3}
                        className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition resize-none`}
                    />
                </div>

                {totalSaida > 0 && (
                    <div
                        className={`mt-4 ${t.bgLight} border ${t.bordaAccent} rounded-xl px-4 py-3 flex justify-between items-center`}
                    >
                        <div>
                            <div
                                className={`text-sm font-medium ${t.textoAccent}`}
                            >
                                {totalSaida} unidades saindo
                            </div>
                            <div
                                className={`text-xs ${t.textoSecundario} mt-0.5`}
                            >
                                {itensSelecionados.length}{" "}
                                {itensSelecionados.length === 1
                                    ? "produto"
                                    : "produtos"}
                            </div>
                        </div>
                        <span
                            className={`font-bold text-base lg:text-lg ${t.textoAccent}`}
                        >
                            {valorTotal.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                            })}
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
                    className={`w-full py-2.5 rounded-xl ${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover} text-sm lg:text-base font-semibold transition`}
                >
                    📤 Confirmar saída
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo="Registrar saída de estoque"
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
