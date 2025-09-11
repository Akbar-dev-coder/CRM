export const fields = {
  employeeId: {
    type: 'async',
    label: 'Employee',
    required: true,
    placeholder: 'Select employee',
    entity: 'employee',
    displayLabels: ['fullName', 'employeeId'],
    searchFields: 'fullName,employeeId,email',
    outputValue: '_id',
  },
  month: {
    type: 'date',
    label: 'Month',
    required: true,
    placeholder: 'Select month',
  },
  // batch: {
  //   type: 'string',
  //   label: 'Batch',
  //   placeholder: 'Enter batch',
  //   required: false,
  // },
  specialAllowances: {
    type: 'number',
    label: 'Special Allowances',
    placeholder: 'Enter special allowances',
  },
  otherAllowance: {
    type: 'number',
    label: 'Other Allowance',
    placeholder: 'Enter other allowance',
  },
  // deductions: {
  //   type: 'number',
  //   label: 'Deductions',
  //   placeholder: 'Enter deductions',
  // },
  profTax: {
    type: 'number',
    label: 'Professional Tax',
    placeholder: 'Enter professional tax',
  },
  tds: {
    type: 'number',
    label: 'TDS',
    placeholder: 'Enter TDS amount',
  },
  effectiveWorkDays: {
    type: 'number',
    label: 'Effective Work Days',
    placeholder: 'Enter effective work days',
  },
  daysInMonth: {
    type: 'number',
    label: 'Days in Month',
    placeholder: 'Enter days in month',
  },
  lop: {
    type: 'number',
    label: 'Loss of Pay',
    placeholder: 'Enter loss of pay',
  },
  location: {
    type: 'textarea',
    label: 'Location',
    placeholder: 'Enter location',
  },
  pfUan: {
    type: 'string',
    label: 'PF UAN',
    placeholder: 'Enter PF UAN',
  },
  pfNo: {
    type: 'string',
    label: 'PF No',
    placeholder: 'Enter PF No',
  },
  status: {
    type: 'select',
    label: 'Status',
    required: true,
    placeholder: 'Select status',
    options: [
      {
        label: 'Paid',
        value: 'Paid',
      },
      {
        label: 'Unpaid',
        value: 'Unpaid',
      },
    ],
  },
};
