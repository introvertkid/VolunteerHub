import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Users, CheckCircle, Clock, XCircle, Calendar, MapPin } from 'lucide-react';
import { getEventRegistrations, EventRegistration, EventDetail } from '@/api/events';
import { toast } from 'sonner';

interface EventReportProps {
  event: EventDetail;
}

const EventReport = ({ event }: EventReportProps) => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, [event.eventId]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const data = await getEventRegistrations(event.eventId);
      setRegistrations(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Không thể tải báo cáo');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: any }> = {
      'PENDING': { label: 'Chờ duyệt', variant: 'outline', icon: Clock },
      'APPROVED': { label: 'Đã duyệt', variant: 'default', icon: CheckCircle },
      'REJECTED': { label: 'Từ chối', variant: 'destructive', icon: XCircle },
      'COMPLETED': { label: 'Hoàn thành', variant: 'secondary', icon: CheckCircle },
      'CANCELLED': { label: 'Đã hủy', variant: 'destructive', icon: XCircle },
    };
    const config = statusMap[status] || { label: status, variant: 'outline' as const, icon: Clock };
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Calculate statistics
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'PENDING').length,
    approved: registrations.filter(r => r.status === 'APPROVED').length,
    completed: registrations.filter(r => r.status === 'COMPLETED').length,
    rejected: registrations.filter(r => r.status === 'REJECTED').length,
    cancelled: registrations.filter(r => r.status === 'CANCELLED').length,
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Event Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Thông tin sự kiện</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>
              {new Date(event.startAt).toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{event.address}, {event.ward}, {event.district}, {event.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{event.registeredCount} người đăng ký</span>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-center">{stats.total}</div>
            <div className="text-sm text-muted-foreground text-center">Tổng đăng ký</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-center text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-muted-foreground text-center">Chờ duyệt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-center text-blue-600">{stats.approved}</div>
            <div className="text-sm text-muted-foreground text-center">Đã duyệt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-center text-green-600">{stats.completed}</div>
            <div className="text-sm text-muted-foreground text-center">Hoàn thành</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-center text-red-600">{stats.rejected + stats.cancelled}</div>
            <div className="text-sm text-muted-foreground text-center">Từ chối/Hủy</div>
          </CardContent>
        </Card>
      </div>

      {/* Volunteers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Danh sách tình nguyện viên</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>STT</TableHead>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((reg, index) => (
                <TableRow key={reg.registrationId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{reg.fullName}</TableCell>
                  <TableCell>{reg.email}</TableCell>
                  <TableCell>
                    {new Date(reg.registrationDate).toLocaleDateString('vi-VN')}
                  </TableCell>
                  <TableCell>{getStatusBadge(reg.status)}</TableCell>
                </TableRow>
              ))}
              {registrations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Chưa có tình nguyện viên đăng ký sự kiện này
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary by Status */}
      {registrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Danh sách hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations
                  .filter(r => r.status === 'COMPLETED')
                  .map((reg, index) => (
                    <TableRow key={reg.registrationId}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{reg.fullName}</TableCell>
                      <TableCell>{reg.email}</TableCell>
                    </TableRow>
                  ))}
                {registrations.filter(r => r.status === 'COMPLETED').length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                      Chưa có tình nguyện viên hoàn thành
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EventReport;
