import { createContext } from "react";

// create context
export const credentialsContext = createContext({storedCredentials: {}, setStoredCredentials: ()=>{}});