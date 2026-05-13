# Mini Booking Management System

A mini booking management system for managing co-working space room reservations.

### Backend
- Laravel 12
- MySQL / PostgreSQL
- Laravel Sanctum (optional)

### Frontend
- React + Vite
- Axios
- React Hook Form
- Context API

### Yêu cầu trước khi chạy
- PHP >= 8.2
- Composer >= 2.x
- Node.js >= 18 và npm
- MySQL hoặc PostgreSQL

### Cài đặt 
1. Cài cho backend:
   ```bash
   cd booking-system
   composer install
   ```
2. Cài cho frontend:
   ```bash
   cd ../booking-frontend
   npm install
   ```

### Hướng dẫn chạy dự án
1. Clone repository:
   ```bash
   git clone https://github.com/yourusername/Palpha_test.git
   cd Palpha_test
   ```

2. Cau hinh backend:
   ```bash
   cd booking-system
   cp .env.example .env
   php artisan key:generate
   ```

3. Cấu hình CSDL trong file `.env` (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD), sau
đó chạy lệnh:
   ```bash
   php artisan migrate --seed
   ```

4. Chạy backend:
   ```bash
   php artisan serve
   ```
   Backend sẽ chạy tại : `http://127.0.0.1:8000`.

5. Mở terminal mới và chạy frontend:
   ```bash
   cd ../booking-frontend
   npm run dev -- --host 0.0.0.0 --port 3030
   ```
   Frontend sẽ chạy tại : `http://localhost:3030`.

### Neu gap loi thieu thu vien
- Backend: lại lệnh `composer install` trong thư mục `booking-system`.
- Frontend: xoa `node_modules` va `package-lock.json`, sau do chạy lại `npm install`.
- Neu cache Laravel: chạy `php artisan optimize:clear`.
### Liên hệ
Nếu bạn gặp bất kỳ vấn đề nào hoặc có câu hỏi, vui lòng liên hệ:
- Email: [phamduong652003@gmail.com](mailto:phamduong652003@gmail.com)
- GitHub: [phduong65](https://github.com/phduong65)
- Zalo: [Phạm Dương](https://zalo.me/0336719208)