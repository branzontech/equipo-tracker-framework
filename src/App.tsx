import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import Header from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import ProtectedRoute from "@/context/protectedRoutes";
import { allRoutes } from "@/navigation";

const queryClient = new QueryClient();

const App = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* <Toaster />
        <Sonner /> */}
        <BrowserRouter>
          <Routes>
            {allRoutes.map(({ path, element }) =>
              path === "/login" ? (
                <Route key={path} path={path} element={element} />
              ) : path === "/" || path === "*" ? (
                <Route key={path} path={path} element={element} />
              ) : (
                <Route
                  key={path}
                  path={path}
                  element={
                    <ProtectedRoute>
                      <div className="h-screen flex">
                        <div className="fixed left-0 top-0 h-screen">
                          <Sidebar
                            isCollapsed={isCollapsed}
                            onToggle={setIsCollapsed}
                          />
                        </div>
                        <div
                          className={`flex-1 flex flex-col ${
                            isCollapsed ? "ml-16" : "ml-64"
                          }`}
                        >
                          <Header className="sticky top-0 z-10" />
                          <main className="flex-1 p-6 overflow-auto">
                            {element}
                          </main>
                        </div>
                      </div>
                    </ProtectedRoute>
                  }
                />
              )
            )}
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;