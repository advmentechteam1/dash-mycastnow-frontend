import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { CreatorAuthProvider } from './context/CreatorAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import CreatorLogin from './pages/creator/CreatorLogin';
import CreatorDashboard from './pages/creator/CreatorDashboard';
import CreatorProtectedRoute from './components/CreatorProtectedRoute';
import UserLogin from './pages/user/UserLogin';
import UserDashboard from './pages/user/UserDashboard';
import UserProtectedRoute from './components/UserProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CreatorAuthProvider>
          <UserAuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Super Admin Routes */}
                <Route path="/login" element={<Login />} />
                <Route
                  path="/super-admin-dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="/superadmin-dashboard/*" element={<Navigate to="/super-admin-dashboard" replace />} />
                <Route path="/dashboard/*" element={<Navigate to="/super-admin-dashboard" replace />} />

                {/* Admin Portal Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                  path="/admin-dashboard/*"
                  element={
                    <AdminProtectedRoute>
                      <AdminDashboard />
                    </AdminProtectedRoute>
                  }
                />

                {/* Creator Studio Routes */}
                <Route path="/creator/login" element={<CreatorLogin />} />
                <Route
                  path="/creator-dashboard/*"
                  element={
                    <CreatorProtectedRoute>
                      <CreatorDashboard />
                    </CreatorProtectedRoute>
                  }
                />

                {/* Listener / User Routes */}
                <Route path="/user/login" element={<UserLogin />} />
                <Route
                  path="/user-dashboard/*"
                  element={
                    <UserProtectedRoute>
                      <UserDashboard />
                    </UserProtectedRoute>
                  }
                />

                {/* Default Route */}
                <Route path="/" element={<Navigate to="/super-admin-dashboard" replace />} />
                <Route path="*" element={<Navigate to="/super-admin-dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </UserAuthProvider>
        </CreatorAuthProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;
