import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, Clock, BookOpen, Share2, BookmarkPlus } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for the sidebar lessons
const courseLessons = [
  { id: "react-basics", title: "Introduction to React", duration: "10:24", isCompleted: true },
  { id: "react-components", title: "Understanding Components", duration: "15:45", isCompleted: true },
  { id: "react-state", title: "State and Props", duration: "22:10", isCompleted: false, isCurrent: true },
  { id: "react-hooks", title: "Mastering React Hooks", duration: "18:30", isCompleted: false },
  { id: "react-routing", title: "Routing with React Router", duration: "14:15", isCompleted: false },
];

export default function Watch() {
  const { id } = useParams();
  const [videoUrl, setVideoUrl] = useState("https://www.w3schools.com/html/mov_bbb.mp4");

  // In a real app, you would fetch the specific video details from the backend based on the `id`
  useEffect(() => {
    // Simulate fetching video data
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-12">
        <div className="mb-6 flex items-center text-sm text-zinc-400">
          <Link to="/my-learning" className="hover:text-primary transition-colors flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <span className="mx-2">/</span>
          <span className="truncate">Course Name</span>
          <span className="mx-2">/</span>
          <span className="text-white font-medium truncate">{id?.replace(/-/g, ' ').toUpperCase() || 'Video Player'}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Video Section */}
          <div className="lg:w-3/4 flex flex-col space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              <video
                controls
                autoPlay
                className="w-full h-full object-contain bg-black"
                poster="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </motion.div>

            {/* Video Info & Controls */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row md:items-start justify-between gap-6"
            >
              <div>
                <h1 className="text-3xl font-bold mb-2 text-white">
                  {id?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || "Video Title"}
                </h1>
                <div className="flex items-center text-sm text-zinc-400 gap-4 mb-4">
                  <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> 22:10</span>
                  <span className="flex items-center"><BookOpen className="h-4 w-4 mr-1" /> Lesson 3 of 5</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white">
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button variant="outline" className="border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 text-white">
                  <BookmarkPlus className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            </motion.div>

            {/* Tabs for Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4"
            >
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="bg-zinc-900/50 border border-zinc-800">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="resources">Resources</TabsTrigger>
                  <TabsTrigger value="qna">Q&A</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <h3 className="text-xl font-semibold mb-4 text-white">About this lesson</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    In this lesson, we will cover the core concepts of building modern web applications. 
                    You'll learn how to structure your code, manage state efficiently, and create reusable 
                    UI components. By the end of this video, you'll have a solid foundation to start 
                    building your own complex interfaces.
                  </p>
                  
                  <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-lg">JS</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">Instructor: Jane Smith</p>
                      <p className="text-sm text-zinc-500">Senior Software Engineer</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="resources" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <p className="text-zinc-400">Downloadable resources will appear here.</p>
                </TabsContent>
                
                <TabsContent value="qna" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <p className="text-zinc-400">Ask questions and discuss with other students.</p>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Sidebar / Up Next */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden sticky top-24">
              <div className="p-5 border-b border-zinc-800 bg-zinc-900">
                <h3 className="font-bold text-lg text-white">Course Content</h3>
                <p className="text-xs text-zinc-400 mt-1">2 / 5 lessons completed</p>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
              
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {courseLessons.map((lesson, index) => (
                  <Link 
                    to={`/watch/${lesson.id}`} 
                    key={lesson.id}
                    className={`flex items-start p-4 hover:bg-zinc-800/80 transition-colors border-l-2 ${
                      lesson.isCurrent ? 'border-primary bg-zinc-800/50' : 'border-transparent'
                    }`}
                  >
                    <div className="mr-3 mt-0.5">
                      {lesson.isCompleted ? (
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <div className="h-2 w-2 rounded-full bg-primary"></div>
                        </div>
                      ) : lesson.isCurrent ? (
                        <PlayCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-zinc-600"></div>
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-medium ${lesson.isCurrent ? 'text-white' : 'text-zinc-300'}`}>
                        {index + 1}. {lesson.title}
                      </h4>
                      <p className="text-xs text-zinc-500 mt-1 flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {lesson.duration}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}