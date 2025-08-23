import { lazy } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import About from '@/pages/About';
import Logout from '@/pages/Logout';
import Profile from '@/pages/Profile';
import { Navigate } from 'react-router-dom';

const Dashboard = lazy(() => import('@/pages/EmployeePages/dashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Attendance = lazy(() => import('@/pages/EmployeePages/Attendance'));
const Leave = lazy(() => import('@/pages/EmployeePages/Leave'));

const employeeRoutes = [
  {
    path: '/login',
    element: <Navigate to="/" />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/attendance',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <Attendance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/leave',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <Leave />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute allowedRoles={['employee']}>
        <Profile />
      </ProtectedRoute>
    ),
  },

  { path: '/about', element: <About /> },
  { path: '/logout', element: <Logout /> },
  { path: '*', element: <NotFound /> },
];

export default employeeRoutes;
