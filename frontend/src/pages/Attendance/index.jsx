import CrudModule from '@/modules/CrudModule/CrudModule';

import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { useDate } from '@/settings';

export default function Attendance() {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const entity = 'employeeAttendance';
  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
    outputValue: '_id',
  };
  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('attendance'),
    DATATABLE_TITLE: translate('attendance_list'),
    ENTITY_NAME: translate('attendance'),
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
      dataIndex: 'name',
    },
    // {
    //   title: 'Employee Name',
    //   dataIndex: 'employeeName',
    //   key: 'employeeName',
    //   render: (_, record) => record.employeeId?.fullName || 'N/A',
    // },
    {
      title: 'Attendance Date',
      dataIndex: 'attendanceDate',
      key: 'attendanceDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
      key: 'workType',
    },
    {
      title: 'Check In Date',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: 'Check Out Date',
      dataIndex: 'checkOutDate',
      key: 'checkOutDate',
      render: (date) => {
        return dayjs(date).format(dateFormat);
      },
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
      key: 'checkOut',
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
      dataIndex: 'name',
      // render: (name) => name.employeeId?.fullName || 'N/A',
    },
    {
      title: 'Attendance Date',
      dataIndex: 'attendanceDate',
      isDate: true,
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
    },
    {
      title: 'Work Type',
      dataIndex: 'workType',
    },
    {
      title: 'Check In Date',
      dataIndex: 'checkInDate',
      isDate: true,
    },
    {
      title: 'Check In',
      dataIndex: 'checkIn',
    },
    {
      title: 'Check Out Date',
      dataIndex: 'checkOutDate',
      isDate: true,
    },
    {
      title: 'Check Out',
      dataIndex: 'checkOut',
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
    enableSearch: true,
  };
  return <CrudModule config={config} />;
}
