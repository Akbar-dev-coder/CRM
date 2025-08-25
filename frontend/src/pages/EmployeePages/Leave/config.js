export const fields = {
  employeeName: {
    type: 'employeeName',
    label: 'Employee Name',
    disableForForm: false,
    disableForUpdate: true,
  },
  leaveType: {
    type: 'select',
    placeholder: 'Select Leave Type',
    label: 'Leave Type',
    required: true,
    options: [
      { label: 'Sick Leave', value: 'Sick Leave' },
      { label: 'Casual Leave', value: 'Casual Leave' },
      { label: 'Annual Leave', value: 'Annual Leave' },
      { label: 'Public Holiday', value: 'Public Holiday' },
    ],
  },
  startDate: {
    type: 'date',
    label: 'From',
    required: true,
  },
  endDate: {
    type: 'date',
    label: 'To',
    required: true,
  },
  // totalDays: {
  //   type: 'totaldays',
  //   label: 'Total Days',
  //   disableForTable: false,
  //   disableForUpdate: true,
  //   disableForForm: true,
  // },
  comment: {
    type: 'comment',
    label: 'Comment',
    required: true,
  },
  appliedDate: {
    type: 'date',
    label: 'Applied Date',
    disableForTable: false,
    disableForUpdate: true,
    disableForForm: true,
  },
  status: {
    type: 'string',
    label: 'Status',
    disableForTable: false,
    disableForUpdate: true,
    disableForForm: true,
  },
};
