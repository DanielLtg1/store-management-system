import api from "./api.js";

// Get products by type (clothes or perfumes)
export const getProdutos = async (tipo) => {
    try {
        const response = await api.get(`/produtos/${tipo}`)
        return response.data;
    }catch (error) {
        console.error("Erro ao buscar produtos:", error);
        throw error;
    }
}

// Create a new product
export const createProduto = async (tipo, produto) => {
    try {
        const response = await api.post(`/produtos/${tipo}`, produto);
        return response.data;
    }catch (error) {
        console.error("Erro ao criar produto:", error);
        throw error;
    }
}

// Update an existing product
export const updateProduto = async (tipo, id, produto) => {
    try {
        const response = await api.put(`/produtos/${tipo}/${id}`, produto);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar produto:", error);
        throw error;
    }
}

// Update product quantity for stock entry
export const updateProdutoEntrada = async (tipo, id, quantidade) => {
    try {
        const response = await api.patch(`/produtos/${tipo}/${id}/entrada`, { quantidade });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar quantidade de produto:", error);
        throw error;
    }
};


// Update product quantity for stock exit
export const updateProdutoSaida = async (tipo, id, quantidade) => {
    try {
        const response = await api.patch(`/produtos/${tipo}/${id}/saida`, { quantidade });
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar quantidade de produto:", error);
        throw error;
    }
};

// Delete a product
export const deleteProduto = async (tipo, id) => {
    try {
        const response = await api.delete(`/produtos/${tipo}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao deletar produto:", error);
        throw error;
    }
}

