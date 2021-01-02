import { createContext, useContext } from "react";
import { User, UserContextType } from "../models/User.model";


export const UserContext = createContext<any>({ user: null, setUser: (user: User) => console.warn('no user provider') });
export const useUser = () => useContext(UserContext);