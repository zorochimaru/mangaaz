export enum Roles {
    'ADMIN' = 'ADMIN',
    'MODERATOR' = 'MODERATOR',
    'READER' = 'READER',
}
export interface User {
    googleId: string,
    name: string,
    img: string,
    email: string,
    tokenObj: any,
    role?: Roles,
}
export interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}