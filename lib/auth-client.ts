// Jembatan ke endpoint auth bawaan Better Auth (/api/auth/*)
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();