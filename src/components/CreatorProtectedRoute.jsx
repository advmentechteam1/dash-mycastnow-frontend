import { Navigate } from 'react-router-dom';
import { useCreatorAuth } from '../context/CreatorAuthContext';

const CreatorProtectedRoute = ({ children }) => {
  const { creator, loading } = useCreatorAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070913] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading Creator Studio...</p>
        </div>
      </div>
    );
  }

  if (!creator) {
    return <Navigate to="/creator/login" replace />;
  }

  return children;
};

export default CreatorProtectedRoute;
