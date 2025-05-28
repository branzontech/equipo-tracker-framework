import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice"; 
import storage from "redux-persist/lib/storage"; 
import { persistStore, persistReducer } from "redux-persist";

// Persistence configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Persistor for the store
export const persistor = persistStore(store);

// Export types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
// Export the AppDispatch type for use in dispatching actions
export type AppDispatch = typeof store.dispatch;
