# Hướng Dẫn Cài Đặt Dự Án

## Mục lục

- [Giới thiệu](#giới-thiệu)
- [Yêu cầu](#yêu-cầu)
- [Cài đặt](#cài-đặt)
  - [Bước 1: Clone repository](#bước-1-clone-repository)
  - [Bước 2: Cài đặt các gói phụ thuộc](#bước-2-cài-đặt-các-gói-phụ-thuộc)
  - [Bước 3: Cấu hình biến môi trường](#bước-3-cấu-hình-biến-môi-trường)
  - [Bước 4: Khởi động dự án](#bước-4-khởi-động-dự-án)
- [Lưu ý quan trọng](#lưu-ý-quan-trọng)

## Giới Thiệu

Đây là một dự án **E-commerce Node.js** có tên là **Aureo Mall**. Dự án này sử dụng [Express](https://expressjs.com/) và [Sequelize](https://sequelize.org/) để quản lý cơ sở dữ liệu.

## Yêu Cầu

- **Node.js** v20.x trở lên
- **NPM** hoặc **Yarn**
- Một cơ sở dữ liệu (ví dụ: **MySQL**, **PostgreSQL**)

## Cài Đặt

### Bước 1: Clone Repository

Sao chép repository về máy tính của bạn:

```bash
git https://github.com/NguyenTienHieu-GitHub/aureo-mall-server.git
cd aureo-mall-server
```

### Bước 2: Cài đặt các gói phụ thuộc

- Chạy lệnh sau để cài đặt các gói phụ thuộc:

```bash
npm install
# hoặc sử dụng Yarn
# yarn install
```

### Bước 3: Cấu hình biến môi trường

- Sao chép tệp cấu hình mẫu `.env.example` thành các tệp `.env.development`, `.env.production` và `.env.test `:

```bash
cp .env.example .env.development
cp .env.example .env.production
cp .env.example .env.test
```

- Mở tệp các tệp `.env.development`, `.env.production`, `.env.test ` và cập nhật các giá trị sau:

```.env.development
# Operating environment
# development : môi trường phát triển
# production : môi trường sản xuất
# test : môi trường kiểm thử
NODE_ENV=operating_environment

#Cấu hình nodemailer
USER_MAIL=your_email
PASSWORD_MAIL=your_email_password

#Cấu hình cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Cấu hình cơ sở dữ liệu
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_NAME=your_db_name

# Dưới đây là một số giá trị phổ biến mà bạn có thể sử dụng cho thuộc tính dialect trong Sequelize:
# mysql: Cho cơ sở dữ liệu MySQL.
# postgres: Cho cơ sở dữ liệu PostgreSQL.
# sqlite: Cho cơ sở dữ liệu SQLite.
# mssql: Cho cơ sở dữ liệu Microsoft SQL Server.
DB_DIALECT=your_db_dialect

# JWT secrets
SECRET_KEY=your_secret_key
REFRESH_KEY=your_refresh_key

# Chi tiết người dùng quản trị (để thiết lập ban đầu)
FIRST_NAME_ADMIN=your_admin_first_name
LAST_NAME_ADMIN=your_admin_last_name
EMAIL_ADMIN=your_admin_email
PASSWORD_ADMIN=your_admin_password

# Thiết lập thời gian hết hạn của token
# s hoặc sec: giây
# m hoặc min: phút
# h: giờ
# d: ngày
# w: tuần
JWT_ACCESS_EXPIRES_IN=expires_in # 10m   "10 phút"
JWT_REFRESH_EXPIRES_IN=expires_in # 7d   "7 ngày"

# Đồng bộ cơ sở dữ liệu
# SYNC_FORCE=true : Sequelize sẽ xóa tất cả dữ liệu và cấu trúc bảng hiện tại trong cơ sở dữ liệu trước khi tạo lại các bảng theo định nghĩa mô hình của bạn. Điều này có nghĩa là mọi dữ liệu trước đó trong các bảng sẽ bị mất.
# SYNC_FORCE=false : Sequelize sẽ chỉ tạo các bảng nếu chúng chưa tồn tại. Nếu bảng đã tồn tại, Sequelize sẽ không thực hiện bất kỳ thay đổi nào và giữ nguyên dữ liệu hiện có. Điều này có nghĩa là bạn có thể thêm các trường mới hoặc thay đổi cấu trúc bảng mà không làm mất dữ liệu cũ.
SYNC_FORCE=true_or_false

```

### Bước 4: Khởi động dự án

- Chạy ứng dụng bằng một trong các lệnh sau:

```bash
# chạy mới môi trường sản xuất
npm run start

# chạy với môi trường phát triền
npm run dev

# chạy với môi trường test
npm run test
```

## Lưu Ý Quan Trọng

- **🔒 Bảo Mật**: Vui lòng không tiết lộ JWT secret và thông tin cơ sở dữ liệu trong mã nguồn. Sử dụng tệp `.env` để lưu trữ các biến môi trường.
- **💾 Cơ Sở Dữ Liệu**: Trước khi sử dụng `SYNC_FORCE=true`, hãy sao lưu cơ sở dữ liệu để tránh mất dữ liệu không mong muốn.
- **🧪 Kiểm Thử**: Để chạy kiểm thử, sử dụng lệnh `npm test` sau khi đã cài đặt các gói phụ thuộc.
- **🚀 Triển Khai**: Đảm bảo rằng bạn đã cấu hình môi trường sản xuất trước khi triển khai ứng dụng.
- **🔍 Phiên Bản**: Ứng dụng yêu cầu Node.js phiên bản 20.x trở lên. Vui lòng kiểm tra phiên bản của bạn bằng lệnh `node -v`.
- **🤝 Góp Phần**: Nếu bạn muốn đóng góp cho dự án, hãy tạo một pull request và đảm bảo tuân thủ các tiêu chuẩn mã hóa được nêu trong dự án.
- **📞 Liên Hệ Hỗ Trợ**: Nếu bạn gặp khó khăn hoặc cần hỗ trợ, hãy liên hệ qua email: [tienhieu2kk3@gmail.com](mailto:tienhieu2kk3@gmail.com).
