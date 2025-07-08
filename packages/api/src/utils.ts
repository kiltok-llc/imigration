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
