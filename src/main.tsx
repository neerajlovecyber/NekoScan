import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Login_01 } from "@/components/loginpage"; 
import { SignUp } from "@/components/signuppage"; // Import SignUp component

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore"; // Import the Zustand store

function Main() {
  // Use Zustand store to manage authentication state
  const { isLoggedIn, isGuest, login, continueAsGuest, logout } = useAuthStore();

  // Check if the user is logged in or guest when the app loads
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    const savedGuestStatus = localStorage.getItem("isGuest");
    
    if (savedLoginStatus === "true") {
      login();
    } else if (savedGuestStatus === "true") {
      continueAsGuest();
    }
  }, [login, continueAsGuest]);

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Route for the home page (either login or app based on auth state) */}
            <Route 
              path="/" 
              element={isLoggedIn || isGuest ? (
                <App onLogout={logout} />
              ) : (
                <Login_01
                  onLogin={login} // Use the Zustand login method
                  onContinueAsGuest={continueAsGuest} // Use the Zustand guest method
                />
              )}
            />
            
            {/* Route for SignUp page */}
            <Route path="/signup" element={<SignUp onSignUp={() => {}} />} />
            <Route  path="/login" element={<Login_01 onLogin={login} onContinueAsGuest={continueAsGuest} />} />
          </Routes>
        </Router>
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
