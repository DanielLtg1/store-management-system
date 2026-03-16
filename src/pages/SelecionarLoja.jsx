import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import sonhoInfantilImg from "../assets/sonhoinfantil.jpg";
import amoreMioImg from "../assets/amoremio.jpg";

export default function SelecionarLoja() {
    const navigate = useNavigate();
    const { setLoja } = useApp();

    function handleLoja(loja) {
        setLoja(loja);
        navigate("/menu");
    }

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-6">
            <div className="mb-14 text-center">
                <h1 className="text-5xl lg:text-6xl font-bold text-neutral-900 tracking-tight">
                    Gestão de Lojas
                </h1>
                <p className="text-xl text-neutral-500 mt-2">
                    Selecione a loja para continuar
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-md lg:max-w-2xl">
                <button
                    onClick={() => handleLoja("sonhoInfantil")}
                    className="flex lg:flex-col items-center gap-5 bg-amber-500 hover:bg-amber-600 hover:shadow-xl hover:shadow-neutral-700/30 active:scale-95 transition-all rounded-2xl px-7 py-6 lg:py-10 text-left lg:text-center flex-1 hover:-translate-y-2"
                >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={sonhoInfantilImg}
                            alt="Sonho Infantil Store"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-white font-bold text-2xl">
                            Sonho Infantil Store
                        </div>
                        <div className="text-amber-100 text-md mt-0.5">
                            Estoque, condicionais e movimentações
                        </div>
                    </div>
                </button>

                <button
                    onClick={() => handleLoja("amoreMio")}
                    className="flex lg:flex-col items-center gap-5 bg-neutral-700 hover:bg-neutral-800 hover:shadow-xl hover:shadow-neutral-700/30 active:scale-95 transition-all rounded-2xl px-7 py-6 lg:py-10 text-left lg:text-center flex-1 hover:-translate-y-2"
                >
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                            src={amoreMioImg}
                            alt="AmoreMio Cosméticos"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <div className="text-white font-bold text-2xl">
                            AmoreMio Cosméticos
                        </div>
                        <div className="text-neutral-400 text-md mt-0.5">
                            Estoque, condicionais e movimentações
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
}
