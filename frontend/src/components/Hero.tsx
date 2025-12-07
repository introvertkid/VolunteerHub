import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Award, Sparkles, TreePine, HandHeart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-volunteers.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-3xl" />
      </div>

      {/* Floating icons decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <TreePine className="absolute top-32 right-[15%] w-8 h-8 text-primary/20 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <HandHeart className="absolute top-48 left-[10%] w-6 h-6 text-secondary/20 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <Sparkles className="absolute bottom-32 right-[25%] w-7 h-7 text-accent/20 animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.5s' }} />
      </div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            {/* Badge với animation */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm font-medium text-foreground/80">Đang mở đăng ký sự kiện mới</span>
            </div>
            
            {/* Heading với style độc đáo */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight">
                <span className="block text-foreground">Hành động nhỏ,</span>
                <span className="block mt-2">
                  <span className="relative">
                    <span className="relative z-10 bg-gradient-to-r from-primary via-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      Thay đổi lớn
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none">
                      <path d="M1 5.5C47.6667 2.16667 141 -2.4 199 5.5" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                  </span>
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                Mỗi giờ bạn đóng góp là một bước tiến cho cộng đồng. 
                Tham gia ngay để kết nối với hàng nghìn tình nguyện viên trên khắp Việt Nam.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="group bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg shadow-primary/25 text-base px-8" asChild>
                <Link to="/events">
                  Tìm sự kiện gần bạn
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="group border-2 text-base px-8" asChild>
                <Link to="/auth" state={{ tab: "register" }}>
                  <HandHeart className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Đăng ký tình nguyện
                </Link>
              </Button>
            </div>

            {/* Stats với thiết kế card */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10 hover:border-primary/30 transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">1,200+</p>
                    <p className="text-xs text-muted-foreground">Tình nguyện viên</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/10 hover:border-secondary/30 transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">180+</p>
                    <p className="text-xs text-muted-foreground">Sự kiện</p>
                  </div>
                </div>
              </div>
              <div className="group p-4 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10 hover:border-accent/30 transition-all cursor-default">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-accent/10 group-hover:bg-accent/20 transition-colors">
                    <Award className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">5,000+</p>
                    <p className="text-xs text-muted-foreground">Giờ đóng góp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image với thiết kế bất đối xứng */}
          <div className="relative lg:block hidden">
            {/* Decorative shapes */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl rotate-12 opacity-20" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-secondary to-primary rounded-2xl -rotate-12 opacity-20" />
            
            {/* Main image container */}
            <div className="relative">
              <div className="absolute inset-4 bg-gradient-to-br from-primary/30 to-accent/30 rounded-[2rem] blur-2xl" />
              <div className="relative bg-gradient-to-br from-card to-card/80 p-3 rounded-[2rem] border border-border/50 shadow-2xl">
                <img
                  src={heroImage}
                  alt="Tình nguyện viên đang hoạt động"
                  className="rounded-[1.5rem] w-full h-[500px] object-cover"
                />
                {/* Floating card overlay */}
                <div className="absolute -bottom-6 -left-6 bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center text-xs font-bold text-primary">A</div>
                      <div className="w-8 h-8 rounded-full bg-secondary/20 border-2 border-card flex items-center justify-center text-xs font-bold text-secondary">B</div>
                      <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-card flex items-center justify-center text-xs font-bold text-accent">C</div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">+50 người</p>
                      <p className="text-xs text-muted-foreground">đăng ký tuần này</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
