const useDate = ({ settings }) => {
  const { tsn_app_date_format } = settings;

  const dateFormat = tsn_app_date_format;

  return {
    dateFormat,
  };
};

module.exports = useDate;
