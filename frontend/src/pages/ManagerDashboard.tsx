import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle, Loader2, Calendar, MapPin, Eye } from 'lucide-react';
import { useAuth, isManager } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { getEvents, deleteEvent, closeEvent, getEventRegistrations, approveOrRejectRegistration, EventDetail, EventRegistration } from '@/api/events';
import EventForm from '@/components/manager/EventForm';
import EventReport from '@/components/manager/EventReport';

const ManagerDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<EventDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<EventDetail | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [selectedEventForRegistrations, setSelectedEventForRegistrations] = useState<EventDetail | null>(null);
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isManager(user)) {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getEvents({ size: 100 });
      setEvents(data.content || []);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId);
      toast.success('Xóa sự kiện thành công!');
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Xóa sự kiện thất bại');
    }
  };

  const handleCloseEvent = async (eventId: number, action: 'COMPLETE' | 'CANCEL') => {
    try {
      await closeEvent(eventId, action);
      toast.success(`Đã ${action === 'COMPLETE' ? 'hoàn thành' : 'hủy'} sự kiện!`);
      fetchEvents();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    }
  };

  const handleViewRegistrations = async (event: EventDetail) => {
    setSelectedEventForRegistrations(event);
    setIsRegistrationsOpen(true);
    setLoadingRegistrations(true);
    try {
      const data = await getEventRegistrations(event.eventId);
      setRegistrations(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải danh sách đăng ký');
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleApproveReject = async (registrationId: number, action: 'APPROVE' | 'REJECT' | 'COMPLETE') => {
    try {
      await approveOrRejectRegistration(registrationId, action);
      const actionText = action === 'APPROVE' ? 'duyệt' : action === 'REJECT' ? 'từ chối' : 'đánh dấu hoàn thành';
      toast.success(`Đã ${actionText} đăng ký!`);
      // Refresh registrations
      if (selectedEventForRegistrations) {
        const data = await getEventRegistrations(selectedEventForRegistrations.eventId);
        setRegistrations(data);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Cập nhật đăng ký thất bại');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'PENDING': { label: 'Chờ duyệt', variant: 'outline' },
      'APPROVED': { label: 'Đã duyệt', variant: 'default' },
      'ONGOING': { label: 'Đang diễn ra', variant: 'default' },
      'COMPLETED': { label: 'Hoàn thành', variant: 'secondary' },
      'CANCELLED': { label: 'Đã hủy', variant: 'destructive' },
      'REJECTED': { label: 'Từ chối', variant: 'destructive' },
    };
    const config = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getRegistrationStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      'PENDING': { label: 'Chờ duyệt', variant: 'outline' },
      'APPROVED': { label: 'Đã duyệt', variant: 'default' },
      'REJECTED': { label: 'Từ chối', variant: 'destructive' },
      'COMPLETED': { label: 'Hoàn thành', variant: 'secondary' },
      'CANCELLED': { label: 'Đã hủy', variant: 'destructive' },
    };
    const config = statusMap[status] || { label: status, variant: 'outline' as const };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (authLoading || loading) {
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Quản lý sự kiện</h1>
            <p className="text-muted-foreground">
              Tạo, chỉnh sửa và quản lý các sự kiện tình nguyện
            </p>
          </div>

          <Tabs defaultValue="events" className="space-y-6">
            <TabsList>
              <TabsTrigger value="events">Sự kiện</TabsTrigger>
              <TabsTrigger value="registrations">Đăng ký</TabsTrigger>
              <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            </TabsList>

            {/* Events Tab */}
            <TabsContent value="events">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Danh sách sự kiện</CardTitle>
                    <CardDescription>Quản lý tất cả các sự kiện của bạn</CardDescription>
                  </div>
                  <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo sự kiện mới
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Tạo sự kiện mới</DialogTitle>
                        <DialogDescription>
                          Điền thông tin để tạo sự kiện tình nguyện mới
                        </DialogDescription>
                      </DialogHeader>
                      <EventForm
                        onSuccess={() => {
                          setIsCreateOpen(false);
                          fetchEvents();
                        }}
                        onCancel={() => setIsCreateOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tên sự kiện</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Ngày bắt đầu</TableHead>
                        <TableHead>Địa điểm</TableHead>
                        <TableHead>Đăng ký</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event) => (
                        <TableRow key={event.eventId}>
                          <TableCell className="font-medium max-w-[200px] truncate">
                            {event.title}
                          </TableCell>
                          <TableCell>{event.categoryName}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              {new Date(event.startAt).toLocaleDateString('vi-VN')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 max-w-[150px] truncate">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              {event.district}, {event.city}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              {event.registeredCount}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(event.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewRegistrations(event)}
                                title="Xem đăng ký"
                              >
                                <Users className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigate(`/events/${event.eventId}`)}
                                title="Xem chi tiết"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Dialog open={isEditOpen && selectedEvent?.eventId === event.eventId} onOpenChange={(open) => {
                                setIsEditOpen(open);
                                if (!open) setSelectedEvent(null);
                              }}>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setSelectedEvent(event)}
                                    disabled={event.status === 'COMPLETED' || event.status === 'CANCELLED'}
                                    title="Chỉnh sửa"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Chỉnh sửa sự kiện</DialogTitle>
                                    <DialogDescription>
                                      Cập nhật thông tin sự kiện
                                    </DialogDescription>
                                  </DialogHeader>
                                  {selectedEvent && (
                                    <EventForm
                                      event={selectedEvent}
                                      onSuccess={() => {
                                        setIsEditOpen(false);
                                        setSelectedEvent(null);
                                        fetchEvents();
                                      }}
                                      onCancel={() => {
                                        setIsEditOpen(false);
                                        setSelectedEvent(null);
                                      }}
                                    />
                                  )}
                                </DialogContent>
                              </Dialog>
                              {event.status !== 'COMPLETED' && event.status !== 'CANCELLED' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCloseEvent(event.eventId, 'COMPLETE')}
                                    title="Đánh dấu hoàn thành"
                                  >
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCloseEvent(event.eventId, 'CANCEL')}
                                    title="Hủy sự kiện"
                                  >
                                    <XCircle className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" title="Xóa">
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Bạn có chắc chắn muốn xóa sự kiện "{event.title}"? Hành động này không thể hoàn tác.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteEvent(event.eventId)}>
                                      Xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {events.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            Chưa có sự kiện nào. Hãy tạo sự kiện mới!
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Registrations Tab */}
            <TabsContent value="registrations">
              <Card>
                <CardHeader>
                  <CardTitle>Quản lý đăng ký</CardTitle>
                  <CardDescription>Duyệt và quản lý đăng ký tình nguyện viên</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Chọn một sự kiện từ tab "Sự kiện" và nhấn vào biểu tượng <Users className="inline h-4 w-4" /> để xem và quản lý đăng ký.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((event) => (
                        <Card key={event.eventId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleViewRegistrations(event)}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                            <CardDescription>{getStatusBadge(event.status)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.registeredCount} đăng ký</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Calendar className="h-4 w-4" />
                              <span>{new Date(event.startAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Báo cáo sự kiện</CardTitle>
                  <CardDescription>Xem danh sách tình nguyện viên tham gia sự kiện</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {events.map((event) => (
                        <Card key={event.eventId} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
                          setSelectedEvent(event);
                          setIsReportOpen(true);
                        }}>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                            <CardDescription>{getStatusBadge(event.status)}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="h-4 w-4" />
                              <span>{event.registeredCount} người tham gia</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Registrations Dialog */}
          <Dialog open={isRegistrationsOpen} onOpenChange={setIsRegistrationsOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Đăng ký cho: {selectedEventForRegistrations?.title}</DialogTitle>
                <DialogDescription>
                  Duyệt hoặc từ chối đăng ký của tình nguyện viên
                </DialogDescription>
              </DialogHeader>
              {loadingRegistrations ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Ngày đăng ký</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((reg) => (
                      <TableRow key={reg.registrationId}>
                        <TableCell className="font-medium">{reg.fullName}</TableCell>
                        <TableCell>{reg.email}</TableCell>
                        <TableCell>
                          {new Date(reg.registrationDate).toLocaleDateString('vi-VN')}
                        </TableCell>
                        <TableCell>{getRegistrationStatusBadge(reg.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {reg.status === 'PENDING' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveReject(reg.registrationId, 'APPROVE')}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                  Duyệt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApproveReject(reg.registrationId, 'REJECT')}
                                >
                                  <XCircle className="h-4 w-4 mr-1 text-red-600" />
                                  Từ chối
                                </Button>
                              </>
                            )}
                            {reg.status === 'APPROVED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReject(reg.registrationId, 'COMPLETE')}
                              >
                                <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                Hoàn thành
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {registrations.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Chưa có đăng ký nào cho sự kiện này
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </DialogContent>
          </Dialog>

          {/* Report Dialog */}
          <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Báo cáo: {selectedEvent?.title}</DialogTitle>
                <DialogDescription>
                  Danh sách tình nguyện viên tham gia sự kiện
                </DialogDescription>
              </DialogHeader>
              {selectedEvent && (
                <EventReport event={selectedEvent} />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ManagerDashboard;
