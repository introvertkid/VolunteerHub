import { useEffect, useState } from "react";
import { EventCard } from "./EventCard";
import { Loader2 } from "lucide-react";
import axios from "axios";

export const FeaturedEvents = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/events/featured');
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl font-bold">Sự kiện nổi bật</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Khám phá và tham gia các hoạt động tình nguyện ý nghĩa đang chờ đợi bạn
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.event_date}
                location={event.location}
                category={event.category}
                currentParticipants={event.current_participants}
                maxParticipants={event.max_participants}
                imageUrl={event.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            Chưa có sự kiện nào được duyệt
          </div>
        )}
      </div>
    </section>
  );
};
