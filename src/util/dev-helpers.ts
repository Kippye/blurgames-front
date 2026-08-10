import type { IResultObject } from '@/types/IResultObject';

export async function mockRequest<T>(
  result: IResultObject<T>,
  delay_ms: number = 1000,
): Promise<IResultObject<T>> {
  await new Promise((resolve) => setTimeout(resolve, delay_ms));
  return result;
}
