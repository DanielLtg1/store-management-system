import api from "./api.js";

// Get all leases
export const getCondicionais = async () => {
    try {
        const response = await api.get("/condicionais");
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar condicionais:", error);
        throw error;
    }  
}

// Create a new lease
export const createCondicional = async (condicional) => {
    try {
        const response = await api.post("/condicionais", condicional);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar condicional:", error);
        throw error;
    }
}

// Update an existing lease
export const updateCondicional = async (id, condicional) => {
    try {
        const response = await api.put(`/condicionais/${id}`, condicional);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar condicional:", error);
        throw error;
    }
}

// Update the status of a lease
export const updateStatusCondicional = async (id, status_condicional) => {
    try {
        const response = await api.patch(`/condicionais/${id}/status`, { status_condicional })
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar status da condicional:", error);
        throw error;
    }
}

// Delete a lease
export const cancelCondicional = async (id) => {
    return updateStatusCondicional(id, 'cancelado' );
}