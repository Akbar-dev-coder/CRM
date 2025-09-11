import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';
import dayjs from 'dayjs';
export default function Employee() {
  const { dateFormat } = useDate();
  const translate = useLanguage();
  const entity = 'employee';

  const searchConfig = {
    displayLabels: ['fullName'],
    searchFields: 'fullName',
  };

  const deleteModalLabels = ['fullName'];

  const Labels = {
    PANEL_TITLE: translate('employee'),
    DATATABLE_TITLE: translate('employee_list'),
    ADD_NEW_ENTITY: translate('add_new_employee'),
    ENTITY_NAME: translate('employee'),
  };

  const dataTableColumns = [
    {
      title: translate('Employee ID'),
      dataIndex: 'employeeId',
    },
    {
      title: translate('Full Name'),
      dataIndex: 'fullName',
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
    },
    {
      title: translate('Phone'),
      dataIndex: 'phone',
    },
    {
      title: translate('Gender'),
      dataIndex: 'gender',
    },
    {
      title: translate('Date Of Birth'),
      dataIndex: 'dateOfBirth',
      // sorter: true,
      render: (text) => dayjs(text).format(dateFormat),
    },
    {
      title: translate('Country'),
      dataIndex: 'country',
    },
    {
      title: translate('Address'),
      dataIndex: 'address',
    },
    {
      title: translate('Department'),
      dataIndex: 'department',
    },
    {
      title: translate('Designation'),
      dataIndex: 'designation',
    },
    {
      title: translate('Employee Type'),
      dataIndex: 'employeeType',
    },
    {
      title: translate('Bank Name'),
      dataIndex: 'bankName',
    },
    {
      title: translate('Bank Account Number'),
      dataIndex: 'bankAccountNumber',
    },
    {
      title: translate('IFSC Code'),
      dataIndex: 'bankIFSC',
    },
    {
      title: translate('Pan Number'),
      dataIndex: 'panNo',
    },
    {
      title: translate('Aadhar Number'),
      dataIndex: 'aadhaarNo',
    },
    {
      title: translate('Basic Salary'),
      dataIndex: 'basicSalary',
    },
    {
      title: translate('Joining Date'),
      dataIndex: 'joiningDate',
      // sorter: true,
      render: (text) => dayjs(text).format(dateFormat),
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
    {
      title: translate('Role'),
      dataIndex: 'role',
    },
  ];

  const readColumns = [
    {
      title: translate('Employee ID'),
      dataIndex: 'employeeId',
    },
    {
      title: translate('Full Name'),
      dataIndex: 'fullName',
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
    },
    {
      title: translate('Phone'),
      dataIndex: 'phone',
    },
    {
      title: translate('Gender'),
      dataIndex: 'gender',
    },
    {
      title: translate('Date Of Birth'),
      dataIndex: 'dateOfBirth',
      // sorter: true,
      isDate: true,
    },
    {
      title: translate('Country'),
      dataIndex: 'country',
    },
    {
      title: translate('Address'),
      dataIndex: 'address',
    },
    {
      title: translate('Department'),
      dataIndex: 'department',
    },
    {
      title: translate('Designation'),
      dataIndex: 'designation',
    },
    {
      title: translate('Employee Type'),
      dataIndex: 'employeeType',
    },
    {
      title: translate('Bank Name'),
      dataIndex: 'bankName',
    },
    {
      title: translate('Bank Account Number'),
      dataIndex: 'bankAccountNumber',
    },
    {
      title: translate('IFSC Code'),
      dataIndex: 'bankIFSC',
    },
    {
      title: translate('Pan Number'),
      dataIndex: 'panNo',
    },
    {
      title: translate('Aadhar Number'),
      dataIndex: 'aadhaarNo',
    },
    {
      title: translate('Basic Salary'),
      dataIndex: 'basicSalary',
    },
    {
      title: translate('Joining Date'),
      dataIndex: 'joiningDate',
      // sorter: true,
      isDate: true,
    },
    {
      title: translate('Status'),
      dataIndex: 'status',
    },
    {
      title: translate('Role'),
      dataIndex: 'role',
    },
  ];

  const config = {
    entity,
    ...Labels,
    fields,
    searchConfig,
    deleteModalLabels,
    dataTableColumns,
    readColumns,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm />}
      config={config}
    />
  );
}
