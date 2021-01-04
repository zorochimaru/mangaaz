import { createContext, useContext } from "react";


export const UserContext = createContext<any>(
    {
        user: null,
        setUser: () => {}
    }
);
export const useUser = () => useContext(UserContext);