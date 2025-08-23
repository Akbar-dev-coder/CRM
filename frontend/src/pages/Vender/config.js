export const fields = {
  srNo: {
    type: 'unique',
    label: 'Sr.No.',
    readOnly: true,
    disableForTable: false,
    disableForUpdate: true,
    disableForForm: true,
  },
  name: {
    type: 'name',
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
    type: 'gstno',
    required: true,
    trim: true,
    label: 'GST No.',
  },
  panNumber: {
    type: 'panno',
    required: true,
    trim: true,
    label: 'PAN No.',
  },
  accountNumber: {
    type: 'accno',
    required: true,
    trim: true,
    label: 'Account Number',
  },
  ifscCode: {
    type: 'ifsccode',
    required: true,
    trim: true,
    label: 'IFSC Code',
  },
  swiftCode: {
    type: 'swiftcode',
    label: 'Bank Swift Code',
  },
  bankName: {
    type: 'bankname',
    required: true,
    trim: true,
    label: 'Bank Name',
  },
  branchName: {
    type: 'branchname',
    required: true,
    trim: true,
    label: 'Branch Name',
  },
  address: {
    type: 'textarea',
    required: true,
    trim: true,
  },
  // enabled: {
  //   type: 'boolean',
  //   label: 'Is Active',
  //   defaultValue: true,
  // },
};
