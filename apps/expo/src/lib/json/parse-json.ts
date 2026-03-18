type ParseResult<T> = { ok: true; data: T } | { ok: false; error: string };

export const parseJSON = <T = unknown>(data: string): ParseResult<T> => {
  try {
    const parsedData = JSON.parse(data);
    return { ok: true, data: parsedData };
  } catch {
    return { ok: false, error: 'JSON 파싱에 실패했습니다.' };
  }
};
