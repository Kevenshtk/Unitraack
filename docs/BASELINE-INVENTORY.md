# BASELINE-INVENTORY.md — Inventário Técnico Completo do Projeto (Unitraack)

**Data do Levantamento**: 05 de Novembro de 2026  
**Escopo**: Projeto Completo (Raiz, `backend/` e `frontend/`)  
**Método**: Inspeção estática direta da árvore de código-fonte e arquivos de configuração atuais  
**Status**: Factual / Não Modificante

---

## 1. Visão Geral da Volumetria do Projeto

O repositório está organizado como um monorepo contendo orquestração na raiz, uma API REST em Node.js/Express (`backend/`) e uma Single Page Application em React 19/Vite (`frontend/`):

| Camada / Diretório | Quantidade de Arquivos (Código/Config) | Detalhamento Principal |
| :--- | :---: | :--- |
| **Raiz do Repositório** | 4 | `package.json`, `package-lock.json`, `docker-compose.yml`, `.gitignore` |
| **Backend (`backend/`)** | 91 | **57** arquivos TypeScript (`.ts`) em `src/`, **27** scripts SQL (`.sql`) em `src/sql/` e `src/database/migrations/`, mais 7 arquivos de manifesto/ambiente/Docker |
| **Frontend (`frontend/`)** | 86 | **64** arquivos em `src/` (`.tsx`, `.ts`, `.css`), **10** ativos/configurações em `public/` (PWA, ícones, logos, `security.txt`), mais 12 arquivos de build/configuração |

---

## 2. Estrutura Completa de Diretórios (Excluindo `docs/`, `.agents/` e `.specify/`)

```text
Unitraack/
├── .gitignore
├── docker-compose.yml                          # Orquestração Docker (serviços backend:3333 e frontend:5173)
├── package.json                                # Scripts raiz com concurrently (dev, dev:front, dev:back, build)
│
├── backend/                                    # API REST Node.js + Express 5 + TypeScript + Supabase/PostgreSQL
│   ├── .dockerignore
│   ├── .env / .env.example
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts                           # Bootstrap Express, middlewares globais, healthcheck e RFC 9116
│       ├── config/
│       │   ├── database.ts                     # Pool de conexão PostgreSQL (pg)
│       │   └── supabase.ts                     # Clientes Supabase (supabase e supabaseAdmin com Service Role)
│       ├── domain/
│       │   ├── entities/
│       │   │   └── EntryRequest.ts             # Tipos e interfaces de RequestStatus, MaterialStatus, EntryRequest e Material
│       │   └── repositories/
│       │       └── IRequestRepository.ts       # Contrato de repositório de solicitações e materiais
│       ├── application/
│       │   └── use-cases/                      # 19 casos de uso da aplicação
│       │       ├── AcceptMaterialTransfer.ts
│       │       ├── CancelByGatekeeper.ts
│       │       ├── CancelEntryRequest.ts
│       │       ├── CancelMaterialTransfer.ts
│       │       ├── ConfirmEntry.ts
│       │       ├── ConfirmMaterialMovement.ts
│       │       ├── CreateEntryRequest.ts
│       │       ├── DeleteEntryRequest.ts
│       │       ├── GetAuditHistory.ts
│       │       ├── GetRequestDetails.ts
│       │       ├── ListRequests.ts
│       │       ├── ListSectorMaterials.ts
│       │       ├── MarkCheckout.ts
│       │       ├── MarkMaterialForExit.ts
│       │       ├── NotifyDiscrepancy.ts
│       │       ├── RejectMaterialTransfer.ts
│       │       ├── ReviewEntryRequest.ts
│       │       ├── TransferMaterial.ts
│       │       └── UpdateEntryRequest.ts
│       ├── infrastructure/
│       │   └── database/
│       │       └── SupabaseRequestRepository.ts # Implementação concreta de IRequestRepository (401 linhas)
│       ├── middlewares/
│       │   ├── authMiddleware.ts               # Validação JWT Supabase, requireAuth, requireRole, requireSuperAdmin
│       │   ├── errorMiddleware.ts              # Tratamento global de exceções HTTP
│       │   ├── securityMiddleware.ts           # Helmet, Rate Limiters (geral e auth), CORS dinâmico e logger sanitizado
│       │   └── tenantMiddleware.ts             # Resolução de tenant via X-Tenant-Slug ou subdomínio
│       ├── presentation/
│       │   └── http/
│       │       ├── controllers/                # 7 Controllers HTTP
│       │       │   ├── AuditController.ts
│       │       │   ├── AuthenticationController.ts
│       │       │   ├── MonitoringController.ts
│       │       │   ├── RequestController.ts
│       │       │   ├── SectorController.ts
│       │       │   ├── SuperAdminController.ts
│       │       │   └── TeamController.ts
│       │       └── routes/                     # Definição de rotas por contexto/papel
│       │           ├── index.ts                # Router agregador (/auth, /terceirizada, /lider, /gestor, /portaria, /sectors, /admin, /notifications)
│       │           ├── adminRoutes.ts
│       │           ├── authRoutes.ts
│       │           ├── gatekeeperRoutes.ts
│       │           ├── leaderRoutes.ts
│       │           ├── managerRoutes.ts
│       │           ├── notificationRoutes.ts
│       │           ├── partnerRoutes.ts
│       │           ├── requestRoutes.ts        # (Arquivo presente, mas não importado em presentation/http/routes/index.ts)
│       │           └── sectorRoutes.ts
│       ├── routes/
│       │   └── index.ts                        # Re-exporta presentation/http/routes/index.ts
│       ├── services/                           # 8 Services de domínio/infraestrutura
│       │   ├── AuditService.ts
│       │   ├── AuthService.ts
│       │   ├── BrandExtractionService.ts
│       │   ├── MonitoringService.ts
│       │   ├── NotificationService.ts
│       │   ├── SectorService.ts
│       │   ├── TenantService.ts
│       │   └── UserService.ts
│       ├── scripts/                            # Scripts CLI de banco, storage e seed
│       │   ├── migrate.ts
│       │   ├── seedUsers.ts
│       │   ├── setup_super_admin.ts
│       │   └── setupStorage.ts
│       ├── database/
│       │   └── migrations/
│       │       └── 20260410_audit_extension.sql
│       ├── sql/                                # 26 scripts SQL evolutivos de schema e RLS
│       │   ├── audit_audit_tracking.sql
│       │   ├── create_invitations.sql
│       │   ├── create_sectors_table.sql
│       │   ├── database.sql
│       │   ├── fix_rls_recursion.sql
│       │   ├── super_admin_setup.sql
│       │   └── update_v2.sql ... update_v18_active_status.sql
│       ├── types/
│       │   └── index.ts                        # Tipagens globais do backend (RequestStatus, Profile, Tenant, Notification, etc.)
│       └── utils/
│           └── apiResponse.ts                  # Padronização de envelopes JSON (ApiResponse.success / error)
│
└── frontend/                                   # Aplicação SPA React 19 + TypeScript + Tailwind CSS v4 + Vite 8
    ├── .dockerignore
    ├── .env
    ├── .gitignore
    ├── Dockerfile
    ├── eslint.config.js
    ├── index.html
    ├── nginx.conf
    ├── package.json
    ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
    ├── vercel.json
    ├── vite.config.ts
    ├── public/
    │   ├── .well-known/security.txt
    │   ├── icons/ (icon-192x192.png, icon-512x512.png)
    │   ├── favicon.svg
    │   ├── logo-lins.png / logo-lins-white.png / logo-lins-symbol.png / logo-lins-symbol-white.png
    │   ├── manifest.webmanifest                # Manifesto PWA
    │   ├── robots.txt / sitemap.xml
    │   └── sw.js                               # Service Worker para cache e notificações nativas
    └── src/                                    # 64 arquivos de código-fonte
        ├── App.tsx                             # Provedores globais (Tenant, Auth, Notification, SessionTimeoutHandler)
        ├── main.tsx                            # Bootstrap React 19, ErrorBoundary, DOM Safeguard e registro de Service Worker
        ├── index.css                           # Tokens Tailwind CSS v4 e variáveis CSS dinâmicas
        ├── components/                         # Componentes transversais
        │   ├── ErrorBoundary.tsx               # Captura de erros de renderização React
        │   ├── SessionTimeoutHandler.tsx       # Desconexão automática após 30 min de inatividade
        │   ├── SignaturePad.tsx                # Canvas de assinatura (atualmente sem importadores ativos)
        │   └── WebcamModal.tsx                 # Captura de câmera via getUserMedia
        ├── contexts/                           # Contextos React
        │   ├── AuthContext.tsx                 # Sessão Supabase, perfil, token e locks
        │   ├── DashboardContext.tsx            # Estado operacional do Gestor e Realtime de tabelas operacionais
        │   ├── NotificationContext.tsx         # Central de notificações em tempo real, som, vibração e Toast
        │   └── TenantContext.tsx               # Resolução de subdomínio/slug e aplicação de cores da usina
        ├── guards/                             # Proteção de rotas e redirecionamentos
        │   ├── HomeRedirect.tsx
        │   ├── ProtectedRoute.tsx
        │   └── SubdomainOrNotFound.tsx
        ├── lib/                                # Clientes de infraestrutura
        │   ├── axios.ts
        │   └── supabase.ts
        ├── routes/
        │   └── MainRoutes.tsx                  # Definição declarativa de rotas React Router v7
        ├── utils/                              # Utilitários de cliente
        │   ├── deviceNotificationService.ts    # Notificações nativas via Service Worker / Notification API
        │   ├── imageCompressor.ts              # Compressão e redimensionamento de fotos em canvas para JPEG
        │   ├── masks.ts                        # Máscaras de CNPJ, telefone e validação de e-mail
        │   ├── soundService.ts                 # Síntese sonora Web Audio API e vibração para alertas
        │   └── subdomain.ts                    # Resolução de slug/subdomínio e leitura de token no sessionStorage
        └── features/                           # Módulos funcionais
            ├── admin/
            │   ├── pages/
            │   │   └── SuperAdminDashboard.tsx
            │   └── components/
            │       ├── TeamManagement.tsx
            │       └── dashboard/team/
            │           ├── InviteGenerator.tsx
            │           ├── ManualRegisterForm.tsx
            │           ├── MemberList.tsx
            │           ├── SectorManagement.tsx
            │           └── TeamCommon.tsx
            ├── auth/
            │   ├── api/
            │   │   ├── authService.ts
            │   │   └── tenantService.ts
            │   ├── components/
            │   │   ├── ParticleBackground.tsx
            │   │   └── RoleDispatcher.tsx
            │   └── pages/
            │       ├── AdminLogin.tsx
            │       ├── Login.tsx
            │       ├── RegisterGestor.tsx
            │       ├── RegisterInternal.tsx
            │       └── RegisterTerceirizada.tsx
            ├── monitoring/
            │   ├── pages/
            │   │   └── GestorDashboard.tsx
            │   └── components/
            │       ├── InteractiveMap.tsx
            │       ├── MonitoringDashboard.tsx
            │       └── ThirdPartiesReport.tsx
            └── requests/
                ├── api/
                │   └── dashboardService.ts
                ├── pages/
                │   ├── LiderDashboard.tsx
                │   ├── PortariaDashboard.tsx
                │   ├── TerceirizadaDashboard.tsx
                │   └── Terceirizada/
                │       └── NovaSolicitacao.tsx
                └── components/
                    ├── AuditSection.tsx
                    └── dashboard/
                        ├── AcceptModal.tsx
                        ├── AdminSidebar.tsx
                        ├── DashboardHeader.tsx
                        ├── DashboardSidebar.tsx
                        ├── DashboardStats.tsx
                        ├── DiscrepanciesTracker.tsx
                        ├── ExitModal.tsx
                        ├── LiderSidebar.tsx
                        ├── MaterialDetailsModal.tsx
                        ├── MobileNav.tsx
                        ├── NotificationDropdown.tsx
                        ├── PendingApprovals.tsx
                        ├── PortariaHistoryView.tsx
                        ├── TransferModal.tsx
                        └── audit/
                            ├── AuditThirdPartyList.tsx
                            └── AuditTimeline.tsx
```

---

## 3. Inventário do Backend (`backend/`)

### 3.1. Stack, Scripts e Dependências (`backend/package.json`)
* **Runtime e Linguagem**: Node.js + TypeScript (`^6.0.2`), executado em desenvolvimento via `nodemon --exec ts-node src/server.ts`.
* **Framework Web**: `express` (`^5.2.1`).
* **Banco de Dados e BaaS**: `@supabase/supabase-js` (`^2.101.1`) e driver `pg` (`^8.20.0`).
* **Segurança e Utilitários**: `helmet` (`^8.3.0`), `express-rate-limit` (`^8.7.0`), `cors` (`^2.8.6`), `dotenv` (`^17.4.1`), `uuid` (`^13.0.0`).
* **Scripts Configurados**:
  * `dev`: `nodemon --exec ts-node src/server.ts`
  * `build`: `tsc`
  * `start`: `node dist/server.js`
  * `db:migrate`: `ts-node src/scripts/migrate.ts`
  * `test`: `echo "Error: no test specified" && exit 1` *(Não existem arquivos de teste automatizado no diretório `backend/`)*.

### 3.2. Configuração e Middlewares (`backend/src/middlewares/` e `config/`)

| Arquivo | Linhas | Responsabilidade Atual |
| :--- | :---: | :--- |
| [server.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/server.ts) | 125 | Inicializa o Express na porta `3333` (com JSON limit de `50mb`), aplica CORS, Helmet, `tenantContextMiddleware`, `sanitizedRequestLogger`, `generalApiLimiter` em `/api`, monta as rotas e expõe `/health`, `/api/security`, `/.well-known/security.txt` e `/api/debug-routes`. |
| [securityMiddleware.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/middlewares/securityMiddleware.ts) | 191 | Configura `helmetMiddleware` (HSTS de 1 ano, CSP, anti-clickjacking), `generalApiLimiter` (600 req/15 min), `authLimiter` (25 req/15 min), `corsOptions` (permitindo localhost, `*.vercel.app`, `*.up.railway.app` e domínios configurados) e `sanitizedRequestLogger` (mascara campos sensíveis nos logs). |
| [authMiddleware.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/middlewares/authMiddleware.ts) | 135 | Valida o token Bearer junto ao Supabase (`supabase.auth.getUser`), carrega o perfil da tabela `profiles`, bloqueia usuários ou tenants inativos (`is_active === false`), valida isolamento cross-tenant e exporta `requireAuth`, `requireRole(...roles)` e `requireSuperAdmin`. |
| [tenantMiddleware.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/middlewares/tenantMiddleware.ts) | 59 | Extrai o slug do tenant a partir do header `x-tenant-slug` ou do subdomínio do header `host`, consultando `TenantService.getTenantBySubdomain` e anexando `req.tenant`. |
| [errorMiddleware.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/middlewares/errorMiddleware.ts) | 39 | Captura exceções não tratadas nos controllers e retorna resposta padronizada via `ApiResponse.error`. |
| [database.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/config/database.ts) | 30 | Instancia `Pool` do pacote `pg` usando `DATABASE_URL`. |
| [supabase.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/config/supabase.ts) | 20 | Instancia `supabase` (chave pública/anon) e `supabaseAdmin` (com `SUPABASE_SERVICE_ROLE_KEY` para operações administrativas e bypass controlado de RLS no backend). |

### 3.3. Mapeamento de Rotas e Endpoints da API (`backend/src/presentation/http/routes/`)

#### Rotas Ativas (Montadas em `/api` via `presentation/http/routes/index.ts`):

| Prefixo | Método e Caminho | Middlewares | Controller / Handler |
| :--- | :--- | :--- | :--- |
| **Sistema** | `GET /health` | Global | `server.ts` (Health check) |
| **Sistema** | `GET /.well-known/security.txt` | Global | `server.ts` (Política RFC 9116) |
| **Sistema** | `GET /api/security` | Global + `generalApiLimiter` | `server.ts` (Resumo de defesas ativas) |
| **Sistema** | `GET /api/debug-routes` | Global + `generalApiLimiter` | `server.ts` (Lista estática de endpoints) |
| `/api/auth` | `POST /register` | `authLimiter`, `tenantContext` | `AuthenticationController.register` |
| `/api/auth` | `GET /tenant-info` | `tenantContext` | `AuthenticationController.getTenantInfo` |
| `/api/auth` | `GET /me` | `requireAuth` | `AuthenticationController.getProfile` |
| `/api/auth` | `GET /invitation/:token` | `authLimiter` | `AuthenticationController.validateInvitation` |
| `/api/auth` | `POST /register-gestor` | `authLimiter` | `AuthenticationController.registerGestor` |
| `/api/terceirizada` | `GET /profile` | `requireAuth`, `requireRole('TERCEIRIZADA', 'GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `AuthenticationController.getProfile` |
| `/api/terceirizada` | `POST /requisicao` | Idem | `RequestController.create` |
| `/api/terceirizada` | `GET /requisicoes` | Idem | `RequestController.listByTenant` |
| `/api/terceirizada` | `PUT /requisicao/:id` | Idem | `RequestController.update` |
| `/api/terceirizada` | `PATCH /requisicao/:id/cancelar` | Idem | `RequestController.cancel` |
| `/api/terceirizada` | `DELETE /requisicao/:id` | Idem | `RequestController.delete` |
| `/api/lider` | `GET /pendencias` | `requireAuth`, `requireRole('LIDER_SETOR', 'GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `RequestController.listLeaderPendencias` |
| `/api/lider` | `POST /revisar/:id` | Idem | `RequestController.review` |
| `/api/lider` | `GET /meu-setor` | Idem | `RequestController.listSectorMaterials` |
| `/api/lider` | `POST /transferir` | Idem | `RequestController.transferMaterial` |
| `/api/lider` | `POST /aceitar-transferencia` | Idem | `RequestController.acceptTransfer` |
| `/api/lider` | `POST /recusar-transferencia` | Idem | `RequestController.rejectTransfer` |
| `/api/lider` | `POST /cancelar-transferencia` | Idem | `RequestController.cancelTransfer` |
| `/api/lider` | `POST /marcar-saida` | Idem | `RequestController.markMaterialForExit` |
| `/api/lider` | `GET /movimentacoes` | Idem | `RequestController.getAuditHistory` |
| `/api/gestor` | `GET /requisicoes` | `requireAuth`, `requireRole('GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `RequestController.listByTenant` |
| `/api/gestor` | `GET /dashboard` | Idem | `RequestController.listByTenant` |
| `/api/gestor` | `POST /approve/:id` | Idem | `RequestController.review` |
| `/api/gestor` | `POST /mark-checkout` | Idem | `RequestController.markCheckout` |
| `/api/gestor` | `GET /monitoring` | Idem | `MonitoringController.getOperationalData` |
| `/api/gestor` | `POST /transfer-material` | Idem | `MonitoringController.transferMaterial` |
| `/api/gestor` | `POST /update-map-layout` | Idem | `MonitoringController.updateMapLayout` |
| `/api/gestor` | `POST /map-layout` | Idem | `MonitoringController.updateMapLayout` |
| `/api/gestor` | `POST /update-material-position` | Idem | `MonitoringController.updateMaterialPosition` |
| `/api/gestor` | `GET /team` | Idem | `TeamController.listMembers` |
| `/api/gestor` | `PUT /team/:id` | Idem | `TeamController.updateMember` |
| `/api/gestor` | `POST /team/:id/reset-password` | Idem | `TeamController.resetPassword` |
| `/api/gestor` | `DELETE /team/:id` | Idem | `TeamController.deleteMember` |
| `/api/gestor` | `GET /audit-report` | Idem | `AuditController.getAuditReport` |
| `/api/gestor` | `GET /third-parties` | Idem | `AuditController.getThirdPartyStats` |
| `/api/portaria` | `GET /approved` | `requireAuth`, `requireRole('PORTARIA', 'GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `RequestController.listByTenant` |
| `/api/portaria` | `POST /status/:id` | Idem | `RequestController.updateGateStatus` |
| `/api/portaria` | `POST /checkin/:id` | Idem | `RequestController.confirmEntry` |
| `/api/portaria` | `POST /movimentacao/:id` | Idem | `RequestController.confirmMovement` |
| `/api/portaria` | `POST /divergencia/:id` | Idem | `RequestController.notifyDiscrepancy` |
| `/api/portaria` | `GET /audit/:tenantId` | Idem | `RequestController.getAuditHistory` |
| `/api/portaria` | `POST /cancelar/:id` | Idem | `RequestController.cancelByGatekeeper` |
| `/api/sectors` | `GET /` | `requireAuth` | `SectorController.listSectors` |
| `/api/sectors` | `POST /` | `requireAuth`, `requireRole('GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `SectorController.createSector` |
| `/api/sectors` | `DELETE /:id` | `requireAuth`, `requireRole('GESTOR_SEGURANCA', 'SUPER_ADMIN')` | `SectorController.deleteSector` |
| `/api/admin` | `GET /tenants` | `requireAuth`, `requireSuperAdmin` | `SuperAdminController.listTenants` |
| `/api/admin` | `POST /tenants` | Idem | `SuperAdminController.createTenantAndGenerateInvite` |
| `/api/admin` | `POST /tenants/invite` | Idem | `SuperAdminController.generateInvite` |
| `/api/admin` | `POST /extract-branding` | Idem | `SuperAdminController.extractBranding` |
| `/api/admin` | `PUT /tenants/:id` | Idem | `SuperAdminController.updateTenant` |
| `/api/admin` | `PATCH /tenants/:id/status` | Idem | `SuperAdminController.toggleTenantStatus` |
| `/api/admin` | `DELETE /tenants/:id` | Idem | `SuperAdminController.deleteTenant` |
| `/api/admin` | `GET /users` | Idem | `SuperAdminController.listAllUsers` |
| `/api/admin` | `PATCH /users/:id/status` | Idem | `SuperAdminController.toggleUserStatus` |
| `/api/admin` | `GET /stats` | Idem | `SuperAdminController.getPlatformStats` |
| `/api/admin` | `GET /audit/:tenantId` | Idem | `RequestController.getAuditHistory` |
| `/api/notifications`| `GET /` | `requireAuth` | `RequestController.listNotifications` |
| `/api/notifications`| `PATCH /read-all` | `requireAuth` | `RequestController.markAllNotificationsRead` |
| `/api/notifications`| `DELETE /clear-all` | `requireAuth` | `RequestController.clearAllNotifications` |
| `/api/notifications`| `PATCH /:id/read` | `requireAuth` | `RequestController.markNotificationRead` |

*(Observação: O arquivo [requestRoutes.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/routes/requestRoutes.ts) declara rotas genéricas `/`, `/:id`, `/:id/review` e `/:id/confirm-entry`, porém não é importado em [presentation/http/routes/index.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/routes/index.ts)).*

### 3.4. Inventário de Controllers (`backend/src/presentation/http/controllers/`)

| Controller | Linhas | Responsabilidade Atual |
| :--- | :---: | :--- |
| [RequestController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/RequestController.ts) | 737 | Concentra todas as operações de solicitações, portaria, materiais, transferências entre setores, histórico de auditoria e endpoints de notificações (`create`, `listByTenant`, `listLeaderPendencias`, `getDetails`, `review`, `confirmEntry`, `confirmMovement`, `notifyDiscrepancy`, `getAuditHistory`, `listSectorMaterials`, `transferMaterial`, `acceptTransfer`, `rejectTransfer`, `cancelTransfer`, `markMaterialForExit`, `markCheckout`, `cancelByGatekeeper`, `update`, `cancel`, `delete`, `updateGateStatus`, `listNotifications`, `markNotificationRead`, `markAllNotificationsRead`, `clearAllNotifications`). |
| [AuthenticationController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/AuthenticationController.ts) | 226 | Registro de empresas terceirizadas e colaboradores internos (`register`), consulta de dados públicos do tenant (`getTenantInfo`), leitura do perfil autenticado (`getProfile`), validação de token de convite (`validateInvitation`) e registro do gestor inicial (`registerGestor`). |
| [SuperAdminController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/SuperAdminController.ts) | 193 | Gestão global da plataforma: criação/edição/exclusão/ativação de usinas (`tenants`), geração de convites de gestor, extração de cores/branding via `BrandExtractionService`, listagem global de usuários e métricas da plataforma. |
| [TeamController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/TeamController.ts) | 106 | Gestão da equipe interna da usina pelo Gestor: listagem (`listMembers`), atualização de dados e status ativo/inativo (`updateMember`), reset de senha (`resetPassword`) e exclusão (`deleteMember`). |
| [MonitoringController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/MonitoringController.ts) | 66 | Consulta consolidada de monitoramento (`getOperationalData`), transferência administrativa (`transferMaterial`), salvamento de coordenadas do mapa industrial (`updateMapLayout`) e posição de materiais (`updateMaterialPosition`). |
| [SectorController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/SectorController.ts) | 59 | Listagem hierárquica de setores/subsetores da unidade (`listSectors`), criação (`createSector`) e exclusão (`deleteSector`). |
| [AuditController.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/presentation/http/controllers/AuditController.ts) | 33 | Geração de dados de auditoria por terceirizada (`getAuditReport`) e estatísticas consolidadas de terceirizadas (`getThirdPartyStats`). |

### 3.5. Inventário de Use Cases (`backend/src/application/use-cases/`)

| Use Case | Linhas | Ação Executada |
| :--- | :---: | :--- |
| [ConfirmMaterialMovement.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/ConfirmMaterialMovement.ts) | 137 | Processa o check-in (`ENTRY` → `IN_PLANTA`) e check-out (`EXIT` → `OUT_PLANTA`) de materiais na Portaria, grava movimentação na tabela `material_movements`, atualiza status da solicitação (`IN_PLANTA` ou `COMPLETED` quando todos os materiais saem) e dispara notificações. |
| [MarkMaterialForExit.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/MarkMaterialForExit.ts) | 75 | Realiza a baixa de materiais pelo Líder (`WAITING_EXIT`), registra movimentação de encaminhamento para a Portaria e notifica Portaria e Terceirizada. |
| [AcceptMaterialTransfer.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/AcceptMaterialTransfer.ts) | 57 | Confirma o recebimento de material transferido para o setor de destino, atualizando `current_sector_id`, voltando status para `IN_PLANTA` e anexando fotos/observação/matrícula de recebimento. |
| [CancelMaterialTransfer.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/CancelMaterialTransfer.ts) | 50 | Cancela transferência pendente pelo setor de origem, retorna o material para `IN_PLANTA` no setor de origem e remove o registro pendente em `material_movements`. |
| [RejectMaterialTransfer.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/RejectMaterialTransfer.ts) | 50 | Recusa transferência no setor de destino, retorna o material para `IN_PLANTA` no setor de origem, remove a movimentação pendente e notifica o setor remetente. |
| [CancelByGatekeeper.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/CancelByGatekeeper.ts) | 39 | Permite à Portaria cancelar uma solicitação antes da entrada efetiva (`CANCELED`), registrando o motivo. |
| [UpdateEntryRequest.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/UpdateEntryRequest.ts) | 36 | Atualiza dados e materiais de uma solicitação da Terceirizada (bloqueando edição se `IN_PLANTA` ou `COMPLETED`) e retorna o status para `PENDING`. |
| [DeleteEntryRequest.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/DeleteEntryRequest.ts) | 33 | Exclui solicitação da Terceirizada se pertencer ao usuário/tenant e estiver em `REJECTED_LIDER`, `REJECTED_GESTOR`, `CANCELED` ou `REJECTED`. |
| [ReviewEntryRequest.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/ReviewEntryRequest.ts) | 29 | Aprova ou recusa solicitação de entrada (`APPROVED_LIDER`/`REJECTED_LIDER` para Líder; `APPROVED_GESTOR`/`REJECTED_GESTOR` para Gestor). |
| [TransferMaterial.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/TransferMaterial.ts) | 27 | Inicia transferência interna de materiais entre setores (`MOVING`), definindo `pending_sector_id` e gravando registro em `material_movements`. |
| [CancelEntryRequest.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/CancelEntryRequest.ts) | 25 | Cancela solicitação pela própria Terceirizada (`CANCELED`), bloqueando se já estiver `IN_PLANTA` ou `COMPLETED`. |
| [ConfirmEntry.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/ConfirmEntry.ts) | 24 | Confirma entrada de solicitação com status `APPROVED_LIDER` ou `APPROVED_GESTOR`, transitando para `IN_PLANTA`. |
| [GetRequestDetails.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/GetRequestDetails.ts) | 21 | Busca detalhes de uma solicitação validando isolamento de `tenant_id` e `profile_id` (anti-IDOR). |
| [NotifyDiscrepancy.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/NotifyDiscrepancy.ts) | 21 | Registra divergência física na Portaria, alterando o status da solicitação para `DISCREPANCY` com o motivo informado. |
| [MarkCheckout.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/MarkCheckout.ts) | 18 | Marca saída definitiva de uma solicitação (`COMPLETED`). |
| [CreateEntryRequest.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/CreateEntryRequest.ts) | 14 | Cria nova solicitação de entrada com status inicial `PENDING` e seus respectivos materiais. |
| [GetAuditHistory.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/GetAuditHistory.ts) | 10 | Consulta histórico de auditoria por tenant e filtros opcionais. |
| [ListSectorMaterials.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/ListSectorMaterials.ts) | 10 | Lista materiais alocados ou em trânsito relacionados a um setor. |
| [ListRequests.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/application/use-cases/ListRequests.ts) | 9 | Lista solicitações filtradas por tenant e critérios adicionais. |

### 3.6. Repositório e Services do Backend (`backend/src/infrastructure/` e `services/`)
* [SupabaseRequestRepository.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/infrastructure/database/SupabaseRequestRepository.ts) (401 linhas): Implementa `IRequestRepository` sobre o `supabaseAdmin`, gerenciando CRUD de `entry_requests`, `materials`, `material_movements` e histórico de auditoria.
* [NotificationService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/NotificationService.ts) (439 linhas): Cria e gerencia notificações persistidas na tabela `notifications` para eventos de nova solicitação, aprovação/recusa do líder, chegada/triagem na portaria, liberação de entrada, divergência, transferência entre setores, baixa e saída concluída.
* [BrandExtractionService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/BrandExtractionService.ts) (259 linhas): Faz scraping de páginas web externas para extrair automaticamente paleta de cores (primária, secundária, navy) e logotipo no cadastro de usinas pelo SuperAdmin.
* [MonitoringService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/MonitoringService.ts) (243 linhas): Agrega setores, materiais ativos e movimentações para o painel de supervisão e salva posições do mapa 2D (`InteractiveMap`).
* [AuditService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/AuditService.ts) (152 linhas): Constrói relatórios de conformidade e estatísticas por empresa terceirizada.
* [TenantService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/TenantService.ts) (123 linhas): Gerencia consulta e atualização de usinas (`tenants`) e convites (`invitations`).
* [UserService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/UserService.ts) (92 linhas): Consulta perfis em `profiles` e listagem de equipe por unidade.
* [AuthService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/AuthService.ts) (85 linhas): Orquestra criação de usuários no Supabase Auth e inserção sincronizada na tabela `profiles`.
* [SectorService.ts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/backend/src/services/SectorService.ts) (66 linhas): CRUD de setores principais e subsetores na tabela `sectors`.

---

## 4. Inventário do Frontend (`frontend/`)

### 4.1. Stack, Scripts e Dependências (`frontend/package.json`)
* **Core**: React (`^19.2.4`), React DOM (`^19.2.4`), React Router DOM (`^7.14.0`), TypeScript (`~6.0.2`), Vite (`^8.0.4`).
* **Estilização e UI**: Tailwind CSS (`^4.2.2`), `@tailwindcss/vite`, `lucide-react` (`^1.7.0`), `clsx`, `tailwind-merge`, `class-variance-authority`, `sweetalert2` (`^11.26.24`).
* **Dados e Rede**: `@supabase/supabase-js` (`^2.101.1`), `axios` (`^1.14.0`), `zustand` (`^5.0.12` — instalado no `package.json`, porém sem stores utilizadas em `src/`).
* **Gráficos, Relatórios e Mídia**: `recharts` (`^2.15.4`), `jspdf` (`^4.2.1`), `jspdf-autotable` (`^5.0.7`), `html-to-image` (`^1.11.13`), `html2canvas` (`^1.4.1`), `react-signature-canvas` (`^1.1.0-alpha.2`).
* **PWA**: `public/manifest.webmanifest` e `public/sw.js` registrados em `src/main.tsx`.
* **Scripts Configurados**: `dev` (`vite`), `build` (`tsc -b && vite build`), `lint` (`eslint .`), `preview` (`vite preview`). *(Não há script ou arquivos de teste automatizado no frontend)*.

### 4.2. Inventário das Pages (`frontend/src/features/*/pages/`)

| Página | Localização | Linhas | Responsabilidade Atual |
| :--- | :--- | :---: | :--- |
| [SuperAdminDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/pages/SuperAdminDashboard.tsx) | `features/admin/pages/` | 2.459 | Painel global do SuperAdmin: CRUD de usinas, extração automática de branding por URL, geração de convites para gestores, ativação/desativação de usinas e usuários globais, e auditoria multi-tenant. |
| [PortariaDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/pages/PortariaDashboard.tsx) | `features/requests/pages/` | 1.897 | Operação da guarita: filas de Entrada, Em Planta, Saída e Histórico (`PortariaHistoryView`), controle de status de triagem (`/portaria/status/:id`), conferência item a item, captura de fotos com compressão, registro de divergências, cancelamento de entrada e confirmação de entrada/saída por matrícula. |
| [LiderDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/pages/LiderDashboard.tsx) | 1.735 | `features/requests/pages/` | Painel do Líder de Setor: aprovação/recusa de solicitações pendentes (`/lider/revisar/:id`), inventário de equipamentos no setor e subsetores, envio/aceite/recusa/cancelamento de transferências internas, baixa para saída (`/lider/marcar-saida`) e histórico de movimentações do setor. |
| [NovaSolicitacao.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx) | `features/requests/pages/Terceirizada/` | 766 | Criação e edição de solicitações pela Terceirizada: seleção de setor e subsetor de destino, dados de motorista/veículo, cadastro de múltiplos equipamentos e upload de fotos comprimidas para o bucket `material-images` do Supabase Storage. |
| [TerceirizadaDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/pages/TerceirizadaDashboard.tsx) | `features/requests/pages/` | 681 | Portal da empresa terceirizada: listagem e filtro de solicitações, acompanhamento de status e divergências, visualização de equipamentos em planta e já finalizados, edição, cancelamento e exclusão de solicitações. |
| [Login.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/pages/Login.tsx) | `features/auth/pages/` | 422 | Autenticação multi-tenant das unidades, validação de vínculo do usuário com a usina, bloqueio de contas/usinas desativadas e redirecionamento por papel. |
| [RegisterInternal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/pages/RegisterInternal.tsx) | `features/auth/pages/` | 408 | Auto-cadastro de colaboradores internos (Líder de Setor e Portaria) via link de convite parametrizado. |
| [RegisterGestor.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/pages/RegisterGestor.tsx) | `features/auth/pages/` | 360 | Validação de token de convite administrativo e cadastro do Gestor de Segurança da usina. |
| [RegisterTerceirizada.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/pages/RegisterTerceirizada.tsx) | `features/auth/pages/` | 330 | Credenciamento público de empresas terceirizadas no portal da usina. |
| [AdminLogin.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/pages/AdminLogin.tsx) | `features/auth/pages/` | 161 | Autenticação exclusiva para o painel global (`SUPER_ADMIN`). |
| [GestorDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/monitoring/pages/GestorDashboard.tsx) | `features/monitoring/pages/` | 127 | Workspace do Gestor de Segurança: orquestra a navegação entre as seções Painel (`DashboardStats`, `DiscrepanciesTracker`, `PendingApprovals`), Equipe (`TeamManagement`), Rastro (`MonitoringDashboard`), Mapa (`InteractiveMap`), Auditoria (`AuditSection`) e Relatórios (`ThirdPartiesReport`). |

### 4.3. Inventário dos Components (`frontend/src/components/` e `features/*/components/`)

#### Componentes Transversais (`src/components/`):
* [WebcamModal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/components/WebcamModal.tsx) (134 linhas): Modal de captura fotográfica via `navigator.mediaDevices.getUserMedia` com suporte a troca de câmera frontal/traseira.
* [SessionTimeoutHandler.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/components/SessionTimeoutHandler.tsx) (83 linhas): Monitora eventos de interação (`mousemove`, `mousedown`, `keydown`, `touchstart`, `scroll`) e encerra a sessão após 30 minutos de inatividade.
* [SignaturePad.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/components/SignaturePad.tsx) (66 linhas): Componente de assinatura em canvas com `react-signature-canvas` *(sem importadores ativos)*.
* [ErrorBoundary.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/components/ErrorBoundary.tsx) (62 linhas): Error Boundary global envolvendo `<App />` em `main.tsx`.

#### Componentes de Autenticação (`src/features/auth/components/`):
* [ParticleBackground.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/components/ParticleBackground.tsx) (159 linhas): Animação em canvas para as telas de login e registro.
* [RoleDispatcher.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/auth/components/RoleDispatcher.tsx) (95 linhas): Valida coerência de URL/slug/role e renderiza o dashboard correspondente ao `profile.role`.

#### Componentes de Monitoramento e Supervisão (`src/features/monitoring/components/`):
* [InteractiveMap.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/monitoring/components/InteractiveMap.tsx) (708 linhas): Mapa industrial 2D interativo em SVG com drag-and-drop, redimensionamento de setores, zoom/pan, busca e modal de detalhes de materiais (`MaterialDetailsModal`).
* [MonitoringDashboard.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/monitoring/components/MonitoringDashboard.tsx) (378 linhas): Visão hierárquica de setores e subsetores exibindo os equipamentos alocados ou em trânsito.
* [ThirdPartiesReport.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/monitoring/components/ThirdPartiesReport.tsx) (261 linhas): Gráficos analíticos (`recharts`) e exportação de relatório gerencial em PDF (`html-to-image` + `jspdf`).

#### Componentes Operacionais, Notificações e Auditoria (`src/features/requests/components/`):
* [AuditTimeline.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/audit/AuditTimeline.tsx) (685 linhas): Linha do tempo completa de auditoria de uma empresa terceirizada com filtros e geração imperativa de PDF (`jspdf` + `jspdf-autotable`).
* [PortariaHistoryView.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/PortariaHistoryView.tsx) (575 linhas): Visualização detalhada e filtrável do histórico de entradas e saídas da Portaria.
* [TransferModal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/TransferModal.tsx) (424 linhas): Modal de transferência de materiais entre setores/subsetores com captura/upload de fotos comprimidas, observação e matrícula do responsável.
* [MaterialDetailsModal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/MaterialDetailsModal.tsx) (417 linhas): Modal compartilhado para inspeção detalhada de um equipamento, galeria de fotos e histórico de movimentações.
* [PendingApprovals.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/PendingApprovals.tsx) (380 linhas): Lista em modo leitura no painel do Gestor os avisos de entrada autorizados pelos líderes que aguardam check-in na Portaria.
* [DashboardSidebar.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/DashboardSidebar.tsx) (302 linhas): Barra lateral de navegação do Gestor com árvore expansível de setores.
* [ExitModal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/ExitModal.tsx) (289 linhas): Modal para o Líder registrar a baixa de equipamentos para saída da planta, com fotos, observação e matrícula.
* [DiscrepanciesTracker.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/DiscrepanciesTracker.tsx) (265 linhas): Painel de acompanhamento de solicitações com divergência registrada pela Portaria (`DISCREPANCY`).
* [NotificationDropdown.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/NotificationDropdown.tsx) (213 linhas): Menu suspenso do sino de notificações com controle de som, leitura individual/em massa e limpeza.
* [AcceptModal.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/AcceptModal.tsx) (173 linhas): Modal para o Líder de destino aceitar transferência de material informando matrícula, observação e fotos opcionais.
* [LiderSidebar.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/LiderSidebar.tsx) (140 linhas): Barra lateral do painel do Líder de Setor.
* [AuditSection.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/AuditSection.tsx) (121 linhas): Coordenador que alterna entre `AuditThirdPartyList` e `AuditTimeline`.
* [AuditThirdPartyList.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/audit/AuditThirdPartyList.tsx) (113 linhas): Seletor de empresas terceirizadas para auditoria.
* [DashboardHeader.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/DashboardHeader.tsx) (102 linhas): Cabeçalho superior integrando título da seção, `NotificationDropdown` e botão de logout.
* [AdminSidebar.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/AdminSidebar.tsx) (81 linhas): Card de diretores da unidade *(sem importadores ativos)*.
* [MobileNav.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/MobileNav.tsx) (65 linhas): Navegação inferior mobile.
* [DashboardStats.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/requests/components/dashboard/DashboardStats.tsx) (52 linhas): Cards de indicadores operacionais do Gestor.

#### Componentes de Equipe e Setores (`src/features/admin/components/`):
* [MemberList.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/dashboard/team/MemberList.tsx) (647 linhas): Listagem, busca, edição, ativação/desativação, reset de senha e exclusão de membros internos da usina.
* [ManualRegisterForm.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/dashboard/team/ManualRegisterForm.tsx) (363 linhas): Cadastro manual de Líderes e operadores de Portaria pelo Gestor.
* [SectorManagement.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/dashboard/team/SectorManagement.tsx) (338 linhas): Criação e exclusão de setores e subsetores da usina.
* [InviteGenerator.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/dashboard/team/InviteGenerator.tsx) (264 linhas): Geração de links de convite por papel e setor.
* [TeamCommon.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/dashboard/team/TeamCommon.tsx) (148 linhas): Primitivas visuais compartilhadas pelo módulo de equipe (`TabButton`, `InputGroup`, `CustomSelect`, `Modal`).
* [TeamManagement.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/features/admin/components/TeamManagement.tsx) (84 linhas): Container de abas da gestão de equipe e setores.

### 4.4. Inventário dos Contexts e Custom Hooks (`frontend/src/contexts/`)

Existem **4 Contexts** e **4 Custom Hooks** (`useAuth`, `useTenant`, `useDashboard`, `useNotifications`):

| Context / Hook | Linhas | Estado e Responsabilidades |
| :--- | :---: | :--- |
| [NotificationContext.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/contexts/NotificationContext.tsx) (`useNotifications`) | 509 | Gerencia notificações em tempo real por tenant (`realtime_notifications_tenant_${tenant_id}`), busca `/api/notifications` com fallback direto para a tabela `notifications` no Supabase, filtra alertas por papel/setor/empresa, aciona som (`soundService`), notificação nativa (`deviceNotificationService`) e exibe Toast flutuante. |
| [AuthContext.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/contexts/AuthContext.tsx) (`useAuth`) | 331 | Gerencia sessão do Supabase Auth, sincroniza token em `sessionStorage`, busca perfil em `profiles` e dados da usina em `tenants` com timeout e retry, bloqueia contas ou usinas desativadas e expõe métodos de login/logout. |
| [DashboardContext.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/contexts/DashboardContext.tsx) (`useDashboard`) | 182 | Carrega em paralelo `/gestor/monitoring`, `/gestor/dashboard` e `/sectors`, calcula estatísticas (incluindo contagem de divergências) e escuta alterações Realtime nas tabelas `materials`, `material_movements` e `entry_requests`. |
| [TenantContext.tsx](file:///c:/Users/keven/Documentos/GitHub/Unitraack/frontend/src/contexts/TenantContext.tsx) (`useTenant`) | 141 | Resolve `slug` e subdomínio da usina, busca `/auth/tenant-info`, gerencia cache em `sessionStorage` e aplica variáveis CSS de tema (`--primary-color`, `--secondary-color`, `--navy-color`). |

### 4.5. Mecanismos de Comunicação no Frontend

1. **Instância Configurada `api` (`src/lib/axios.ts`)**:
   * Usada em `tenantService.ts`, `dashboardService.ts`, `LiderDashboard.tsx`, `TerceirizadaDashboard.tsx`, `SectorManagement.tsx`, `InteractiveMap.tsx`, `TransferModal.tsx`.
2. **Axios Cru (`import axios from 'axios'`)**:
   * Usado em `NovaSolicitacao.tsx`, `AuditSection.tsx`, `InviteGenerator.tsx`, `MemberList.tsx`, `ManualRegisterForm.tsx`.
3. **`fetch()` Nativo com `getAuthToken()`**:
   * Usado em `SuperAdminDashboard.tsx`, `PortariaDashboard.tsx`, `NotificationContext.tsx`, `RegisterTerceirizada.tsx`, `RegisterInternal.tsx`, `RegisterGestor.tsx`.
4. **Cliente Supabase Direto (`src/lib/supabase.ts`)**:
   * **Auth**: `AuthContext.tsx`, `authService.ts`.
   * **Database Queries/Updates**: `AuthContext.tsx` (`profiles`, `tenants`), `NotificationContext.tsx` (fallback de leitura e update em `notifications`), `NovaSolicitacao.tsx` (`profiles`), `AdminSidebar.tsx` (`profiles`).
   * **Realtime**: `DashboardContext.tsx`, `NotificationContext.tsx`, `PortariaDashboard.tsx`, `LiderDashboard.tsx`, `TerceirizadaDashboard.tsx`.
   * **Storage**: `NovaSolicitacao.tsx` (upload e `getPublicUrl` no bucket `material-images`).

---

## 5. Sinais de Código Sem Consumidor e Divergências Técnicas Observadas no Código

| Item | Localização | Evidência Factual no Código |
| :--- | :--- | :--- |
| **Rotas de requisição não montadas no Backend** | `backend/src/presentation/http/routes/requestRoutes.ts` | O arquivo define 5 rotas, mas não é importado em `backend/src/presentation/http/routes/index.ts`. |
| **Divergência no nome do bucket no script de setup** | `backend/src/scripts/setupStorage.ts` vs. `NovaSolicitacao.tsx` | O script de backend cria o bucket com underscore (`material_images`), enquanto o frontend faz upload para `material-images` (com hífen). |
| **Métodos órfãos de aprovação do Gestor no Frontend** | `DashboardContext.tsx` (linhas 143–151) e `dashboardService.ts` (linhas 14–22) | `approveRequest` e `rejectRequest` estão declarados no contexto/service, mas nenhum componente do frontend os invoca (`PendingApprovals.tsx` é somente leitura). Além disso, `POST /gestor/reject/:id` não existe em `managerRoutes.ts`. |
| **Filtro de role `'LIDER'` em `NotificationContext.tsx`** | `frontend/src/contexts/NotificationContext.tsx` (linhas 177 e 266) | Compara `profile.role === 'LIDER'`, enquanto o papel cadastrado no banco e nos tipos do sistema é `'LIDER_SETOR'`. |
| **Componentes sem importadores no Frontend** | `SignaturePad.tsx` e `AdminSidebar.tsx` | Nenhum arquivo ativo importa `SignaturePad.tsx` ou `AdminSidebar.tsx`. |
| **Consulta descartada (`fetchProfile`)** | `NovaSolicitacao.tsx` (linhas 80 e 118–129) | Consulta `supabase.from('profiles').select('*')` no `useEffect`, mas descarta o retorno. |
| **Imports / chamadas vazias** | `MonitoringDashboard.tsx` (linha 2) e `InteractiveMap.tsx` (linhas 16 e 42) | `import axios from 'axios'` não utilizado em `MonitoringDashboard.tsx`; `const { } = useAuth()` vazio em `InteractiveMap.tsx`. |
| **`DashboardProvider` envolvendo `PortariaDashboard` e `LiderDashboard`** | `RoleDispatcher.tsx` (linhas 67–77) | Executa chamadas `/gestor/monitoring` e `/gestor/dashboard` (que retornam `403 Forbidden` para Líder e Portaria). Em `LiderDashboard`, apenas `TransferModal.tsx` lê `dashboard?.sectors` dentro de um `try/catch`. |
| **Dependências NPM sem uso ativo no Frontend** | `frontend/package.json` | `zustand` (`^5.0.12`) e `react-signature-canvas` (usado apenas no componente órfão `SignaturePad.tsx`). |
| **Ausência de suíte de testes automatizados** | `backend/package.json` e `frontend/package.json` | Não existem arquivos `*.test.*` ou `*.spec.*` em `backend/` ou `frontend/`. |

