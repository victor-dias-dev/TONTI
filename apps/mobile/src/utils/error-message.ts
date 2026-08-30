import { isAxiosError } from 'axios';
import { strings } from '../constants/strings';

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (typeof data === 'object' && data !== null && 'message' in data) {
      const message = data.message;
      if (typeof message === 'string' && message.length > 0) {
        return message;
      }
    }
  }

  if (error instanceof Error && error.message.length > 0) {
    return error.message;
  }

  return strings.errors.generic;
}
