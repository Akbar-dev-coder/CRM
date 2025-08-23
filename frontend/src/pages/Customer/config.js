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
  country: {
    type: 'country',
    required: true,
  },
  address: {
    type: 'textarea',
    required: true,
    trim: true,
  },
  gstno: {
    type: 'gstno',
    required: true,
    label: 'GST No.',
  },
  phone: {
    type: 'phone',
    required: true,
  },
  email: {
    type: 'email',
    required: true,
  },
};
