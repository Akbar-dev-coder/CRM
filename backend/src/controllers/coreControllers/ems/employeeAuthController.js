const bcrypt = require('bcryptjs');
const Employee = require('@/models/appModels/ems/Employee');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your jwt secret key';

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const employee = await Employee.findOne({ email });

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
        message: ' Invalid crendentials',
      });
    }

    const token = jwt.sign({ id: employee._id, role: employee.role }, SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({
      success: true,
      result: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
      },
      token,
      message: 'Logged in succcessfully',
    });
  } catch (error) {
    console.error('Logged in error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    console.error('Logged out error:', error);
    return res.status.json({
      success: false,
      message: 'Internal server error',
    });
  }
};
