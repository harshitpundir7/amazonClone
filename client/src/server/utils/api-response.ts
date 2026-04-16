interface SuccessPayload {
  statusCode: number;
  message: string;
  data?: unknown;
}

export function successResponse({ statusCode, message, data }: SuccessPayload) {
  return {
    status: 'success',
    message,
    ...(data !== undefined && { data }),
  };
}
