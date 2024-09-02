import { Dispatch, SetStateAction } from "react";

export interface UserExists {
    userExists: boolean
}

export interface UserInfo {
    id: number,
    email: string,
    picture: string,
    diet: string[],
    allergies: string[],
    completedRecipeCount: number
}

export interface UserContextProps {
    activeUser: UserInfo;
    setActiveUser: Dispatch<SetStateAction<UserInfo>>;
}

export interface UserData {
    userExists: boolean,
    userData: UserInfo
}