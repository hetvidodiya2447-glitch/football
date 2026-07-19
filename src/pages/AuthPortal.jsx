import React, { useState } from "react";
import { loginUser, registerUser } from "../services/authService";
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const BLOCKED_EMAIL_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "yopmail.com", "tempmail.com", "10minutemail.com"
]);

const validateEmail = (email) => {
  const formatRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  if (!formatRegex.test(email)) return "Please enter a valid email address.";

  const domain = email.toLowerCase().split("@")[1];
  if (BLOCKED_EMAIL_DOMAINS.has(domain)) {
    return "Disposable email addresses are not allowed.";
  }
  return null;
};

export default function AuthPortal({ onLoginSuccess }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  
  // Input fields for signup
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("guest");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAwaitingEmail, setIsAwaitingEmail] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Developer Admin Backdoor
    if (email.toLowerCase() === "rishisolanki7319@gmail.com" && password === "h24r4s2007@") {
      setSuccess("Developer Admin access granted! Redirecting...");
      const adminUser = {
        id: 'dev_admin',
        name: 'Rishi N Solanki',
        email: email,
        role: 'admin',
        avatar: '👑'
      };
      // Save this special session locally
      localStorage.setItem("dev_admin_session", JSON.stringify(adminUser));
      setTimeout(() => {
        onLoginSuccess(adminUser);
      }, 800);
      return;
    }

    const res = await loginUser(email, password);
    if (res.success) {
      setSuccess("Welcome back! Redirecting...");
      // For login, onLoginSuccess receives the raw user. App.jsx checks the session.
      setTimeout(() => {
        onLoginSuccess(res.user);
      }, 800);
    } else {
      setError(res.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    const res = await registerUser(username, email, password, role);
    if (res.success) {
      setSuccess(res.message); // "Check your email to confirm your account!"
      setIsAwaitingEmail(true);
      // Automatically switch to login mode after a delay
      setTimeout(() => {
        setIsRegisterMode(false);
        setPassword("");
        setConfirmPassword("");
      }, 3000);
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-black text-on-surface flex items-center justify-center relative overflow-hidden px-4 py-8 font-body-md">
      <div className="scanlines"></div>
      
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <Card className="w-full max-w-md p-6 sm:p-8 relative z-10 bg-surface-container-low/75 border-outline-variant/30 rounded-xl">
        
        {/* Logo and Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary-fixed/10 border border-primary-fixed/20 flex items-center justify-center rounded volt-glow mb-4">
             <MapPin className="text-primary-fixed h-6 w-6" />
          </div>
          <h1 className="text-display-sm font-bold italic tracking-widest text-primary-fixed volt-text-glow font-display-lg uppercase mb-1">
            STADIUM BUDDY
          </h1>
          <Badge variant="neutral">
            CLOUD_SECURE_AUTH
          </Badge>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="bg-error/10 border border-error/30 text-error text-xs font-label-caps px-4 py-3 rounded mb-6 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{error.toUpperCase()}</span>
          </div>
        )}
        {success && (
          <div className="bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed volt-text-glow text-xs font-label-caps px-4 py-3 rounded mb-6 flex items-start gap-2">
            <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{success.toUpperCase()}</span>
          </div>
        )}

        {isAwaitingEmail && (
           <div className="bg-primary-fixed/10 border border-primary-fixed/20 text-primary-fixed text-xs font-label-caps px-4 py-3 rounded mb-6 text-center">
             <span>Please check your inbox (and spam folder) for a confirmation link. You must click the link before you can log in.</span>
           </div>
        )}

        {/* Toggle Mode */}
        <div className="flex p-1 bg-surface-container border border-outline-variant/20 rounded mb-8">
          <button
            className={`flex-1 py-2 text-[10px] font-label-caps tracking-wider rounded transition-all ${!isRegisterMode ? 'bg-primary-fixed text-black font-bold volt-glow shadow-sm' : 'text-on-surface-variant/70 hover:text-white'}`}
            onClick={() => { setIsRegisterMode(false); setError(""); setSuccess(""); setIsAwaitingEmail(false); }}
          >
            LOG IN
          </button>
          <button
            className={`flex-1 py-2 text-[10px] font-label-caps tracking-wider rounded transition-all ${isRegisterMode ? 'bg-primary-fixed text-black font-bold volt-glow shadow-sm' : 'text-on-surface-variant/70 hover:text-white'}`}
            onClick={() => { setIsRegisterMode(true); setError(""); setSuccess(""); setIsAwaitingEmail(false); }}
          >
            SIGN UP
          </button>
        </div>

        {/* Forms */}
        <div className="transition-all duration-300">
          {!isRegisterMode ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <Input 
                name="email" 
                placeholder="Email Address" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                name="password" 
                placeholder="Password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" variant="primary" className="w-full mt-6 py-2.5">
                Log In
              </Button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <Input 
                placeholder="Username" 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input 
                name="email" 
                placeholder="Email Address" 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input 
                name="password" 
                placeholder="Password (min 6 chars)" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Input 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="pt-1">
                <select 
                  className="w-full bg-surface-container border border-outline-variant/30 p-2.5 rounded text-xs font-label-caps text-white uppercase focus:border-primary-fixed focus:outline-none transition-colors"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="guest" className="bg-surface">Role: Fan / Guest</option>
                  <option value="staff" className="bg-surface">Role: Field Staff</option>
                </select>
              </div>

              <Button type="submit" variant="primary" className="w-full mt-6 py-2.5">
                Create Account
              </Button>
            </form>
          )}
        </div>
      </Card>
    </div>
  );
}
