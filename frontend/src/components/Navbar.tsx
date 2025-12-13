import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Settings, Menu, X } from "lucide-react";
import { useState } from "react";
import { useUserRole } from "@/hooks/useUserRole";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isManager } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/events", label: "Sự kiện" },
    { to: "/about", label: "Về chúng tôi" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-border/50" />

      <div className="container mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md group-hover:blur-lg transition-all" />
            <div className="relative bg-gradient-to-br from-primary to-emerald-600 rounded-xl p-2 shadow-lg shadow-primary/20">
              <Heart className="h-5 w-5 text-white" fill="currentColor" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-foreground">Volunteer</span>
            <span className="text-lg font-bold text-primary">Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive(link.to)
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
            >
              {link.label}
              {isActive(link.to) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </Link>
          ))}
          {isManager && (
            <Link
              to="/manager"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isActive("/manager")
                  ? "text-primary"
                  : "text-foreground/70 hover:text-foreground hover:bg-muted/50"
                }`}
            >
              <Settings className="h-4 w-4" />
              Quản lý
            </Link>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3 pr-3 border-r border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {user.fullName?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground/80">
                  {user.fullName}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-foreground/70">
                <Link to="/auth">Đăng nhập</Link>
              </Button>
              <Button size="sm" asChild className="bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/20">
                <Link to="/auth" state={{ tab: "register" }}>Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border p-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted"
                }`}
            >
              {link.label}
            </Link>
          ))}
          {isManager && (
            <Link
              to="/manager"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive("/manager")
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted"
                }`}
            >
              <Settings className="h-4 w-4" />
              Quản lý
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};
