import { createContext } from "react";

interface IMealsContext {
  contextData: string[],
  setContextData: React.Dispatch<React.SetStateAction<string[]>>
}

export const MealsContext = createContext<IMealsContext>({} as IMealsContext);