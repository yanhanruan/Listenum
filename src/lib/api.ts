// lib/api.ts

/**
 * Defines the available HTTP methods.
 */
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Extends the native `RequestInit` type.
 * It allows the `body` to be any type for automatic JSON stringification
 * and adds a `params` object for URL query string generation.
 * The native `signal` for AbortController is already part of `RequestInit`.
 */
interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number>;
}

// Use environment variables for a flexible API base URL.
// Fallback to "/api" for local development if the variable is not set.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * The core request function. It's not exported and serves as the foundation
 * for the simplified `api` object methods.
 * @param url The API endpoint path (e.g., "/users").
 * @param method The HTTP method.
 * @param options The request configuration.
 * @returns A promise that resolves with the parsed JSON response.
 */
async function coreRequest<T>(
  url: string,
  method: HttpMethod,
  options: RequestOptions = {}
): Promise<T> {
  const { body, params, headers: customHeaders, ...rest } = options;

  // 1. Construct the full URL with query parameters.
  const queryString = params
    ? "?" + new URLSearchParams(Object.entries(params).map(([k, v]) => [k, String(v)])).toString()
    : "";
  const fullUrl = `${API_BASE_URL}${url}${queryString}`;

  // 2. Configure request headers.
  const headers = new Headers({
    "Content-Type": "application/json",
    ...customHeaders,
  });

  // 3. Automatically attach the JWT token.
  //    This assumes the token is stored in localStorage.
  const token = localStorage.getItem("authToken");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  // 4. Make the fetch request.
  let response: Response;
  try {
    response = await fetch(fullUrl, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...rest, // Pass through other options like `signal` for cancellation.
    });
  } catch (error) {
    // Handle network errors or requests that couldn't be sent.
    console.error("Fetch Error:", error);
    throw new Error("Network request failed. Please try again later.");
  }
  
  // 5. Handle the 401 Unauthorized special case.
  if (response.status === 401) {
    // Here you can implement global unauthorized logic,
    // such as clearing user data and redirecting to the login page.
    console.error("Authentication failed. Please log in again.");
    // localStorage.removeItem("authToken");
    // window.location.href = "/login";
    throw new Error("Authentication failed. Please log in again.");
  }

  // 6. Handle other non-successful HTTP status codes.
  if (!response.ok) {
    let errorMessage = `API Error: ${response.status} ${response.statusText}`;
    try {
      // Try to parse a JSON error response from the backend.
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch {
      // Fallback to the status text if the response is not JSON.
    }
    console.error(errorMessage);
    throw new Error(errorMessage);
  }

  // 7. Handle successful responses.
  // For 204 No Content responses, the body is empty, so we return null.
  if (response.status === 204) {
    return null as T;
  }
  
  return response.json();
}

// ===================================================================
// EXPORTED API OBJECT
// Provides clean, semantic methods for making API calls.
// ===================================================================

export const api = {
  get: <T>(url: string, params?: Record<string, string | number>, options: RequestOptions = {}) => {
    return coreRequest<T>(url, "GET", { ...options, params });
  },

  post: <T>(url:string, body?: any, options: RequestOptions = {}) => {
    return coreRequest<T>(url, "POST", { ...options, body });
  },

  put: <T>(url: string, body?: any, options: RequestOptions = {}) => {
    return coreRequest<T>(url, "PUT", { ...options, body });
  },

  delete: <T>(url: string, options: RequestOptions = {}) => {
    return coreRequest<T>(url, "DELETE", options);
  },
};

// ===================================================================
// EXAMPLE USAGE
// Defines specific API endpoints for the application.
// ===================================================================

/**
 * Logs a practice session.
 * @param duration The duration of the practice in minutes.
 */
export function logPractice(duration: number) {
  return api.post<{ success: boolean }>("/practice", { duration });
}

/**
 * Fetches practice statistics.
 */
export function getPracticeStats() {
  return api.get<{ totalSessions: number; totalTime: number }>("/practice/stats");
}

/**
 * Fetches the current user's profile.
 * Example with request cancellation:
 * ```
 * const controller = new AbortController();
 * getUserProfile({ signal: controller.signal })
 * .then(data => console.log(data))
 * .catch(err => {
 * if (err.name === 'AbortError') {
 * console.log('Fetch aborted');
 * }
 * });
 * // To cancel:
 * // controller.abort();
 * ```
 * @param options Optional request options, e.g., a signal for cancellation.
 */
export function getUserProfile(options: RequestOptions = {}) {
  return api.get<{ id: string; name: string; email: string }>("/user/profile", undefined, options);
}