export interface HintType {
  type: string;
  displayName: string;
}

export interface CreateHintTypeRequest {
  type: string;
  displayName: string;
}

export interface UpdateHintTypeRequest {
  currentType: string;
  updatedType: string;
  updatedDisplayName: string;
}

export interface DeleteHintTypeRequest {
  type: string;
}

export interface ReactivateHintTypeRequest {
  type: string;
}

export interface CreateHintTypeResponse {
  type: string;
  displayName: string;
}

export interface UpdateHintTypeResponse {
  oldHintType: HintType;
  updatedHintType: HintType;
}

export interface DeleteHintTypeResponse {
  type: string;
  displayName: string;
}

export interface ReactivateHintTypeResponse {
  type: string;
  displayName: string;
}
