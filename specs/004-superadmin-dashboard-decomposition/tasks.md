---

description: "Task list for Refatoração Frontend - Fase 2C: Decomposição Modular e Padronização de Rede do SuperAdminDashboard"
---

# Tasks: 004-superadmin-dashboard-decomposition

**Input**: Design documents from `/specs/004-superadmin-dashboard-decomposition/`  
**Prerequisites**: [plan.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/plan.md), [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/spec.md), [data-model.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/data-model.md), [contracts/superadmin-components-contract.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/contracts/superadmin-components-contract.md)  
**Tests**: Validação estática TypeScript (`tsc -b`), build de produção (`vite build`), auditoria de ausência de `fetch(` e contagem de linhas via PowerShell (`quickstart.md`).  
**Organization**: Tarefas organizadas por fase e User Story (`US1` a `US4`) para implementação incremental e segura.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependências de tarefas não concluídas)
- **[Story]**: User Story à qual a tarefa pertence (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos exatos incluídos em cada descrição

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação da estrutura de diretórios e tipos compartilhados do domínio Super Admin

- [X] T001 Create directories `frontend/src/features/admin/api/`, `frontend/src/features/admin/hooks/`, and `frontend/src/features/admin/components/superadmin/`
- [X] T002 [P] Create domain types and payload interfaces in `frontend/src/features/admin/components/superadmin/types.ts` defining `SuperAdminTab`, `UserCategoryFilter`, `UserStatusFilter`, `Tenant`, `PlatformStats`, `GlobalProfile`, `AuditLog`, `TenantFormData`, `BrandingExtractionData`, `ExtractionFeedback`, and initial form defaults (max 350 lines)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada centralizada de serviços HTTP substituindo 100% das chamadas `fetch()` nativo

**⚠️ CRITICAL**: Nenhuma User Story de hooks ou UI deve ser iniciada antes da conclusão do serviço HTTP.

- [X] T003 Create `frontend/src/features/admin/api/superAdminService.ts` using `api` from `frontend/src/lib/axios.ts` implementing `getPlatformStats()`, `listTenants()`, `createTenant(payload)`, `updateTenant(id, payload)`, `toggleTenantStatus(id, isActive)`, `deleteTenant(id)`, `generateTenantInvite(payload)`, `extractBranding(url)`, `listAllUsers()`, `toggleUserStatus(id, isActive)`, and `getTenantAudit(tenantId)` without manual token headers or `fetch()` (max 350 lines; depends on T002)

**Checkpoint**: Camada de serviços HTTP pronta — desenvolvimento de hooks e subcomponentes liberado.

---

## Phase 3: User Story 1 - Gestão de Usinas, Branding e Convites de Gestores (Priority: P1) 🎯 MVP

**Goal**: Isolar todo o fluxo de usinas (`tenants`), extração de branding por URL, geração/cópia de convites e confirmações padronizadas (`ConfirmDialog` + `sonner`).

**Independent Test**: Abrir aba de Usinas, cadastrar nova usina usando extração de branding por URL, copiar link de convite, editar uma usina e alternar status / excluir via `ConfirmDialog`.

### Implementation for User Story 1

- [X] T004 [US1] Create `frontend/src/features/admin/hooks/useSuperAdminTenants.ts` encapsulating tenants state, search/expand filters, create/edit modal state, URL branding extraction (`superAdminService.extractBranding`), invite generation/copy, status toggle and deletion using `superAdminService`, `useConfirm()`, and `sonner` (max 350 lines; depends on T002, T003)
- [X] T005 [P] [US1] Create `frontend/src/features/admin/components/superadmin/TenantFormModal.tsx` rendering the create/edit tenant modal, generated invite link card, automatic branding URL scanner, 3-slot interactive palette picker, and form inputs (max 350 lines; depends on T002)
- [X] T006 [P] [US1] Create `frontend/src/features/admin/components/superadmin/TenantsManagementView.tsx` rendering the tenants list, search bar, expandable unit details, invite link trigger, audit shortcut, edit, status toggle, and delete actions (max 350 lines; depends on T002)

**Checkpoint**: Gestão de usinas, branding e convites (`US1`) pronta.

---

## Phase 4: User Story 2 - Gestão Global de Usuários e Controle de Acesso (Priority: P2)

**Goal**: Isolar a listagem global de usuários, filtros combinados (unidade, categoria, status, busca) e ativação/desativação com guarda contra autodesativação.

**Independent Test**: Acessar aba de Usuários, filtrar por unidade/categoria/status, validar bloqueio ao tentar desativar a própria conta e alternar status de outro usuário via `ConfirmDialog`.

### Implementation for User Story 2

- [X] T007 [US2] Create `frontend/src/features/admin/hooks/useSuperAdminUsers.ts` encapsulating global users state, multi-criteria filtering, expandable unit sections, self-deactivation guard, and status toggle using `superAdminService.toggleUserStatus`, `useConfirm()`, and `sonner` (max 350 lines; depends on T002, T003)
- [X] T008 [P] [US2] Create `frontend/src/features/admin/components/superadmin/GlobalUsersView.tsx` rendering filter controls (search, tenant select, category/status pills) and grouped internal/partner user lists without duplicating card markup (max 350 lines; depends on T002)

**Checkpoint**: Gestão global de usuários (`US2`) pronta.

---

## Phase 5: User Story 3 - Indicadores Globais da Plataforma e Auditoria por Usina (Priority: P3)

**Goal**: Isolar os cards de métricas globais e a consulta paginada de auditoria operacional por unidade selecionada.

**Independent Test**: Conferir cards de estatísticas na aba Dashboard e consultar/paginar logs de auditoria na aba Monitoramento selecionando uma usina.

### Implementation for User Story 3

- [X] T009 [US3] Create `frontend/src/features/admin/hooks/useSuperAdminStats.ts` encapsulating `PlatformStats`, selected monitoring tenant, on-demand audit loading via `superAdminService.getTenantAudit`, and pagination (8 items/page) (max 350 lines; depends on T002, T003)
- [X] T010 [P] [US3] Create `frontend/src/features/admin/components/superadmin/PlatformStatsCards.tsx` rendering the global metric cards (`totalTenants`, `totalUsers`, `totalRequests`) and recent units overview (max 350 lines; depends on T002)
- [X] T011 [P] [US3] Create `frontend/src/features/admin/components/superadmin/TenantAuditView.tsx` rendering the tenant selector, audit logs table/mobile cards, loading/empty states, and pagination controls (max 350 lines; depends on T002)

**Checkpoint**: Métricas globais e auditoria (`US3`) prontas.

---

## Phase 6: User Story 4 - Recomposição do Container e Padronização Final (Priority: P4)

**Goal**: Reduzir `SuperAdminDashboard.tsx` a um container/orquestrador enxuto (`<= 220` linhas) sem nenhuma chamada `fetch(` ou modal ad-hoc legado.

**Independent Test**: Verificar navegação entre todas as abas (`dashboard`, `tenants`, `users`, `monitoring`), ausência de `fetch(` e contagem de linhas conforme `quickstart.md`.

### Implementation for User Story 4

- [X] T012 [US4] Refactor `frontend/src/features/admin/pages/SuperAdminDashboard.tsx` to act solely as container/orchestrator wiring `superAdminService` initial load, `useSuperAdminTenants`, `useSuperAdminUsers`, `useSuperAdminStats`, sidebar/mobile navigation, header, active tab views, and `TenantFormModal`, removing all `fetch()` calls, `getAuthToken()`, and ad-hoc `confirmDialog`/`infoDialog` state (max 220 lines; depends on T004–T011)

**Checkpoint**: Container `SuperAdminDashboard.tsx` recomposto e integrado.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Auditoria automatizada de limites de linhas (`SC-001`, `SC-002`), ausência de `fetch(` (`SC-003`) e build de produção (`SC-005`)

- [X] T013 Run automated line-count and `fetch(` / `getAuthToken` grep verification from `specs/004-superadmin-dashboard-decomposition/quickstart.md` confirming `SuperAdminDashboard.tsx <= 220` lines, all new modules `<= 350` lines, and zero `fetch(` occurrences
- [X] T014 Execute production build validation (`npm run build --prefix frontend`) verifying `tsc -b && vite build` exits with code `0`

---

## Dependencies & Execution Order

- **Setup (`T001`–`T002`)**: Sem dependências; executa primeiro.
- **Foundational (`T003`)**: Depende de `T002`; bloqueia hooks (`T004`, `T007`, `T009`).
- **User Stories (`T004`–`T011`)**: Subcomponentes visuais (`T005`, `T006`, `T008`, `T010`, `T011`) dependem apenas de `T002` e podem ser criados em paralelo; hooks (`T004`, `T007`, `T009`) dependem de `T002` e `T003`.
- **Container (`T012`)**: Depende da conclusão de `T004`–`T011`.
- **Validação Final (`T013`–`T014`)**: Depende `T012`.
