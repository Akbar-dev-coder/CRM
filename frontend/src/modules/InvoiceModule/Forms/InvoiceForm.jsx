import { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

import { DatePicker } from 'antd';

import AutoCompleteAsync from '@/components/AutoCompleteAsync';

import ItemRow from '@/modules/ErpPanelModule/ItemRow';

import MoneyInputFormItem from '@/components/MoneyInputFormItem';
import { selectFinanceSettings } from '@/redux/settings/selectors';
import { useDate } from '@/settings';
import useLanguage from '@/locale/useLanguage';

import calculate from '@/utils/calculate';
import { useSelector } from 'react-redux';
import SelectAsync from '@/components/SelectAsync';

export default function InvoiceForm({ subTotal = 0, current = null }) {
  const { last_invoice_number } = useSelector(selectFinanceSettings);

  if (last_invoice_number === undefined) {
    return <></>;
  }

  return <LoadInvoiceForm subTotal={subTotal} current={current} />;
}

function LoadInvoiceForm({ subTotal = 0, current = null }) {
  const translate = useLanguage();
  const { dateFormat } = useDate();
  const { last_invoice_number } = useSelector(selectFinanceSettings);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [lastNumber, setLastNumber] = useState(() => last_invoice_number + 1);

  useEffect(() => {
    if (current) {
      const { cgstRate = 0, sgstRate = 0, igstRate = 0, year, number } = current;
      setCgstRate(cgstRate / 100);
      setSgstRate(sgstRate / 100);
      setIgstRate(igstRate / 100);
      setCurrentYear(year);
      setLastNumber(number);
    }
  }, [current]);

  const addField = useRef(false);

  useEffect(() => {
    addField.current.click();
  }, []);

  const [invoiceCurrency, setInvoiceCurrency] = useState('INR');

  const [cgstRate, setCgstRate] = useState(0);
  const [sgstRate, setSgstRate] = useState(0);
  const [igstRate, setIgstRate] = useState(0);

  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstAmount, setSgstAmount] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);

  const [total, setTotal] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  // const [taxRate, setTaxRate] = useState(0);

  // const handelTaxChange = (value) => {
  //   setTaxRate(value / 100);
  // };

  // useEffect(() => {
  //   if (current) {
  //     const { taxRate= 0, year, number } = current;
  //     setTaxRate(taxRate / 100);
  //     setCurrentYear(year);
  //     setLastNumber(number);
  //   }
  // }, [current]);
  // useEffect(() => {

  //   const currentTotal = calculate.add(calculate.multiply(subTotal, taxRate), subTotal);
  //   setTaxTotal(Number.parseFloat(calculate.multiply(subTotal, taxRate)));
  //   setTotal(Number.parseFloat(currentTotal));
  // }, [subTotal, taxRate]);
  useEffect(() => {
    const cgst = calculate.multiply(subTotal, cgstRate);
    const sgst = calculate.multiply(subTotal, sgstRate);
    const igst = calculate.multiply(subTotal, igstRate);
    const totalTax = calculate.add(cgst, calculate.add(sgst, igst));
    const currentTotal = calculate.add(subTotal, totalTax);
    setCgstAmount(cgst);
    setSgstAmount(sgst);
    setIgstAmount(igst);
    setTaxTotal(totalTax);
    setTotal(currentTotal);
  }, [subTotal, cgstRate, sgstRate, igstRate]);

  return (
    <>
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={8}>
          <Form.Item
            name="client"
            label={translate('Client')}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <AutoCompleteAsync
              entity={'client'}
              displayLabels={['name']}
              searchFields={'name'}
              redirectLabel={'Add New Client'}
              withRedirect
              urlToRedirect={'/customer'}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            label={translate('number')}
            name="number"
            initialValue={lastNumber}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            name="currency"
            label="Currency"
            rules={[{ required: true }]}
            initialValue="INR"
          >
            <Select
              value={invoiceCurrency}
              onChange={(value) => setInvoiceCurrency(value)}
              options={[
                { label: 'INR ₹', value: 'INR' },
                { label: 'USD $', value: 'USD' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={3}>
          <Form.Item
            label={translate('year')}
            name="year"
            initialValue={currentYear}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={5}>
          <Form.Item
            label={translate('status')}
            name="status"
            rules={[
              {
                required: false,
              },
            ]}
            initialValue={'draft'}
          >
            <Select
              options={[
                { value: 'draft', label: translate('Draft') },
                { value: 'pending', label: translate('Pending') },
                { value: 'sent', label: translate('Sent') },
              ]}
            ></Select>
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={8}>
          <Form.Item
            name="date"
            label={translate('Date')}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs()}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={6}>
          <Form.Item
            name="expiredDate"
            label={translate('Payment Due Date')}
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
            initialValue={dayjs().add(30, 'days')}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={10}>
          <Form.Item label={translate('Note')} name="notes">
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            label={translate('P.O No.')}
            name="purchaseOrderNumber"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input placeholder={translate('Enter Purchase Order Number')} />
          </Form.Item>
        </Col>

        <Col className="gutter-row" span={6}>
          <Form.Item
            label={translate('P.O Date')}
            name="purchaseOrderDate"
            rules={[
              {
                required: true,
                type: 'object',
              },
            ]}
          >
            <DatePicker style={{ width: '100%' }} format={dateFormat} />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Row gutter={[12, 12]} style={{ position: 'relative', textAlign: 'center' }}>
        {/* <Col className="gutter-row" span={3}>
          <p>{translate('Item')}</p>
        </Col> */}
        <Col className="gutter-row" span={5}>
          <p>{translate('Description')}</p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{translate('HSN/SAC code')}</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>{translate('Quantity')}</p>{' '}
        </Col>
        <Col className="gutter-row" span={5}>
          <p>{translate('Price')}</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>{translate('Total')}</p>
        </Col>
      </Row>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow
                key={field.key}
                remove={remove}
                field={field}
                current={current}
                currency={invoiceCurrency}
              />
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                {translate('Add field')}
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider dashed />
      <div style={{ position: 'relative', width: ' 100%', float: 'right' }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={5}>
            <Form.Item>
              <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                {translate('Save')}
              </Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4} offset={10}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'right',
              }}
            >
              {translate('Sub Total')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={subTotal} currency={invoiceCurrency} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col span={4} offset={15}>
            <Form.Item name="cgstRate">
              <SelectAsync
                entity={'taxes'}
                outputValue="taxValue"
                displayLabels={['taxName', 'taxValue']}
                filterField="taxType"
                filterValue="CGST"
                onChange={(val) => setCgstRate((val || 0) / 100)}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder="Select CGST"
                customLabelRender={(record) =>
                  `${record.taxType?.toUpperCase()}(${record.taxValue}%)`
                }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <MoneyInputFormItem readOnly value={cgstAmount} currency={invoiceCurrency} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col span={4} offset={15}>
            <Form.Item name="sgstRate">
              <SelectAsync
                entity={'taxes'}
                outputValue="taxValue"
                displayLabels={['taxName', 'taxValue']}
                filterField="taxType"
                filterValue="SGST"
                onChange={(val) => setSgstRate((val || 0) / 100)}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder="Select SGST"
                customLabelRender={(record) =>
                  `${record.taxType?.toUpperCase()}(${record.taxValue}%)`
                }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <MoneyInputFormItem readOnly value={sgstAmount} currency={invoiceCurrency} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col span={4} offset={15}>
            <Form.Item name="igstRate">
              <SelectAsync
                entity={'taxes'}
                outputValue="taxValue"
                displayLabels={['taxName', 'taxValue']}
                filterField="taxType"
                filterValue="IGST"
                onChange={(val) => setIgstRate((val || 0) / 100)}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder="Select IGST"
                customLabelRender={(record) =>
                  `${record.taxType?.toUpperCase()}(${record.taxValue}%)`
                }
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <MoneyInputFormItem readOnly value={igstAmount} currency={invoiceCurrency} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col span={4} offset={15}>
            <p style={{ textAlign: 'right' }}>Total Tax :</p>
          </Col>
          <Col span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} currency={invoiceCurrency} />
          </Col>
        </Row>
        <Row gutter={[12, -5]}>
          <Col span={4} offset={15}>
            <p style={{ textAlign: 'right' }}>Total :</p>
          </Col>
          <Col span={5}>
            <MoneyInputFormItem readOnly value={total} currency={invoiceCurrency} />
          </Col>
        </Row>
        {/* <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <SelectAsync
                value={taxRate}
                onChange={handelTaxChange}
                entity={'taxes'}
                outputValue={'taxValue'}
                displayLabels={['taxName']}
                withRedirect={true}
                urlToRedirect="/taxes"
                redirectLabel={translate('Add New Tax')}
                placeholder={translate('Select Tax Value')}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={taxTotal} />
          </Col>
        </Row> */}
        {/* <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={4} offset={15}>
            <p
              style={{
                paddingLeft: '12px',
                paddingTop: '5px',
                margin: 0,
                textAlign: 'right',
              }}
            >
              {translate('Total')} :
            </p>
          </Col>
          <Col className="gutter-row" span={5}>
            <MoneyInputFormItem readOnly value={total} />
          </Col>
        </Row> */}
      </div>
    </>
  );
}
