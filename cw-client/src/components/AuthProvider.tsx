import { createContext, useState, ReactNode } from 'react';
import { IUserAuth } from '@/types/user';

interface IAuthContext {
  userData: IUserAuth | null;
  setUserData: React.Dispatch<React.SetStateAction<IUserAuth | null>>;
}

export const AuthContext = createContext<IAuthContext | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<IUserAuth | null>(null);
  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
