import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Hls from "hls.js";
import {
  ArrowLeft, PlayCircle, Clock, BookOpen, Share2, BookmarkPlus,
  Loader2, ThumbsUp, CheckCircle, ChevronRight, StickyNote,
  MessageSquare, Star, BookmarkCheck, Heart, Send
} from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { contentService } from "@/services/contentService";
import { API_BASE_URL } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

// Per-course metadata: chapters, instructor, tags, difficulty
const COURSE_META: Record<string, {
  instructor: string;
  role: string;
  avatar: string;
  difficulty: string;
  tags: string[];
  chapterTitles: string[];
  qna: { q: string; a: string; votes: number }[];
}> = {
  default: {
    instructor: "Alex Rivera",
    role: "Senior Engineer",
    avatar: "AR",
    difficulty: "Beginner",
    tags: ["Programming", "Tutorial"],
    chapterTitles: ["Introduction", "Core Concepts", "Hands-on Practice", "Advanced Topics", "Summary & Next Steps"],
    qna: [
      { q: "Do I need prior experience?", a: "No! This course starts from scratch.", votes: 42 },
      { q: "Will there be exercises?", a: "Yes, each section has hands-on exercises.", votes: 28 },
    ],
  },
  "react-basics": {
    instructor: "Sarah Chen",
    role: "Frontend Architect @ Meta",
    avatar: "SC",
    difficulty: "Beginner",
    tags: ["React", "JavaScript", "Frontend", "Web Dev"],
    chapterTitles: ["What is React?", "JSX & Components", "Props & State", "Hooks Deep Dive", "Routing & Deployment"],
    qna: [
      { q: "Should I know JavaScript first?", a: "Yes, basic JS knowledge is recommended.", votes: 87 },
      { q: "Is React still relevant in 2025?", a: "Absolutely! React powers most major web apps today.", votes: 63 },
      { q: "What IDE should I use?", a: "VS Code with the ES7+ React snippets extension.", votes: 41 },
    ],
  },
  "python-beginners": {
    instructor: "Dr. Priya Nair",
    role: "Data Scientist @ Google",
    avatar: "PN",
    difficulty: "Beginner",
    tags: ["Python", "Data Science", "AI/ML", "Scripting"],
    chapterTitles: ["Python Setup & Syntax", "Variables & Data Types", "Control Flow & Loops", "Functions & Modules", "File I/O & Libraries"],
    qna: [
      { q: "Which Python version should I install?", a: "Python 3.11+ is recommended.", votes: 102 },
      { q: "Is Python good for jobs?", a: "Python is the #1 language for data science & AI roles.", votes: 79 },
      { q: "Can I build web apps with Python?", a: "Yes! Django and FastAPI are great frameworks.", votes: 55 },
    ],
  },
  "aws-cloud": {
    instructor: "James O'Brien",
    role: "AWS Solutions Architect",
    avatar: "JO",
    difficulty: "Intermediate",
    tags: ["AWS", "Cloud", "DevOps", "Infrastructure"],
    chapterTitles: ["Cloud Fundamentals", "EC2 & S3 Deep Dive", "Networking & VPC", "Serverless with Lambda", "Cost Optimization"],
    qna: [
      { q: "Do I need a credit card for AWS free tier?", a: "Yes, but you won't be charged if you stay within free tier limits.", votes: 95 },
      { q: "Is the AWS certification worth it?", a: "Yes, AWS certs are highly valued in the industry.", votes: 73 },
    ],
  },
};

function getMeta(courseId?: string) {
  if (!courseId) return COURSE_META.default;
  const key = Object.keys(COURSE_META).find(k => courseId.toLowerCase().includes(k));
  return COURSE_META[key || "default"] || COURSE_META.default;
}

function generateChapters(durationSec: number, titles: string[]) {
  if (!durationSec || durationSec < 10) {
    // Fallback: evenly spaced over 30 minutes
    durationSec = 1800;
  }
  const count = Math.min(titles.length, 5);
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    title: titles[i] || `Chapter ${i + 1}`,
    startSec: Math.floor((durationSec / count) * i),
    endSec: Math.floor((durationSec / count) * (i + 1)),
  }));
}

interface Note { time: number; text: string }

export default function Watch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [question, setQuestion] = useState("");
  const [localQna, setLocalQna] = useState<{ q: string; a: string; votes: number }[]>([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [playbackUrl, setPlaybackUrl] = useState<string>();

  const { data: video, isLoading, error } = useQuery({
    queryKey: ["video", id],
    queryFn: () => contentService.getVideo(id as string),
    enabled: Boolean(id) && id !== "welcome",
  });

  // Fetch related videos from same course
  const { data: relatedVideos = [] } = useQuery({
    queryKey: ["related-videos", video?.courseId],
    queryFn: () => contentService.getVideos({ courseId: video?.courseId, limit: 8 }),
    enabled: Boolean(video?.courseId),
  });

  const meta = getMeta(video?.courseId);
  const chapters = generateChapters(video?.duration || 0, meta.chapterTitles);

  useEffect(() => {
    setLocalQna(meta.qna);
  }, [video?.courseId]);

  useEffect(() => {
    const found = chapters.findLast(c => currentTime >= c.startSec);
    if (found) setActiveChapter(found.index);
  }, [currentTime]);

  const hlsUrl = video?.status === "ready" && id
    ? `${API_BASE_URL}/streaming/${id}/manifest.m3u8`
    : undefined;
  const fallbackVideoUrl = video?.originalUrl
    ? `${API_BASE_URL}${video.originalUrl}`
    : id === "welcome"
    ? "https://www.w3schools.com/html/mov_bbb.mp4"
    : undefined;

  const title = video?.title || id?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Video";
  const description = video?.description || "Comprehensive lesson designed to help you master this topic step by step with real-world examples.";
  const totalDuration = video?.duration || 0;

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

  const seekTo = (sec: number) => {
    if (videoRef.current) videoRef.current.currentTime = sec;
  };

  const addNote = () => {
    if (!noteText.trim()) return;
    setNotes(prev => [...prev, { time: currentTime, text: noteText.trim() }]);
    setNoteText("");
    toast.success("Note saved!");
  };

  const askQuestion = () => {
    if (!question.trim()) return;
    setLocalQna(prev => [{ q: question.trim(), a: "Your question has been submitted! An instructor will reply soon.", votes: 0 }, ...prev]);
    setQuestion("");
    toast.success("Question submitted!");
  };

  const completedChapters = chapters.filter(c => currentTime >= c.endSec).length;
  const hasPlayableSource = Boolean(playbackUrl || hlsUrl);

  useEffect(() => {
    const player = videoRef.current;
    if (!player) return;

    const token = localStorage.getItem("accessToken");

    if (hlsUrl && Hls.isSupported()) {
      const hls = new Hls({
        xhrSetup: (xhr) => {
          if (token) {
            xhr.setRequestHeader("Authorization", `Bearer ${token}`);
          }
        },
      });

      hls.loadSource(hlsUrl);
      hls.attachMedia(player);
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal && fallbackVideoUrl) {
          hls.destroy();
          setPlaybackUrl(fallbackVideoUrl);
        }
      });

      return () => hls.destroy();
    }

    if (hlsUrl && player.canPlayType("application/vnd.apple.mpegurl")) {
      setPlaybackUrl(hlsUrl);
      return;
    }

    setPlaybackUrl(fallbackVideoUrl);
  }, [hlsUrl, fallbackVideoUrl]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto pb-16">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <button onClick={() => navigate(-1)} className="hover:text-primary flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-zinc-400">{video?.courseId || "Course"}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-white font-medium truncate max-w-[200px]">{title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Main Video Column ── */}
          <div className="lg:w-3/4 flex flex-col gap-6">

            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
              )}
              {!isLoading && video?.status === "processing" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 gap-4">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <p className="text-zinc-400">Preparing adaptive stream...</p>
                </div>
              )}
              {!isLoading && !hasPlayableSource && video?.status !== "processing" && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 gap-4">
                  <PlayCircle className="h-20 w-20 text-zinc-600" />
                  <p className="text-zinc-400">Video not available</p>
                </div>
              )}
              {hasPlayableSource && video?.status !== "processing" && (
                <video
                  ref={videoRef}
                  controls autoPlay
                  className="w-full h-full object-contain bg-black"
                  poster={video?.thumbnail}
                  onTimeUpdate={e => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                  src={playbackUrl || undefined}
                />
              )}
            </motion.div>

            {/* Chapter Timeline Bar */}
            {chapters.length > 0 && totalDuration > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs text-zinc-500 font-medium">CHAPTERS</span>
                  <span className="text-xs text-zinc-600 ml-auto">{fmt(currentTime)} / {fmt(totalDuration)}</span>
                </div>
                <div className="flex gap-1 h-1.5 rounded-full overflow-hidden bg-zinc-800">
                  {chapters.map(ch => {
                    const pct = ((ch.endSec - ch.startSec) / totalDuration) * 100;
                    const filled = currentTime >= ch.endSec;
                    const active = activeChapter === ch.index;
                    return (
                      <button
                        key={ch.index}
                        title={ch.title}
                        onClick={() => seekTo(ch.startSec)}
                        style={{ width: `${pct}%` }}
                        className={`h-full transition-all duration-300 ${
                          filled ? "bg-primary" : active ? "bg-primary/60 animate-pulse" : "bg-zinc-700 hover:bg-zinc-500"
                        }`}
                      />
                    );
                  })}
                </div>
                <div className="flex gap-1 mt-2">
                  {chapters.map(ch => (
                    <button
                      key={ch.index}
                      onClick={() => seekTo(ch.startSec)}
                      style={{ width: `${((ch.endSec - ch.startSec) / totalDuration) * 100}%` }}
                      className={`text-left truncate text-xs px-1 py-1 rounded transition-colors ${
                        activeChapter === ch.index ? "text-primary font-semibold" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {ch.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Title & Actions */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="border-primary/50 text-primary text-xs">{meta.difficulty}</Badge>
                    {meta.tags.slice(0, 3).map(t => (
                      <Badge key={t} variant="secondary" className="bg-zinc-800 text-zinc-300 text-xs">{t}</Badge>
                    ))}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">{title}</h1>
                  <div className="flex items-center gap-5 text-sm text-zinc-400">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{fmt(totalDuration)}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" />{video?.courseId || "EduStream"}</span>
                    <span className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`} />)}
                      <span className="ml-1">4.8</span>
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="ghost"
                    onClick={() => { setLiked(l => !l); toast(liked ? "Like removed" : "Liked!"); }}
                    className={`gap-2 ${liked ? "text-red-400 hover:text-red-300" : "text-zinc-300 hover:text-white"}`}
                  >
                    <Heart className={`h-4 w-4 ${liked ? "fill-red-400" : ""}`} />
                    {liked ? "Liked" : "Like"}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => { setSaved(s => !s); toast(saved ? "Removed from saved" : "Saved to library!"); }}
                    className={`gap-2 ${saved ? "text-primary" : "text-zinc-300 hover:text-white"}`}
                  >
                    {saved ? <BookmarkCheck className="h-4 w-4" /> : <BookmarkPlus className="h-4 w-4" />}
                    {saved ? "Saved" : "Save"}
                  </Button>
                  <Button variant="ghost" className="gap-2 text-zinc-300 hover:text-white"
                    onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success("Link copied!"); }}>
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <Tabs defaultValue="overview">
                <TabsList className="bg-zinc-900/60 border border-zinc-800 w-full sm:w-auto">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="chapters">Chapters</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="qna">Q&A</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-3 text-white">About this lesson</h3>
                  <p className="text-zinc-400 leading-relaxed">{description}</p>
                  <div className="mt-6 pt-6 border-t border-zinc-800 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                      {meta.avatar}
                    </div>
                    <div>
                      <p className="text-white font-medium">Instructor: {meta.instructor}</p>
                      <p className="text-sm text-zinc-500">{meta.role}</p>
                    </div>
                  </div>
                </TabsContent>

                {/* Chapters */}
                <TabsContent value="chapters" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800 space-y-3">
                  <h3 className="text-lg font-semibold mb-4 text-white">All Chapters</h3>
                  {chapters.map(ch => {
                    const isDone = currentTime >= ch.endSec;
                    const isActive = activeChapter === ch.index;
                    return (
                      <button
                        key={ch.index}
                        onClick={() => seekTo(ch.startSec)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                          isActive ? "border-primary bg-primary/10" : isDone ? "border-zinc-700 bg-zinc-900/50 opacity-70" : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800/50"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone ? "bg-green-500/20 text-green-400" : isActive ? "bg-primary text-white" : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {isDone ? <CheckCircle className="h-4 w-4" /> : <span className="text-xs font-bold">{ch.index + 1}</span>}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${isActive ? "text-primary" : "text-zinc-200"}`}>{ch.title}</p>
                          <p className="text-xs text-zinc-500 mt-0.5">{fmt(ch.startSec)} – {fmt(ch.endSec)}</p>
                        </div>
                        {isActive && <Badge className="bg-primary text-white text-xs">Playing</Badge>}
                      </button>
                    );
                  })}
                </TabsContent>

                {/* Notes */}
                <TabsContent value="notes" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><StickyNote className="h-5 w-5 text-yellow-400" />My Notes</h3>
                  <div className="flex gap-2 mb-6">
                    <Textarea
                      placeholder={`Add a note at ${fmt(currentTime)}...`}
                      className="bg-zinc-900 border-zinc-700 text-white resize-none h-20"
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                    />
                    <Button onClick={addNote} className="bg-primary hover:bg-primary/90 self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {notes.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-8">No notes yet. Pause and jot down key insights!</p>
                  ) : (
                    <div className="space-y-3">
                      {notes.map((n, i) => (
                        <div key={i} className="flex gap-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                          <button onClick={() => seekTo(n.time)} className="text-primary text-xs font-mono hover:underline flex-shrink-0 mt-0.5">
                            {fmt(n.time)}
                          </button>
                          <p className="text-zinc-300 text-sm">{n.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                {/* Q&A */}
                <TabsContent value="qna" className="mt-6 p-6 bg-zinc-900/30 rounded-xl border border-zinc-800">
                  <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2"><MessageSquare className="h-5 w-5 text-blue-400" />Q&A</h3>
                  <div className="flex gap-2 mb-6">
                    <Textarea
                      placeholder="Ask a question about this lesson..."
                      className="bg-zinc-900 border-zinc-700 text-white resize-none h-20"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                    />
                    <Button onClick={askQuestion} className="bg-blue-600 hover:bg-blue-700 self-end">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {localQna.map((item, i) => (
                      <div key={i} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
                        <p className="text-white font-medium mb-2">❓ {item.q}</p>
                        <p className="text-zinc-400 text-sm pl-5 border-l-2 border-primary/40 leading-relaxed">{item.a}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <button className="flex items-center gap-1 text-xs text-zinc-500 hover:text-primary transition-colors">
                            <ThumbsUp className="h-3 w-3" /> {item.votes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/4"
          >
            <div className="sticky top-24 space-y-5">
              {/* Course Progress */}
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 p-5">
                <h3 className="font-bold text-white mb-1">Course Progress</h3>
                <p className="text-xs text-zinc-400 mb-3">{completedChapters} / {chapters.length} chapters</p>
                <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${chapters.length ? (completedChapters / chapters.length) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">{Math.round(chapters.length ? (completedChapters / chapters.length) * 100 : 0)}% complete</p>
              </div>

              {/* Chapter List */}
              <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-800">
                  <h3 className="font-bold text-white">Chapters</h3>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {chapters.map((ch) => {
                    const isDone = currentTime >= ch.endSec;
                    const isActive = activeChapter === ch.index;
                    return (
                      <button
                        key={ch.index}
                        onClick={() => seekTo(ch.startSec)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/60 transition-colors border-l-2 ${
                          isActive ? "border-primary bg-zinc-800/40" : "border-transparent"
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isDone ? "bg-green-500/20" : isActive ? "bg-primary" : "bg-zinc-800"
                        }`}>
                          {isDone ? <CheckCircle className="h-3 w-3 text-green-400" /> :
                            isActive ? <PlayCircle className="h-3 w-3 text-white" /> :
                            <span className="text-[10px] text-zinc-400">{ch.index + 1}</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : isDone ? "text-zinc-500" : "text-zinc-300"}`}>{ch.title}</p>
                          <p className="text-[10px] text-zinc-600">{fmt(ch.startSec)}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Related Videos */}
              {relatedVideos.filter(v => v.id !== video?.id).length > 0 && (
                <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 overflow-hidden">
                  <div className="p-4 border-b border-zinc-800">
                    <h3 className="font-bold text-white">Up Next</h3>
                  </div>
                  <div className="divide-y divide-zinc-800">
                    {relatedVideos.filter(v => v.id !== video?.id).slice(0, 4).map(rv => (
                      <Link key={rv.id} to={`/watch/${rv.id}`}
                        className="flex gap-3 p-3 hover:bg-zinc-800/50 transition-colors group">
                        <div className="w-20 h-12 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0 relative">
                          {rv.thumbnail
                            ? <img src={rv.thumbnail} alt={rv.title} className="w-full h-full object-cover" />
                            : <PlayCircle className="absolute inset-0 m-auto h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-zinc-200 font-medium line-clamp-2 group-hover:text-primary transition-colors">{rv.title}</p>
                          <p className="text-xs text-zinc-500 mt-1">{rv.courseId}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
