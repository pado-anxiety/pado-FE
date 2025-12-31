export function safeStringify<T>(data: T): string {
  try {
    return JSON.stringify(data, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  } catch (error) {
    if (!(error instanceof Error)) throw error;

    console.error('JSON 변환 실패:', error.message);

    return JSON.stringify({
      error: 'Data could not be serialized',
      message: error.message,
    });
  }
}
