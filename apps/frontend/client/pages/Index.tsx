import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Users, Sparkles, Mail, Send } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import ContentRow from "@/components/ContentRow";
import { contentService } from "@/services/contentService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const FEATURED_COURSE = {
// ...
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
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const navigate = useNavigate();
  
  const { data: videos = [] } = useQuery({
    queryKey: ["home-trending"],
    queryFn: () => contentService.getTrending(8),
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsSubscribing(true);
    setTimeout(() => {
      toast.success("Thanks for subscribing! Check your inbox for updates.");
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

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

      {/* Features Section */}
      <div className="py-20 px-6 lg:px-12 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why Learn on EduStream?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Join thousands of students and experience the next generation of online education with our state-of-the-art platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: "Adaptive Streaming", 
                desc: "Our player automatically adjusts quality based on your internet speed, ensuring zero buffering even on slow networks.",
                icon: Play
              },
              { 
                title: "Expert Mentors", 
                desc: "Learn from industry professionals and educators who are passionate about sharing their knowledge and experience.",
                icon: Users
              },
              { 
                title: "Interactive Learning", 
                desc: "Engage with dynamic quizzes, hands-on projects, and real-time feedback to reinforce your understanding.",
                icon: Sparkles
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition-colors group">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-20 px-6 lg:px-12 border-t border-border bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Mail className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white tracking-tight">Stay Ahead of the Curve</h2>
            <p className="text-zinc-400 text-lg">
              Get the latest course updates, industry news, and learning tips delivered straight to your inbox.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative group">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-full px-6 h-14 text-white focus:outline-none focus:ring-2 focus:ring-primary backdrop-blur-sm transition-all"
            />
            <button 
              type="submit"
              disabled={isSubscribing}
              className="bg-primary text-white rounded-full px-8 h-14 font-bold hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {isSubscribing ? "Joining..." : (
                <>
                  Subscribe
                  <Send className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
            Join 10,000+ Students Already Learning
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
        © 2024 EduStream. All rights reserved.
      </footer>
    </div>
  );
}
