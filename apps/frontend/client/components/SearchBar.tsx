import { useState, useRef, useEffect } from "react";
import { Search, Loader2, Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks/use-debounce";

interface VideoResult {
  id: string;
  title: string;
  thumbnail?: string;
  duration: number;
}

export default function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 300);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: results, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/content?search=${encodeURIComponent(debouncedQuery)}&limit=5`, {
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
        }
      });
      
      if (!res.ok) throw new Error("Search failed");
      return (await res.json()) as VideoResult[];
    },
    enabled: debouncedQuery.trim().length > 0,
  });

  const handleResultClick = (videoId: string) => {
    setIsExpanded(false);
    setSearchQuery("");
    navigate(`/watch/${videoId}`);
  };

  return (
    <div ref={searchRef} className="relative hidden sm:block">
      <div 
        className={`flex items-center transition-all duration-300 ${
          isExpanded ? "w-64 bg-card ring-1 ring-border rounded-lg" : "w-10 bg-card rounded-full hover:bg-card/80"
        } h-10`}
      >
        <button 
          onClick={() => setIsExpanded(true)}
          className="flex h-10 w-10 items-center justify-center shrink-0 rounded-full"
        >
          <Search className="h-5 w-5 text-foreground/70" />
        </button>
        
        <input
          type="text"
          placeholder="Search courses..."
          className={`flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground transition-all duration-300 ${
            isExpanded ? "w-full opacity-100 px-2" : "w-0 opacity-0 px-0"
          }`}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsExpanded(true);
          }}
          onFocus={() => setIsExpanded(true)}
        />
      </div>

      {/* Dropdown Results */}
      {isExpanded && debouncedQuery.trim().length > 0 && (
        <div className="absolute top-12 right-0 w-80 bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50">
          {isLoading ? (
            <div className="p-4 flex justify-center items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : results && results.length > 0 ? (
            <div className="py-2">
              <div className="px-3 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Search Results
              </div>
              {results.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleResultClick(video.id)}
                  className="w-full text-left px-4 py-3 flex gap-3 hover:bg-muted transition-colors items-center"
                >
                  {video.thumbnail ? (
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-16 h-10 object-cover rounded bg-muted-foreground/20 shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                      <Play className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found for "{debouncedQuery}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
