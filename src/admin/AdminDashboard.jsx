import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard, BookOpen, Users, Video, Briefcase, Settings,
    Plus, MoreVertical, TrendingUp, DollarSign, Activity, Calendar, Upload, Trash2,
    Download, FilePlus, X
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CourseService } from '../services/course';

const AdminDashboard = () => {
    const { currentUser, isAdmin, loading } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    // College Entities
    const [subjects, setSubjects] = useState([]);
    const [faculty, setFaculty] = useState([]);
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudents, setSelectedStudents] = useState(new Set());
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', rollNo: '', email: '', department: 'CSE', year: '1st Year' });
    const itemsPerPage = 10;

    // Filter State
    const [studentFilters, setStudentFilters] = useState({
        department: '',
        year: '',
        search: ''
    });

    // Mock Data for Analytics
    const growthData = [
        { name: 'Jan', students: 400, revenue: 2400 },
        { name: 'Feb', students: 600, revenue: 3200 },
        { name: 'Mar', students: 900, revenue: 5500 },
        { name: 'Apr', students: 1200, revenue: 7800 },
        { name: 'May', students: 1600, revenue: 9500 },
        { name: 'Jun', students: 2100, revenue: 12800 },
    ];

    const coursePopularity = [
        { name: 'Web Dev', value: 35 },
        { name: 'Cloud', value: 25 },
        { name: 'AI/ML', value: 20 },
        { name: 'CyberSec', value: 20 },
    ];
    const COLORS = ['#4F47E6', '#10B981', '#F59E0B', '#EF4444'];

    useEffect(() => {
        if (!loading) {
            if (!currentUser) navigate('/login');
            else if (!isAdmin) navigate('/dashboard');
        }
    }, [currentUser, isAdmin, loading, navigate]);

    // Fetch College Data
    useEffect(() => {
        if (isAdmin) {
            if (activeTab === 'subjects') {
                import('../services/subject').then(({ SubjectService }) => {
                    SubjectService.getAllSubjects().then(setSubjects).catch(console.error);
                });
            } else if (activeTab === 'faculty') {
                import('../services/faculty').then(({ FacultyService }) => {
                    FacultyService.getAllFaculty().then(setFaculty).catch(console.error);
                });
            } else if (activeTab === 'students') {
                import('../services/student').then(({ StudentService }) => {
                    StudentService.getAllStudents().then(data => {
                        setStudents(data);
                        setFilteredStudents(data);
                    }).catch(console.error);
                });
            }
        }
    }, [activeTab, isAdmin]);

    // Apply Student Filters
    useEffect(() => {
        if (activeTab === 'students') {
            let result = students;

            if (studentFilters.department) {
                result = result.filter(s => s.department === studentFilters.department);
            }
            if (studentFilters.year) {
                result = result.filter(s => s.year === studentFilters.year);
            }
            if (studentFilters.search) {
                const term = studentFilters.search.toLowerCase();
                result = result.filter(s =>
                    s.name?.toLowerCase().includes(term) ||
                    s.rollNo?.toLowerCase().includes(term) ||
                    s.email?.toLowerCase().includes(term)
                );
            }
            setFilteredStudents(result);
            setCurrentPage(1);
            setSelectedStudents(new Set());
        }
    }, [studentFilters, students, activeTab]);

    if (loading || !isAdmin) return <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-900">Loading Admin Panel...</div>;

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-sm font-semibold transition-all duration-200 group ${activeTab === id
                ? 'bg-primary text-white shadow-lg shadow-primary/20 translate-x-1'
                : 'text-slate-500 hover:text-primary hover:bg-slate-50'
                }`}
        >
            <Icon size={20} className={activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-primary transition-colors'} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-slate-200 fixed h-full z-20 hidden lg:flex flex-col">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10 text-slate-900">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-primary/20">
                            AL
                        </div>
                        <span className="text-2xl font-bold tracking-tight">Admin<span className="text-primary">.</span></span>
                    </div>

                    <nav className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="text-xs font-bold text-slate-400 uppercase px-6 mb-2 mt-2">Overview</div>
                        <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />

                        <div className="text-xs font-bold text-slate-400 uppercase px-6 mb-2 mt-6">People</div>
                        <SidebarItem id="students" icon={Users} label="Students" />
                        <SidebarItem id="faculty" icon={Briefcase} label="Faculty" />

                        <div className="text-xs font-bold text-slate-400 uppercase px-6 mb-2 mt-6">Academics</div>
                        <SidebarItem id="subjects" icon={BookOpen} label="Subjects" />
                        <SidebarItem id="exams" icon={Activity} label="Exams & Results" />
                        <SidebarItem id="live" icon={Video} label="Video Classes" />

                        <div className="text-xs font-bold text-slate-400 uppercase px-6 mb-2 mt-6">Career</div>
                        <SidebarItem id="placement" icon={TrendingUp} label="Placement" />
                    </nav>

                    <nav className="mt-auto pt-8 border-t border-slate-100 space-y-2">
                        <SidebarItem id="settings" icon={Settings} label="College Settings" />
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-72 p-6 lg:p-10 overflow-auto h-screen">
                {/* Top Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 capitalize">{activeTab}</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {currentUser?.displayName || 'Admin'}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <a href="/" target="_blank" className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl transition-all flex items-center gap-2">
                            Visit Website
                        </a>
                        <button className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                            <Plus size={18} /> New Report
                        </button>
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                            M
                        </div>
                    </div>
                </div>

                {/* Dashboard / Analytics View */}
                {(activeTab === 'overview' || activeTab === 'analytics') && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Revenue', value: '$12,450', change: '+12%', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
                                { label: 'Active Students', value: '2,845', change: '+5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                { label: 'Course Sales', value: '432', change: '+18%', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                                { label: 'Live Sessions', value: '124', change: '+2%', icon: Video, color: 'text-orange-500', bg: 'bg-orange-500/10' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-card border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                                            <stat.icon size={24} />
                                        </div>
                                        <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">{stat.change}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-400">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Chart - Revenue & Growth */}
                            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-xl font-bold text-[#0F172A]">Platform Growth</h3>
                                    <div className="flex gap-2">
                                        <select className="bg-slate-50 border border-slate-200 text-[#0F172A] text-sm rounded-lg px-3 py-1 outline-none">
                                            <option>Last 6 Months</option>
                                            <option>This Year</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="h-[300px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={growthData}>
                                            <defs>
                                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4F47E6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#4F47E6" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorStu" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                            <XAxis dataKey="name" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#0F172A' }}
                                                itemStyle={{ color: '#4F47E6' }}
                                            />
                                            <Area type="monotone" dataKey="revenue" stroke="#4F47E6" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="students" stroke="#10B981" fillOpacity={1} fill="url(#colorStu)" strokeWidth={3} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Secondary Chart - Course Categories */}
                            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-[#0F172A] mb-6">Popular Categories</h3>
                                <div className="h-[300px] flex items-center justify-center">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={coursePopularity}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {coursePopularity.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity / Table */}
                        <div className="bg-card border border-white/5 rounded-2xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white">Recent Enrollments</h3>
                                <button className="text-primary text-sm font-semibold hover:underline">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="text-gray-400 border-b border-white/10 text-sm">
                                        <tr>
                                            <th className="px-4 py-3 font-medium">Student</th>
                                            <th className="px-4 py-3 font-medium">Course</th>
                                            <th className="px-4 py-3 font-medium">Date</th>
                                            <th className="px-4 py-3 font-medium">Amount</th>
                                            <th className="px-4 py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-sm">
                                        {[
                                            { user: 'Alex Johnson', course: 'Full Stack Bootcamp', date: 'Oct 24, 2026', price: '$99', status: 'Completed' },
                                            { user: 'Sarah Smith', course: 'AWS Solutions Arch', date: 'Oct 23, 2026', price: '$129', status: 'Pending' },
                                            { user: 'Mike Brown', course: 'React Native Master', date: 'Oct 23, 2026', price: '$89', status: 'Completed' },
                                        ].map((row, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-4 text-white font-medium">{row.user}</td>
                                                <td className="px-4 py-4 text-gray-300">{row.course}</td>
                                                <td className="px-4 py-4 text-gray-400">{row.date}</td>
                                                <td className="px-4 py-4 text-white">{row.price}</td>
                                                <td className="px-4 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${row.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {row.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'students' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Student Directory</h2>
                            <div className="flex gap-3">
                                <label className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-xl hover:bg-green-100 transition-all font-semibold text-sm cursor-pointer whitespace-nowrap">
                                    <Upload size={18} />
                                    <span>Import Excel</span>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            /* Import XLSX dynamically */
                                            const XLSX = await import("xlsx");

                                            const reader = new FileReader();
                                            reader.onload = async (evt) => {
                                                const bstr = evt.target.result;
                                                const wb = XLSX.read(bstr, { type: 'binary' });
                                                const wsname = wb.SheetNames[0];
                                                const ws = wb.Sheets[wsname];
                                                const data = XLSX.utils.sheet_to_json(ws);

                                                if (confirm(`Found ${data.length} students. Upload now?`)) {
                                                    const { StudentService } = await import('../services/student');

                                                    // Transform to our Schema
                                                    const formattedData = data.map(row => ({
                                                        name: row.Name,
                                                        rollNo: row.RollNo,
                                                        email: row.Email,
                                                        department: row.Department,
                                                        year: row.Year ? row.Year.toString() + (typeof row.Year === 'number' ? 'th Year' : '') : '',
                                                        section: row.Section,
                                                        password: row.RollNo, // Default password
                                                        skills: [],
                                                        cgpa: row.CGPA || null
                                                    }));

                                                    await StudentService.batchCreateStudents(formattedData);
                                                    alert("Successfully uploaded students from Excel!");
                                                    StudentService.getAllStudents().then(d => { setStudents(d); setFilteredStudents(d); });
                                                }
                                            };
                                            reader.readAsBinaryString(file);
                                        }}
                                    />
                                </label>
                                <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-semibold">
                                    <Plus size={20} /> Add Student
                                </button>
                            </div>
                        </div>

                        {/* Filters */}
                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            <div className="flex-1 min-w-[200px] relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, roll no..."
                                    className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 outline-none focus:border-primary transition-all placeholder:text-slate-400"
                                    onChange={(e) => setStudentFilters(prev => ({ ...prev, search: e.target.value }))}
                                />
                            </div>
                            <select
                                className="bg-white border border-slate-200 text-slate-900 rounded-xl px-6 py-3 outline-none focus:border-primary cursor-pointer transition-all"
                                onChange={(e) => setStudentFilters(prev => ({ ...prev, department: e.target.value }))}
                            >
                                <option value="">All Departments</option>
                                <option value="CSE">CSE</option>
                                <option value="IT">IT</option>
                                <option value="ECE">ECE</option>
                                <option value="MECH">MECH</option>
                            </select>
                            <select
                                className="bg-white border border-slate-200 text-slate-900 rounded-xl px-6 py-3 outline-none focus:border-primary cursor-pointer transition-all"
                                onChange={(e) => setStudentFilters(prev => ({ ...prev, year: e.target.value }))}
                            >
                                <option value="">All Years</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>

                            {/* Delete Filtered Button - Only show if filters are applied */}
                            {(studentFilters.department || studentFilters.year) && filteredStudents.length > 0 && (
                                <button
                                    onClick={async () => {
                                        const count = filteredStudents.length;
                                        const filterDesc = `${studentFilters.department || 'All Depts'} - ${studentFilters.year || 'All Years'}`;
                                        if (confirm(`⚠️ DANGER: Delete ALL ${count} students matching filter "${filterDesc}"? This cannot be undone.`)) {
                                            const { StudentService } = await import('../services/student');
                                            try {
                                                await StudentService.batchDeleteStudents(filteredStudents.map(s => s.id));
                                                // Refresh: Get fresh list without the deleted ones
                                                const remaining = students.filter(s => !filteredStudents.find(fs => fs.id === s.id));
                                                setStudents(remaining);
                                                setFilteredStudents([]); // All matched are gone
                                                alert(`Successfully deleted ${count} students.`);
                                            } catch (e) {
                                                console.error(e);
                                                alert("Batch delete failed.");
                                            }
                                        }
                                    }}
                                    className="px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-semibold flex items-center gap-2"
                                >
                                    <Trash2 size={18} />
                                    Delete Filtered ({filteredStudents.length})
                                </button>
                            )}
                        </div>

                        <div className="flex justify-between items-center mb-4 px-2">
                            <div className="text-gray-400 text-sm">
                                Total Students: <span className="text-white font-bold">{filteredStudents.length}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg disabled:opacity-50 transition-all"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-400 text-xs flex items-center">
                                    Page {currentPage} of {Math.ceil(filteredStudents.length / itemsPerPage)}
                                </span>
                                <button
                                    disabled={currentPage >= Math.ceil(filteredStudents.length / itemsPerPage)}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white text-xs rounded-lg disabled:opacity-50 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {/* Action Bar for Selection */}
                        <div className="flex gap-3 mb-4 flex-wrap">
                            {selectedStudents.size > 0 && (
                                <button
                                    onClick={async () => {
                                        if (confirm(`Delete ${selectedStudents.size} students?`)) {
                                            const { StudentService } = await import('../services/student');
                                            try {
                                                await StudentService.batchDeleteStudents(Array.from(selectedStudents));
                                                setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
                                                setFilteredStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
                                                setSelectedStudents(new Set());
                                                alert("Deleted Successfully");
                                            } catch (e) { console.error(e); alert("Delete failed"); }
                                        }
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-sm font-semibold"
                                >
                                    <Trash2 size={16} /> Delete Selected ({selectedStudents.size})
                                </button>
                            )}

                            <button
                                onClick={async () => {
                                    const XLSX = await import("xlsx");
                                    const ws = XLSX.utils.json_to_sheet(filteredStudents.map(({ id, ...rest }) => rest));
                                    const wb = XLSX.utils.book_new();
                                    XLSX.utils.book_append_sheet(wb, ws, "Students");
                                    XLSX.writeFile(wb, "averqon_students.xlsx");
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-semibold ml-auto"
                            >
                                <Download size={16} /> Export Excel
                            </button>

                            <button
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-sm font-semibold"
                            >
                                <FilePlus size={16} /> Manual Add
                            </button>
                        </div>

                        {/* Add Student Modal */}
                        {showAddModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
                                <div className="bg-white border border-slate-200 p-8 rounded-2xl w-full max-w-lg shadow-2xl relative">
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                                    >
                                        <X size={20} />
                                    </button>
                                    <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Student</h3>
                                    <div className="space-y-4">
                                        <input
                                            placeholder="Full Name"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-primary"
                                            value={newStudent.name}
                                            onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                        />
                                        <input
                                            placeholder="Roll No"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-primary"
                                            value={newStudent.rollNo}
                                            onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                                        />
                                        <input
                                            placeholder="Email"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-primary"
                                            value={newStudent.email}
                                            onChange={e => setNewStudent({ ...newStudent, email: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-primary"
                                                value={newStudent.department}
                                                onChange={e => setNewStudent({ ...newStudent, department: e.target.value })}
                                            >
                                                <option value="CSE">CSE</option>
                                                <option value="IT">IT</option>
                                                <option value="ECE">ECE</option>
                                                <option value="MECH">MECH</option>
                                            </select>
                                            <select
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 outline-none focus:border-primary"
                                                value={newStudent.year}
                                                onChange={e => setNewStudent({ ...newStudent, year: e.target.value })}
                                            >
                                                <option value="1st Year">1st Year</option>
                                                <option value="2nd Year">2nd Year</option>
                                                <option value="3rd Year">3rd Year</option>
                                                <option value="4th Year">4th Year</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={async () => {
                                                if (!newStudent.name || !newStudent.rollNo) return alert("Fill required fields");
                                                const { StudentService } = await import('../services/student');
                                                await StudentService.createStudent(newStudent);
                                                const data = await StudentService.getAllStudents();
                                                setStudents(data);
                                                setFilteredStudents(data);
                                                setShowAddModal(false);
                                                setNewStudent({ name: '', rollNo: '', email: '', department: 'CSE', year: '1st Year' });
                                                alert("Student Added!");
                                            }}
                                            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all mt-4"
                                        >
                                            Create Student
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-4 py-5 w-10">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-300 bg-white"
                                                onChange={(e) => {
                                                    if (e.target.checked) setSelectedStudents(new Set(filteredStudents.map(s => s.id)));
                                                    else setSelectedStudents(new Set());
                                                }}
                                                checked={selectedStudents.size === filteredStudents.length && filteredStudents.length > 0}
                                            />
                                        </th>
                                        <th className="px-4 py-5">Student</th>
                                        <th className="px-6 py-5">Roll No</th>
                                        <th className="px-6 py-5">Department</th>
                                        <th className="px-6 py-5">Year</th>
                                        <th className="px-6 py-5">CGPA</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                    {filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).length > 0 ? filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((student) => (
                                        <tr key={student.id} className={`hover:bg-slate-50 transition-colors group ${selectedStudents.has(student.id) ? 'bg-slate-50' : ''}`}>
                                            <td className="px-4 py-5 text-center">
                                                <input
                                                    type="checkbox"
                                                    className="rounded border-slate-300 bg-white"
                                                    checked={selectedStudents.has(student.id)}
                                                    onChange={(e) => {
                                                        const newSet = new Set(selectedStudents);
                                                        if (e.target.checked) newSet.add(student.id);
                                                        else newSet.delete(student.id);
                                                        setSelectedStudents(newSet);
                                                    }}
                                                />
                                            </td>
                                            <td className="px-4 py-5 font-semibold">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs uppercase text-slate-600">
                                                        {student.name ? student.name.substring(0, 2) : 'ST'}
                                                    </div>
                                                    <div>
                                                        <div className="text-slate-900">{student.name}</div>
                                                        <div className="text-xs text-slate-500">{student.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-slate-600 font-mono">{student.rollNo}</td>
                                            <td className="px-6 py-5 text-slate-600">{student.department}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-bold">
                                                    {student.year}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 font-bold text-green-600">{student.cgpa || 'N/A'}</td>
                                            <td className="px-6 py-5 text-right flex justify-end gap-2">
                                                <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        // In a real app, we check currentUser.role here. 
                                                        // Assuming isAdmin covers Faculty Admin/Super Admin for now.
                                                        if (confirm(`ADMIN ACTION: Are you sure you want to PERMANENTLY delete ${student.name}?`)) {
                                                            const { StudentService } = await import('../services/student');
                                                            await StudentService.deleteStudent(student.id);
                                                            setStudents(s => s.filter(i => i.id !== student.id));
                                                            setFilteredStudents(s => s.filter(i => i.id !== student.id));
                                                        }
                                                    }}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 hover:text-red-400 transition-colors"
                                                    title="Delete (Admin Only)"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="7" className="px-8 py-12 text-center text-gray-500">
                                                No students found matching your filters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'courses' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-slate-900">Course Management</h2>
                            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 font-semibold">
                                <Plus size={20} /> Add New Course
                            </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="px-8 py-5">Title</th>
                                        <th className="px-6 py-5">Instructor</th>
                                        <th className="px-6 py-5">Price</th>
                                        <th className="px-6 py-5">Enrolled</th>
                                        <th className="px-6 py-5">Status</th>
                                        <th className="px-6 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                    {courses.length > 0 ? courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-5 font-semibold">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center text-xs">IMG</div>
                                                    {course.title}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-gray-300">{course.instructor}</td>
                                            <td className="px-6 py-5 font-mono text-green-400">${course.price}</td>
                                            <td className="px-6 py-5">{course.students || 0}</td>
                                            <td className="px-6 py-5">
                                                <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-xs font-bold">Active</span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-12 text-center text-gray-500">
                                                No courses found. Add your first course!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
