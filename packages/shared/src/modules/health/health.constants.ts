import { API_PREFIX } from '../../constants/api.constants.js';

export const API_HEALTH_PATH = `${API_PREFIX}/health`;
export const API_READINESS_PATH = `${API_HEALTH_PATH}/ready`;
