import { BaseResponse } from "../types/BaseType";
import {
  CreateHintTypeRequest,
  CreateHintTypeResponse,
  DeleteHintTypeRequest,
  DeleteHintTypeResponse,
} from "../types/HintTypeInterfaces";
import { CREATE_HINT_TYPE_URL, DELETE_HINT_TYPE_URL } from "../url";

export const createHintType = async (
  request: CreateHintTypeRequest
): Promise<BaseResponse<CreateHintTypeResponse | null>> => {
  try {
    const response = await fetch(CREATE_HINT_TYPE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Always parse the response, even for error status codes
    const data = await response.json();

    // Don't throw for 4xx/5xx - let the component handle the BaseResponse
    return data;
  } catch (error) {
    // Only handle network/JSON parsing errors
    return {
      statusCode: -1,
      message:
        error instanceof Error ? error.message : "Network error occurred",
      data: null,
    };
  }
};

export const deleteHintType = async (
  request: DeleteHintTypeRequest
): Promise<BaseResponse<DeleteHintTypeResponse | null>> => {
  try {
    const response = await fetch(DELETE_HINT_TYPE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    // Always parse the response, even for error status codes
    const data = await response.json();

    // Don't throw for 4xx/5xx - let the component handle the BaseResponse
    return data;
  } catch (error) {
    // Only handle network/JSON parsing errors
    return {
      statusCode: -1,
      message:
        error instanceof Error ? error.message : "Network error occurred",
      data: null,
    };
  }
};
