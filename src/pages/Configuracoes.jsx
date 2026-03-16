import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const SENHA_ADMIN = localStorage.getItem("senhaAdmin") || "1234";

export default function Configuracoes() {
    const navigate = useNavigate();
    const { atendentes, salvarAtendentes } = useApp();

    const [autenticado, setAutenticado] = useState(false);
    const [senhaDigitada, setSenhaDigitada] = useState("");
    const [erroSenha, setErroSenha] = useState("");

    const [editando, setEditando] = useState(null);
    const [novoPin, setNovoPin] = useState("");
    const [confirmarPin, setConfirmarPin] = useState("");
    const [erroPin, setErroPin] = useState("");
    const [sucessoPin, setSucessoPin] = useState("");

    const [novoNome, setNovoNome] = useState("");
    const [adicionando, setAdicionando] = useState(false);
    const [pinNovaAtendente, setPinNovaAtendente] = useState("");

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erroSenhaAdmin, setErroSenhaAdmin] = useState("");
    const [sucessoSenhaAdmin, setSucessoSenhaAdmin] = useState("");
    const [editandoSenha, setEditandoSenha] = useState(false);

    function autenticar() {
        if (senhaDigitada === SENHA_ADMIN) {
            setAutenticado(true);
            setErroSenha("");
        } else {
            setErroSenha("Senha incorreta.");
            setSenhaDigitada("");
        }
    }

    function salvarSenhaAdmin() {
        if (senhaAtual !== SENHA_ADMIN) {
            setErroSenhaAdmin("Senha atual incorreta.");
            return;
        }
        if (novaSenha.length < 4) {
            setErroSenhaAdmin("A nova senha deve ter ao menos 4 caracteres.");
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setErroSenhaAdmin("As senhas não coincidem.");
            return;
        }
        localStorage.setItem("senhaAdmin", novaSenha);
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmarSenha("");
        setErroSenhaAdmin("");
        setEditandoSenha(false);
        setSucessoSenhaAdmin("Senha alterada com sucesso!");
        setTimeout(() => setSucessoSenhaAdmin(""), 3000);
    }

    function salvarPin(id) {
        if (novoPin.length !== 4) {
            setErroPin("O PIN deve ter 4 dígitos.");
            return;
        }
        if (novoPin !== confirmarPin) {
            setErroPin("Os PINs não coincidem.");
            return;
        }
        salvarAtendentes(
            atendentes.map((a) => (a.id === id ? { ...a, pin: novoPin } : a)),
        );
        setEditando(null);
        setNovoPin("");
        setConfirmarPin("");
        setErroPin("");
        setSucessoPin("PIN alterado com sucesso!");
        setTimeout(() => setSucessoPin(""), 3000);
    }

    function adicionarAtendente() {
        if (novoNome.trim() === "") return;
        if (pinNovaAtendente.length !== 4) {
            setErroPin("O PIN deve ter 4 dígitos.");
            return;
        }
        const cores = [
            "bg-orange-600",
            "bg-teal-600",
            "bg-amber-500",
            "bg-violet-600",
            "bg-pink-600",
        ];
        const novaAtendente = {
            id: Date.now(),
            nome: novoNome.trim(),
            inicial: novoNome.trim()[0].toUpperCase(),
            cor: cores[atendentes.length % cores.length],
            pin: pinNovaAtendente,
        };
        salvarAtendentes([...atendentes, novaAtendente]);
        setNovoNome("");
        setPinNovaAtendente("");
        setAdicionando(false);
        setSucessoPin("Atendente adicionada com sucesso!");
        setTimeout(() => setSucessoPin(""), 3000);
    }

    function removerAtendente(id) {
        salvarAtendentes(atendentes.filter((a) => a.id !== id));
    }

    // ── Tela de autenticação ──
    if (!autenticado) {
        return (
            <div className="min-h-screen bg-neutral-200 flex flex-col">
                <div className="bg-white border-b border-neutral-200 px-5 lg:px-10 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition"
                    >
                        ←
                    </button>
                    <span className="font-semibold text-base lg:text-lg">
                        Configurações
                    </span>
                </div>

                <div className="flex-1 flex items-center justify-center px-5">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-8 w-full max-w-sm">
                        <div className="text-center mb-6">
                            <div className="text-4xl mb-3">🔒</div>
                            <div className="font-bold text-lg text-neutral-900">
                                Área restrita
                            </div>
                            <div className="text-sm text-neutral-400 mt-1">
                                Digite a senha de administrador para continuar
                            </div>
                        </div>

                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                            Senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite a senha"
                            value={senhaDigitada}
                            onChange={(e) => {
                                setSenhaDigitada(e.target.value);
                                setErroSenha("");
                            }}
                            onKeyDown={(e) => e.key === "Enter" && autenticar()}
                            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition mb-2"
                        />
                        {erroSenha && (
                            <div className="text-xs text-red-500 mb-3">
                                {erroSenha}
                            </div>
                        )}
                        <button
                            onClick={autenticar}
                            className="w-full py-2.5 rounded-xl bg-orange-700 text-white font-semibold text-sm hover:bg-orange-600 transition mt-2"
                        >
                            Entrar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Tela principal de configurações ──
    return (
        <div className="min-h-screen bg-neutral-200 flex flex-col">
            <div className="bg-white border-b border-neutral-200 px-5 lg:px-10 py-4 flex items-center gap-3 sticky top-0 z-10">
                <button
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition"
                >
                    ←
                </button>
                <span className="font-semibold text-base lg:text-lg flex-1">
                    Configurações
                </span>
                <button
                    onClick={() => setAutenticado(false)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 transition"
                >
                    Sair
                </button>
            </div>

            <div className="flex-1 px-5 lg:px-10 py-6 lg:py-10 max-w-3xl w-full mx-auto">
                {sucessoPin && (
                    <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
                        ✓ {sucessoPin}
                    </div>
                )}

                <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    Atendentes
                </div>

                <div className="flex flex-col gap-3">
                    {atendentes.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white border border-neutral-200 rounded-xl p-4 lg:p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div
                                    className={`w-10 h-10 rounded-full ${a.cor} flex items-center justify-center text-white font-bold flex-shrink-0`}
                                >
                                    {a.inicial}
                                </div>
                                <span className="font-semibold text-sm lg:text-base flex-1">
                                    {a.nome}
                                </span>
                                <button
                                    onClick={() => {
                                        setEditando(
                                            editando === a.id ? null : a.id,
                                        );
                                        setNovoPin("");
                                        setConfirmarPin("");
                                        setErroPin("");
                                    }}
                                    className="text-xs text-orange-600 font-semibold hover:underline"
                                >
                                    {editando === a.id
                                        ? "Cancelar"
                                        : "Alterar PIN"}
                                </button>
                                {atendentes.length > 1 && (
                                    <button
                                        onClick={() => removerAtendente(a.id)}
                                        className="text-xs text-red-400 font-semibold hover:underline ml-2"
                                    >
                                        Remover
                                    </button>
                                )}
                            </div>

                            {editando === a.id && (
                                <div className="border-t border-neutral-100 pt-4 flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                            Novo PIN
                                        </label>
                                        <input
                                            type="password"
                                            maxLength={4}
                                            placeholder="4 dígitos"
                                            value={novoPin}
                                            onChange={(e) => {
                                                setNovoPin(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 4),
                                                );
                                                setErroPin("");
                                            }}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                            Confirmar PIN
                                        </label>
                                        <input
                                            type="password"
                                            maxLength={4}
                                            placeholder="4 dígitos"
                                            value={confirmarPin}
                                            onChange={(e) => {
                                                setConfirmarPin(
                                                    e.target.value
                                                        .replace(/\D/g, "")
                                                        .slice(0, 4),
                                                );
                                                setErroPin("");
                                            }}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => salvarPin(a.id)}
                                            className="w-full lg:w-auto px-6 py-2.5 rounded-xl bg-orange-700 text-white text-sm font-semibold hover:bg-orange-600 transition"
                                        >
                                            Salvar
                                        </button>
                                    </div>
                                </div>
                            )}
                            {editando === a.id && erroPin && (
                                <div className="text-xs text-red-500 mt-2">
                                    {erroPin}
                                </div>
                            )}
                        </div>
                    ))}

                    {adicionando ? (
                        <div className="bg-white border border-orange-200 rounded-xl p-4 lg:p-5">
                            <div className="font-semibold text-sm lg:text-base mb-4">
                                Nova atendente
                            </div>
                            <div className="flex flex-col lg:flex-row gap-3">
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                        Nome
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ex: Carla"
                                        value={novoNome}
                                        onChange={(e) =>
                                            setNovoNome(e.target.value)
                                        }
                                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                        PIN inicial
                                    </label>
                                    <input
                                        type="password"
                                        maxLength={4}
                                        placeholder="4 dígitos"
                                        value={pinNovaAtendente}
                                        onChange={(e) => {
                                            setPinNovaAtendente(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 4),
                                            );
                                            setErroPin("");
                                        }}
                                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                    />
                                </div>
                            </div>
                            {erroPin && (
                                <div className="text-xs text-red-500 mt-2">
                                    {erroPin}
                                </div>
                            )}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => {
                                        setAdicionando(false);
                                        setNovoNome("");
                                        setPinNovaAtendente("");
                                        setErroPin("");
                                    }}
                                    className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={adicionarAtendente}
                                    className="flex-1 py-2.5 rounded-xl bg-orange-700 text-white text-sm font-semibold hover:bg-orange-600 transition"
                                >
                                    Adicionar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setAdicionando(true)}
                            className="w-full py-3 rounded-xl border border-dashed border-neutral-300 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 transition"
                        >
                            + Adicionar atendente
                        </button>
                    )}
                </div>
                {/* Senha de administrador */}
                <div className="mt-8">
                    <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                        Senha de administrador
                    </div>

                    {sucessoSenhaAdmin && (
                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-3">
                            ✓ {sucessoSenhaAdmin}
                        </div>
                    )}

                    <div className="bg-white border border-neutral-200 rounded-xl p-4 lg:p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-white font-bold flex-shrink-0">
                                🔑
                            </div>
                            <span className="font-semibold text-sm lg:text-base flex-1">
                                Senha de acesso às configurações
                            </span>
                            <button
                                onClick={() => {
                                    setEditandoSenha(!editandoSenha);
                                    setSenhaAtual("");
                                    setNovaSenha("");
                                    setConfirmarSenha("");
                                    setErroSenhaAdmin("");
                                }}
                                className="text-xs text-orange-600 font-semibold hover:underline"
                            >
                                {editandoSenha ? "Cancelar" : "Alterar senha"}
                            </button>
                        </div>

                        {editandoSenha && (
                            <div className="border-t border-neutral-100 pt-4 mt-3 flex flex-col gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                        Senha atual
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Digite a senha atual"
                                        value={senhaAtual}
                                        onChange={(e) => {
                                            setSenhaAtual(e.target.value);
                                            setErroSenhaAdmin("");
                                        }}
                                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                    />
                                </div>
                                <div className="flex flex-col lg:flex-row gap-3">
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                            Nova senha
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Nova senha"
                                            value={novaSenha}
                                            onChange={(e) => {
                                                setNovaSenha(e.target.value);
                                                setErroSenhaAdmin("");
                                            }}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-neutral-500 mb-1.5 block">
                                            Confirmar nova senha
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Repita a nova senha"
                                            value={confirmarSenha}
                                            onChange={(e) => {
                                                setConfirmarSenha(
                                                    e.target.value,
                                                );
                                                setErroSenhaAdmin("");
                                            }}
                                            className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm bg-white outline-none focus:border-orange-400 transition"
                                        />
                                    </div>
                                </div>
                                {erroSenhaAdmin && (
                                    <div className="text-xs text-red-500">
                                        {erroSenhaAdmin}
                                    </div>
                                )}
                                <button
                                    onClick={salvarSenhaAdmin}
                                    className="w-full lg:w-auto lg:self-end px-6 py-2.5 rounded-xl bg-orange-700 text-white text-sm font-semibold hover:bg-orange-600 transition"
                                >
                                    Salvar senha
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
