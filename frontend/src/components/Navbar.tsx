import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-primary rounded-lg p-2 group-hover:scale-110 transition-transform">
            <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Tình Nguyện
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <Link to="/events" className="text-foreground/80 hover:text-primary transition-colors">
            Sự kiện
          </Link>
          <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
            Giới thiệu
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-muted-foreground hidden md:inline">
                Xin chào, {user.email}
              </span>
              <Button variant="ghost" onClick={signOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Đăng nhập</Link>
              </Button>
              <Button asChild>
                <Link to="/auth">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
