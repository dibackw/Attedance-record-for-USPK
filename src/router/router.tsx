// router.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Login } from '../components/pages/login/login.tsx';
import  MainStudent  from '../components/pages/MainStudent/MainStudent.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'student' | 'teacher';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userRole = localStorage.getItem('role') as 'student' | 'teacher' | null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainStudent />
          </ProtectedRoute>
        }
      />

      {/* Маршрут студента — был закомментирован, теперь активен */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <MainStudent />  {/* замените на StudentDashboard, когда создадите */}
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};