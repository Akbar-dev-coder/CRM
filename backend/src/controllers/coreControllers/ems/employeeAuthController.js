const bcrypt = require('bcryptjs');
const Employee = require('@/models/appModels/Employee');
const jwt = require('jsonwebtoken');

const EMPLOYEE_SECRET = process.env.EMPLOYEE_JWT_SECRET || 'your jwt secret key';

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Email and password are required',
      });
    }

    const employee = await Employee.findOne({
      email,
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Wrong password',
      });
    }

    console.log('Using token generation', EMPLOYEE_SECRET);
    console.log('Received login attempt', email);
    console.log('Employee found', employee._id);
    const token = jwt.sign(
      {
        id: employee._id,
        fullName: employee.fullName,
        role: employee.role,
        email: employee.email,
        employeeId: employee.employeeId,
        userType: 'employee',
      },
      EMPLOYEE_SECRET,
      {
        expiresIn: '1d',
      }
    );

    console.log('JWT token generated for employee');

    //save session token

    employee.loggedSessions = employee.loggedSessions || [];
    employee.loggedSessions.push(token);
    await employee.save();

    // Set secure cookie based on environment
    // res.cookie('employee_token', token, {
    //   httpOnly: true,
    //   sameSite: 'lax',
    //   secure: process.env.NODE_ENV === 'production',
    //   maxAge: 24 * 60 * 60 * 1000,
    // });

    return res.status(200).json({
      success: true,
      result: {
        _id: employee._id,
        fullName: employee.fullName,
        email: employee.email,
        role: employee.role,
        userType: 'employee',
        token: token,
      },
      message: 'Employee logged in successfully',
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No authorization token provided',
      });
    }

    const token = authHeader.substring(7);

    // If req.employee exists (from middleware), use it
    if (req.employee) {
      req.employee.loggedSessions = req.employee.loggedSessions.filter((t) => t !== token);
      await req.employee.save();
    } else {
      // If middleware didn't set req.employee, manually find and update
      const decoded = jwt.verify(token, process.env.EMPLOYEE_JWT_SECRET);
      const employee = await Employee.findById(decoded.id);

      if (employee) {
        employee.loggedSessions = employee.loggedSessions.filter((t) => t !== token);
        await employee.save();
      }
    }

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
