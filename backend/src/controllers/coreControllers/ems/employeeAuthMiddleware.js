// const jwt = require('jsonwebtoken');
// const Employee = require('@/models/appModels/Employee');

// const isAuth =
//   (allowedRoles = []) =>
//   async (req, res, next) => {
//     try {
//       // Check both header and cookie
//       const token = req.headers.authorization?.split(' ')[1] || req.cookies['employee_token'];

//       if (!token) {
//         return res.status(401).json({
//           success: false,
//           message: 'Authentication token is missing',
//         });
//       }

//       console.log('Token to verify:', token);
//       console.log('Using secret for verification:', process.env.EMPLOYEE_JWT_SECRET);

//       const decoded = jwt.verify(token, process.env.EMPLOYEE_JWT_SECRET);

//       const employee = await Employee.findById(decoded.id);

//       if (!employee) {
//         return res.status(404).json({
//           success: false,
//           message: 'Employee not Found',
//         });
//       }

//       if (allowedRoles.length && !allowedRoles.includes(employee.role)) {
//         return res.status(403).json({
//           success: false,
//           message: 'You do not have permission to access this resource',
//         });
//       }

//       req.user = employee;
//       next();
//     } catch (error) {
//       console.error('Authorization error:', error);
//       return res.status(401).json({
//         success: false,
//         result: null,
//         message: 'Invalid or expired token',
//         jwtExpired: true,
//       });
//     }
//   };

// module.exports = isAuth;

const jwt = require('jsonwebtoken');
const Employee = require('@/models/appModels/Employee');

const employeeAuthMiddleware = {
  isValidEmployeeToken: async (req, res, next) => {
    try {
      console.log('Employee auth middleware is cheking');
      //get token from header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer')) {
        console.log('no valid authorization header found');

        return res.status(401).json({
          success: false,
          result: null,
          message: 'Access denied. No valid token provided',
        });
      }
      const token = authHeader.substring(7);

      if (!token) {
        return res.status(403).json({
          success: false,
          result: null,
          message: 'Access denied. Token is required',
        });
      }
      //verify token
      const decoded = jwt.verify(token, process.env.EMPLOYEE_JWT_SECRET);

      //find token

      const employee = await Employee.findById(decoded.id);
      if (!employee || !employee.loggedSessions.includes(token)) {
        return res.status(404).json({
          success: false,
          result: null,
          message: 'Access denied. Invalid session or token expired',
        });
      }

      //add employee to request object

      req.employee = employee;
      req.user = employee;
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(401).json({
        success: false,
        result: null,
        message: 'Invalid or expired token',
        jwtExpired: true,
      });
    }
  },
  //check if user is employee
  requireEmployeeRole: (req, res, next) => {
    console.log('Checking employee role...');

    if (!req.employee && !req.user) {
      console.log('No user found in request');
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const user = req.employee || req.user;

    if (user.role !== 'employee') {
      console.log('User role is not employee:', user.role);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Employee role required.',
      });
    }

    console.log('Employee role verified');
    next();
  },
};

module.exports = employeeAuthMiddleware;
