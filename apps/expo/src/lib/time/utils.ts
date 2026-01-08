export const formatToYYYYMMDD = (dateStr: string) => {
  return dateStr.split('T')[0].replace(/-/g, '');
};

export const formatToKoreanDate = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 8) {
    return dateStr;
  }

  const month = parseInt(dateStr.slice(4, 6), 10);
  const day = parseInt(dateStr.slice(6, 8), 10);

  return `${month}월 ${day}일`;
};
