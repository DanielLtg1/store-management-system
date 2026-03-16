import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { temas } from "../theme";
import ModalPin from "../components/ModalPin";

const condicionalMock = {
    id: 1,
    clienteNome: "Maria Oliveira",
    clienteTelefone: "(63) 98765-4321",
    dataSaida: "2026-03-05",
    status: "aberto",
    itens: [
        {
            id: 1,
            nome: "Vestido Floral Rosa",
            tamanho: "4",
            preco: 89.9,
            quantidadeLevou: 2,
            quantidadeDevolveu: 0,
        },
        {
            id: 2,
            nome: "Conjunto Listrado",
            tamanho: "6",
            preco: 74.9,
            quantidadeLevou: 2,
            quantidadeDevolveu: 0,
        },
        {
            id: 3,
            nome: "Casaco de Moletom",
            tamanho: "8",
            preco: 119.9,
            quantidadeLevou: 2,
            quantidadeDevolveu: 0,
        },
    ],
};

export default function CondicionalDetalhe() {
    const navigate = useNavigate();
    const { loja } = useApp();
    const t = temas[loja] || temas.sonhoInfantil;

    const [itens, setItens] = useState(condicionalMock.itens);
    const [modalPin, setModalPin] = useState(false);
    const [acaoPin, setAcaoPin] = useState(null);

    function alterarDevolvido(id, delta) {
        setItens((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const novo = item.quantidadeDevolveu + delta;
                if (novo < 0 || novo > item.quantidadeLevou) return item;
                return { ...item, quantidadeDevolveu: novo };
            }),
        );
    }

    function abrirPin(acao) {
        setAcaoPin(acao);
        setModalPin(true);
    }
    function handleConfirmar(atendente) {
        setModalPin(false);
        if (acaoPin === "encerrar") navigate("/condicionais");
    }

    const totalLevou = itens.reduce((acc, i) => acc + i.quantidadeLevou, 0);
    const totalDevolveu = itens.reduce(
        (acc, i) => acc + i.quantidadeDevolveu,
        0,
    );
    const totalPendente = totalLevou - totalDevolveu;
    const itensFicou = itens.filter(
        (i) => i.quantidadeLevou - i.quantidadeDevolveu > 0,
    );
    const valorTotal = itensFicou.reduce(
        (acc, i) => acc + (i.quantidadeLevou - i.quantidadeDevolveu) * i.preco,
        0,
    );

    function formatarData(dataStr) {
        const [ano, mes, dia] = dataStr.split("-");
        return `${dia}/${mes}/${ano}`;
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
                    {condicionalMock.clienteNome}
                </span>
                <span
                    className={`text-xs font-mono font-semibold px-3 py-1 rounded-full ${t.badgeBg} ${t.badgeTexto}`}
                >
                    {t.label}
                </span>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-5xl w-full mx-auto">
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div
                        className={`${t.bgCard} border ${t.bordaCard} rounded-xl p-3 lg:p-4 text-center`}
                    >
                        <div className={`text-xs ${t.textoSecundario} mb-1`}>
                            Saiu em
                        </div>
                        <div
                            className={`font-bold text-sm lg:text-base ${t.textoPrimario}`}
                        >
                            {formatarData(condicionalMock.dataSaida)}
                        </div>
                    </div>
                    <div
                        className={`${t.bgCard} border ${t.bordaCard} rounded-xl p-3 lg:p-4 text-center`}
                    >
                        <div className={`text-xs ${t.textoSecundario} mb-1`}>
                            Total levado
                        </div>
                        <div
                            className={`font-bold text-sm lg:text-base ${t.textoPrimario}`}
                        >
                            {totalLevou} peças
                        </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 lg:p-4 text-center">
                        <div className="text-xs text-amber-500 mb-1">
                            Pendente
                        </div>
                        <div className="font-bold text-sm lg:text-base text-amber-600">
                            {totalPendente} peças
                        </div>
                    </div>
                </div>

                <div
                    className={`text-xs font-semibold uppercase tracking-wider ${t.textoSecundario} mb-3`}
                >
                    Peças do condicional
                </div>
                <p className={`text-xs lg:text-sm ${t.textoSecundario} mb-4`}>
                    Informe quantas peças estão sendo devolvidas
                </p>

                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2">
                    {itens.map((item) => {
                        const ficou =
                            item.quantidadeLevou - item.quantidadeDevolveu;
                        return (
                            <div
                                key={item.id}
                                className={`${t.bgCard} border ${t.bordaCard} rounded-xl px-4 py-4 flex items-center gap-4`}
                            >
                                <div
                                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${t.bgLight}`}
                                >
                                    {loja === "amoreMio" ? "🌸" : "👗"}
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
                                        un.
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <span
                                            className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoSecundario}`}
                                        >
                                            Levou: {item.quantidadeLevou}
                                        </span>
                                        {ficou > 0 && (
                                            <span
                                                className={`text-xs font-medium px-2 py-0.5 rounded-full ${t.bgLight} ${t.textoAccent}`}
                                            >
                                                Ficou: {ficou}
                                            </span>
                                        )}
                                        {item.quantidadeDevolveu > 0 && (
                                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                                                Dev.: {item.quantidadeDevolveu}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() =>
                                            alterarDevolvido(item.id, -1)
                                        }
                                        className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                    >
                                        −
                                    </button>
                                    <span
                                        className={`font-mono font-semibold text-sm w-5 text-center ${t.textoPrimario}`}
                                    >
                                        {item.quantidadeDevolveu}
                                    </span>
                                    <button
                                        onClick={() =>
                                            alterarDevolvido(item.id, 1)
                                        }
                                        className={`w-8 h-8 rounded-lg border ${t.bordaCard} ${t.bgLight} hover:opacity-80 transition font-bold ${t.textoPrimario} flex items-center justify-center`}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {itensFicou.length > 0 && (
                    <div
                        className={`mt-6 ${t.bgLight} border ${t.bordaAccent} rounded-xl p-4 lg:p-5`}
                    >
                        <div
                            className={`font-bold text-sm lg:text-base mb-3 ${t.textoAccent}`}
                        >
                            📊 Resumo — o que ficou
                        </div>
                        <div className="flex flex-col gap-2">
                            {itensFicou.map((item) => {
                                const ficou =
                                    item.quantidadeLevou -
                                    item.quantidadeDevolveu;
                                return (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm lg:text-base"
                                    >
                                        <span className={t.textoPrimario}>
                                            {item.nome} ({ficou} un.)
                                        </span>
                                        <span
                                            className={`font-semibold ${t.textoPrimario}`}
                                        >
                                            {(
                                                ficou * item.preco
                                            ).toLocaleString("pt-BR", {
                                                style: "currency",
                                                currency: "BRL",
                                            })}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className={`flex justify-between mt-3 pt-3 border-t ${t.bordaAccent} font-bold text-base lg:text-lg ${t.textoAccent}`}
                        >
                            <span>Total a cobrar</span>
                            <span>
                                {valorTotal.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <div
                className={`${t.bgBottomBar} border-t ${t.bordaBottomBar} px-5 lg:px-10 py-4 flex gap-3 max-w-5xl w-full mx-auto`}
            >
                <button
                    onClick={() => abrirPin("parcial")}
                    className={`flex-1 py-2.5 rounded-xl border ${t.bordaCard} ${t.bgLight} text-sm lg:text-base font-semibold ${t.textoPrimario} hover:opacity-80 transition`}
                >
                    Salvar parcial
                </button>
                <button
                    onClick={() => abrirPin("encerrar")}
                    className={`flex-1 py-2.5 rounded-xl ${t.bgBotao} ${t.textoBotao} ${t.bgBotaoHover} text-sm lg:text-base font-semibold transition`}
                >
                    Encerrar ✓
                </button>
            </div>

            <ModalPin
                aberto={modalPin}
                titulo={
                    acaoPin === "encerrar"
                        ? "Encerrar condicional"
                        : "Salvar devolução parcial"
                }
                onConfirmar={handleConfirmar}
                onCancelar={() => setModalPin(false)}
            />
        </div>
    );
}
