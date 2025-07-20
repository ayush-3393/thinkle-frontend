export const host = "localhost";
export const backendPort = 8080;

export const API_BASE_URL = `http://${host}:${backendPort}`;

export const CREATE_HINT_TYPE_URL = `${API_BASE_URL}/hint-types/create`;
export const DELETE_HINT_TYPE_URL = `${API_BASE_URL}/hint-types/delete`;
export const REACTIVATE_HINT_TYPE_URL = `${API_BASE_URL}/hint-types/re-activate`;
export const UPDATE_HINT_TYPE_URL = `${API_BASE_URL}/hint-types/update`;

export const GET_HINT_URL = `${API_BASE_URL}/hints/get`;

export const CREATE_GAME_SESSION_URL = `${API_BASE_URL}/game/session`;

export const SUBMIT_GUESS_URL = `${API_BASE_URL}/guess/submit`;
