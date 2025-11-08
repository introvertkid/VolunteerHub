import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, Award } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-volunteers.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
        style={{
          backgroundImage: `linear-gradient(135deg, hsl(var(--primary) / 0.05), hsl(var(--accent) / 0.05))`,
        }}
      />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Cùng nhau tạo nên sự khác biệt
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Kết nối tình nguyện viên,
              <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
                {" "}lan tỏa yêu thương
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed">
              Tham gia các hoạt động tình nguyện ý nghĩa như trồng cây, dọn rác, từ thiện và nhiều hơn nữa. 
              Hãy cùng chúng tôi xây dựng một cộng đồng tốt đẹp hơn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="hero" asChild>
                <Link to="/events">
                  Khám phá sự kiện
                  <ArrowRight className="ml-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Trở thành tình nguyện viên</Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  <span className="text-2xl font-bold">1000+</span>
                </div>
                <p className="text-sm text-muted-foreground">Tình nguyện viên</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-secondary">
                  <Calendar className="h-5 w-5" />
                  <span className="text-2xl font-bold">150+</span>
                </div>
                <p className="text-sm text-muted-foreground">Sự kiện</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <Award className="h-5 w-5" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <p className="text-sm text-muted-foreground">Thành tựu</p>
              </div>
            </div>
          </div>

          <div className="relative lg:block hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
            <img
              src={heroImage}
              alt="Tình nguyện viên đang trồng cây"
              className="relative rounded-3xl shadow-2xl w-full h-auto object-cover"
              style={{ boxShadow: 'var(--shadow-elegant)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
