import CrudModule from '@/modules/CrudModule/CrudModule';
import DynamicForm from '@/forms/DynamicForm';
import { fields } from './config';
import useLanguage from '@/locale/useLanguage';

export default function Attendance() {
  const translate = useLanguage();
  const entity = 'attendance';

  const searchConfig = {
    displayLabels: ['name'],
    searchFields: 'name',
  };

  const deleteModalLabels = ['name'];

  const Labels = {
    PANEL_TITLE: translate('attendance'),
    DATATABLE_TITLE: translate('attendance_list'),
    ADD_NEW_ENTITY: translate('add_new_attendance'),
    ENTITY_NAME: translate('attendace'),
  };

  const config = {
    entity,
    ...Labels,
    fields,
    searchConfig,
    deleteModalLabels,
  };

  return (
    <CrudModule
      createForm={<DynamicForm fields={fields} />}
      updateForm={<DynamicForm fields={fields} isUpdateForm />}
      config={config}
    />
  );
}
