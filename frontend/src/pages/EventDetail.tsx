import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Calendar, MapPin, Users, Loader2, Check, Clock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";


const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`http://localhost:8080/api/v1/events/${id}`);
                setEvent(res.data);
            } catch (err) {
                console.error("Error fetching event:", err);
                setEvent(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);


    const handleRegister = async () => {
        if (!user) {
            toast.error("Bạn cần đăng nhập trước");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await axios.post(
                `http://localhost:8080/api/v1/events/${id}/register`
            );

            toast.success("Đăng ký thành công!");
            setShowConfirm(false);

            setEvent((prev: any) => ({
                ...prev,
                isRegistered: true,
                registeredCount: prev.registeredCount + 1
            }));

        } catch (err: any) {
            toast.error(err.response?.data?.message || "Đăng ký thất bại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 pt-24 text-center">
                    <h1 className="text-2xl font-bold">Không tìm thấy sự kiện</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    {event.imageUrl && (
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-[400px] object-cover rounded-xl mb-8"
                        />
                    )}

                    <div className="space-y-6">
                        <div>
                            <Badge className="mb-4">{event.categoryName}</Badge>
                            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
                        </div>

                        <div className="flex flex-wrap gap-6 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                <span>
                                    {new Date(event.startAt).toLocaleDateString("vi-VN")}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                <span>
                                    {event.address}, {event.ward}, {event.district}, {event.city}
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                <span>
                                    {event.registeredCount} người đã đăng ký
                                </span>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <p className="text-lg whitespace-pre-wrap">{event.description}</p>
                        </div>

                        <div className="pt-6 border-t">
                            {event.status === "PENDING" ? (<Button size="lg" disabled variant="secondary" className="gap-2">
                                <Clock className="h-5 w-5" /> Sự kiện chưa được duyệt
                            </Button>) :
                                (
                                    event.isRegistered ? (
                                        <Button size="lg" disabled variant="secondary" className="gap-2">
                                            <Check className="h-5 w-5" /> Đã đăng ký
                                        </Button>
                                    ) : (
                                        <Button size="lg" onClick={() => setShowConfirm(true)}>
                                            Đăng ký tham gia
                                        </Button>
                                    )
                                )}

                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận đăng ký</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc muốn đăng ký tham gia sự kiện:
                            <br />
                            <span className="font-semibold">{event.title}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConfirm(false)}>
                            Hủy
                        </Button>

                        <Button onClick={handleRegister} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Xác nhận đăng ký
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );

};

export default EventDetail;
