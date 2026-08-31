export async function simulateRequest<T>(data: T, delayMs = 280): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, delayMs));
  return data;
}
