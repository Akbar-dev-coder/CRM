import * as actionTypes from './types';
import * as authService from '@/auth';
import { request } from '@/request';

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.login({ loginData });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const register =
  ({ registerData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.register({ registerData });

    if (data.success === true) {
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const verify =
  ({ userId, emailToken }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.verify({ userId, emailToken });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const resetPassword =
  ({ resetPasswordData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.resetPassword({ resetPasswordData });

    if (data.success === true) {
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      window.localStorage.removeItem('isLogout');
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

// export const logout = () => async (dispatch, getState) => {
//   const state = getState();
//   const role = state.auth?.current?.role;

//   dispatch({
//     type: actionTypes.LOGOUT_SUCCESS,
//   });
//   const result = window.localStorage.getItem('auth');
//   const tmpAuth = JSON.parse(result);
//   const settings = window.localStorage.getItem('settings');
//   const tmpSettings = JSON.parse(settings);
//   window.localStorage.removeItem('auth');
//   window.localStorage.removeItem('settings');
//   window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));
//   const data = await authService.logout(role);
//   if (data.success === false) {
//     const auth_state = {
//       current: tmpAuth,
//       isLoggedIn: true,
//       isLoading: false,
//       isSuccess: true,
//     };
//     window.localStorage.setItem('auth', JSON.stringify(auth_state));
//     window.localStorage.setItem('settings', JSON.stringify(tmpSettings));
//     window.localStorage.removeItem('isLogout');
//     dispatch({
//       type: actionTypes.LOGOUT_FAILED,
//       payload: data.result,
//     });
//   } else {
//     dispatch({ type: actionTypes.LOGIN_SUCCESS });
//   }
// };

export const logout = () => async (dispatch, getState) => {
  const state = getState();
  const role = state.auth?.current?.role;
  const token = state.auth?.current?.token;

  // Don't clear localStorage yet - keep token for the API call
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });

  // Backup current state in case logout fails
  const result = window.localStorage.getItem('auth');
  const tmpAuth = JSON.parse(result);
  const settings = window.localStorage.getItem('settings');
  const tmpSettings = JSON.parse(settings);

  try {
    // Make the API call FIRST while token is still available
    const data = await authService.logout(role, token);

    if (data.success === false) {
      // If API logout failed, restore the auth state
      window.localStorage.setItem('auth', JSON.stringify(tmpAuth));
      window.localStorage.setItem('settings', JSON.stringify(tmpSettings));

      dispatch({
        type: actionTypes.LOGOUT_FAILED,
        payload: tmpAuth?.current,
      });
    } else {
      // API logout successful - NOW clear localStorage
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('settings');
      window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));

      dispatch({ type: actionTypes.LOGIN_SUCCESS });
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Even if API fails, clear local storage (network issues, etc.)
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('settings');
    window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));
  }
};

export const updateProfile =
  ({ entity, jsonData }) =>
  async (dispatch) => {
    let data = await request.updateAndUpload({ entity, id: '', jsonData });

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
    }
  };

// import * as authService from '@/auth';
// import { request } from '@/request';
// import axios from 'axios';

// export const login =
//   ({ loginData }) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.REQUEST_LOADING,
//     });

//     console.log(' Starting login process...');
//     const data = await authService.login({ loginData });

//     console.log('Login response:', {
//       success: data.success,
//       role: data.result?.role,
//       userType: data.result?.userType,
//       hasToken: !!data.result?.token,
//     });

//     if (data.success === true) {
//       // Validate that we have the necessary data
//       if (!data.result) {
//         console.error(' Login succeeded but no result data');
//         dispatch({
//           type: actionTypes.REQUEST_FAILED,
//         });
//         return;
//       }

//       // Ensure we have role information
//       const userRole = data.result.role || data.result.userType || 'user';

//       const auth_state = {
//         current: {
//           ...data.result,
//           role: userRole, // Ensure role is always present
//         },
//         isLoggedIn: true,
//         isLoading: false,
//         isSuccess: true,
//       };

//       console.log('Storing auth state:', auth_state);

//       // Store in localStorage
//       window.localStorage.setItem('auth', JSON.stringify(auth_state));
//       window.localStorage.removeItem('isLogout');

//       dispatch({
//         type: actionTypes.REQUEST_SUCCESS,
//         payload: auth_state.current,
//       });
//     } else {
//       console.error('Login failed:', data.message);
//       dispatch({
//         type: actionTypes.REQUEST_FAILED,
//         payload: data.message,
//       });
//     }
//   };

// export const register =
//   ({ registerData }) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.REQUEST_LOADING,
//     });
//     const data = await authService.register({ registerData });

//     if (data.success === true) {
//       dispatch({
//         type: actionTypes.REGISTER_SUCCESS,
//       });
//     } else {
//       dispatch({
//         type: actionTypes.REQUEST_FAILED,
//       });
//     }
//   };

// export const verify =
//   ({ userId, emailToken }) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.REQUEST_LOADING,
//     });
//     const data = await authService.verify({ userId, emailToken });

//     if (data.success === true) {
//       const userRole = data.result?.role || data.result?.userType || 'user';

//       const auth_state = {
//         current: {
//           ...data.result,
//           role: userRole,
//         },
//         isLoggedIn: true,
//         isLoading: false,
//         isSuccess: true,
//       };

//       window.localStorage.setItem('auth', JSON.stringify(auth_state));
//       window.localStorage.removeItem('isLogout');

//       dispatch({
//         type: actionTypes.REQUEST_SUCCESS,
//         payload: auth_state.current,
//       });
//     } else {
//       dispatch({
//         type: actionTypes.REQUEST_FAILED,
//       });
//     }
//   };

// export const resetPassword =
//   ({ resetPasswordData }) =>
//   async (dispatch) => {
//     dispatch({
//       type: actionTypes.REQUEST_LOADING,
//     });
//     const data = await authService.resetPassword({ resetPasswordData });

//     if (data.success === true) {
//       const userRole = data.result?.role || data.result?.userType || 'user';

//       const auth_state = {
//         current: {
//           ...data.result,
//           role: userRole,
//         },
//         isLoggedIn: true,
//         isLoading: false,
//         isSuccess: true,
//       };

//       window.localStorage.setItem('auth', JSON.stringify(auth_state));
//       window.localStorage.removeItem('isLogout');

//       dispatch({
//         type: actionTypes.REQUEST_SUCCESS,
//         payload: auth_state.current,
//       });
//     } else {
//       dispatch({
//         type: actionTypes.REQUEST_FAILED,
//       });
//     }
//   };

// export const logout = () => async (dispatch) => {
//   console.log('Starting logout process...');

//   dispatch({
//     type: actionTypes.LOGOUT_SUCCESS,
//   });

//   // Backup current state in case logout fails
//   const result = window.localStorage.getItem('auth');
//   const tmpAuth = result ? JSON.parse(result) : null;
//   const settings = window.localStorage.getItem('settings');
//   const tmpSettings = settings ? JSON.parse(settings) : null;

//   // Clear localStorage
//   window.localStorage.removeItem('auth');
//   window.localStorage.removeItem('settings');
//   window.localStorage.setItem('isLogout', JSON.stringify({ isLogout: true }));

//   try {
//     const data = await authService.logout();

//     if (data.success === false) {
//       console.error('Server logout failed, restoring auth state');
//       // Restore auth state if server logout failed
//       if (tmpAuth) {
//         const auth_state = {
//           current: tmpAuth.current,
//           isLoggedIn: true,
//           isLoading: false,
//           isSuccess: true,
//         };
//         window.localStorage.setItem('auth', JSON.stringify(auth_state));
//       }

//       if (tmpSettings) {
//         window.localStorage.setItem('settings', JSON.stringify(tmpSettings));
//       }

//       window.localStorage.removeItem('isLogout');

//       dispatch({
//         type: actionTypes.LOGOUT_FAILED,
//         payload: tmpAuth?.current,
//       });
//     } else {
//       console.log('Logout successful');
//       // Clear any remaining axios headers
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   } catch (error) {
//     console.error(' Logout error:', error);
//     // In case of network error, still consider logout successful locally
//     delete axios.defaults.headers.common['Authorization'];
//   }
// };

// export const updateProfile =
//   ({ entity, jsonData }) =>
//   async (dispatch) => {
//     let data = await request.updateAndUpload({ entity, id: '', jsonData });

//     if (data.success === true) {
//       const userRole = data.result?.role || data.result?.userType || 'user';

//       const updatedUser = {
//         ...data.result,
//         role: userRole,
//       };

//       dispatch({
//         type: actionTypes.REQUEST_SUCCESS,
//         payload: updatedUser,
//       });

//       const auth_state = {
//         current: updatedUser,
//         isLoggedIn: true,
//         isLoading: false,
//         isSuccess: true,
//       };

//       window.localStorage.setItem('auth', JSON.stringify(auth_state));
//     }
//   };
