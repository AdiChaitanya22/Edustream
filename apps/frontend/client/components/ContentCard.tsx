import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { Video } from "@/services/contentService";

interface ContentCardProps {
  video: Video;
  progress?: number;
  badge?: string;
}

export default function ContentCard({
  video,
  progress,
  badge,
}: ContentCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Link to={`/watch/${video.id}`}>
      <div className="group relative h-full rounded-lg overflow-hidden bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-xl">

        {/* Thumbnail */}
        <div className="relative h-40 sm:h-44 md:h-52 overflow-hidden bg-muted">
          {video.thumbnail ? (
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
          )}

          {/* Progress Bar */}
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          {/* Badge */}
          {badge && (
            <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-primary text-white">
              {badge}
            </div>
          )}

          {/* Duration */}
          <div className="absolute bottom-2 right-2 px-2 py-1 text-xs rounded bg-black/70 text-white">
            {formatDuration(video.duration)}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-2">
            {video.title}
          </h3>

          {video.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {video.description}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-3">
            <span>{video.uploadedBy}</span>
            <span className="capitalize">{video.status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}