export interface User {
    name: string,
    img: string
}
export interface UserContextType  {
    user: User | null;
    setUser: (user: User) => void;
}