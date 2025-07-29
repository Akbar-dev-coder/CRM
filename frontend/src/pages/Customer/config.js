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
