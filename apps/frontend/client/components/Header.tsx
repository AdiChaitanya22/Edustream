import { Link } from "react-router-dom";
import { Search, Bell, User, Menu } from "lucide-react";
import { useState } from "react";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-background via-background to-transparent">
      <div className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">E</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              EduStream
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/my-learning"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              My Learning
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <SearchBar />
            <NotificationBell />
            <Link 
              to="/auth"
              className="h-10 w-10 rounded-full bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <User className="h-5 w-5 text-primary-foreground" />
            </Link>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden h-10 w-10 rounded-full bg-card hover:bg-card/80 transition-colors flex items-center justify-center"
            >
              <Menu className="h-5 w-5 text-foreground/70" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="mt-4 flex flex-col gap-2 md:hidden">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:bg-card/50 rounded-lg"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:bg-card/50 rounded-lg"
            >
              Browse
            </Link>
            <Link
              to="/dashboard"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:bg-card/50 rounded-lg"
            >
              Dashboard
            </Link>
            <Link
              to="/my-learning"
              className="px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors hover:bg-card/50 rounded-lg"
            >
              My Learning
            </Link>
            <Link
              to="/admin"
              className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors hover:bg-card/50 rounded-lg"
            >
              Admin
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
