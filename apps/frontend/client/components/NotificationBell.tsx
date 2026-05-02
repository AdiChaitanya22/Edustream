import { useState } from "react";
import { Bell, Check, Info } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "GLOBAL" | "DIRECT";
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return [];
      
      const res = await fetch("http://localhost:3000/notifications", {
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return (await res.json()) as Notification[];
    },
    // Refetch often for "real-time" feel without WebSockets
    refetchInterval: 10000, 
  });

  const markAsRead = useMutation({
    mutationFn: async (id: string) => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
        }
      });
      if (!res.ok) throw new Error("Failed to mark as read");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative hidden sm:inline-flex h-10 w-10 rounded-full bg-card hover:bg-card/80 transition-colors items-center justify-center">
          <Bell className="h-5 w-5 text-foreground/70" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-in zoom-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0 mr-4 mt-2" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
            {unreadCount} unread
          </span>
        </div>
        
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
              <Bell className="h-8 w-8 text-muted-foreground/30" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-4 border-b border-border transition-colors ${notif.isRead ? 'bg-background opacity-75' : 'bg-muted/30'}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-0.5 shrink-0 h-2 w-2 rounded-full ${notif.isRead ? 'bg-transparent' : 'bg-primary'}`} />
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-sm font-medium leading-none flex items-center justify-between">
                        {notif.title}
                        {notif.type === 'GLOBAL' && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1 ml-2">Global</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground break-words mt-1">
                        {notif.message}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-[10px] text-muted-foreground">
                          {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                        </p>
                        {!notif.isRead && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 text-xs px-2 gap-1"
                            onClick={() => markAsRead.mutate(notif.id)}
                            disabled={markAsRead.isPending}
                          >
                            <Check className="h-3 w-3" />
                            Mark read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Temporary inline Badge component to avoid importing if it's not exported properly or to keep it simple.
// Actually, let's just use a normal div to be safe. I will fix the Badge usage below.
