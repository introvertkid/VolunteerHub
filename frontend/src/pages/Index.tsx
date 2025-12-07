import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { FeaturedEvents } from "@/components/FeaturedEvents";
import { Footer } from "@/components/Footer";
import { TreePine, Users, Heart, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      
      {/* How it works section */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-background" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              Đơn giản & Nhanh chóng
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bắt đầu hành trình của bạn
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chỉ với 3 bước đơn giản, bạn đã có thể tham gia các hoạt động tình nguyện ý nghĩa
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Tạo tài khoản",
                description: "Đăng ký miễn phí chỉ trong 30 giây với email của bạn",
                color: "from-primary to-emerald-500"
              },
              {
                step: "02",
                icon: Heart,
                title: "Chọn sự kiện",
                description: "Khám phá và đăng ký các hoạt động phù hợp với bạn",
                color: "from-secondary to-orange-500"
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "Tham gia & Đóng góp",
                description: "Có mặt và tạo ra những thay đổi tích cực cho cộng đồng",
                color: "from-accent to-blue-500"
              }
            ].map((item, index) => (
              <div key={index} className="group relative">
                {/* Connector line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="relative p-8 rounded-3xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
                  {/* Step number */}
                  <span className="absolute -top-4 -left-2 text-7xl font-bold text-muted/30 select-none">
                    {item.step}
                  </span>
                  
                  {/* Icon */}
                  <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} p-0.5 mb-6`}>
                    <div className="w-full h-full rounded-2xl bg-card flex items-center justify-center">
                      <item.icon className="h-6 w-6 text-foreground" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FeaturedEvents />
      
      {/* Impact section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-accent/5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium">
                Tác động thực tế
              </span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Mỗi hành động nhỏ đều 
                <span className="text-primary"> tạo nên sự khác biệt</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Cùng nhìn lại những con số ấn tượng mà cộng đồng tình nguyện viên đã đạt được trong năm qua
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: TreePine, value: "2,500+", label: "Cây được trồng", color: "text-emerald-500" },
                  { icon: Users, value: "15,000+", label: "Người được hỗ trợ", color: "text-blue-500" },
                  { icon: Heart, value: "500+", label: "Suất quà từ thiện", color: "text-rose-500" },
                  { icon: Clock, value: "10,000+", label: "Giờ tình nguyện", color: "text-amber-500" },
                ].map((stat, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-card border border-border">
                    <stat.icon className={`h-8 w-8 ${stat.color} mb-3`} />
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                    <TreePine className="h-20 w-20 text-primary/40" />
                  </div>
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 border border-accent/20 flex items-center justify-center">
                    <Heart className="h-12 w-12 text-accent/40" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-32 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 border border-secondary/20 flex items-center justify-center">
                    <Users className="h-12 w-12 text-secondary/40" />
                  </div>
                  <div className="h-48 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-20 w-20 text-emerald-500/40" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-emerald-600 to-teal-600" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
            
            <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Sẵn sàng tạo nên sự thay đổi?
              </h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                Tham gia cộng đồng hàng nghìn tình nguyện viên và bắt đầu hành trình ý nghĩa của bạn ngay hôm nay
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-xl" asChild>
                  <Link to="/auth" state={{ tab: "register" }}>
                    Đăng ký ngay
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link to="/events">Xem sự kiện</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
