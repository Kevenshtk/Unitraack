# Frontend API Services & Interceptor Contract

**Feature**: `001-frontend-phase1-standardization`  
**Date**: 2026-11-05

## 1. Contrato do Cliente HTTP Base (`frontend/src/lib/axios.ts`)

### 1.1 Request Interceptor
Toda requisição disparada via `api` (`axios.create`) DEVE automaticamente:
1. Resolver a sessão ativa via `supabase.auth.getSession()` (renovando preventivamente via `supabase.auth.refreshSession()` se `expires_at * 1000 < Date.now() + 10000`) com fallback para `getAuthToken()` (`frontend/src/utils/subdomain.ts`);
2. Injetar `config.headers.Authorization = Bearer ${token}` caso ainda não esteja presente;
3. Resolver o slug do tenant via `getSubdomain()` (`frontend/src/utils/subdomain.ts`) e injetar `config.headers['X-Tenant-Slug'] = slug` caso `slug` exista e o cabeçalho ainda não tenha sido definido manualmente.

### 1.2 Response Interceptor
- Em caso de `401 Unauthorized` (sem `_retry`), tenta `supabase.auth.refreshSession()` uma única vez e repete a chamada original com o novo token.

---

## 2. Contratos dos Serviços de Domínio

### 2.1 `gatekeeperService.ts` (`frontend/src/features/requests/api/gatekeeperService.ts`)
- `getApprovedRequests(statuses: string[])` → `GET /portaria/approved?status=...`
- `getAuditHistory(tenantId: string, onlyPortaria = true)` → `GET /portaria/audit/${tenantId}?onlyPortaria=${onlyPortaria}`
- `updateGateStatus(targetId: string, status: string)` → `POST /portaria/status/${targetId}` body `{ status }`
- `confirmMovement(requestId: string, payload: { materialIds: string[]; type: string; signature: string; photos?: string[]; observation?: string })` → `POST /portaria/movimentacao/${requestId}`
- `cancelEntry(requestId: string, reason: string)` → `POST /portaria/cancelar/${requestId}` body `{ reason }`
- `notifyDiscrepancy(requestId: string, reason: string)` → `POST /portaria/divergencia/${requestId}` body `{ reason }`

### 2.2 `teamService.ts` (`frontend/src/features/admin/api/teamService.ts`)
- `getTeamMembers()` → `GET /gestor/team`
- `updateTeamMember(id: string, memberData: Record<string, any>)` → `PUT /gestor/team/${id}`
- `deleteTeamMember(id: string)` → `DELETE /gestor/team/${id}`
- `resetMemberPassword(id: string, newPassword: string)` → `POST /gestor/team/${id}/reset-password` body `{ newPassword }`
- `registerInternalMember(payload: Record<string, any>)` → `POST /auth/register`

### 2.3 `requestService.ts` (`frontend/src/features/requests/api/requestService.ts`)
- `getSectors()` → `GET /sectors`
- `createRequest(payload: Record<string, any>)` → `POST /terceirizada/requisicao`
- `updateRequest(id: string, payload: Record<string, any>)` → `PUT /terceirizada/requisicao/${id}`
- `getPartnerProfile()` → `GET /terceirizada/profile`
- `getPartnerRequests()` → `GET /terceirizada/requisicoes`
- `cancelPartnerRequest(id: string)` → `POST /terceirizada/requisicoes/${id}/cancel`
- `deletePartnerRequest(id: string)` → `DELETE /terceirizada/requisicoes/${id}`

### 2.4 `dashboardService.ts` (`frontend/src/features/requests/api/dashboardService.ts`)
- `getMonitoring()` → `GET /gestor/monitoring`
- `getDashboard()` → `GET /gestor/dashboard`
- `updateMaterialPosition(materialId: string, x: number, y: number)` → `POST /gestor/material-position`
- `updateMapLayout(layouts: any[])` → `POST /gestor/map-layout`
- `getThirdPartyStats()` → `GET /gestor/third-parties`
- `getAuditReport(profileId: string)` → `GET /gestor/audit-report?profileId=${profileId}`

