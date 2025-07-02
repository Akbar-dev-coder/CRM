export const fields = {
  srNo: {
    type: 'number',
    label: 'Sr.No.',
    readOnly: true,
    table: true,
    disableForForm: true,
    disableForUpdate: true,
  },
  name: {
    type: 'string',
    required: true,
  },
  country: {
    type: 'country',
    required: true,
  },
  address: {
    type: 'string',
    required: true,
    trim: true,
  },
  gstno: {
    type: 'string',
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
