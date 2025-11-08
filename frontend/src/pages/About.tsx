import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Heart, Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Về Chúng Tôi
            </h1>
            <p className="text-xl text-muted-foreground">
              Nền tảng kết nối cộng đồng tình nguyện tại Việt Nam
            </p>
          </div>

          <div className="prose max-w-none space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold m-0">Sứ Mệnh</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Chúng tôi xây dựng một nền tảng công nghệ để kết nối những trái tim nhân ái, 
                tạo điều kiện cho mọi người dễ dàng tham gia và tổ chức các hoạt động tình nguyện. 
                Mục tiêu của chúng tôi là lan tỏa tinh thần cống hiến và tạo ra những thay đổi tích cực 
                cho cộng đồng và xã hội.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <h2 className="text-3xl font-bold m-0">Tầm Nhìn</h2>
              </div>
              <p className="text-lg text-muted-foreground">
                Trở thành nền tảng tình nguyện hàng đầu tại Việt Nam, nơi mọi người có thể 
                dễ dàng tìm kiếm, tham gia và tổ chức các hoạt động ý nghĩa. Chúng tôi hướng tới 
                việc xây dựng một cộng đồng tình nguyện năng động, nơi mọi đóng góp đều được 
                ghi nhận và tôn vinh.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <h2 className="text-3xl font-bold m-0">Giá Trị Cốt Lõi</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">Minh Bạch</h3>
                  <p className="text-muted-foreground">
                    Thông tin sự kiện rõ ràng, quy trình đăng ký công khai và dễ hiểu
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">Tôn Trọng</h3>
                  <p className="text-muted-foreground">
                    Trân trọng mọi đóng góp và coi trọng thời gian của tình nguyện viên
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">Cộng Đồng</h3>
                  <p className="text-muted-foreground">
                    Xây dựng môi trường kết nối, chia sẻ và hỗ trợ lẫn nhau
                  </p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="text-xl font-semibold mb-2">Hiệu Quả</h3>
                  <p className="text-muted-foreground">
                    Tối ưu hóa quy trình để tạo ra tác động thực sự cho cộng đồng
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold m-0">Cam Kết</h2>
              </div>
              <ul className="space-y-3 text-lg text-muted-foreground list-none">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Đảm bảo mọi hoạt động được kiểm duyệt kỹ lưỡng trước khi công bố</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Bảo vệ thông tin cá nhân của người dùng một cách tối đa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Hỗ trợ tích cực cho các tổ chức và cá nhân tổ chức sự kiện</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">✓</span>
                  <span>Cải tiến liên tục để mang lại trải nghiệm tốt nhất cho cộng đồng</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
