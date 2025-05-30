import Login from "@/pages/auth/views/Login";
import Dashboard from "@/pages/dashboard/Index";
import NotFound from "@/pages/NotFound";
import { Navigate } from "react-router-dom";

export const coreNavigation = [
  { path: "/", element: <Navigate to="/login" replace /> },
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "*", element: <NotFound /> },
];
