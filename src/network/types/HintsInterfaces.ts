export interface GetHintRequest {
  userId: number;
  hintType: string;
}

export interface GetHintResponse {
  hintText: string;
}
