export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
}
