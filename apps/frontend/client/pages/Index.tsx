import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ContentRow from "@/components/ContentRow";
import { contentService } from "@/services/contentService";
import { useQuery } from "@tanstack/react-query";

const FEATURED_COURSE = {
  title: "Featured Course",
  image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200",
};

const featuredVideo = {
  title: "Welcome to EduStream",
  description:
    "Adaptive streaming platform optimized for low-bandwidth environments",
};

const CATEGORIES = [
  "Programming",
  "Web Development",
  "AI & ML",
  "Cloud Computing",
  "Cyber Security",
  "Data Science",
];

const continueWatching = [
  { title: "React Basics", progress: 65, image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" },
  { title: "Python for Beginners", progress: 40, image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?w=800" },
  { title: "AWS Cloud Intro", progress: 80, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800" },
];

export default function Index() {
  const [isAutoPlay] = useState(true);
  const navigate = useNavigate();
  const { data: videos = [] } = useQuery({
    queryKey: ["home-trending"],
    queryFn: () => contentService.getTrending(8),
  });

  const trendingVideos = videos.length > 0
    ? videos.map((video) => ({
        id: video.id,
        title: video.title,
        image: video.thumbnail,
      }))
    : [
        { title: "JavaScript Masterclass", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" },
        { title: "Learn React Fast", image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800" },
        { title: "Python AI Projects", image: "https://images.unsplash.com/photo-1649180556628-9ba704115795?w=800" },
        { title: "Cloud Computing Basics", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800" },
      ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96 sm:h-[500px] md:h-[600px] overflow-hidden pt-16">
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src={FEATURED_COURSE.image}
            alt={FEATURED_COURSE.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-center px-6 lg:px-12">
          <motion.div 
            className="max-w-2xl space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/50 text-sm backdrop-blur-sm">
              Featured Course
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-white leading-tight">
              {featuredVideo.title}
            </h1>

            <p className="text-lg text-gray-300">
              {featuredVideo.description}
            </p>

            <button 
              onClick={() => navigate('/watch/welcome')}
              className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 hover:scale-105 hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
            >
              <Play className="h-5 w-5 fill-current" />
              Play Now
            </button>
          </motion.div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-6 py-8">
        <div className="flex gap-3 overflow-x-auto">
          {CATEGORIES.map((cat, idx) => (
            <button
              key={idx}
              className="px-4 py-2 rounded-full bg-primary text-white text-sm whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Continue Watching */}
      <div className="py-8">
        <ContentRow title="Continue Watching" items={continueWatching} />
      </div>

      {/* Trending */}
      <div className="py-8">
        <ContentRow title="Trending Videos" items={trendingVideos} />
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        © 2024 EduStream. All rights reserved.
      </footer>
    </div>
  );
}
