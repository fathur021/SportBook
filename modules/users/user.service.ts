import { findUserById, findUsers, updateUserRoleById } from "./user.repository";
import type { UserListQuery } from "./user.schema";

export class UserNotFoundError extends Error {
  constructor() {
    super("User Tidak di Temukan");
  }
}

export class CannotChangeOwnRoleError extends Error {
  constructor() {
    super("Tidak bisa mengubah role akun sendiri");
    this.name = "CannotChangeOwnRoleError";
  }
}

function toDateKey(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
function mapUser(user: {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: Date;
  _count: { bookings: number };
  sessions: { updatedAt: Date }[];
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    emailVerified: user.emailVerified,
    joinedAt: toDateKey(user.createdAt),
    bookingsCount: user._count.bookings,
    lastActiveAt: user.sessions[0]?.updatedAt.toISOString() ?? null,
  };
}

export async function listUsersService(filter:UserListQuery){
    const user = await findUsers(filter);
    return user.map(mapUser)
}

export async function updateUserRoleService({
    userId,
    role,
    actorUserId,
}: {
    userId:string,
    role:string,
    actorUserId:string
}){
    if(userId === actorUserId){
        throw new CannotChangeOwnRoleError();
    }
    const existing = await findUserById(userId);
    if(!existing){
        throw new UserNotFoundError()
    }
    const update = await updateUserRoleById(userId, role)
    return mapUser(update)

}