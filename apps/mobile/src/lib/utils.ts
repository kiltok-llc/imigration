export async function raiseStatus<T extends Response>(res: T) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
  }
  return res;
}

export async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
