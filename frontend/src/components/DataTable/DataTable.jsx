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

  const handleDownloadExcel = () => {
    const exportColumn = dataTableColumns.filter((col) => col.dataIndex);
    const exportkey = exportColumn.map((col) => col.dataIndex);
    const headerMap = exportColumn.reduce((acc, col) => {
      acc[col.dataIndex] = typeof col.title === 'string' ? col.title : col.dataIndex;
      return acc;
    }, {});

    const cleanData = dataSource.map((row) => {
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
    const doc = new jsPDF();
    const exportColumns = dataTableColumns.filter((col) => col.dataIndex);
    const exportKey = exportColumns.map((col) => col.dataIndex);
    const headerMap = exportColumns.reduce((acc, col) => {
      acc[col.dataIndex] = typeof col.title === 'string' ? col.title : col.dataIndex;
      return acc;
    }, {});

    const tableColumns = exportKey.map((key) => headerMap[key]);
    const tableRows = dataSource.map((row) => exportKey.map((key) => row[key]));

    doc.setFontSize(16);
    doc.setTextColor('#333333');
    doc.text(`${entity.charAt(0).toUpperCase() + entity.slice(1)} List`, 14, 20);

    autoTable(doc, {
      startY: 25,
      head: [tableColumns],
      body: tableRows,
      theme: 'striped',
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'left',
        fontSize: 5,
      },
      bodyStyles: {
        fontSize: 5,
        valign: 'middle',
        halign: 'left',
      },
      styles: {
        overflow: 'linebreak',
        minCellWidth: 'auto',
      },
      didDrawPage: function (data) {
        const dateStr = new Date().toLocaleString();
        doc.setFontSize(8);
        doc.setTextColor('#888');
        doc.text(
          `Generated on: ${dateStr}`,
          data.settings.margin.left,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save(`${capitalize(entity)}.pdf`);
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
