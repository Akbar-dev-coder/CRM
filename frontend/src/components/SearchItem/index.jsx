import { useState, useEffect, useRef } from 'react';

import useDebounce from '@/hooks/useDebounce';

import { Select, Empty } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

import { useCrudContext } from '@/context/crud';
import { selectSearchedItems } from '@/redux/crud/selectors';

function SearchItemComponent({ config, onRerender }) {
  let { entity, searchConfig } = config;
  console.log(' SearchItemComponent - Config:', config);
  console.log(' SearchItemComponent - Entity:', entity);
  console.log(' SearchItemComponent - SearchConfig:', searchConfig);
  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;
  console.log(' SearchItemComponent - DisplayLabels:', displayLabels);
  console.log(' SearchItemComponent - SearchFields:', searchFields);
  console.log(' SearchItemComponent - OutputValue:', outputValue);
  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);
  console.log('SearchItemComponent - Redux State:', { result, isLoading, isSuccess });

  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const isSearching = useRef(false);

  const [searching, setSearching] = useState(false);

  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const [, cancel] = useDebounce(
    () => {
      console.log('Debounce triggered with value:', valToSearch);
      setDebouncedValue(valToSearch);
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    console.log('useEffect triggered - debouncedValue:', debouncedValue);
    if (debouncedValue != '') {
      const options = {
        q: debouncedValue,
        fields: searchFields,
      };
      console.log(' Dispatching search with options:', options);
      console.log(' Entity for search:', entity);
      dispatch(crud.search({ entity, options }));
    }
    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText) => {
    console.log('onSearch called with:', searchText);
    if (searchText && searchText != '') {
      isSearching.current = true;
      setSearching(true);
      setOptions([]);
      setCurrentValue(undefined);
      setValToSearch(searchText);
      console.log('Search state updated');
    }
  };

  const onSelect = (data) => {
    console.log('onSelect called with data:', data);
    console.log('Available results:', result);
    const currentItem = result.find((item) => {
      console.log('Comparing:', item[outputValue], 'with', data);
      return item[outputValue] === data;
    });
    console.log('Selected item:', currentItem);
    dispatch(crud.currentItem({ data: currentItem }));

    panel.open();
    collapsedBox.open();
    readBox.open();
    onRerender();
  };
  useEffect(() => {
    console.log('Search result useEffect - isSearching.current:', isSearching.current);
    console.log('Search result useEffect - isSuccess:', isSuccess);
    console.log('Search result useEffect - result:', result);
    if (isSearching.current) {
      if (isSuccess) {
        setOptions(result);
      } else {
        setSearching(false);
        setCurrentValue(undefined);
        setOptions([]);
      }
    }
  }, [isSuccess, result]);

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={<SearchOutlined style={{ float: 'right', padding: '8px 0' }} />}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      style={{ width: '100%' }}
      onSelect={onSelect}
    >
      {selectOptions.map((optionField) => (
        <Select.Option key={optionField[outputValue]} value={optionField[outputValue]}>
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}

export default function SearchItem({ config }) {
  const [state, setState] = useState([0]);

  const onRerender = () => {
    setState([state + 1]);
  };

  return state.map((comp) => (
    <SearchItemComponent key={comp} config={config} onRerender={onRerender} />
  ));
}
