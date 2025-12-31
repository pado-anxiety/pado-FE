export const parseJSON = (data: string, errorHandler: () => void) => {
  try {
    const parsedData = JSON.parse(data);
    return parsedData;
  } catch {
    errorHandler();
  }
};
