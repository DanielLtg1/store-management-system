import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

export default function ModalPin({ aberto, titulo, onConfirmar, onCancelar }) {
    const { atendentes } = useApp();
    const isMobile = useIsMobile();
    const inputRef = useRef(null);

    const [atendenteSelecionado, setAtendenteSelecionado] = useState(null);
    const [pin, setPin] = useState("");
    const [erro, setErro] = useState("");
    const [animando, setAnimando] = useState(false);

    useEffect(() => {
        if (aberto) {
            setAtendenteSelecionado(null);
            setPin("");
            setErro("");
        }
    }, [aberto]);

    useEffect(() => {
        if (aberto && !isMobile) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [aberto, isMobile]);

    useEffect(() => {
        if (pin.length === 4) validarPin();
    }, [pin]);

    function validarPin() {
        if (!atendenteSelecionado) {
            setErro("Selecione uma atendente primeiro.");
            setPin("");
            return;
        }

        const pinCorreto = atendentes.find(
            (a) => a.id === atendenteSelecionado.id,
        )?.pin;

        if (pin === pinCorreto) {
            setErro("");
            setTimeout(() => onConfirmar(atendenteSelecionado), 200);
        } else {
            setAnimando(true);
            setErro("PIN incorreto. Tente novamente.");
            setTimeout(() => {
                setPin("");
                setAnimando(false);
                if (!isMobile) inputRef.current?.focus();
            }, 500);
        }
    }

    function pressionar(digito) {
        if (pin.length < 4) setPin((prev) => prev + digito);
    }

    function apagar() {
        setPin((prev) => prev.slice(0, -1));
        setErro("");
    }

    function handleInputDesktop(e) {
        const valor = e.target.value.replace(/\D/g, "").slice(0, 4);
        setPin(valor);
        setErro("");
    }

    if (!aberto) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center z-50"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancelar();
            }}
        >
            <div className="bg-white w-full lg:w-auto lg:min-w-96 rounded-t-2xl lg:rounded-2xl px-6 pb-10 pt-6 lg:p-8">
                <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6 lg:hidden" />

                <div className="font-bold text-lg lg:text-xl text-neutral-900 mb-1">
                    {titulo}
                </div>
                <div className="text-sm text-neutral-400 mb-6">
                    Selecione sua identificação e digite seu PIN
                </div>

                <div className="flex flex-col gap-2 mb-6">
                    {atendentes.map((a) => (
                        <button
                            key={a.id}
                            onClick={() => {
                                setAtendenteSelecionado(a);
                                setErro("");
                                inputRef.current?.focus();
                            }}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left
                ${
                    atendenteSelecionado?.id === a.id
                        ? "border-orange-300 bg-orange-50"
                        : "border-neutral-200 hover:bg-neutral-50"
                }`}
                        >
                            <div
                                className={`w-9 h-9 rounded-full ${a.cor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
                            >
                                {a.inicial}
                            </div>
                            <span className="font-semibold text-sm lg:text-base text-neutral-900">
                                {a.nome}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="text-xs font-semibold text-neutral-400 mb-3">
                    Digite seu PIN
                </div>
                <div
                    className={`flex gap-3 justify-center mb-4 ${animando ? "animate-shake" : ""}`}
                >
                    {[0, 1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={`w-4 h-4 rounded-full border-2 transition-all
                ${i < pin.length ? "bg-orange-600 border-orange-600" : "border-neutral-300"}`}
                        />
                    ))}
                </div>

                {erro && (
                    <div className="text-xs text-red-500 text-center mb-4">
                        {erro}
                    </div>
                )}

                {!isMobile && (
                    <input
                        ref={inputRef}
                        type="password"
                        inputMode="numeric"
                        maxLength={4}
                        value={pin}
                        onChange={handleInputDesktop}
                        className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-center text-sm bg-white outline-none focus:border-orange-400 transition mb-2"
                        placeholder="Digite o PIN pelo teclado"
                    />
                )}

                {isMobile && (
                    <div className="grid grid-cols-3 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <button
                                key={n}
                                onClick={() => pressionar(String(n))}
                                className="py-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-orange-50 hover:border-orange-200 transition font-mono font-semibold text-lg text-neutral-800"
                            >
                                {n}
                            </button>
                        ))}
                        <button
                            onClick={onCancelar}
                            className="py-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition text-sm text-neutral-500"
                        >
                            ✕
                        </button>
                        <button
                            onClick={() => pressionar("0")}
                            className="py-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-orange-50 hover:border-orange-200 transition font-mono font-semibold text-lg text-neutral-800"
                        >
                            0
                        </button>
                        <button
                            onClick={apagar}
                            className="py-4 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition text-sm text-neutral-500"
                        >
                            ⌫
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
