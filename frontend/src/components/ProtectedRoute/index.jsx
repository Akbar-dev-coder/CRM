// import { useSelector } from 'react-redux';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { isLoggedIn, current } = useSelector((state) => state.auth);

//   if (!isLoggedIn || !current) {
//     return <Navigate to="/login" replace />;
//   }

//   if (!Array.isArray(!allowedRoles) || !allowedRoles.includes(current.role)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth, selectCurrentUser, selectCurrentUserRole } from '@/redux/auth/selectors';
import PageLoader from '@/components/PageLoader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const auth = useSelector(selectAuth);
  const currentUser = useSelector(selectCurrentUser);
  const userRole = useSelector(selectCurrentUserRole);

  const isLoadingAuth = auth.isLoading; // from Redux, true when login is processing

  // Wait until auth state is fully loaded
  if (isLoadingAuth) {
    return <PageLoader />;
  }

  // If still no login after loading
  if (!auth.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // If user data is still not set but logged in → show loader instead of redirect
  if (!currentUser) {
    return <PageLoader />;
  }

  // Role-based protection
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    if (userRole === 'employee') {
      return <Navigate to="/employee-dashboard" replace />;
    }
    if (userRole === 'owner') {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
