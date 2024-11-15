import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Login_01 } from "@/components/loginpage"; 
import { SignUp } from "@/components/signuppage"; // Import SignUp component
import { ForgotPassword } from "@/components/ForgotPassword";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore"; // Import the Zustand store
import { Settings } from "@/components/Settings";
import { Profiles } from "@/components/Profiles";
import { Home } from "@/components/Home";
import { AnimatedGridPattern } from "@/components/ui/animatedbackground";
import { cn } from "@/lib/utils";

function Main() {
  // Use Zustand store to manage authentication state
  const { isLoggedIn, isGuest, login, continueAsGuest } = useAuthStore();

  // Check if the user is logged in or guest when the app loads
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    const savedGuestStatus = localStorage.getItem("isGuest");
    
    if (savedLoginStatus === "true") {
      const email = localStorage.getItem("email");
      const profileImage = localStorage.getItem("profileImage");
      if (email && profileImage) {
        login(email, profileImage);
      }
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
                <App  />
              ) : (
                <Login_01
                   // Use the Zustand guest method
                />
              )}
            />
            
            {/* Route for SignUp page */}
            <Route path="/signup" element={<SignUp />} />
            <Route  path="/login" element={<Login_01/>} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
        <Toaster />

      </ThemeProvider>
      <AnimatedGridPattern
    numSquares={30}
    maxOpacity={0.1}
    duration={3}
    repeatDelay={1}
    className={cn(
      "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
      "inset-x-0 inset-y-[-30%] skew-y-12",
    )}
  />
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Main />
);
