import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Cookies from "js-cookie";
import { Toaster } from "sonner";
import "./styles/index.css";

// Import the userId from cookies
const userId = Cookies.get("userId");

// Create the root element for the React application
const root = ReactDOM.createRoot(document.getElementById("root")!);

// Render the application
root.render(
  // Wrap the entire app in Redux's Provider to give access to the store
  <Provider store={store}>
    {
      // Check if the userId cookie exists (meaning the user has logged in before)
      userId ? (
        // If the user is logged in, use PersistGate to rehydrate Redux state from storage
        // This allows redux-persist to restore the auth state (e.g., the logged-in user)
        <PersistGate loading={null} persistor={persistor}>
          <App />
          {/* <Toaster richColors position="top-right" /> */}
        </PersistGate>
      ) : (
        // If the user is NOT logged in, skip redux-persist to avoid hydration errors
        // The App will render normally without loading persisted auth state
        <>
          {/* // If the user is NOT logged in, skip redux-persist to avoid hydration
          errors // The App will render normally without loading persisted auth
          state */}
          <App />
          {/* <Toaster richColors position="top-right" /> */}
        </>
      )
    }
  </Provider>
);
