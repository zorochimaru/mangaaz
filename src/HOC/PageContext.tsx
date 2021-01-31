import { createContext, Dispatch, useContext } from "react";
import { ChapterPage } from "../models/ChapterPage.model";


export type PageFactory = {
    page: ChapterPage | null,
    setPage: Dispatch<any>
};

export const PageContext = createContext<PageFactory>(
    {
        page: null,
        setPage: () => { }
    }
);
export const usePage = () => useContext(PageContext);