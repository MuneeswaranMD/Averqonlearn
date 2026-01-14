import api from './api';

export const SuperAdminService = {
    // Institutions
    getColleges: async () => {
        const response = await api.get('/colleges');
        return response.data.map(c => ({ ...c, id: c._id }));
    },

    registerCollege: async (collegeData) => {
        const response = await api.post('/colleges', collegeData);
        return response.data;
    },

    registerCollegeWithAdmin: async (collegeData, adminData) => {
        const response = await api.post('/colleges', {
            ...collegeData,
            adminData
        });
        return response.data;
    },

    updateCollege: async (id, collegeData) => {
        const response = await api.put(`/colleges/${id}`, collegeData);
        return response.data;
    },

    toggleCollegeStatus: async (id, currentStatus) => {
        const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
        const response = await api.put(`/colleges/${id}`, { status: newStatus });
        return response.data;
    },

    deleteCollege: async (id) => {
        const response = await api.delete(`/colleges/${id}`);
        return response.data;
    },

    deleteMultipleColleges: async (ids) => {
        const results = [];
        for (const id of ids) {
            await api.delete(`/colleges/${id}`);
            results.push(id);
        }
        return results;
    },

    // Institutional Admins
    getCollegeAdmins: async () => {
        const response = await api.get('/users/role/collegeAdmin');
        return response.data.map(u => ({ ...u, id: u._id }));
    },

    // System Logs
    getSystemLogs: async (count = 50) => {
        // Mocking for now as logs aren't critical for initial migration
        return [];
    },

    // Global Stats
    getGlobalStats: async () => {
        const [colleges, users] = await Promise.all([
            api.get('/colleges'),
            api.get('/users/role/student')
        ]);
        
        return {
            totalColleges: colleges.data.length,
            totalUsers: users.data.length,
            activeSessions: 12, // Placeholder
            systemHealth: '100% Online'
        };
    },

    getGlobalAnalytics: async () => {
        const colleges = await api.get('/colleges');
        return {
            enrollmentTrend: [
                { name: 'Jan', students: 4000 },
                { name: 'Feb', students: 4500 },
                { name: 'Mar', students: 5200 },
            ],
            collegePerformance: colleges.data.map(c => ({
                name: c.name,
                revenue: Math.floor(Math.random() * 50000) + 10000
            }))
        };
    },

    seedDemoData: async () => {
        const response = await api.post('/academic/seed');
        return response.data;
    }
};
