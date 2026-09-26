import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const UserProtectedRoute = ({ children }) => {
  const { user, loading } = useUserAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070e13] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading Listener Space...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/user/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;
