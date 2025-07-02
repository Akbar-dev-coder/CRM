export const fields = {
  srNo: {
    type: 'number',
    label: 'Sr.No.',
    readOnly: true,
    table: true,
    disableForForm: true,
    disableForUpdateL: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  email: {
    required: true,
    type: 'email',
  },
  phone: {
    type: 'phone',
    required: true,
  },
  gstNumber: {
    type: 'string',
    required: true,
    trim: true,
    label: 'GST No.',
  },
  panNumber: {
    type: 'string',
    required: true,
    trim: true,
    label: 'PAN No.',
  },
  accountNumber: {
    type: 'string',
    required: true,
    trim: true,
    label: 'Account Number',
  },
  ifscCode: {
    type: 'string',
    required: true,
    trim: true,
    label: 'IFSC Code',
  },
  swiftCode: {
    type: 'string',
    label: 'Bank Swift Code',
  },
  bankName: {
    type: 'string',
    required: true,
    trim: true,
    label: 'Bank Name',
  },
  branchName: {
    type: 'string',
    required: true,
    trim: true,
    label: 'Branch Name',
  },
  address: {
    type: 'string',
    required: true,
    trim: true,
  },
  // enabled: {
  //   type: 'boolean',
  //   label: 'Is Active',
  //   defaultValue: true,
  // },
};
