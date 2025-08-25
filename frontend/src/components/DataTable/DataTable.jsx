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

function AddNewItem({ config }) {
  const { crudContextAction } = useCrudContext();
  const { collapsedBox, panel } = crudContextAction;
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
        filterRow[headerMap[key]] = row[key];
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

    // Use landscape orientation for better column spacing
    const doc = new jsPDF('landscape', 'mm', 'a4');

    const exportColumns = dataTableColumns.filter((col) => col.dataIndex);
    const exportKey = exportColumns.map((col) => col.dataIndex);
    const headerMap = exportColumns.reduce((acc, col) => {
      acc[col.dataIndex] = typeof col.title === 'string' ? col.title : col.dataIndex;
      return acc;
    }, {});

    const tableColumns = exportKey.map((key) => headerMap[key]);
    const tableRows = flattenedDataSource.map((row) =>
      exportKey.map((key) => {
        const value = row[key];
        // Handle null/undefined values and convert to string
        if (value === null || value === undefined) return '';

        const stringValue = String(value);

        // Format address field to be more compact
        if (key === 'Address' && stringValue.length > 50) {
          return stringValue.replace(/\n/g, ', ').substring(0, 60) + '...';
        }

        // Format other long fields
        if (stringValue.length > 40) {
          return stringValue.substring(0, 37) + '...';
        }

        return stringValue.replace(/\n/g, ' ');
      })
    );

    // Title styling
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#2c3e50');
    doc.text(`${entity.charAt(0).toUpperCase() + entity.slice(1)} List`, 14, 20);

    // Get page dimensions for better column width calculation
    const pageWidth = doc.internal.pageSize.getWidth();
    const margins = { left: 14, right: 14 };
    const tableWidth = pageWidth - margins.left - margins.right;

    // Calculate dynamic column widths based on actual content
    const calculateDynamicColumnWidths = () => {
      const availableWidth = tableWidth;
      const minWidth = 12; // Minimum column width
      const maxWidth = 60; // Maximum column width
      const padding = 4; // Extra padding per column

      // Calculate content-based widths
      const contentWidths = tableColumns.map((header, colIndex) => {
        // Start with header length
        let maxContentLength = header.length;

        // Check content in all rows for this column
        tableRows.forEach((row) => {
          if (row[colIndex] && row[colIndex].length > maxContentLength) {
            maxContentLength = row[colIndex].length;
          }
        });

        // Convert character count to approximate width (rough estimation: 1 char ≈ 1.8mm at font size 7)
        const estimatedWidth = Math.max(
          minWidth,
          Math.min(maxWidth, maxContentLength * 1.8 + padding)
        );

        return {
          index: colIndex,
          header: header,
          contentLength: maxContentLength,
          estimatedWidth: estimatedWidth,
        };
      });

      // Calculate total estimated width
      const totalEstimatedWidth = contentWidths.reduce((sum, col) => sum + col.estimatedWidth, 0);

      // If total width exceeds available space, proportionally reduce
      if (totalEstimatedWidth > availableWidth) {
        const scaleFactor = availableWidth / totalEstimatedWidth;
        return contentWidths.map((col) => Math.max(minWidth, col.estimatedWidth * scaleFactor));
      }

      // If total width is less than available space, distribute extra space
      if (totalEstimatedWidth < availableWidth) {
        const extraSpace = availableWidth - totalEstimatedWidth;
        const extraPerColumn = extraSpace / contentWidths.length;

        return contentWidths.map((col) => Math.min(maxWidth, col.estimatedWidth + extraPerColumn));
      }

      // Return as-is if fits perfectly
      return contentWidths.map((col) => col.estimatedWidth);
    };

    const columnWidths = calculateDynamicColumnWidths();

    autoTable(doc, {
      startY: 30,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',

      // Column styles with dynamic widths
      columnStyles: exportKey.reduce((acc, key, index) => {
        acc[index] = {
          cellWidth: columnWidths[index],
          halign: 'left',
          valign: 'middle',
          overflow: 'linebreak',
          cellPadding: { top: 2, right: 1.5, bottom: 2, left: 1 },
        };
        return acc;
      }, {}),

      headStyles: {
        fillColor: [41, 128, 185], // Better blue color
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center',
        valign: 'middle',
        fontSize: 8,
        cellPadding: { top: 3, right: 2, bottom: 3, left: 2 },
      },

      bodyStyles: {
        fontSize: 7,
        cellPadding: { top: 2.5, right: 1.5, bottom: 2.5, left: 1.5 },
        valign: 'middle',
        halign: 'left',
        textColor: [44, 62, 80],
      },

      alternateRowStyles: {
        fillColor: [248, 249, 250], // Light gray for alternate rows
      },

      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
        fontSize: 7,
        font: 'helvetica',
        halign: 'left',
        valign: 'middle',
      },

      // Dynamic table layout
      tableWidth: 'auto',
      tableLineWidth: 0.1,
      margin: margins,

      // Handle page breaks better
      showHead: 'everyPage',
      pageBreak: 'auto',

      // Custom draw functions for better formatting
      didDrawPage: function (data) {
        // Header on each page
        if (data.pageNumber > 1) {
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor('#2c3e50');
          doc.text(`${entity.charAt(0).toUpperCase() + entity.slice(1)} List (Continued)`, 14, 15);
        }

        // Footer with page numbers and generation date
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Page number - fix undefined issue
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor('#7f8c8d');
        const totalPages = doc.getNumberOfPages();
        doc.text(`Page ${data.pageNumber} of ${totalPages}`, pageWidth - 30, pageHeight - 10, {
          align: 'right',
        });

        // Generation date
        const dateStr = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        doc.text(`Generated on: ${dateStr}`, 14, pageHeight - 10);
      },

      // Handle cell content dynamically
      didParseCell: function (data) {
        // Dynamic text handling based on column width
        const columnWidth = columnWidths[data.column.index];
        const maxCharsPerLine = Math.floor(columnWidth / 1.5); // Approximate chars per line

        if (data.cell.text && data.cell.text.length > 0) {
          let cellText = data.cell.text[0];
          if (typeof cellText === 'string') {
            // For very narrow columns, truncate more aggressively
            if (columnWidth < 20 && cellText.length > maxCharsPerLine) {
              data.cell.text = [cellText.substring(0, maxCharsPerLine - 3) + '...'];
            }
            // For wider columns, allow more text but still manage overflow
            else if (cellText.length > maxCharsPerLine * 3) {
              data.cell.text = [cellText.substring(0, maxCharsPerLine * 3 - 3) + '...'];
            }
          }
        }
      },
    });

    // Save with timestamp in filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    doc.save(`${capitalize(entity)}_${timestamp}.pdf`);
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
    if (item.key === 'edit' && config.allowEdit === false) {
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
