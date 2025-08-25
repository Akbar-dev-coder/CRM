export const fields = {
  status: {
    type: 'select',
    placeholder: 'Select Status',
    label: 'Status',
    required: true,
    options: [
      { label: 'Approved', value: 'Approved' },
      { label: 'Rejected', value: 'Rejected' },
    ],
  },
  adminComment: {
    type: 'admincomment',
    required: true,
    label: 'Admin Comment',
  },
};
