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

export default function NovoCondicional() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;

    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [itens, setItens] = useState(
        produtosMock.map((p) => ({ ...p, selecionado: false, qtdSaindo: 0 })),
    );
    const [busca, setBusca] = useState("");
    const [modalPin, setModalPin] = useState(false);

    function alterarQtd(id, delta) {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const nova = item.qtdSaindo + delta;
                if (nova < 0 || nova > item.quantidade) return item;
                return { ...item, qtdSaindo: nova, selecionado: nova > 0 };
            }),
        );
    }

    function formatarTelefone(valor) {
        const nums = valor.replace(/\D/g, "").slice(0, 11);
        if (nums.length <= 2) return `(${nums}`;
        if (nums.length <= 7) return `(${nums.slice(0, 2)}) ${nums.slice(2)}`;
        if (nums.length <= 11)
            return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`;
        return valor;
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
    const itensSelecionados = itens.filter((i) => i.qtdSaindo > 0);
    const totalSaindo = itensSelecionados.reduce(
        (acc, i) => acc + i.qtdSaindo,
        0,
    );
    const podeSalvar = nome.trim() !== "" && totalSaindo > 0;

    function handleConfirmar(atendente) {
        setModalPin(false);
        navigate("/condicionais");
    }

    return (
        <div className={`min-h-screen ${t.bgPagina} flex flex-col`}>
            <div
                className={`${t.bgTopbar} border-b ${t.bordaTopbar} px-5 lg:px-10 py-4 flex items-center gap-3 sticky top-0 z-10`}
            >
                <button
                    onClick={() => navigate("/condicionais")}
                    className={`w-9 h-9 rounded-lg border ${t.botaoVoltar} flex items-center justify-center transition`}
                >
                    ←
                </button>
                <span
                    className={`font-semibold text-base lg:text-lg flex-1 ${t.textoTopbar}`}
                >
                    Novo Condicional
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
                <div
                    className={`text-xs font-semibold uppercase tracking-wider ${t.textoSecundario} mb-3`}
                >
                    Dados da cliente
                </div>

                <div className="flex flex-col lg:flex-row gap-3 mb-6">
                    <div className="flex-1">
                        <label
                            className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                        >
                            Nome *
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Maria Oliveira"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition`}
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                        >
                            Telefone
                        </label>
                        <input
                            type="text"
                            placeholder="(63) 9 0000-0000"
                            value={telefone}
                            onChange={(e) =>
                                setTelefone(formatarTelefone(e.target.value))
                            }
                            className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition`}
                        />
                    </div>
                </div>

                <div
                    className={`text-xs font-semibold uppercase tracking-wider ${t.textoSecundario} mb-3`}
                >
                    Peças que estão saindo *
                </div>

                <input
                    type="text"
                    placeholder="Buscar produto..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className={`w-full border ${t.bordaInput} rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none ${t.bordaFocus} transition mb-4`}
                />

                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    {itensFiltrados.map((item) => (
                        <div
                            key={item.id}
                            className={`border rounded-xl px-4 py-4 flex items-center gap-4 transition
                ${item.qtdSaindo > 0 ? `${t.bordaAccent} ${t.bgLight}` : `${t.bgCard} ${t.bordaCard}`}`}
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
                                    Tam. {item.tamanho} ·{" "}
                                    {item.preco.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}{" "}
                                    · {item.quantidade} disponíveis
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <button
                                    onClick={() => alterarQtd(item.id, -1)}
                                    className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                >
                                    −
                                </button>
                                <span
                                    className={`font-mono font-semibold text-sm w-5 text-center ${t.textoPrimario}`}
                                >
                                    {item.qtdSaindo}
                                </span>
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

                {totalSaindo > 0 && (
                    <div
                        className={`mt-4 ${t.bgCard} border ${t.bordaCard} rounded-xl px-4 py-3 flex justify-between items-center`}
                    >
                        <span className={`text-sm ${t.textoSecundario}`}>
                            Total saindo
                        </span>
                        <span
                            className={`font-bold text-base lg:text-lg ${t.textoPrimario}`}
                        >
                            {totalSaindo} peças
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`${t.bgBottomBar} border-t ${t.bordaBottomBar} px-5 lg:px-10 py-4 max-w-5xl w-full mx-auto`}
            >
                <button
                    disabled={!podeSalvar}
                    onClick={() => setModalPin(true)}
                    className={`w-full py-2.5 rounded-xl text-sm lg:text-base font-semibold transition
            ${podeSalvar ? `${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover}` : "bg-neutral-300 text-neutral-500 cursor-not-allowed"}`}
                >
                    Confirmar saída
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo="Confirmar saída do condicional"
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
