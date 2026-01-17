import React from 'react';
import { Bot } from 'lucide-react';
import StudentOverview from './student/StudentOverview';
import MySubjects from './student/MySubjects';
import VideoClasses from './student/VideoClasses';
import Notes from './student/Notes';
import AITutor from './student/AITutor';
import Exams from './student/Exams';
import Results from './student/Results';
import Placements from './student/Placements';
import Resume from './student/Resume';
import Certificates from './student/Certificates';
import Profile from './student/Profile';
import ProgressTracker from './student/ProgressTracker';

const StudentDashboard = ({ activeTab }) => {
    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <StudentOverview />;
            case 'subjects': return <MySubjects />;
            case 'ai-tutor': return <AITutor />;
            case 'exams': return <Exams />;
            case 'results': return <Results />;
            case 'progress': return <ProgressTracker />;
            case 'placements': return <Placements />;
            case 'resume': return <Resume />;
            case 'certificates': return <Certificates />;
            case 'profile': return <Profile />;
            case 'appearance': return <Appearance />;
            default: return <StudentOverview />;
        }
    };

    return (
        <div className="relative">
            {renderContent()}

            {/* AI Tutor Floating Button - Only show if not on AI Tutor tab */}
            {activeTab !== 'ai-tutor' && (
                <div className="fixed bottom-8 right-8 z-50">
                    <button className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 transition-all group">
                        <Bot size={32} />
                        <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                            Need help? Ask AI Tutor
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
