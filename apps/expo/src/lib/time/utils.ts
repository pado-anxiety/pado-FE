export const formatToYYYYMMDD = (dateStr: string) => {
  return dateStr.split('T')[0].replace(/-/g, '');
};

export const formatToLocaleDate = (
  dateStr: string,
  locale: string = 'en-US', // 기본값은 미국식
): string => {
  if (!dateStr || dateStr.length !== 8) return dateStr;

  const year = parseInt(dateStr.slice(0, 4), 10);
  const month = parseInt(dateStr.slice(4, 6), 10) - 1; // JS Month는 0부터 시작
  const day = parseInt(dateStr.slice(6, 8), 10);

  const date = new Date(year, month, day);

  // Intl API를 사용하여 국가별 포맷 적용
  return new Intl.DateTimeFormat(locale, {
    month: 'short', // 'Jan' 또는 '1월'
    day: 'numeric',
    // 연도가 필요 없다면 생략 가능
  }).format(date);
};
