import { useEffect } from 'react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectUpdatedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function UpdateForm({ config, formElements, withUpload = false }) {
  let { entity } = config;
  const translate = useLanguage();
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();

  /////

  const { panel, collapsedBox, readBox } = crudContextAction;

  const showCurrentRecord = () => {
    readBox.open();
  };

  /////
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    const id = current._id;

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }

    const formattedValues = unflattenFields(fieldsValue);
    // const trimmedValues = Object.keys(fieldsValue).reduce((acc, key) => {
    //   acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
    //   return acc;
    // }, {});
    dispatch(crud.update({ entity, id, jsonData: formattedValues, withUpload }));
  };
  useEffect(() => {
    if (current) {
      let newValues = { ...current };
      if (newValues.joiningDate) {
        newValues = {
          ...newValues,
          joiningDate: dayjs(newValues['joiningDate']),
        };
      }
      if (newValues.dateOfBirth) {
        newValues = {
          ...newValues,
          dateOfBirth: dayjs(newValues['dateOfBirth']),
        };
      }
      if (newValues.birthday) {
        newValues = {
          ...newValues,
          birthday: dayjs(newValues['birthday']),
        };
      }
      if (newValues.date) {
        newValues = {
          ...newValues,
          date: dayjs(newValues['date']),
        };
      }
      if (newValues.expiredDate) {
        newValues = {
          ...newValues,
          expiredDate: dayjs(newValues['expiredDate']),
        };
      }
      if (newValues.attendanceDate) {
        newValues = {
          ...newValues,
          attendanceDate: dayjs(newValues['attendanceDate']),
        };
      }
      if (newValues.checkInDate) {
        newValues = {
          ...newValues,
          checkInDate: dayjs(newValues['checkInDate']),
        };
      }
      if (newValues.checkOutDate) {
        newValues = {
          ...newValues,
          checkOutDate: dayjs(newValues['checkOutDate']),
        };
      }
      if (newValues.checkIn) {
        newValues = {
          ...newValues,
          checkIn: dayjs(newValues['checkIn'], 'HH:mm'),
        };
      }
      if (newValues.checkOut) {
        newValues = {
          ...newValues,
          checkOut: dayjs(newValues['checkOut'], 'HH:mm'),
        };
      }
      if (newValues.appliedDate) {
        newValues = {
          ...newValues,
          appliedDate: dayjs(newValues['appliedDate'], 'YY:MM:DD'),
        };
      }
      if (newValues.startDate) {
        newValues = {
          ...newValues,
          startDate: dayjs(newValues['startDate']),
        };
      }
      if (newValues.endDate) {
        newValues = {
          ...newValues,
          endDate: dayjs(newValues['endDate']),
        };
      }

      if (newValues.created) {
        newValues = {
          ...newValues,
          created: dayjs(newValues['created']),
        };
      }
      if (newValues.updated) {
        newValues = {
          ...newValues,
          updated: dayjs(newValues['updated']),
        };
      }
      form.resetFields();
      form.setFieldsValue(newValues);
    }
  }, [current]);

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction({ actionType: 'update' }));
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  const { isEditBoxOpen } = state;

  const show = isEditBoxOpen ? { display: 'block', opacity: 1 } : { display: 'none', opacity: 0 };
  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {formElements}
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit">
              {translate('Save')}
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            <Button onClick={showCurrentRecord}>{translate('Cancel')}</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}

function unflattenFields(values) {
  const nested = {};
  for (const key in values) {
    if (key.includes('_')) {
      const [parent, child] = key.split('_');
      if (!nested[parent]) nested[parent] = {};
      nested[parent][child] = values[key];
    } else {
      nested[key] = values[key];
    }
  }
  return nested;
}
