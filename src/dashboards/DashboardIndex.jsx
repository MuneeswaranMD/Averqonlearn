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
            <div className="min-h-screen bg-background flex items-center justify-center transition-colors duration-300">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/20" />
                    </div>
                    <div className="flex flex-col items-center">
                        <h2 className="text-xl font-black text-text-primary tracking-tight">Averqon<span className="text-primary italic">OS</span></h2>
                        <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mt-2 animate-pulse">Initialising Framework...</p>
                    </div>
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
