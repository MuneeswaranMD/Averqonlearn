import api from './api';

export const AdminService = {
    // Get users by role and college
    getUsersByRole: async (collegeId, role) => {
        const response = await api.get(`/users/role/${role}`, {
            params: { collegeId }
        });
        return response.data;
    },

    // User Management
    addUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    },

    deleteMultipleUsers: async (ids) => {
        const results = [];
        for (const id of ids) {
            await api.delete(`/users/${id}`);
            results.push(id);
        }
        return results;
    },

    // Departments
    getDepartments: async (collegeId) => {
        const response = await api.get('/departments', {
            params: { collegeId }
        });
        return response.data;
    },

    addDepartment: async (deptData) => {
        const response = await api.post('/departments', deptData);
        return response.data;
    },

    syncDepartments: async () => {
        const response = await api.post('/departments/sync');
        return response.data;
    },

    // Settings
    getSettings: async () => {
        const response = await api.get('/colleges/me');
        return response.data;
    },

    updateSettings: async (settingsData) => {
        const response = await api.put('/colleges/me', settingsData);
        return response.data;
    }
};
