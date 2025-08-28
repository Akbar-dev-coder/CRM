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
  batch: {
    type: 'string',
    label: 'Batch',
    placeholder: 'Enter batch',
    required: false,
  },
  allowances: {
    type: 'number',
    label: 'Allowances',
    placeholder: 'Enter allowances',
  },
  deductions: {
    type: 'number',
    label: 'Deductions',
    placeholder: 'Enter deductions',
  },
  bonuses: {
    type: 'number',
    label: 'boonuses',
    placeholder: 'Enter bonuses',
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
