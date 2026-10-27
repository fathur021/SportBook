import { auth } from "@/lib/auth";

export function getRequestSession(request: Request) {
  return auth.api.getSession({
    headers: request.headers,
  });
}