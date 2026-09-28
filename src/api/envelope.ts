import type { AxiosResponse } from "axios";

export interface Envelope<T> {
  data: T;
}

export async function unwrap<T>(promise: Promise<AxiosResponse<Envelope<T>>>): Promise<T> {
  const res = await promise;
  return res.data.data;
}
