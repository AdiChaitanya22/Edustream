# EduStream - Adaptive Streaming Platform for Education

**EduStream** is a cloud-native adaptive streaming platform optimized for low-bandwidth environments (100 kbps–1.5 Mbps). It enables educators to deliver high-quality video content to students in regions with limited connectivity.

---

## 🎯 Features

- **Adaptive Bitrate Streaming**: Automatic quality adjustment based on bandwidth
- **Offline Content Caching**: PWA support for offline viewing
- **Low-Bandwidth Optimization**: Works reliably on 100 kbps–1.5 Mbps connections
- **Encoding Pipeline**: Automated FFmpeg-based video encoding (multiple quality levels)
- **Message Queue**: RabbitMQ for async encoding jobs
- **Real-time Monitoring**: Prometheus + Grafana dashboards
- **Distributed Tracing**: Jaeger for observability
- **Microservices Architecture**: Modular, scalable design
- **Secure Authentication**: JWT-based auth, Google OAuth 2.0 integration, and role-based access control (RBAC)
- **Admin Dashboard**: Real-time user management (roles, deactivation), video management (editing metadata, deletion), and live system metrics

---

## 🏗️ Architecture

```
EduStream (Monorepo)
├── apps/
│   ├── backend/          # NestJS microservices
│   │   ├── src/
│   │   │   ├── auth/     # JWT authentication
│   │   │   ├── users/    # User management
│   │   │   ├── content/  # Video content metadata
│   │   │   ├── streaming/ # HLS delivery service
│   │   │   ├── encoding/ # FFmpeg worker service
│   │   │   └── analytics/ # Usage analytics
│   │   └── package.json
│   └── frontend/         # React + Tailwind frontend
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── hooks/
│       └── package.json
├── infra/                # Infrastructure configs
│   ├── docker/
│   ├── kubernetes/
│   ├── terraform/
│   └── cicd/
├── docker-compose.yml    # Local development stack
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- Docker & Docker Compose
- Git

### 1. Clone & Setup

```bash
cd edustream
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Update .env with your configuration if needed
```

### 3. Start Development Stack

```bash
npm run docker:up
```

This will start:
- **MongoDB** (27017): Database
- **Redis** (6379): Cache & session store
- **RabbitMQ** (5672, 15672): Message broker
- **FFmpeg Service**: Encoding worker
- **Prometheus** (9090): Metrics
- **Grafana** (3003): Dashboards
- **Jaeger** (16686): Distributed tracing
- **MinIO** (9000, 9001): S3-compatible storage

### 4. Start Backend & Frontend

```bash
# In separate terminals:
npm run dev:backend  # Runs on http://localhost:3000
npm run dev:frontend # Runs on http://localhost:3001
```

Or all at once:
```bash
npm run dev
```

### 5. Verify Services

- **Backend**: http://localhost:3000/api/health
- **Frontend**: http://localhost:3001
- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Grafana**: http://localhost:3003 (admin/admin)
- **Jaeger**: http://localhost:16686
- **MinIO**: http://localhost:9001 (minioadmin/minioadmin)

---

## 📦 Project Workspace

```
edustream/
├── apps/backend/          # NestJS backend
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   └── ... (modules to be created)
│   ├── package.json
│   └── tsconfig.json
├── apps/frontend/         # React frontend
│   ├── src/
│   │   ├── index.tsx
│   │   └── ... (components to be created)
│   ├── package.json
│   └── tsconfig.json
├── infra/
│   ├── docker-compose.yml
│   ├── Dockerfile.ffmpeg
│   ├── mongodb/init.js
│   ├── prometheus/prometheus.yml
│   └── kubernetes/ (manifests)
├── docker-compose.yml
├── package.json (root)
└── .env.example
```

---

## 🛠️ Development Commands

### Backend
```bash
cd apps/backend
npm run start:dev     # Start with hot-reload
npm run build         # Build for production
npm run test          # Run unit tests
npm run test:e2e      # Run integration tests
```

### Frontend
```bash
cd apps/frontend
npm start             # Start dev server
npm run build         # Build for production
npm run test          # Run tests
npm run eject         # Eject from CRA (one-way)
```

### Docker
```bash
npm run docker:build  # Build all services
npm run docker:up     # Start containers
npm run docker:down   # Stop containers
npm run docker:logs   # View logs
```

---

## 🧪 Testing

### Unit & Integration Tests
```bash
npm run test          # Run all tests
npm run test:backend  # Backend tests only
npm run test:frontend # Frontend tests only
```

### Coverage
```bash
npm run test -- --coverage
```

---

## 📊 Monitoring & Observability

### Metrics (Prometheus)
- http://localhost:9090
- Queries available for uptime, request latency, encoding jobs, etc.

### Dashboards (Grafana)
- http://localhost:3003
- Pre-configured dashboards for API health, video encoding, and streaming quality

### Distributed Tracing (Jaeger)
- http://localhost:16686
- Trace requests across microservices

---

## 🔐 Security

- **JWT Authentication**: All API endpoints protected
- **Password Hashing**: bcryptjs with salt rounds = 10
- **Rate Limiting**: 100 requests per 15 minutes
- **CORS**: Configured for `localhost:3000` and `localhost:3001`
- **Environment Secrets**: Use `.env` file, never commit secrets

---

## 📝 Completed Roadmap

All development phases are now fully completed:

### Phase 1: Foundation
- [x] Monorepo structure setup
- [x] Docker Compose with 8 services
- [x] NestJS backend skeleton
- [x] React frontend skeleton
- [x] Kubernetes manifests & CI/CD pipeline configuration

### Phase 2: Core Backend
- [x] Initialize NestJS app with database setup
- [x] Create MongoDB schemas (users, videos, encodings, sessions, analytics)
- [x] Set up Redis client and caching layer

### Phase 3: Authentication & Security
- [x] JWT auth service & refresh tokens
- [x] User registration & login endpoints
- [x] Role-based access control (RBAC)
- [x] Google OAuth 2.0 integration

### Phase 4: Streaming Service
- [x] HLS manifest generation
- [x] Adaptive bitrate selection
- [x] Progress tracking & streaming session management

### Phase 5: Encoding Pipeline
- [x] FFmpeg worker service
- [x] RabbitMQ job queue
- [x] Quality level generation (240p, 360p, 480p, 720p)

### Phase 6: Frontend (React)
- [x] React setup with Tailwind CSS
- [x] HLS.js video player & adaptive bitrate switching
- [x] Offline PWA caching readiness
- [x] User Dashboard & Watch page

### Phase 7: Infrastructure
- [x] Kubernetes manifests (deployments, statefulsets, services, HPA, network policies)
- [x] Terraform config templates
- [x] Prometheus & Grafana monitoring dashboards setup

### Phase 8: CI/CD
- [x] GitHub Actions workflows (linting, tests, docker building, staging & production deployments)

---

## 🔮 Future Enhancements & Next Steps

Here are planned future enhancements to make the platform fully production-ready:

### Production Readiness
- [ ] Add comprehensive unit & integration tests
- [ ] Integrate CDN for video segments and assets
- [ ] Implement email verification and password reset flows
- [ ] Add video thumbnails generation worker
- [ ] Full PWA offline video caching
- [ ] Add video captions/subtitles support
- [ ] Implement live streaming capabilities

### Performance & Security
- [ ] Optimize database queries and setup connection pooling
- [ ] Add Redis caching for video metadata and popular lists
- [ ] Implement API key authentication for encoding service
- [ ] Add video encryption/DRM support
- [ ] Implement user-specific rate limiting

---

## 📚 Documentation

See `/docs` (to be created) for:
- API specifications (Swagger)
- Database schemas
- Encoding quality guidelines
- Deployment guides
- Troubleshooting

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push: `git push origin feature/your-feature`
4. Create a Pull Request


