import { createContext, useState, useEffect } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const savedAuth = sessionStorage.getItem("auth");
        return savedAuth ? JSON.parse(savedAuth) : {}; 
    });

    const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        localStorage.setItem("persist", JSON.stringify(persist));
    }, [persist]);

    useEffect(() => {
        if (auth && Object.keys(auth).length > 0) {
            sessionStorage.setItem("auth", JSON.stringify(auth));
        }
    }, [auth]); 

    return (
        <AuthContext.Provider value={{ auth, setAuth, persist, setPersist }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
