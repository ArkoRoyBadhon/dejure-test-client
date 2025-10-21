import { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";

// Create context
const SocketContext = createContext(undefined);

// Custom hook
export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

// Provider
export const SocketContextProvider = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const socketInstance = io(
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000",
        // "http://localhost:5000",
        {
          query: { userId: user._id },
          transports: ["websocket", "polling"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
        }
      );

      socketInstance.on("connect_error", (err) => {});

      socketInstance.on("disconnect", () => {});

      setSocket(socketInstance);

      return () => {
        socketInstance.close();
      };
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
