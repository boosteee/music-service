import { Navigate, Outlet } from 'react-router-dom';

const AuthenticateProvider = () => {
  const userData = JSON.parse(localStorage.getItem('user') ?? '{}');
  const { user } = userData;

  if (!user) {
    return <Navigate to='/login' />;
  }
  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default AuthenticateProvider;
