import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SelecionarLoja from "./pages/SelecionarLoja";
import Menu from "./pages/Menu";
import Estoque from "./pages/Estoque";
import Condicionais from "./pages/Condicionais";
import CondicionalDetalhe from "./pages/CondicionalDetalhe";
import NovoCondicional from "./pages/NovoCondicional";
import Configuracoes from "./pages/Configuracoes";
import NovoProduto from "./pages/NovoProduto";
import EntradaEstoque from './pages/EntradaEstoque'
import SaidaEstoque from './pages/SaidaEstoque'



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/loja" replace />} />
                <Route path="/loja" element={<SelecionarLoja />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/estoque" element={<Estoque />} />
                <Route path="/condicionais" element={<Condicionais />} />
                <Route path="/condicionais/:id" element={<CondicionalDetalhe />} />
                <Route path="/condicionais/novo" element={<NovoCondicional />} />
                <Route path="/configuracoes" element={<Configuracoes />} />
                <Route path="/estoque/novo" element={<NovoProduto />} />
                <Route path="/estoque/entrada" element={<EntradaEstoque />} />
                <Route path="/estoque/saida" element={<SaidaEstoque />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
