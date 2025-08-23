import { lazy } from 'react';

import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const Vender = lazy(() => import('@/pages/Vender'));
const Employee = lazy(() => import('@/pages/Employee'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));
const Quote = lazy(() => import('@/pages/Quote/index'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));

const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));
const Attendance = lazy(() => import('@/pages/Attendance'));
// let routes = {
//   expense: [],
//   default: [
//     {
//       path: '/login',
//       element: <Navigate to="/" />,
//     },
//     {
//       path: '/logout',
//       element: <Logout />,
//     },
//     {
//       path: '/about',
//       element: <About />,
//     },
//     {
//       path: '/',
//       element: <Dashboard />,
//     },
//     {
//       path: '/customer',
//       element: <Customer />,
//     },
//     {
//       path: '/employee',
//       element: <Employee />,
//     },

//     {
//       path: '/vender',
//       element: <Vender />,
//     },

//     {
//       path: '/invoice',
//       element: <Invoice />,
//     },
//     {
//       path: '/invoice/create',
//       element: <InvoiceCreate />,
//     },
//     {
//       path: '/invoice/read/:id',
//       element: <InvoiceRead />,
//     },
//     {
//       path: '/invoice/update/:id',
//       element: <InvoiceUpdate />,
//     },
//     {
//       path: '/invoice/pay/:id',
//       element: <InvoiceRecordPayment />,
//     },
//     {
//       path: '/quote',
//       element: <Quote />,
//     },
//     {
//       path: '/quote/create',
//       element: <QuoteCreate />,
//     },
//     {
//       path: '/quote/read/:id',
//       element: <QuoteRead />,
//     },
//     {
//       path: '/quote/update/:id',
//       element: <QuoteUpdate />,
//     },
//     {
//       path: '/payment',
//       element: <Payment />,
//     },
//     {
//       path: '/payment/read/:id',
//       element: <PaymentRead />,
//     },
//     {
//       path: '/payment/update/:id',
//       element: <PaymentUpdate />,
//     },

//     {
//       path: '/settings',
//       element: <Settings />,
//     },
//     {
//       path: '/settings/edit/:settingsKey',
//       element: <Settings />,
//     },
//     {
//       path: '/payment/mode',
//       element: <PaymentMode />,
//     },
//     {
//       path: '/taxes',
//       element: <Taxes />,
//     },

//     {
//       path: '/profile',
//       element: <Profile />,
//     },
//     {
//       path: '*',
//       element: <NotFound />,
//     },
//   ],
// };

// export default routes;
const adminRoutes = [
  {
    path: '/login',
    element: <Navigate to="/" />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/customer',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Customer />
      </ProtectedRoute>
    ),
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Employee />
      </ProtectedRoute>
    ),
  },
  {
    path: '/attendence',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Attendance />
      </ProtectedRoute>
    ),
  },
  {
    path: '/vender',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Vender />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Invoice />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice/create',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <InvoiceCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice/read/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <InvoiceRead />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice/update/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <InvoiceUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/invoice/pay/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <InvoiceRecordPayment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quote',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Quote />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quote/create',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <QuoteCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quote/read/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <QuoteRead />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quote/update/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <QuoteUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Payment />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/read/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <PaymentRead />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/update/:id',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <PaymentUpdate />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings/edit/:settingsKey',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/payment/mode',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <PaymentMode />
      </ProtectedRoute>
    ),
  },
  {
    path: '/taxes',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Taxes />
      </ProtectedRoute>
    ),
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute allowedRoles={['owner']}>
        <Profile />
      </ProtectedRoute>
    ),
  },
  { path: '/about', element: <About /> },
  { path: '/logout', element: <Logout /> },
  { path: '*', element: <NotFound /> },
];

export default adminRoutes;
