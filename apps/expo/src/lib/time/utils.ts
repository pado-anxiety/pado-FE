export const formatToYYYYMMDD = (dateStr: string) => {
  return dateStr.split('T')[0].replace(/-/g, '');
};
