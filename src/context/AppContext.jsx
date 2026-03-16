import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

const atendentesPadrao = [
    { id: 1, nome: "Dinda", inicial: "D", cor: "bg-orange-600", pin: "1234" },
    { id: 2, nome: "Maria", inicial: "M", cor: "bg-teal-600", pin: "1234" },
    { id: 3, nome: "Ana", inicial: "A", cor: "bg-amber-500", pin: "1234" },
];

export function AppProvider({ children }) {
    const [loja, setLojaState] = useState(() => {
        return localStorage.getItem("loja") || null;
    });

    const [atendentes, setAtendentes] = useState(() => {
        const salvo = localStorage.getItem("atendentes");
        return salvo ? JSON.parse(salvo) : atendentesPadrao;
    });

    function setLoja(novaLoja) {
        setLojaState(novaLoja);
        if (novaLoja) {
            localStorage.setItem("loja", novaLoja);
        } else {
            localStorage.removeItem("loja");
        }
    }

    function salvarAtendentes(novaLista) {
        setAtendentes(novaLista);
        localStorage.setItem("atendentes", JSON.stringify(novaLista));
    }

    return (
        <AppContext.Provider
            value={{ loja, setLoja, atendentes, salvarAtendentes }}
        >
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
