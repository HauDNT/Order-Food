<style>
    .logo-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 50px;
    }

    .logo-container img {
        margin-right: 50px;
    }
</style>

# Website đặt món ăn online với Next.js 14 và NestJS 10

<div class="logo-container">
  <img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" />
  <img src="https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" width="150" alt="Next Logo" />
  <img src="https://ies.solutions/wordpress/wp-content/uploads/jwt.png" width="150" alt="JWT Logo" />
  <img src="https://th.bing.com/th/id/R.4f46be41435ec190eccb1e819229df7b?rik=qLJtJ2oihy9E8w&riu=http%3a%2f%2fjoelcox.io%2fscripts%2flogos%2fmongo-logo.png&ehk=07W0kY%2bKXtJZJn1s35izmffF6NX0jelfmidCaghxea0%3d&risl=&pid=ImgRaw&r=0" width="150" alt="MongoDB Logo" />
</div>

## Mô Tả Dự Án

Dự án này là một ứng dụng web đặt món ăn online sử dụng **Next.js** cho frontend và **NestJS** cho backend, hỗ trợ xác thực người dùng thông qua JSON Web Tokens (JWT). 
Ứng dụng cho phép người dùng đăng nhập, đăng ký và quản lý tài khoản của họ một cách an toàn và có những tính năng cơ bản của 1 website đặt món ăn (tương tự ShopeeFood).

### Tính Năng

- Đăng ký và đăng nhập người dùng
- Xác thực người dùng với JWT
- Quản lý phiên người dùng
- Giao diện người dùng thân thiện và responsive
- API RESTful cho backend
- Xem cửa hàng, đặt món ăn theo yêu cầu

## Công Nghệ Sử Dụng

- **Frontend**: [Next.js 14](https://nextjs.org)
- **Backend**: [NestJS 10](https://nestjs.com)
- **Cơ sở dữ liệu**: [MongoDB](https://www.mongodb.com)
- **Xác thực**: JSON Web Tokens (JWT), NestJS Passport