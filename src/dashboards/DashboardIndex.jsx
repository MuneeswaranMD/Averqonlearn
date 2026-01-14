import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StudentDashboard from './StudentDashboard';
import FacultyDashboard from './FacultyDashboard';
import TPODashboard from './TPODashboard';
import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';

const DashboardIndex = () => {
    const {
        currentUser,
        loading,
        isSuperAdmin,
        isCollegeAdmin,
        isPlacement,
        isFaculty,
        isStudent
    } = useAuth();

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/login');
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold animate-pulse">Initializing OS...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) return null;

    const renderDashboard = () => {
        if (isSuperAdmin) return <SuperAdminDashboard activeTab={activeTab} />;
        if (isCollegeAdmin) return <AdminDashboard activeTab={activeTab} />;
        if (isPlacement) return <TPODashboard activeTab={activeTab} />;
        if (isFaculty) return <FacultyDashboard activeTab={activeTab} />;
        return <StudentDashboard activeTab={activeTab} />;
    };

    return (
        <DashboardLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderDashboard()}
        </DashboardLayout>
    );
};

export default DashboardIndex;
