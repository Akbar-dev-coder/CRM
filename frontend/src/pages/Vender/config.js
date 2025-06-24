export const fields = {
  name: {
    type: 'string',
    required: true,
  },
  email: {
    type: 'email',
  },
  phone: {
    type: 'phone',
    required: true,
  },
  gstNumber: {
    type: 'string',
    label: 'GST No.',
  },
  panNumber: {
    type: 'string',
    label: 'PAN No.',
  },
  accountNumber: {
    type: 'string',
    label: 'Account Number',
  },
  ifscCode: {
    type: 'string',
    label: 'IFSC Code',
  },
  swiftCode: {
    type: 'string',
    label: 'Bank Swift Code',
  },
  bankName: {
    type: 'string',
    label: 'Bank Name',
  },
  branchName: {
    type: 'string',
    label: 'Branch Name',
  },
  address: {
    type: 'string',
  },
  // enabled: {
  //   type: 'boolean',
  //   label: 'Is Active',
  //   defaultValue: true,
  // },
};
