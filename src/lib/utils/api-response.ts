export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function errorResponse(error: string, message?: string): ApiResponse {
  return {
    success: false,
    error,
    message,
  }
}

export function handleApiError(error: unknown): Response {
  console.error("API Error:", error)

  if (error instanceof Error) {
    return Response.json(errorResponse(error.message), { status: 500 })
  }

  return Response.json(errorResponse("Internal server error"), { status: 500 })
}
