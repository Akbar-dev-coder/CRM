import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import { generate as uniqueId } from 'shortid';
import color from '@/utils/color';
import useLanguage from '@/locale/useLanguage';

// const SelectAsync = ({
//   entity,
//   displayLabels = ['name'],
//   outputValue = '_id',
//   redirectLabel = '',
//   withRedirect = false,
//   urlToRedirect = '/',
//   placeholder = 'select',
//   value,
//   onChange,
// }) => {
//   const translate = useLanguage();
//   const [selectOptions, setOptions] = useState([]);
//   const [currentValue, setCurrentValue] = useState(undefined);

//   const navigate = useNavigate();

//   const asyncList = () => {
//     return request.list({ entity });
//   };
//   const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
//   useEffect(() => {
//     isSuccess && setOptions(result);
//   }, [isSuccess]);

//   const labels = (optionField) => {
//     return displayLabels.map((x) => optionField[x]).join(' ');
//   };
//   useEffect(() => {
//     if (value !== undefined) {
//       const val = value?.[outputValue] ?? value;
//       setCurrentValue(val);
//       onChange(val);
//     }
//   }, [value]);

//   const handleSelectChange = (newValue) => {
//     if (newValue === 'redirectURL') {
//       navigate(urlToRedirect);
//     } else {
//       const val = newValue?.[outputValue] ?? newValue;
//       setCurrentValue(newValue);
//       onChange(val);
//     }
//   };

//   const optionsList = () => {
//     const list = [];

//     // if (selectOptions.length === 0 && withRedirect) {
//     //   const value = 'redirectURL';
//     //   const label = `+ ${translate(redirectLabel)}`;
//     //   list.push({ value, label });
//     // }
//     selectOptions.map((optionField) => {
//       const value = optionField[outputValue] ?? optionField;
//       const label = labels(optionField);
//       const currentColor = optionField[outputValue]?.color ?? optionField?.color;
//       const labelColor = color.find((x) => x.color === currentColor);
//       list.push({ value, label, color: labelColor?.color });
//     });

//     return list;
//   };

//   return (
//     <Select
//       loading={fetchIsLoading}
//       disabled={fetchIsLoading}
//       value={currentValue}
//       onChange={handleSelectChange}
//       placeholder={placeholder}
//     >
//       {optionsList()?.map((option) => {
//         return (
//           <Select.Option key={`${uniqueId()}`} value={option.value}>
//             <Tag bordered={false} color={option.color}>
//               {option.label}
//             </Tag>
//           </Select.Option>
//         );
//       })}
//       {withRedirect && (
//         <Select.Option value={'redirectURL'}>{`+ ` + translate(redirectLabel)}</Select.Option>
//       )}
//     </Select>
//   );
// };

const SelectAsync = ({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
  placeholder = 'select',
  value,
  onChange,
  filterField,
  filterValue,
  customLabelRender,
}) => {
  const translate = useLanguage();
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const navigate = useNavigate();

  const asyncList = () => request.list({ entity });
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);

  useEffect(() => {
    if (isSuccess) {
      console.log('Fetched employee list:', result);
      const filtered =
        filterField && filterValue ? result.filter((r) => r[filterField] === filterValue) : result;
      setOptions(filtered);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (value) {
      setCurrentValue(typeof value === 'string' ? value : value._id);
    }
  }, [value]);

  const handleSelectChange = (selectedId) => {
    console.log('Selected employee ID:', selectedId);
    if (selectedId === 'redirectURL') {
      navigate(urlToRedirect);
    } else {
      const rec = selectOptions.find((x) => x._id === selectedId);
      setCurrentValue(selectedId);

      onChange?.(outputValue === '_id' ? rec._id : rec[outputValue]);
    }
  };

  return (
    <Select
      loading={fetchIsLoading}
      value={currentValue}
      onChange={handleSelectChange}
      placeholder={placeholder}
      disabled={fetchIsLoading}
    >
      {selectOptions.map((option) => {
        const label = customLabelRender
          ? customLabelRender(option)
          : displayLabels.map((x) => option[x]) || 'no label'.join(' ') || 'no label';
        const tagColor = color.find((c) => c.color === option.color)?.color;
        return (
          <Select.Option key={option._id} value={option._id}>
            <Tag bordered={false} color={tagColor}>
              {label}
            </Tag>
          </Select.Option>
        );
      })}
      {withRedirect && (
        <Select.Option value="redirectURL">{`+ ${translate(redirectLabel)}`}</Select.Option>
      )}
    </Select>
  );
};

export default SelectAsync;
