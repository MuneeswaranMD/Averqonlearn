import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { AuthService } from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isCollegeAdmin, setIsCollegeAdmin] = useState(false);
    const [isPlacement, setIsPlacement] = useState(false);
    const [isFaculty, setIsFaculty] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [collegeId, setCollegeId] = useState(null);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            const storedUser = localStorage.getItem('averqon_user');

            if (token && storedUser) {
                try {
                    const user = JSON.parse(storedUser);
                    setCurrentUser({
                        uid: user._id,
                        email: user.email,
                        displayName: user.displayName,
                        role: user.role
                    });
                    setUserData(user);
                    setCollegeId(user.collegeId || null);

                    const role = user.role || 'student';
                    const isSuper = user.email === 'muneeswaran@averqon.in' || role === 'superAdmin';

                    setIsSuperAdmin(isSuper);
                    setIsCollegeAdmin(!isSuper && role === 'collegeAdmin');
                    setIsPlacement(!isSuper && (role === 'placement' || role === 'tpo'));
                    setIsFaculty(!isSuper && role === 'faculty');
                    setIsStudent(!isSuper && role === 'student');
                } catch (error) {
                    console.error("Auth Init Error:", error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('averqon_user');
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const loginWithRole = async (email, password) => {
        try {
            const normalizedEmail = email.toLowerCase().trim();
            const isSuperAdminEmail = normalizedEmail === 'muneeswaran@averqon.in';

            let data;
            if (isSuperAdminEmail) {
                data = await AuthService.firebaseLogin(normalizedEmail, password);
            } else {
                data = await AuthService.mongoLogin(normalizedEmail, password);
            }

            setCurrentUser({
                uid: data._id,
                email: data.email,
                displayName: data.displayName,
                role: data.role
            });
            setUserData(data);
            setCollegeId(data.collegeId || null);

            const role = data.role || 'student';
            const isSuper = normalizedEmail === 'muneeswaran@averqon.in' || role === 'superAdmin';

            setIsSuperAdmin(isSuper);
            setIsCollegeAdmin(!isSuper && role === 'collegeAdmin');
            setIsPlacement(!isSuper && (role === 'placement' || role === 'tpo'));
            setIsFaculty(!isSuper && role === 'faculty');
            setIsStudent(!isSuper && role === 'student');

            return data;
        } catch (error) {
            console.error("Login Error:", error);
            throw error;
        }
    };

    const logout = async () => {
        await AuthService.logout();
        setCurrentUser(null);
        setUserData(null);
        setCollegeId(null);
        setIsSuperAdmin(false);
        setIsCollegeAdmin(false);
        setIsPlacement(false);
        setIsFaculty(false);
        setIsStudent(false);
    };

    const value = {
        currentUser,
        userData,
        collegeId,
        loading,
        isSuperAdmin,
        isCollegeAdmin,
        isAdmin: isSuperAdmin || isCollegeAdmin,
        isPlacement,
        isFaculty,
        isStudent,
        loginWithRole,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
