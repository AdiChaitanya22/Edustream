import { useState } from "react";
import { Play } from "lucide-react";
import Header from "@/components/Header";
import ContentRow from "@/components/ContentRow";

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
  { title: "React Basics", progress: 65 },
  { title: "Python for Beginners", progress: 40 },
  { title: "AWS Cloud Intro", progress: 80 },
];

const trendingVideos = [
  { title: "JavaScript Masterclass" },
  { title: "Learn React Fast" },
  { title: "Python AI Projects" },
  { title: "Cloud Computing Basics" },
];

export default function Index() {
  const [isAutoPlay] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="relative h-96 sm:h-[500px] md:h-[600px] overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img
            src={FEATURED_COURSE.image}
            alt={FEATURED_COURSE.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative h-full flex flex-col justify-center px-6 lg:px-12">
          <div className="max-w-2xl space-y-6">
            <span className="px-3 py-1 rounded-full bg-primary text-white text-sm">
              Featured Course
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold text-white">
              {featuredVideo.title}
            </h1>

            <p className="text-lg text-gray-300">
              {featuredVideo.description}
            </p>

            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold">
              <Play className="h-5 w-5" />
              Play Now
            </button>
          </div>
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