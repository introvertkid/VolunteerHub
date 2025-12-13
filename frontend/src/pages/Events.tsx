import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EventCard, EventCardProps } from '@/components/EventCard';
import { useEvents } from '@/hooks/useEvents';

const Events = () => {
    const { events } = useEvents();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                            Các Sự Kiện Tình Nguyện
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Tham gia cùng chúng tôi để tạo nên sự thay đổi tích cực cho cộng đồng
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map((event) => (
                            <EventCard
                                key={event.eventId}
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

                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Events;
