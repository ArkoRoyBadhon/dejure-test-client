"use client";
import { persistor, store } from "@/redux/store";
import { Suspense, useEffect } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { SocketContextProvider } from "./SocketContextProvider";

const ReduxProvider = ({ children }) => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.location.hostname !== "localhost"
    ) {
      const handleRightClick = (e) => {
        e.preventDefault();
      };

      document.addEventListener("contextmenu", handleRightClick);

      return () => {
        document.removeEventListener("contextmenu", handleRightClick);
      };
    }
  }, []);

  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <SocketContextProvider>
          <Toaster position="top-center" richColors={true} />
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </SocketContextProvider>
      </Suspense>
    </Provider>
  );
};

export default ReduxProvider;
