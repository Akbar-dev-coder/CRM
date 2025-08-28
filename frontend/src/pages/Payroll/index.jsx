import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { useDate } from '@/settings';

export default function Payroll() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'payroll';

  const searchConfig = {
    displayLabels: ['fullName'],
    searchFields: 'FullName',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('payroll'),
    DATATABLE_TITLE: translate('payroll_list'),
    ADD_NEW_ENTITY: translate('add_new_payroll'),
    ENTITY_NAME: translate('payroll'),
  };

  const dataTableColumns = [
    {
      title: 'Employee Id',
      dataIndex: 'employeeCode',
      // key: 'employeeId',
      // render: (employee) => {
      //   return employee?.employeeId || 'N/A';
      // },
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      // key: 'employeeName',
      // render: (employee) => {
      //   return employee?.fullName || 'N/A';
      // },
    },
    {
      title: 'Email',
      dataIndex: 'employeeEmail',
      // key: 'email',
      // render: (employee) => employee?.email || 'N/A',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
    },
    {
      title: 'Allowances',
      dataIndex: 'allowances',
      key: 'allowances',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Bonuses',
      dataIndex: 'bonuses',
      key: 'bonuses',
    },
    {
      title: 'Gross Salary',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  const readColumns = [
    {
      title: 'Employee Id',
      dataIndex: 'employeeCode',
      // render: (employee) => employee.employeeId?.employeeId || 'N/A',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      // render: (name) => name.employeeId?.fullName || 'N/A',
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      isDate: true,
    },
    {
      title: 'Batch',
      dataIndex: 'batch',
      key: 'batch',
    },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
    },
    {
      title: 'Allowances',
      dataIndex: 'allowances',
      key: 'allowances',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Bonuses',
      dataIndex: 'bonuses',
      key: 'bonuses',
    },
    {
      title: 'Gross Salary',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
    },
    {
      title: 'Net Salary',
      dataIndex: 'netSalary',
      key: 'netSalary',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
