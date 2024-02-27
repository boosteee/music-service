import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

const AuthenticateProvider = () => {
  const authContext = useContext(AuthContext);
  console.log(authContext);
  const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
  const { user } = userData;
  console.log('asdasdasda', user);
  if (!user) {
    return <Navigate to='/login' />;
  }
  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default AuthenticateProvider;
