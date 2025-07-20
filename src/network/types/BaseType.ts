export interface BaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export enum ResponseStatus {
  SUCCESS = 0,
  FAILURE = 1,
}
