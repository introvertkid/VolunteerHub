import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Check, X, Trash2 } from 'lucide-react';
import axios from 'axios';

const AdminEvents = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/v1/events");
            setEvents(res.data.content);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch events:", err);
        }
    };


    const handleUpdateStatus = async (eventId: string, newStatus: string) => {
        setLoading(true);
        try {
            const response = await axios.patch(
                `http://localhost:8080/api/events/${eventId}/admin-review`, // URL
                { action: newStatus }
            );

            toast.success(response.data.message || 'Xử lý thành công!');

        } catch (error: any) {
            console.error(error);
            if (error.response) {
                toast.error(`Lỗi: ${error.response.data.message || 'Không thể xử lý'}`);
            } else if (error.request) {
                toast.error('Không thể kết nối đến Server');
            } else {
                toast.error('Có lỗi xảy ra');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (eventId: string) => {
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-8">Duyệt sự kiện</h1>

                    {events.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <p className="text-muted-foreground">Không có sự kiện nào</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {events.map((event) => (
                                <Card key={event.id}>
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <CardTitle>{event.title}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    Tạo bởi: {event.profiles?.full_name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Ngày: {new Date(event.event_date).toLocaleDateString('vi-VN')} • {event.location}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={
                                                    event.status === 'approved' ? 'default' :
                                                        event.status === 'pending' ? 'secondary' :
                                                            event.status === 'rejected' ? 'destructive' : 'outline'
                                                }
                                            >
                                                {event.status === 'pending' ? 'Chờ duyệt' :
                                                    event.status === 'approved' ? 'Đã duyệt' :
                                                        event.status === 'rejected' ? 'Từ chối' :
                                                            event.status === 'draft' ? 'Nháp' : event.status}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
                                        <div className="flex gap-2">
                                            {event.status !== 'approved' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(event.id, 'approved')}
                                                >
                                                    <Check className="mr-2 h-4 w-4" />
                                                    Duyệt
                                                </Button>
                                            )}
                                            {event.status !== 'rejected' && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleUpdateStatus(event.id, 'rejected')}
                                                >
                                                    <X className="mr-2 h-4 w-4" />
                                                    Từ chối
                                                </Button>
                                            )}
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Xóa
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminEvents;