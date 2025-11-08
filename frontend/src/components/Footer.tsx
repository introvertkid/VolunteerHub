import { Link } from "react-router-dom";
import { Heart, Facebook, Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <Heart className="h-5 w-5 text-primary-foreground" fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Tình Nguyện
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Kết nối tình nguyện viên, lan tỏa yêu thương đến cộng đồng.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/events" className="hover:text-primary transition-colors">
                  Sự kiện
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition-colors">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition-colors">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition-colors">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>contact@tinhnguyenvn.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="h-4 w-4 text-primary" />
                <a href="#" className="hover:text-primary transition-colors">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Tình Nguyện. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};
