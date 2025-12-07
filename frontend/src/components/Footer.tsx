import { Link } from "react-router-dom";
import { Heart, Facebook, Mail, Phone, MapPin, ArrowUpRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-card to-muted/30 border-t border-border overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 py-16 relative">
        {/* Newsletter section */}
        <div className="mb-16 p-8 rounded-3xl bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border border-primary/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Đừng bỏ lỡ sự kiện mới</h3>
              <p className="text-muted-foreground">Đăng ký nhận thông báo về các hoạt động tình nguyện mới nhất</p>
            </div>
            <div className="flex gap-3">
              <Input 
                placeholder="Email của bạn" 
                className="bg-background/50 border-border/50 focus:border-primary"
              />
              <Button className="gap-2 px-6 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90">
                <Send className="h-4 w-4" />
                Đăng ký
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-primary to-emerald-600 rounded-xl p-2.5 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <div>
                <span className="text-xl font-bold block">VolunteerHub</span>
                <span className="text-xs text-muted-foreground">Kết nối yêu thương</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nền tảng kết nối tình nguyện viên với các hoạt động cộng đồng ý nghĩa trên khắp Việt Nam.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2.5 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2.5 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Khám phá</h3>
            <ul className="space-y-4">
              {[
                { to: "/events", label: "Tất cả sự kiện" },
                { to: "/about", label: "Về chúng tôi" },
                { to: "/auth", label: "Tham gia ngay" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Hỗ trợ</h3>
            <ul className="space-y-4">
              {[
                { to: "/faq", label: "Câu hỏi thường gặp" },
                { to: "/terms", label: "Điều khoản sử dụng" },
                { to: "/privacy", label: "Chính sách bảo mật" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="group flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
                    {link.label}
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-6 text-foreground">Liên hệ</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>123 Đường ABC, Quận 1</p>
                  <p>TP. Hồ Chí Minh, Việt Nam</p>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">hello@volunteerhub.vn</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="text-sm text-muted-foreground">1900 xxxx xx</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 VolunteerHub. Được xây dựng với <Heart className="h-3 w-3 inline text-red-500 mx-1" fill="currentColor" /> tại Việt Nam
          </p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-primary transition-colors">Điều khoản</Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">Bảo mật</Link>
            <Link to="/cookies" className="hover:text-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
