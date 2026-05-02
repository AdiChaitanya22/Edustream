import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  Video, 
  Settings, 
  BarChart, 
  Search, 
  Bell,
  MoreVertical,
  PlayCircle,
  Home
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const STATS = [
  { title: "Total Users", value: "12,453", change: "+14%", icon: Users },
  { title: "Active Courses", value: "84", change: "+5%", icon: Video },
  { title: "Total Views", value: "1.2M", change: "+21%", icon: BarChart },
];

const VIDEOS = [
  { id: "1", title: "JavaScript Masterclass", views: "145K", status: "Published", date: "2024-03-10" },
  { id: "2", title: "React Fundamentals", views: "89K", status: "Published", date: "2024-03-12" },
  { id: "3", title: "Python Data Science", views: "210K", status: "Published", date: "2024-03-15" },
  { id: "4", title: "Advanced CSS Animations", views: "0", status: "Draft", date: "2024-03-20" },
  { id: "5", title: "Intro to Machine Learning", views: "45K", status: "Published", date: "2024-03-22" },
];

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  const queryClient = useQueryClient();

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: notifTitle,
          message: notifMessage,
          type: "GLOBAL",
        }),
      });
      if (!res.ok) throw new Error("Failed to send broadcast");
    },
    onSuccess: () => {
      toast.success("Broadcast sent successfully!");
      setNotifTitle("");
      setNotifMessage("");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: () => {
      toast.error("Failed to send broadcast. Make sure you are an Admin.");
    }
  });

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className={`w-64 bg-zinc-950 border-r border-zinc-800 hidden md:block flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full absolute'}`}>
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">E</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Admin
            </span>
          </Link>
        </div>
        <nav className="p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium">
            <BarChart className="h-5 w-5" />
            Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
            <Users className="h-5 w-5" />
            Users
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
            <Video className="h-5 w-5" />
            Content
          </Link>
          <Link to="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <div className="pt-8 mt-8 border-t border-zinc-800">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors">
              <Home className="h-5 w-5" />
              Back to Site
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input 
                placeholder="Search resources..." 
                className="w-64 pl-9 bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5 text-zinc-400" />
            </Button>
            <Avatar className="h-9 w-9 border border-zinc-800">
              <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
            <p className="text-zinc-400">Welcome back, Admin. Here's what's happening today.</p>
          </div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
          >
            {STATS.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 h-full">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-zinc-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                      {stat.change} from last month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Recent Content Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-white">Recent Content</CardTitle>
                  <p className="text-sm text-zinc-400 mt-1">Manage and view your uploaded videos.</p>
                </div>
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2">
                  <PlayCircle className="h-4 w-4" />
                  Upload New
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                      <TableHead className="text-zinc-400">Video Title</TableHead>
                      <TableHead className="text-zinc-400">Status</TableHead>
                      <TableHead className="text-zinc-400">Views</TableHead>
                      <TableHead className="text-zinc-400">Date</TableHead>
                      <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VIDEOS.map((video) => (
                      <TableRow key={video.id} className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableCell className="font-medium text-white">
                          {video.title}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={video.status === 'Published' ? 'default' : 'secondary'}
                            className={video.status === 'Published' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800/80'}
                          >
                            {video.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-300">{video.views}</TableCell>
                        <TableCell className="text-zinc-400">{video.date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Broadcast Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-xl text-white">Broadcast Announcement</CardTitle>
                <p className="text-sm text-zinc-400 mt-1">Send a global notification to all registered users.</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Title</Label>
                  <Input 
                    placeholder="E.g., Server Maintenance, New Course Added!" 
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary text-white"
                    value={notifTitle}
                    onChange={(e) => setNotifTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Message</Label>
                  <Textarea 
                    placeholder="Type your announcement here..." 
                    className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary h-24 text-white"
                    value={notifMessage}
                    onChange={(e) => setNotifMessage(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white gap-2 mt-2"
                  onClick={() => broadcastMutation.mutate()}
                  disabled={broadcastMutation.isPending || !notifTitle || !notifMessage}
                >
                  <Bell className="h-4 w-4" />
                  {broadcastMutation.isPending ? "Sending..." : "Send Global Notification"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
