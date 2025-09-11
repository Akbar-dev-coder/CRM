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
    entity: 'payroll',
    displayLabels: ['name'],
    searchFields: 'employeeName',
    outputValue: '_id',
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
    // {
    //   title: 'Batch',
    //   dataIndex: 'batch',
    //   key: 'batch',
    // },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
    },
    {
      title: 'Special Allowances',
      dataIndex: 'specialAllowances',
      key: 'specialAllowances',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Other Allowances',
      dataIndex: 'otherAllowance',
      key: 'otherAllowance',
    },
    {
      title: 'Prof. Tax',
      dataIndex: 'profTax',
      key: 'profTax',
    },
    {
      title: 'TDS',
      dataIndex: 'tds',
      key: 'tds',
    },
    {
      title: 'Effective Work Days',
      dataIndex: 'effectiveWorkDays',
      key: 'effectiveWorkDays',
    },
    {
      title: 'Days in Month',
      dataIndex: 'daysInMonth',
      key: 'daysInMonth',
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
    // {
    //   title: 'Batch',
    //   dataIndex: 'batch',
    //   key: 'batch',
    // },
    {
      title: 'Basic Salary',
      dataIndex: 'basicSalary',
      key: 'basicSalary',
    },
    {
      title: 'Special Allowances',
      dataIndex: 'specialAllowances',
      key: 'specialAllowances',
    },
    {
      title: 'Deductions',
      dataIndex: 'deductions',
      key: 'deductions',
    },
    {
      title: 'Other Allowances',
      dataIndex: 'otherAllowance',
      key: 'otherAllowance',
    },
    {
      title: 'Prof. Tax',
      dataIndex: 'profTax',
      key: 'profTax',
    },
    {
      title: 'TDS',
      dataIndex: 'tds',
      key: 'tds',
    },
    {
      title: 'Effective Work Days',
      dataIndex: 'effectiveWorkDays',
      key: 'effectiveWorkDays',
    },
    {
      title: 'Days in Month',
      dataIndex: 'daysInMonth',
      key: 'daysInMonth',
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
