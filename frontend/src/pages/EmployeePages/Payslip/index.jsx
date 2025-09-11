import CrudModule from '@/modules/CrudModule/CrudModule';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { useDate } from '@/settings';
export default function Payslip() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'payslip';
  const searchConfig = {
    displayLabels: ['employeeName', 'employeeCode', 'month'],
    searchFields: 'employeeName,employeeCode,month',
  };
  const deleteModalLabels = ['employeeName'];

  const Labels = {
    PANEL_TITLE: translate('payslip'),
    DATATABLE_TITLE: translate('my payslip_list'),
    ENTITY_NAME: translate('payslip'),
  };

  //custom dataTableColumns

  const dataTableColumns = [
    {
      title: 'Employee Id',
      dataIndex: 'employeeCode',
    },
    {
      title: 'Name',
      dataIndex: 'employeeName',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'employeeEmail',
    // },
    // {
    //   title: 'Batch',
    //   dataIndex: 'batch',
    // },
    {
      title: 'Month',
      dataIndex: 'month',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },

    // {
    //   title: 'Basic Salary',
    //   dataIndex: 'basicSalary',
    // },
    // {
    //   title: 'Allowances',
    //   dataIndex: 'allowances',
    // },
    // {
    //   title: 'Bonuses',
    //   dataIndex: 'bonuses',
    // },
    // {
    //   title: 'Deductions',
    //   dataIndex: 'deductions',
    // },
    // {
    //   title: 'Gross Salary',
    //   dataIndex: 'grossSalary',
    // },
    // {
    //   title: 'Net Salary',
    //   dataIndex: 'netSalary',
    // },
    {
      title: 'Pay Date',
      dataIndex: 'payDate',
      key: 'payDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
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
      dataIndex: 'employeeCode',
    },
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
    },
    // {
    //   title: 'Employee Email',
    //   dataIndex: 'employeeEmail',
    // },
    {
      title: 'Month',
      dataIndex: 'month',
      isDate: true,
    },
    // {
    //   title: 'Basic Salary',
    //   dataIndex: 'basicSalary',
    // },
    // {
    //   title: 'Allowances',
    //   dataIndex: 'allowances',
    // },
    // {
    //   title: 'Bonuses',
    //   dataIndex: 'bonuses',
    // },
    // {
    //   title: 'Deductions',
    //   dataIndex: 'deductions',
    // },
    // {
    //   title: 'Gross Salary',
    //   dataIndex: 'grossSalary',
    // },
    // {
    //   title: 'Net Salary',
    //   dataIndex: 'netSalary',
    // },
    {
      title: 'Pay Date',
      dataIndex: 'payDate',
      key: 'payDate',
      isDate: true,
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
    // fields,
    searchConfig,
    deleteModalLabels,
    dataTableColumns,
    readColumns,
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
  };
  return <CrudModule config={config} />;
}
