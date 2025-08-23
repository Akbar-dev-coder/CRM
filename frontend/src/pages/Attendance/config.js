export const fields = {
  employeeId: {
    type: 'employeeId',
    label: 'Employee Id',
    displayLabels: true,
  },

  name: {
    type: 'fullname',
    required: true,
  },

  attendanceDate: {
    type: 'date',
    label: 'Date',
    required: true,
  },
  shift: {
    type: 'select',
    label: 'Shift',
    required: true,
    placeholder: 'Select Shift',
    options: [
      {
        label: 'Night Shift',
        value: 'Night Shift',
      },
      {
        label: 'Morning Shift',
        value: 'Morning Shift',
      },
      {
        label: 'General Shift',
        value: 'General Shift',
      },
    ],
  },
  workType: {
    type: 'select',
    label: 'Work Type',
    required: true,
    placeholder: 'Select Work Type',
    options: [
      { label: 'Work From Home', value: 'Work From Home' },
      { label: 'Work From Office', value: 'Work From Office' },
      { label: 'Remote', value: 'Remote' },
    ],
  },
  checkInDate: {
    type: 'date',
    label: 'Check In Date',
    required: true,
  },
  checkOutDate: {
    type: 'date',
    label: 'Check Out Date',
    required: true,
  },
  checkIn: {
    type: 'time',
    label: 'Check In',
    required: true,
  },
  checkOut: {
    type: 'time',
    label: 'Check Out',
    required: true,
  },
};
