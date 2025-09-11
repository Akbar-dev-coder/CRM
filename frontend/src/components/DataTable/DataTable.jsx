import { useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  FilePdfOutlined,
} from '@ant-design/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Dropdown, Table, Button, Input } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { selectListItems } from '@/redux/crud/selectors';
import useLanguage from '@/locale/useLanguage';
import { dataForTable } from '@/utils/dataStructure';
import { useMoney, useDate } from '@/settings';

import { generate as uniqueId } from 'shortid';

import { useCrudContext } from '@/context/crud';
import dayjs from 'dayjs';

import { DOWNLOAD_BASE_URL } from '@/config/serverApiConfig';

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
  const { dateFormat } = useDate();
  const { ADD_NEW_ENTITY } = config;

  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      {ADD_NEW_ENTITY}
    </Button>
  );
}
export default function DataTable({ config, extra = [] }) {
  let { entity, dataTableColumns, DATATABLE_TITLE, fields, searchConfig } = config;
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, readBox, editBox, advancedBox } = crudContextAction;
  const translate = useLanguage();
  const { moneyFormatter } = useMoney();
  const { dateFormat } = useDate();
  const dateColumns = ['dob', 'joiningDate', 'attendanceDate', 'checkInDate', 'checkOutDate'];

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // flatten data for employeeId

  const flattenDataForExport = (data) => {
    return data.map((row) => {
      const newRow = {
        ...row,
      };
      if (row.employeeId && typeof row.employeeId === 'object') {
        newRow.employeeId = row.employeeId.employeeId || 'N/A';
      }
      return newRow;
    });
  };
  const handleDownloadExcel = () => {
    const flattenedDataSource = flattenDataForExport(dataSource);

    const exportColumn = dataTableColumns.filter((col) => col.dataIndex);
    const exportkey = exportColumn.map((col) => col.dataIndex);
    const headerMap = exportColumn.reduce((acc, col) => {
      acc[col.dataIndex] = typeof col.title === 'string' ? col.title : col.dataIndex;
      return acc;
    }, {});

    const cleanData = flattenedDataSource.map((row) => {
      const filterRow = {};
      exportkey.forEach((key) => {
        let value = row[key];

        // format date fields
        if (value && dateColumns.includes(key) && !isNaN(Date.parse(value))) {
          value = dayjs(value).format(dateFormat);
        }

        filterRow[headerMap[key]] = value;
      });
      return filterRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `${entity}`);
    XLSX.writeFile(workbook, `${capitalize(entity)}.xlsx`);
  };
  const handleDownloadPDF = () => {
    const flattenedDataSource = flattenDataForExport(dataSource);

    // Special handling for Employee entity with many columns
    if (entity.toLowerCase() === 'employee') {
      return handleEmployeePDFOptimized();
    }

    // Regular PDF handling for other entities
    const doc = new jsPDF('landscape', 'mm', 'a4');

    const exportColumns = dataTableColumns.filter(
      (col) => col.dataIndex && col.dataIndex !== 'action'
    );
    const exportKey = exportColumns.map((col) => col.dataIndex);
    const headerMap = exportColumns.reduce((acc, col) => {
      acc[col.dataIndex] = typeof col.title === 'string' ? col.title : col.dataIndex;
      return acc;
    }, {});

    const tableColumns = exportKey.map((key) => headerMap[key]);
    const tableRows = flattenedDataSource.map((row) =>
      exportKey.map((key) => {
        let value = row[key];

        if (value === null || value === undefined) return '';

        if (row.employeeId && typeof row.employeeId === 'object') {
          newRow.employeeId = row.employeeId.employeeId || 'N/A';
          newRow.epmployeeName = row.epmployId.fullName || 'N/A';
        }
        // Format date fields
        if (value && dateColumns.includes(key) && !isNaN(Date.parse(value))) {
          value = dayjs(value).format(dateFormat);
        }

        let stringValue = String(value).replace(/\s+/g, ' ').trim();

        // Handle long content
        if (stringValue.length > 40) {
          return stringValue.substring(0, 37) + '...';
        }

        return stringValue;
      })
    );

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2c3e50');

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = `${entity.charAt(0).toUpperCase() + entity.slice(1)} List`;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 20);

    const margins = { left: 12, right: 12 };
    const availableWidth = pageWidth - margins.left - margins.right;
    const avgColumnWidth = availableWidth / tableColumns.length;

    autoTable(doc, {
      startY: 30,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',

      styles: {
        fontSize: 8,
        font: 'helvetica',
        cellPadding: { top: 2, right: 1.5, bottom: 2, left: 1.5 },
        overflow: 'linebreak',
        valign: 'middle',
      },

      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 9,
      },

      bodyStyles: {
        fontSize: 8,
        halign: 'center',
      },

      columnStyles: exportKey.reduce((acc, key, index) => {
        acc[index] = { cellWidth: avgColumnWidth };
        return acc;
      }, {}),

      margin: margins,

      didDrawPage: function (data) {
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.setFontSize(8);
        doc.setTextColor('#7f8c8d');

        const dateStr = new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        doc.text(`Page ${data.pageNumber}`, 12, pageHeight - 8);
        doc.text(`Generated: ${dateStr}`, pageWidth / 2 - 30, pageHeight - 8);
        doc.text('Confidential', pageWidth - 35, pageHeight - 8);
      },
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    doc.save(`${capitalize(entity)}_${timestamp}.pdf`);
  };

  // OPTIMIZED EMPLOYEE PDF FUNCTION
  const handleEmployeePDFOptimized = () => {
    const flattenedDataSource = flattenDataForExport(dataSource);
    const doc = new jsPDF('landscape', 'mm', 'a3'); // A3 for Employee

    // Manually map all Employee columns based on your actual dataTableColumns
    const employeeColumns = [
      { dataIndex: 'employeeId', title: 'Employee ID' },
      { dataIndex: 'fullName', title: 'Full Name' },
      { dataIndex: 'email', title: 'Email' },
      { dataIndex: 'phone', title: 'Phone' },
      { dataIndex: 'gender', title: 'Gender' },
      { dataIndex: 'dateOfBirth', title: 'Date Of Birth' },
      { dataIndex: 'country', title: 'Country' },
      { dataIndex: 'address', title: 'Address' },
      { dataIndex: 'department', title: 'Department' },
      { dataIndex: 'designation', title: 'Designation' },
      { dataIndex: 'employeeType', title: 'Employee Type' },
      { dataIndex: 'bankName', title: 'Bank Name' },
      { dataIndex: 'bankAccountNumber', title: 'Bank Account Number' },
      { dataIndex: 'bankIFSC', title: 'IFSC Code' },
      { dataIndex: 'panNo', title: 'Pan Number' },
      { dataIndex: 'aadhaarNo', title: 'Aadhar Number' },
      { dataIndex: 'basicSalary', title: 'Basic Salary' },
      { dataIndex: 'joiningDate', title: 'Joining Date' },
      { dataIndex: 'status', title: 'Status' },
      { dataIndex: 'role', title: 'Role' },
    ];

    // Filter only columns that exist in data
    const dataKeys = Object.keys(flattenedDataSource[0] || {});
    const validColumns = employeeColumns.filter((col) => dataKeys.includes(col.dataIndex));

    console.log(
      'Employee PDF - Valid columns:',
      validColumns.map((col) => col.dataIndex)
    );
    console.log('Employee PDF - Available data keys:', dataKeys);

    const exportKey = validColumns.map((col) => col.dataIndex);
    const tableColumns = validColumns.map((col) => col.title);

    const tableRows = flattenedDataSource.map((row) =>
      exportKey.map((key) => {
        let value = row[key];

        if (value === null || value === undefined) return '';

        // Format dates
        if (key.toLowerCase().includes('date') && !isNaN(Date.parse(value))) {
          return dayjs(value).format(dateFormat || 'DD/MM/YYYY');
        }

        // Format salary

        // if (key.toLowerCase().includes('salary') || key.toLowerCase().includes('basic')) {
        //   const numValue = parseFloat(String(row[key]).replace(/[^0-9.-]+/g, ''));
        //   if (!isNaN(numValue)) {
        //     return `${numValue}`;
        //   }
        // }

        // Clean string
        const stringValue = String(value).replace(/\s+/g, ' ').trim();

        // Truncate long content intelligently
        if (key.toLowerCase().includes('address') && stringValue.length > 60) {
          return stringValue.substring(0, 57) + '...';
        }
        if (stringValue.length > 35) {
          return stringValue.substring(0, 32) + '...';
        }

        return stringValue;
      })
    );

    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2c3e50');

    const pageWidth = doc.internal.pageSize.getWidth();
    const title = 'Employee Details Report';
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 25);

    // Column width calculation for A3
    const margins = { left: 12, right: 12 };
    const availableWidth = pageWidth - margins.left - margins.right;
    const baseColumnWidth = availableWidth / tableColumns.length;

    autoTable(doc, {
      startY: 35,
      head: [tableColumns],
      body: tableRows,
      theme: 'grid',

      styles: {
        fontSize: 7,
        font: 'helvetica',
        cellPadding: { top: 1.5, right: 1, bottom: 1.5, left: 1 },
        overflow: 'linebreak',
        valign: 'middle',
        lineWidth: 0.1,
        lineColor: [200, 200, 200],
      },

      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 8,
      },

      bodyStyles: {
        fontSize: 7,
        textColor: [44, 62, 80],
        halign: 'center',
      },

      // Dynamic column widths
      columnStyles: exportKey.reduce((acc, key, index) => {
        const safeKey = String(key || '').toLowerCase();

        acc[index] = {
          cellWidth: baseColumnWidth,
          valign: 'middle',
        };

        // Adjust width and alignment based on content type
        if (safeKey.includes('id')) {
          acc[index].cellWidth = baseColumnWidth * 0.7;
          acc[index].halign = 'center';
        } else if (safeKey.includes('address')) {
          acc[index].cellWidth = baseColumnWidth * 1.4;
          acc[index].halign = 'left';
        } else if (safeKey.includes('email')) {
          acc[index].cellWidth = baseColumnWidth * 1.2;
          acc[index].halign = 'left';
        } else if (safeKey.includes('salary') || safeKey.includes('basic')) {
          acc[index].cellWidth = baseColumnWidth * 0.9;
          acc[index].halign = 'right';
        } else if (safeKey.includes('name')) {
          acc[index].cellWidth = baseColumnWidth * 1.1;
          acc[index].halign = 'left';
        }

        return acc;
      }, {}),

      alternateRowStyles: {
        fillColor: [248, 249, 250],
      },

      margin: margins,
      tableWidth: 'auto',
      showHead: 'everyPage',
      pageBreak: 'auto',

      didDrawPage: function (data) {
        const pageHeight = doc.internal.pageSize.getHeight();
        const currentPageWidth = doc.internal.pageSize.getWidth();

        // Header for continuation pages
        if (data.pageNumber > 1) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor('#2c3e50');
          const continueTitle = 'Employee Details Report (Continued)';
          const continueTitleWidth = doc.getTextWidth(continueTitle);
          doc.text(continueTitle, (currentPageWidth - continueTitleWidth) / 2, 20);
        }

        // Footer
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#7f8c8d');

        doc.text(`Page ${data.pageNumber}`, 12, pageHeight - 10);

        const dateStr = new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        const dateText = `Generated: ${dateStr}`;
        const dateWidth = doc.getTextWidth(dateText);
        doc.text(dateText, (currentPageWidth - dateWidth) / 2, pageHeight - 10);

        doc.text('Confidential', currentPageWidth - 35, pageHeight - 10);
      },
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    doc.save(`Employee_Complete_${timestamp}.pdf`);
  };

  let items = [
    {
      label: translate('Show'),
      key: 'read',
      icon: <EyeOutlined />,
    },
    {
      label: translate('Edit'),
      key: 'edit',
      icon: <EditOutlined />,
    },
    ['payslip', 'payroll'].includes(entity) && {
      label: translate('Download'),
      key: 'download',
      icon: <FilePdfOutlined />,
    },

    ...extra,
    {
      type: 'divider',
    },

    {
      label: translate('Delete'),
      key: 'delete',
      icon: <DeleteOutlined />,
    },
  ];
  items = items.filter((item) => {
    if (
      (item.key === 'edit' && config.allowEdit === false) ||
      (item.key === 'delete' && config.allowDelete === false)
    ) {
      return false;
    }
    return true;
  });
  const handleRead = (record) => {
    dispatch(crud.currentItem({ data: record }));
    panel.open();
    collapsedBox.open();
    readBox.open();
  };
  function handleEdit(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  }
  function handleDelete(record) {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modal.open();
  }
  const handleDownload = (record) => {
    window.open(`${DOWNLOAD_BASE_URL}${entity}/${entity}-${record._id}.pdf`, '_blank');
  };

  function handleUpdatePassword(record) {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    advancedBox.open();
    panel.open();
    collapsedBox.open();
  }

  // let dispatchColumns = [];
  // if (fields) {
  //   dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  // } else {
  //   dispatchColumns = [...dataTableColumns];
  // }

  let dispatchColumns = [];

  if (config.dataTableColumns) {
    dispatchColumns = [...config.dataTableColumns];
  } else if (fields) {
    dispatchColumns = [...dataForTable({ fields, translate, moneyFormatter, dateFormat })];
  }

  dataTableColumns = [
    ...dispatchColumns,
    {
      title: '',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => {
              switch (key) {
                case 'read':
                  handleRead(record);
                  break;
                case 'edit':
                  handleEdit(record);
                  break;
                case 'download':
                  handleDownload(record);
                  break;

                case 'delete':
                  handleDelete(record);
                  break;
                case 'updatePassword':
                  handleUpdatePassword(record);
                  break;

                default:
                  break;
              }
              // else if (key === '2')handleCloseTask
            },
          }}
          trigger={['click']}
        >
          <EllipsisOutlined
            style={{ cursor: 'pointer', fontSize: '24px' }}
            onClick={(e) => e.preventDefault()}
          />
        </Dropdown>
      ),
    },
  ];

  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);

  const { pagination, items: dataSource } = listResult;

  const dispatch = useDispatch();

  const handelDataTableLoad = useCallback((pagination) => {
    const options = { page: pagination.current || 1, items: pagination.pageSize || 10 };
    dispatch(crud.list({ entity, options }));
  }, []);

  const filterTable = (e) => {
    const value = e.target.value;
    const options = { q: value, fields: searchConfig?.searchFields || '' };
    dispatch(crud.list({ entity, options }));
  };

  const dispatcher = () => {
    dispatch(crud.list({ entity }));
  };

  useEffect(() => {
    const controller = new AbortController();
    dispatcher();
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        backIcon={<ArrowLeftOutlined />}
        title={DATATABLE_TITLE}
        ghost={false}
        extra={[
          <Input
            key={`searchFilterDataTable}`}
            onChange={filterTable}
            placeholder={translate('search')}
            allowClear
          />,
          <Button onClick={handelDataTableLoad} key={`${uniqueId()}`} icon={<RedoOutlined />}>
            {translate('Refresh')}
          </Button>,
          config.allowCreate !== false && <AddNewItem key={`${uniqueId()}`} config={config} />,

          ['client', 'vender', 'employee', 'employeeAttendance'].includes(entity) && (
            <Dropdown
              key={'downloadDropdown'}
              menu={{
                items: [
                  {
                    key: 'excel',
                    label: 'Excel',
                    icon: <DownloadOutlined />,
                  },
                  {
                    key: 'pdf',
                    label: 'PDF',
                    icon: <DownloadOutlined />,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === 'excel') {
                    handleDownloadExcel();
                  } else if (key === 'pdf') {
                    handleDownloadPDF();
                  }
                },
              }}
            >
              <Button icon={<DownloadOutlined />}>{translate('download')}</Button>
            </Dropdown>
          ),
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>

      <Table
        columns={dataTableColumns}
        rowKey={(item) => item._id}
        dataSource={dataSource}
        pagination={pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
        scroll={{ x: true }}
      />
    </>
  );
}
