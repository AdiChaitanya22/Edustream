import { useState, useEffect } from "react";
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
  Home,
  Upload,
  Loader2,
  LogOut,
  Trash2,
  Edit,
  Eye
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { contentService } from "@/services/contentService";
import api from "@/services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const STATS = [
  { title: "Total Users", value: "12,453", change: "+14%", icon: Users },
  { title: "Active Courses", value: "84", change: "+5%", icon: Video },
  { title: "Total Views", value: "1.2M", change: "+21%", icon: BarChart },
];

export default function Admin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");
  
  // Upload state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadDesc, setUploadDesc] = useState("");
  const [courseId, setCourseId] = useState("react-basics");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Delete state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  };

  const { data: currentUser, isLoading: userLoading } = useQuery({
    queryKey: ["admin-current-user"],
    queryFn: async () => {
      const response = await api.get("/auth/me");
      return response.data;
    },
    enabled: Boolean(localStorage.getItem("accessToken")),
    retry: false,
  });

  const isAdmin = currentUser?.role?.toUpperCase() === "ADMIN";

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  // Fetch real videos
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ["admin-videos"],
    queryFn: () => contentService.getVideos({ limit: 50 }),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!videoFile) return;
      if (!localStorage.getItem("accessToken")) {
        throw new Error("Please log in again before uploading.");
      }
      if (!isAdmin) {
        throw new Error("Your account is not an admin account.");
      }
      return contentService.uploadVideo({
        file: videoFile,
        title: uploadTitle,
        description: uploadDesc,
        courseId,
      });
    },
    onSuccess: () => {
      toast.success("Video uploaded successfully!");
      setUploadOpen(false);
      setUploadTitle("");
      setUploadDesc("");
      setVideoFile(null);
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 401) {
        clearAuth();
        toast.error("Your login session expired. Please log in again.");
        navigate("/auth");
        return;
      }

      const message = error?.response?.data?.message || error.message || "Upload failed";
      toast.error(`Upload failed: ${message}`);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return contentService.deleteVideo(id);
    },
    onSuccess: () => {
      toast.success("Video deleted successfully");
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ["admin-videos"] });
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Failed to delete video";
      toast.error(message);
    }
  });

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      const token = localStorage.getItem("accessToken");
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
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleLogout}
              title="Log out"
            >
              <LogOut className="h-5 w-5 text-zinc-400" />
            </Button>
            <Avatar className="h-9 w-9 border border-zinc-800">
              <AvatarImage src="https://i.pravatar.cc/150?u=admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 md:p-8 space-y-8 overflow-y-auto">
          {userLoading ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </CardContent>
            </Card>
          ) : !currentUser ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="py-10 text-center space-y-4">
                <p className="text-zinc-300">Please log in before using the admin dashboard.</p>
                <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-white">
                  Go to Login
                </Button>
              </CardContent>
            </Card>
          ) : !isAdmin ? (
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardContent className="py-10 text-center space-y-4">
                <p className="text-zinc-300">You are logged in as {currentUser.email}, but this account is not an admin.</p>
                <p className="text-sm text-zinc-500">Video uploads require an account with the admin role.</p>
                <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90 text-white">
                  Log in with admin account
                </Button>
              </CardContent>
            </Card>
          ) : null}

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
                <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-primary hover:bg-primary/90 text-white gap-2">
                      <Upload className="h-4 w-4" />
                      Upload New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload New Video</DialogTitle>
                      <DialogDescription className="text-zinc-400">
                        Add a new video to your library. It will be available to users immediately.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="title" className="text-zinc-300">Video Title</Label>
                        <Input
                          id="title"
                          placeholder="E.g. Advanced React Hooks"
                          className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary"
                          value={uploadTitle}
                          onChange={(e) => setUploadTitle(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="desc" className="text-zinc-300">Description</Label>
                        <Textarea
                          id="desc"
                          placeholder="What is this video about?"
                          className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary"
                          value={uploadDesc}
                          onChange={(e) => setUploadDesc(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="course" className="text-zinc-300">Course ID</Label>
                        <Input
                          id="course"
                          placeholder="react-basics"
                          className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary"
                          value={courseId}
                          onChange={(e) => setCourseId(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="file" className="text-zinc-300">Video File</Label>
                        <Input
                          id="file"
                          type="file"
                          accept="video/*"
                          className="bg-zinc-900 border-zinc-800 focus-visible:ring-primary file:text-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary/10 hover:file:bg-primary/20"
                          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setUploadOpen(false)}
                        className="text-zinc-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => uploadMutation.mutate()}
                        disabled={uploadMutation.isPending || userLoading || !isAdmin || !videoFile || !uploadTitle}
                        className="bg-primary hover:bg-primary/90 text-white min-w-[100px]"
                      >
                        {uploadMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          "Upload Video"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {videosLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                        <TableHead className="text-zinc-400">Video Title</TableHead>
                        <TableHead className="text-zinc-400">Status</TableHead>
                        <TableHead className="text-zinc-400">Course</TableHead>
                        <TableHead className="text-zinc-400">Date</TableHead>
                        <TableHead className="text-zinc-400 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {videos.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-10 text-zinc-500">
                            No videos found. Upload your first video!
                          </TableCell>
                        </TableRow>
                      ) : (
                        videos.map((video: any) => (
                          <TableRow key={video.id} className="border-zinc-800 hover:bg-zinc-800/50">
                            <TableCell className="font-medium text-white">
                              {video.title}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={video.status === 'READY' ? 'default' : 'secondary'}
                                className={video.status === 'READY' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-800/80'}
                              >
                                {video.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-300">{video.courseId}</TableCell>
                            <TableCell className="text-zinc-400">{new Date(video.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-white w-40">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator className="bg-zinc-800" />
                                  <DropdownMenuItem 
                                    className="cursor-pointer gap-2"
                                    onClick={() => navigate(`/watch/${video.id}`)}
                                  >
                                    <Eye className="h-4 w-4" /> View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="cursor-pointer gap-2">
                                    <Edit className="h-4 w-4" /> Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator className="bg-zinc-800" />
                                  <DropdownMenuItem 
                                    className="cursor-pointer text-red-500 focus:text-red-500 gap-2"
                                    onClick={() => setDeleteId(video.id)}
                                  >
                                    <Trash2 className="h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Delete Confirmation Dialog */}
          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete the video and remove the data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteId(null)}
                  className="text-zinc-400 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                  disabled={deleteMutation.isPending}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Permanently Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

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
