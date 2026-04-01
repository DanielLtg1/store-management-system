import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import ModalPin from "../components/ModalPin";

// Importing the API service functions to interact with the backend
import { createProduto } from "../services/produtos.js";

export default function NovoProduto() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;
    const isSonho = loja === "sonhoInfantil";
    const tipo = isSonho ? "roupas" : "perfumes";

    const [nome, setNome] = useState("");
    const [tamanho, setTamanho] = useState("");
    const [genero, setGenero] = useState("");
    const [preco, setPreco] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [erros, setErros] = useState({});
    const [modalPin, setModalPin] = useState(false);

    const generos = ["Feminino", "Masculino", "Unissex"];
    const tamanhosRoupas = [
        "RN",
        "P",
        "M",
        "G",
        "1",
        "2",
        "4",
        "6",
        "8",
        "10",
        "12",
        "14",
        "16",
    ];
    const tamanhosPerfumes = [
        "25ml",
        "30ml",
        "50ml",
        "75ml",
        "100ml",
        "150ml",
        "200ml",
    ];
    const tamanhos = isSonho ? tamanhosRoupas : tamanhosPerfumes;

    function formatarPreco(valor) {
        const nums = valor.replace(/\D/g, "");
        if (!nums) return "";
        return (parseInt(nums) / 100).toFixed(2).replace(".", ",");
    }

    function validar() {
        const novosErros = {};
        if (!nome.trim()) novosErros.nome = "Informe o nome do produto.";
        if (!tamanho) novosErros.tamanho = "Selecione um tamanho.";
        if (!genero) novosErros.genero = "Selecione o gênero.";
        if (!preco) novosErros.preco = "Informe o preço.";
        if (!quantidade || parseInt(quantidade) < 0)
            novosErros.quantidade = "Informe a quantidade.";
        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    function iconeGenero(g) {
        if (!isSonho) return "🌸";
        if (g === "Masculino") return "👕";
        if (g === "Feminino") return "👗";
        return "🧥";
    }

    async function handleConfirmar(atendente) {
        setModalPin(false);

        const produto = {
            nome: nome.trim(),
            tamanho,
            genero,
            preco: parseFloat(preco.replace(",", ".")),
            quantidade: parseInt(quantidade),
        }

        try {
            await createProduto(tipo, produto);
            navigate("/estoque");
        } catch (error) {
            console.error("Erro ao criar produto:", error);
        }
    }

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
                    Novo Produto
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-3xl w-full mx-auto">
                <div className="flex flex-col gap-5">
                    <div>
                        <label
                            className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                        >
                            Nome do produto *
                        </label>
                        <input
                            type="text"
                            placeholder={
                                isSonho
                                    ? "Ex: Vestido Floral Rosa"
                                    : "Ex: Perfume Carolina Herrera"
                            }
                            value={nome}
                            onChange={(e) => {
                                setNome(e.target.value);
                                setErros((p) => ({ ...p, nome: null }));
                            }}
                            className={`w-full border rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none transition
                ${erros.nome ? "border-red-400" : `${t.bordaInput} ${t.bordaFocus}`}`}
                        />
                        {erros.nome && (
                            <div className="text-xs text-red-400 mt-1">
                                {erros.nome}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                        >
                            Tamanho *
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {tamanhos.map((tam) => (
                                <button
                                    key={tam}
                                    onClick={() => {
                                        setTamanho(tam);
                                        setErros((p) => ({
                                            ...p,
                                            tamanho: null,
                                        }));
                                    }}
                                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition ${tamanho === tam ? t.filtroAtivo : t.filtroInativo}`}
                                >
                                    {tam}
                                </button>
                            ))}
                        </div>
                        {erros.tamanho && (
                            <div className="text-xs text-red-400 mt-1">
                                {erros.tamanho}
                            </div>
                        )}
                    </div>

                    <div>
                        <label
                            className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                        >
                            Gênero *
                        </label>
                        <div className="flex gap-2">
                            {generos.map((g) => (
                                <button
                                    key={g}
                                    onClick={() => {
                                        setGenero(g);
                                        setErros((p) => ({
                                            ...p,
                                            genero: null,
                                        }));
                                    }}
                                    className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition ${genero === g ? t.filtroAtivo : t.filtroInativo}`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                        {erros.genero && (
                            <div className="text-xs text-red-400 mt-1">
                                {erros.genero}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label
                                className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                            >
                                Preço de venda *
                            </label>
                            <div className="relative">
                                <span
                                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium ${t.textoSecundario}`}
                                >
                                    R$
                                </span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0,00"
                                    value={preco}
                                    onChange={(e) => {
                                        setPreco(formatarPreco(e.target.value));
                                        setErros((p) => ({
                                            ...p,
                                            preco: null,
                                        }));
                                    }}
                                    className={`w-full border rounded-xl pl-10 pr-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none transition
                    ${erros.preco ? "border-red-400" : `${t.bordaInput} ${t.bordaFocus}`}`}
                                />
                            </div>
                            {erros.preco && (
                                <div className="text-xs text-red-400 mt-1">
                                    {erros.preco}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <label
                                className={`text-xs font-semibold ${t.textoSecundario} mb-1.5 block`}
                            >
                                Quantidade inicial *
                            </label>
                            <input
                                type="number"
                                inputMode="numeric"
                                placeholder="0"
                                min="0"
                                value={quantidade}
                                onChange={(e) => {
                                    setQuantidade(e.target.value);
                                    setErros((p) => ({
                                        ...p,
                                        quantidade: null,
                                    }));
                                }}
                                className={`w-full border rounded-xl px-4 py-2.5 text-sm lg:text-base ${t.bgInput} ${t.textoPrimario} outline-none transition
                  ${erros.quantidade ? "border-red-400" : `${t.bordaInput} ${t.bordaFocus}`}`}
                            />
                            {erros.quantidade && (
                                <div className="text-xs text-red-400 mt-1">
                                    {erros.quantidade}
                                </div>
                            )}
                        </div>
                    </div>

                    {nome && tamanho && genero && preco && (
                        <div
                            className={`${t.bgCard} border ${t.bordaCard} rounded-xl p-4 flex items-center gap-4`}
                        >
                            <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${t.bgLight}`}
                            >
                                {iconeGenero(genero)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div
                                    className={`font-semibold text-sm ${t.textoPrimario} truncate`}
                                >
                                    {nome}
                                </div>
                                <div
                                    className={`text-xs ${t.textoSecundario} mt-0.5`}
                                >
                                    Tam. {tamanho} · {genero}
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className={`font-bold text-sm ${t.textoPrimario}`}
                                >
                                    R$ {preco}
                                </div>
                                <div
                                    className={`text-xs ${t.textoSecundario} mt-0.5`}
                                >
                                    {quantidade || 0} un.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
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
                    Salvar produto
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo="Cadastrar novo produto"
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
