import Header from "@/components/Header";
import ContentCard from "@/components/ContentCard";
import { contentService } from "@/services/contentService";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function Browse() {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ["browse-videos"],
    queryFn: () => contentService.getVideos({ limit: 48 }),
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground">Browse Courses</h1>
            <p className="text-lg text-muted-foreground mt-3">
              Watch the latest videos published by your EduStream admins.
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : videos.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
              No videos have been uploaded yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {videos.map((video) => (
                <ContentCard key={video.id} video={video} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
