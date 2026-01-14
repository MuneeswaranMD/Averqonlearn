import api from './api';

export const PlacementService = {
    // Companies / Partners
    getPartners: async (collegeId) => {
        const response = await api.get('/placements/partners', {
            params: { collegeId }
        });
        return response.data;
    },

    addPartner: async (data) => {
        const response = await api.post('/placements/partners', data);
        return response.data;
    },

    deletePartner: async (id) => {
        const response = await api.delete(`/placements/partners/${id}`);
        return response.data;
    },

    // Job Drives
    getDrives: async (collegeId) => {
        const response = await api.get('/placements/drives', {
            params: { collegeId }
        });
        return response.data;
    },

    addDrive: async (data) => {
        const response = await api.post('/placements/drives', data);
        return response.data;
    },

    deleteDrive: async (id) => {
        const response = await api.delete(`/placements/drives/${id}`);
        return response.data;
    },

    // Applications Tracking
    getApplications: async (collegeId) => {
        const response = await api.get('/placements/applications', {
            params: { collegeId }
        });
        return response.data;
    },

    updateApplicationStatus: async (id, status) => {
        const response = await api.put(`/placements/applications/${id}`, { status });
        return response.data;
    },

    applyForDrive: async (applicationData) => {
        const response = await api.post('/placements/applications', applicationData);
        return response.data;
    }
};
