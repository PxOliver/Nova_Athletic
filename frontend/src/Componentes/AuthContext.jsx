import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); 
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []); 

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null); 
    localStorage.removeItem("user"); 
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout , isloading}}>
      {children} {/* Renderiza los componentes hijos que estarán dentro de este proveedor */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 