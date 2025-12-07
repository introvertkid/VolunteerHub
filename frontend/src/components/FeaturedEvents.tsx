import { useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { Loader2, Sparkles, ArrowRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import axios from "axios";

export const FeaturedEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/events');
        setEvents(res.data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <div className="container mx-auto px-4 flex flex-col items-center justify-center gap-4 relative">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-primary relative" />
          </div>
          <p className="text-muted-foreground animate-pulse">Đang tải sự kiện...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-primary">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">Khám phá</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Sự kiện <span className="text-primary">nổi bật</span>
            </h2>
            <p className="text-muted-foreground max-w-lg">
              Tham gia các hoạt động ý nghĩa và tạo ra những thay đổi tích cực cho cộng đồng
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Lọc
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 group" asChild>
              <Link to="/events">
                Xem tất cả
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>

        {events.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.slice(0, 8).map((event, index) => (
                <div 
                  key={event.eventId} 
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  <EventCard
                    eventId={event.eventId}
                    title={event.title}
                    description={event.description}
                    categoryName={event.categoryName}
                    address={event.address}
                    ward={event.ward}
                    district={event.district}
                    city={event.city}
                    startAt={event.startAt}
                    endAt={event.endAt}
                    status={event.status}
                    createdBy={event.createdBy}
                    registeredCount={event.registeredCount}
                    isRegistered={event.isRegistered}
                    isApproved={event.isApproved}
                  />
                </div>
              ))}
            </div>
            
            {events.length > 8 && (
              <div className="mt-12 text-center">
                <Button size="lg" variant="outline" className="gap-2 group" asChild>
                  <Link to="/events">
                    Khám phá thêm {events.length - 8} sự kiện
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Sparkles className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Chưa có sự kiện nào</h3>
            <p className="text-muted-foreground mb-6">Hãy quay lại sau để xem các sự kiện mới nhất</p>
            <Button asChild>
              <Link to="/auth" state={{ tab: "register" }}>Đăng ký nhận thông báo</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
