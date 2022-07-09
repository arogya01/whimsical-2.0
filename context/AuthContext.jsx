import { createContext, useContext } from "react";

export const AuthContext = createContext({ user: null, username: null });

// export default function AuthContextProvider({ children }) {
//   return (
//     <AuthContext.Provider value={{ user: null, username: "arogya" }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

export const useAuth = () => {
  return useContext(AuthContext);
};
