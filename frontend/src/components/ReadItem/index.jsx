import { useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';

import dayjs from 'dayjs';
import { dataForRead } from '@/utils/dataStructure';

import { useCrudContext } from '@/context/crud';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { valueByString } from '@/utils/helpers';

import useLanguage from '@/locale/useLanguage';
import { useDate } from '@/settings';

export default function ReadItem({ config }) {
  const { dateFormat } = useDate();
  let { readColumns, fields } = config;
  const translate = useLanguage();
  const { result: currentResult } = useSelector(selectCurrentItem);
  const { state } = useCrudContext();
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState([]);

  if (!readColumns && fields)
    readColumns = [...dataForRead({ fields: fields, translate: translate })];
  // useEffect(() => {
  //   const list = [];
  //   readColumns.map((props) => {
  //     const propsKey = props.dataIndex;
  //     const propsTitle = props.title;
  //     const isDate = props.isDate || false;
  //     let value = valueByString(currentResult, propsKey);
  //     value = isDate ? dayjs(value).format(dateFormat) : value;
  //     list.push({ propsKey, label: propsTitle, value: value });
  //   });
  //   setListState(list);
  // }, [currentResult]);

  //new logic

  // ReadItem.jsx me isko use karein

  useEffect(() => {
    if (!currentResult) return;
    const columnsToDisplay = readColumns || dataForRead({ fields, translate });

    const list = columnsToDisplay.map((props) => {
      const propsKey = props.dataIndex;
      const propsTitle = props.title;
      let value;

      if (props.render) {
        // Agar custom render function hai, to usko use karo

        value = props.render(currentResult);
      } else {
        // Warna purani logic se value nikalo
        value = valueByString(currentResult, propsKey);
      }

      // Date formatting (agar render function nahi hai)
      if (!props.render && props.isDate && value) {
        value = dayjs(value).format(dateFormat);
      }

      return { propsKey, label: propsTitle, value: value || 'N/A' };
    });

    setListState(list);
  }, [currentResult, readColumns, fields]);

  const show = isReadBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };

  const itemsList = listState.map((item) => {
    return (
      <Row key={item.propsKey} gutter={12}>
        <Col className="gutter-row" span={8}>
          <p>{item.label}</p>
        </Col>
        <Col className="gutter-row" span={2}>
          <p> : </p>
        </Col>
        <Col className="gutter-row" span={14}>
          <p>{item.value}</p>
        </Col>
      </Row>
    );
  });

  return <div style={show}>{itemsList}</div>;
}
