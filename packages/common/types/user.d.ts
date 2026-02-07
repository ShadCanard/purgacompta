export declare enum UserRole {
    GUEST = "GUEST",
    MEMBER = "MEMBER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN",
    OWNER = "OWNER"
}
export interface UserData {
    firstName?: string;
    lastName?: string;
    alias?: string;
    balance?: number;
    maxBalance?: number;
    isOnline?: boolean;
    manageTablet?: boolean;
    tabletUsername?: string;
    phone?: string;
}
export interface User {
    id: string;
    discordId: string;
    username: string;
    email?: string;
    avatar?: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
    data?: UserData;
}
//# sourceMappingURL=user.d.ts.map