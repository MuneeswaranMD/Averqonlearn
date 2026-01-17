import api from './api';

export const BatchService = {
    getAll: async () => {
        const response = await api.get('/batches');
        return response.data;
    },

    create: async (batchData) => {
        const response = await api.post('/batches', batchData);
        return response.data;
    },

    update: async (id, batchData) => {
        const response = await api.put(`/batches/${id}`, batchData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/batches/${id}`);
        return response.data;
    },

    populate: async (id, criteria) => {
        const response = await api.post(`/batches/${id}/populate`, criteria);
        return response.data;
    }
};
