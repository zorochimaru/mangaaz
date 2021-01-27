import { createContext, Dispatch, useContext } from "react";
import { User } from "../models/User.model";

export type UserFactory = {
    user: User | null,
    setUser: Dispatch<any>
};

export const UserContext = createContext<UserFactory>(
    {
        user: null,
        setUser: () => { }
    }
);
export const useUser = () => useContext(UserContext);