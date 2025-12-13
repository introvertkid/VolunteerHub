import { useEffect, useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Lock, Unlock, Download } from 'lucide-react';
import axios from 'axios';
import { RoleID } from '@/types/user';

const AdminUsers = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/v1/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {

  };

  const handleExportUsers = () => {
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
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Quản lý người dùng</h1>
            <Button onClick={handleExportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Xuất CSV
            </Button>
          </div>

          {users.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Không có người dùng nào</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle>{user.full_name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Tạo lúc: {new Date(user.created_at).toLocaleDateString('vi-VN')}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">
                              {/* Truy cập trực tiếp user.role.roleId (hoặc user.role.id tùy API trả về) */}
                              {user.role.id === RoleID.VOLUNTEER ? 'Tình nguyện viên' :
                                user.role.id === RoleID.MANAGER ? 'Quản lý sự kiện' :
                                  user.role.id === RoleID.ADMIN ? 'Admin' : 'Khác'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge variant={user.status == "ACTIVE" ? 'default' : 'destructive'}>
                        {user.status == "ACTIVE" ? 'Hoạt động' : 'Bị khóa'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant={user.status == "ACTIVE" ? 'outline' : 'default'}
                      onClick={() => handleToggleActive(user.id, user.status == "ACTIVE")}
                    >
                      {user.status == "ACTIVE" ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Khóa tài khoản
                        </>
                      ) : (
                        <>
                          <Unlock className="mr-2 h-4 w-4" />
                          Mở khóa
                        </>
                      )}
                    </Button>
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

export default AdminUsers;