export const parseJSON = (data: string, errorHandler: () => void) => {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch {
    errorHandler();
    return { errorMessage: 'JSON 파싱에 실패했습니다.' };
  }
};
