import { API_BASE_URL } from '@/config/serverApiConfig';
import axios from 'axios';
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';

export const login = async ({ loginData }) => {
  try {
    console.log(' Attempting admin login...');
    const response = await axios.post(
      API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
      loginData,
      { withCredentials: true }
    );

    const { status, data } = response;
    console.log(' Admin login successful:', { success: data.success, role: data.result?.role });

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );

    // Ensure the response has proper structure
    return {
      success: data.success,
      result: {
        ...data.result,
        userType: 'admin',
        token: data.result?.token,
        role: data.result?.role || 'admin',
      },
      message: data.message,
    };
  } catch (adminError) {
    console.log('Admin login failed, trying employee login...');
    console.log('Admin error:', adminError?.response?.data?.message);

    try {
      const employeeResponse = await axios.post(
        API_BASE_URL + `employee/login?timestamp=${new Date().getTime()}`,
        loginData,
        { withCredentials: true }
      );

      const { status, data } = employeeResponse;
      console.log('Employee login successful:', {
        success: data.success,
        role: data.result?.role,
      });

      successHandler(
        { data, status },
        {
          notifyOnSuccess: false,
          notifyOnFailed: true,
        }
      );

      // Ensure consistent response structure
      return {
        success: data.success,
        result: {
          ...data.result,
          userType: 'employee',
          token: data.result?.token,
          role: data.result?.role || 'employee',
        },
        message: data.message,
      };
    } catch (employeeError) {
      console.error(' Employee login failed:', employeeError?.response?.data);
      return {
        success: false,
        message:
          employeeError?.response?.data?.message || 'Login failed for both admin and employee',
        error: employeeError?.response?.data,
      };
    }
  }
};

export const register = async ({ registerData }) => {
  try {
    const response = await axios.post(API_BASE_URL + `register`, registerData);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const verify = async ({ userId, emailToken }) => {
  try {
    const response = await axios.get(API_BASE_URL + `verify/${userId}/${emailToken}`);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const resetPassword = async ({ resetPasswordData }) => {
  try {
    const response = await axios.post(API_BASE_URL + `resetpassword`, resetPasswordData);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = async (role, token) => {
  axios.defaults.withCredentials = true;
  let endpoint = '';

  if (role === 'employee') {
    endpoint = 'employee/logout';
  } else {
    endpoint = 'logout';
  }

  // Create headers with the passed token
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(
      API_BASE_URL + `${endpoint}?timestamp=${new Date().getTime()}`,
      {},
      {
        withCredentials: true,
        headers: headers,
      }
    );
    return response.data;
  } catch (error) {
    return errorHandler(error);
  }
};
