import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { Login } from '../components/pages/login/login.tsx';
import MainStudent from '../components/pages/MainStudent/MainStudent.tsx';
import MainTeacher from '../components/pages/MainTeacher/MainTeacher.tsx';
import MainHeadman from '../components/pages/MainHeadman/MainHeadman.tsx';
import MyGroupPage from '../components/pages/MyGroup/MyGroupPage';
import ProfilePage from '../components/pages/ProfilePage/ProfilePage';
import TeacherPolls from '../components/pages/TeacherPolls/TeacherPolls';
import TabelPage from '../components/pages/TabelPage/TabelPage';
import StudentPolls from '../components/pages/StudentPolls/StudentPolls';
import ReportPage from '../components/pages/ReportPage/ReportPage.tsx';

interface ProtectedRouteProps {
  children: ReactNode;
  role?: 'student' | 'teacher' | 'headman';
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const userRole = localStorage.getItem('role') as 'student' | 'teacher' | 'headman' | null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const RoleRedirect = () => {
  const role = localStorage.getItem('role');
  if (role === 'teacher') return <Navigate to="/teacher" replace />;
  if (role === 'headman') return <Navigate to="/headman" replace />;
  return <Navigate to="/student" replace />;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <RoleRedirect />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <MainStudent />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <MainTeacher />
          </ProtectedRoute>
        }
      />

      <Route
        path="/headman"
        element={
          <ProtectedRoute role="headman">
            <MainHeadman />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mygroup"
        element={
          <ProtectedRoute>
            <MyGroupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/surveys"
        element={
          <ProtectedRoute role="teacher">
            <TeacherPolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tabel"
        element={
          <ProtectedRoute>
            <TabelPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/polls"
        element={
          <ProtectedRoute >
            <StudentPolls />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <ReportPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};