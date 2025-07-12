export const unwrap = <T>({
  data,
  error,
}: {
  data: null | T;
  error: unknown;
}): T => {
  if (data === null || error) {
    throw error;
  }
  return data;
};

export async function raiseStatus<T extends Response>(res: T) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
  }
  return res;
}
