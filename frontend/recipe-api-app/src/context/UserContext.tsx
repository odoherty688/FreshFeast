import { createContext } from "react";
import { UserContextProps } from "../interfaces/UserInfo";

const UserContext = createContext<UserContextProps | null>(null);

export default UserContext;
