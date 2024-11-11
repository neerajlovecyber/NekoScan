import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth"; 
import { auth } from "@/firebaseConfig"; 
import { useAuthStore } from "@/store/useAuthStore"; // Import Zustand store

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook for navigation
  const login = useAuthStore.getState().login; // Access Zustand's login method

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      login(); // Mark the user as logged in using Zustand
      navigate("/"); // Navigate to the dashboard or home page
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in with Google:", user);
      login(); // Mark the user as logged in using Zustand
      navigate("/"); // Navigate to the dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  // GitHub login handler
  const handleGitHubLogin = async () => {
    const provider = new GithubAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in with GitHub:", user);
      login(); // Mark the user as logged in using Zustand
      navigate("/dashboard"); // Navigate to the dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
          <CardDescription>
            Create an account by entering your email below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Email Input */}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            {/* Error message display */}
            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Sign Up
            </Button>

            {/* Google Login Button */}
            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
              Sign Up with Google
            </Button>

            {/* GitHub Login Button */}
            <Button variant="outline" className="w-full" onClick={handleGitHubLogin}>
              Sign Up with GitHub
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
