const useAppSettings = () => {
  let settings = {};
  settings['tsn_app_email'] = 'noreply@tsnapp.com';
  settings['tsn_base_url'] = 'https://cloud.tsnapp.com';
  return settings;
};

module.exports = useAppSettings;
