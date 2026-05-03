import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, ArrowRight, Play, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth, isAuthenticated, user } = useAuthStore();

  // Systematic check: if already logged in, redirect away from auth page
  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from?.pathname || (user.role === "ADMIN" ? "/admin" : "/dashboard");
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      
      setAuth(data);
      toast({ title: "Welcome back!", description: "You have successfully logged in." });
      // Redirect will be handled by the useEffect above or manually here
      const target = data.user?.role === "ADMIN" ? "/admin" : "/dashboard";
      navigate(target);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email');
    const password = formData.get('password');
    const [firstName, ...rest] = name.split(' ');
    const lastName = rest.join(' ') || 'User';

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      setAuth(data);
      toast({ title: "Success!", description: "Account created successfully." });
      navigate("/dashboard");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Decorative Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 items-center justify-center p-12 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(139,92,246,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-50" />
        </div>

        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="mb-12"
          >
            <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl shadow-primary/20 rotate-3">
              <Play className="h-10 w-10 text-white fill-current" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-5xl font-black text-white leading-tight tracking-tight">
              Master your craft with <span className="text-primary">EduStream</span>.
            </h1>
            <p className="text-zinc-400 text-xl leading-relaxed">
              Join thousands of learners worldwide. High-quality video education, optimized for any bandwidth.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-8">
              {[
                { icon: <Play className="h-4 w-4" />, text: "4K Adaptive Streaming" },
                { icon: <ShieldCheck className="h-4 w-4" />, text: "Verified Certificates" },
                { icon: <CheckCircle2 className="h-4 w-4" />, text: "Expert Instructors" },
                { icon: <User className="h-4 w-4" />, text: "Personalized Path" },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-300">
                  <div className="h-8 w-8 rounded-lg bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
                    {feature.icon}
                  </div>
                  {feature.text}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute inset-0 lg:hidden bg-zinc-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          className="w-full max-w-[420px] relative z-10"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 lg:hidden flex items-center gap-3">
             <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
                <Play className="h-5 w-5 text-white fill-current" />
             </div>
             <span className="text-2xl font-black text-white tracking-tighter">EduStream</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Get Started</h2>
            <p className="text-zinc-500 mt-2">Enter your details to access your learning journey</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-zinc-900/50 p-1 rounded-full border border-zinc-800">
              <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">Login</TabsTrigger>
              <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email" name="email" type="email" placeholder="name@company.com" 
                      className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl" required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" dir="ltr" className="text-xs font-bold uppercase tracking-wider text-zinc-500">Password</Label>
                    <Link to="#" className="text-xs text-primary font-bold hover:underline">Forgot password?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password" name="password" type="password" placeholder="••••••••"
                      className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl" required 
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
                  {isLoading ? "Authenticating..." : (
                    <>
                      Sign in to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="name" name="name" placeholder="John Doe" 
                      className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl" required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-email" name="email" type="email" placeholder="name@company.com" 
                      className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl" required 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password" dir="ltr" className="text-xs font-bold uppercase tracking-wider text-zinc-500 ml-1">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="reg-password" name="password" type="password" placeholder="Min. 8 characters"
                      className="pl-11 h-12 bg-zinc-900/50 border-zinc-800 focus:border-primary/50 focus:ring-primary/20 rounded-xl" required minLength={8}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-12 bg-primary text-white hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/20 mt-2" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : (
                    <>
                      Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          
          <div className="mt-10 flex flex-col items-center gap-6">
             <div className="flex items-center gap-4 w-full">
                <div className="h-[1px] flex-1 bg-zinc-800" />
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Secure Login</span>
                <div className="h-[1px] flex-1 bg-zinc-800" />
             </div>
             <p className="text-center text-[11px] text-zinc-500 leading-relaxed">
               Protected by 256-bit encryption. By signing up, you agree to our{" "}
               <Link to="#" className="text-zinc-300 underline underline-offset-4 hover:text-primary transition-colors">Terms</Link>
               {" "}and{" "}
               <Link to="#" className="text-zinc-300 underline underline-offset-4 hover:text-primary transition-colors">Privacy</Link>.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
