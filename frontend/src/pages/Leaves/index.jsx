import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Attendance() {
  const translate = useLanguage();
  const entity = 'employeeLeave';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'employeeName',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('leave'),
    DATATABLE_TITLE: translate('leave requests_list'),
    ENTITY_NAME: translate('leave'),
  };

  //custom dataTableColumns

  const dataTableColumns = [
    {
      title: 'Employee Id',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (employee) => {
        return employee?.employeeId || 'N/A';
      },
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeId',
      key: 'employeeName',
      render: (employee) => {
        return employee?.fullName || 'N/A';
      },
    },
    {
      title: 'Leave Type',
      dataIndex: 'leaveType',
    },
    {
      title: 'From',
      dataIndex: 'startDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'to',
      dataIndex: 'endDate',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Admin Comment',
      dataIndex: 'adminComment',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];
  //custom read columns

  const readColumns = [
    {
      title: 'Employee Id',
      dataIndex: 'employeeId',
      render: (item) => item.employeeId?.employeeId || 'N/A',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      render: (name) => name.employeeId?.fullName || 'N/A',
    },
    {
      title: 'From',
      dataIndex: 'startDate',
      isDate: true,
    },
    {
      title: 'to',
      dataIndex: 'endDate',
      isDate: true,
    },
    {
      title: 'Admin Comment',
      dataIndex: 'adminComment',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
  ];

  const configPage = {
    entity,
    ...Labels,
  };

  const config = {
    ...configPage,
    fields,
    searchConfig,
    deleteModalLabels,
    dataTableColumns,
    readColumns,
    allowCreate: false,
    allowEdit: true,
  };
  return <CrudModule updateForm={<DynamicForm fields={fields} isUpdateForm />} config={config} />;
}
