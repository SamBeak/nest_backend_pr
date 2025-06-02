# NestJS Backend API

[![NestJS Version](https://img.shields.io/npm/v/@nestjs/core.svg)](https://www.npmjs.com/package/@nestjs/core)
[![License](https://img.shields.io/github/license/SamBeak/nest_backend_pr)](https://github.com/SamBeak/nest_backend_pr/blob/main/LICENSE)
[![CI](https://github.com/SamBeak/nest_backend_pr/actions/workflows/ci.yml/badge.svg)](https://github.com/SamBeak/nest_backend_pr/actions)

A robust and scalable backend API built with NestJS, TypeORM, and PostgreSQL.

## 🚀 Features

- **RESTful API** - Clean, maintainable, and well-documented API endpoints
- **Authentication** - JWT-based authentication system
- **Database** - PostgreSQL with TypeORM for database operations
- **Validation** - Request validation using class-validator
- **Pagination** - Built-in pagination support for collections
- **API Documentation** - Interactive API documentation with Swagger
- **Environment Configuration** - Easy environment-based configuration
- **Modular Architecture** - Well-structured, modular codebase

## 📦 Prerequisites

- Node.js (v16 or later)
- npm or yarn
- PostgreSQL (v12 or later)
- Git

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/SamBeak/nest_backend_pr.git
   cd nest_backend_pr
   ```

2. **Install dependencies**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Setup environment variables**

   Copy the example environment file and update the values:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration.

## 🚀 Getting Started

### Development

```bash
# Start in development mode with hot-reload
npm run start:dev
# or
yarn start:dev
```

### Production

```bash
# Build the application
npm run build

# Start in production mode
npm run start:prod
```

### Running Tests

```bash
# Run unit tests
npm test

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Documentation

Once the application is running, you can access the API documentation at:

- Swagger UI: `http://localhost:3000/api`
- JSON API Spec: `http://localhost:3000/api-json`

## 📁 Project Structure

```text
src/
├── auth/               # Authentication module
│   ├── const/          # Constants
│   ├── dto/            # Data Transfer Objects
│   ├── guard/          # Authentication guards
│   └── pipe/           # Custom pipes
├── common/             # Shared modules and utilities
│   ├── const/          # Global constants
│   ├── entities/       # Shared database entities
│   └── validation/     # Custom validation logic
├── posts/              # Posts module
│   ├── dto/            # Post DTOs
│   └── entities/       # Post entities
├── users/              # Users module
│   ├── const/          # User constants
│   ├── decorator/      # Custom decorators
│   └── entities/       # User entities
├── app.module.ts       # Root application module
└── main.ts             # Application entry file
```

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=nest_backend

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Swagger
SWAGGER_TITLE=NestJS API
SWAGGER_DESCRIPTION=API documentation
SWAGGER_VERSION=1.0
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [TypeORM](https://typeorm.io/) - ORM for TypeScript and JavaScript
- [PostgreSQL](https://www.postgresql.org/) - The World's Most Advanced Open Source Relational Database

## 🚀 Deployment

When you're ready to deploy your NestJS application to production, follow these steps to ensure optimal performance:

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Set environment variables**

   Ensure all production environment variables are properly configured in your deployment environment.

3. **Use a process manager**

   Consider using PM2 or another process manager to keep your application running:

   ```bash
   npm install -g pm2
   pm2 start dist/main.js --name nest-backend
   ```

4. **Set up a reverse proxy**
   Use Nginx or Apache as a reverse proxy in front of your application for better performance and security.

5. **Enable HTTPS**
   Secure your application with SSL/TLS using Let's Encrypt or another certificate authority.

For more detailed deployment instructions, refer to the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## 📚 Resources

Here are some helpful resources for working with NestJS:

- [Official NestJS Documentation](https://docs.nestjs.com) - Comprehensive guides and API references
- [TypeORM Documentation](https://typeorm.io/) - Database ORM documentation
- [NestJS GitHub Repository](https://github.com/nestjs/nest) - Source code and issue tracker
- [NestJS Community](https://discord.gg/nestjs) - Join the community on Discord for help and discussions
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
