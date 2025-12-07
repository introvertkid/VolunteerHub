import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { login, register, logout, getCurrentUser } from "@/api/auth";
import { useNavigate } from 'react-router-dom';

interface Role {
  roleId: number;
  name: string;
}

interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export const isManager = (user: User | null): boolean => {
  return user?.role?.name === 'ROLE_MANAGER' || user?.role?.name === 'ROLE_ADMIN';
};

export const isAdmin = (user: User | null): boolean => {
  return user?.role?.name === 'ROLE_ADMIN';
};

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, phoneNumber: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const signUp = async (email: string, password: string, fullName: string, phoneNumber: string) => {
    try {
      await register(email, password, fullName, phoneNumber);
      toast.success('Đăng ký thành công!');
      navigate('/auth');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await login(email, password);
      console.log(data);
      setUser(data);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  const signOut = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      setUser(null);
      toast.success('Đăng xuất thành công!');
      navigate('/auth');
    } catch (error: any) {
      toast.error('Đăng xuất thất bại');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
