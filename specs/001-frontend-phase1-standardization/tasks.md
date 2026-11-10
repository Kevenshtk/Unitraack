---

description: "Task list for Refatoração Frontend - Fase 1: Padronização de Feedback, Camada de API e Limpeza de Dependências"
---

# Tasks: Refatoração Frontend - Fase 1: Padronização de Feedback, Camada de API e Limpeza de Dependências

**Input**: Design documents from `/specs/001-frontend-phase1-standardization/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`

**Tests**: Validação estática (`tsc -b && vite build`) e verificação de critérios mensuráveis conforme `quickstart.md` (testes automatizados unitários não foram solicitados nesta fase).

**Organization**: As tarefas estão agrupadas por User Story (`US1` a `US4`) seguindo a ordem de prioridade (`P1` → `P4`) para permitir implementação e validação incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo (arquivos distintos, sem dependências de tarefas incompletas)
- **[Story]**: User Story à qual a tarefa pertence (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos exatos dos arquivos estão incluídos em cada descrição

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação de pacotes e diretórios base no Frontend

- [X] T001 Install `sonner` dependency in `frontend/package.json` (`npm install sonner --prefix frontend`)
- [X] T002 [P] Create directories `frontend/src/components/common/` and `frontend/src/features/admin/api/` per implementation plan

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura compartilhada de interceptors HTTP e feedback visual que DEVE estar pronta antes das User Stories

**⚠️ CRITICAL**: Nenhuma User Story deve ser iniciada antes da conclusão desta fase

- [X] T003 [P] Extend request interceptor in `frontend/src/lib/axios.ts` to fallback to `getAuthToken()` and automatically inject `X-Tenant-Slug` header via `getSubdomain()` from `frontend/src/utils/subdomain.ts` when not explicitly set
- [X] T004 [P] Create accessible `ConfirmDialog` component, `ConfirmDialogProvider`, and `useConfirm()` hook in `frontend/src/components/common/ConfirmDialog.tsx` enforcing constraints from `data-model.md`: `title` (required string), `description` (required string), `confirmText` (optional, default `'Confirmar'`), `cancelText` (optional, default `'Cancelar'`), `variant` (`'danger' | 'warning' | 'primary'`, default `'danger'`), `isLoading` (boolean, default `false`), and optional `inputConfig` (`type?: 'text' | 'textarea'`, `placeholder?: string`, `defaultValue?: string`, `required?: boolean` default `true`, `errorMessage?: string` default `'Este campo é obrigatório.'`) with `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, `aria-describedby`, and `Escape`/backdrop dismissal resolving `{ isConfirmed: false }`
- [X] T005 Mount `<Toaster position="top-right" richColors closeButton expand={false} />` (`sonner`) and `<ConfirmDialogProvider>` in `frontend/src/App.tsx` (depends on T001, T004)

**Checkpoint**: Infraestrutura base pronta — implementação das User Stories liberada.

---

## Phase 3: User Story 1 - Isolamento de Sessão e Contexto por Papel sem Erros 403 (Priority: P1) 🎯 MVP

**Goal**: Garantir que os perfis `LIDER_SETOR` e `PORTARIA` não montem o `DashboardProvider`, eliminando 100% das chamadas indevidas a `/gestor/monitoring` e `/gestor/dashboard` (`403 Forbidden`) e mantendo o `TransferModal` funcional para o Líder.

**Independent Test**: Autenticar com `LIDER_SETOR` e `PORTARIA`, inspecionar a aba Network/Console do navegador ao abrir o painel e ao abrir o `TransferModal`, verificando zero requisições para `/gestor/*` e zero erros `403 Forbidden`.

### Implementation for User Story 1

- [X] T006 [P] [US1] Export `useOptionalDashboard` (`() => useContext(DashboardContext)`) and remove unused `approveRequest` and `rejectRequest` methods from `DashboardContextType` and provider value in `frontend/src/contexts/DashboardContext.tsx`
- [X] T007 [P] [US1] Update `frontend/src/features/auth/components/RoleDispatcher.tsx` to wrap only `case 'GESTOR_SEGURANCA'` (`<GestorDashboard />`) in `<DashboardProvider>`, rendering `<LiderDashboard />` and `<PortariaDashboard />` directly without `<DashboardProvider>`
- [X] T008 [US1] Update `frontend/src/features/requests/components/dashboard/TransferModal.tsx` to replace the `try { useDashboard() } catch` block with `useOptionalDashboard()` from `frontend/src/contexts/DashboardContext.tsx` (depends on T006)

**Checkpoint**: User Story 1 funcional e testável de forma independente (MVP atingido).

---

## Phase 4: User Story 2 - Padronização da Camada de Comunicação HTTP e Serviços de Domínio (Priority: P2)

**Goal**: Eliminar chamadas `fetch()` manuais e importações diretas de `axios` nos módulos escopados (`PortariaDashboard`, `MemberList`, `InviteGenerator`, `ManualRegisterForm`, `NovaSolicitacao`, `TerceirizadaDashboard`, `AuditSection`, `TransferModal`), centralizando tudo em serviços de domínio sobre `frontend/src/lib/axios.ts`.

**Independent Test**: Executar listagem/criação de solicitação em `NovaSolicitacao`, triagem/entrada/saída/divergência/histórico em `PortariaDashboard`, gestão de equipe em `MemberList`/`InviteGenerator`/`ManualRegisterForm` e auditoria em `AuditSection`, verificando que todas as requisições usam a instância `api` de `frontend/src/lib/axios.ts`.

### Implementation for User Story 2

- [X] T009 [P] [US2] Create `frontend/src/features/requests/api/gatekeeperService.ts` using `api` from `frontend/src/lib/axios.ts` implementing `getApprovedRequests(statuses: string[])`, `getAuditHistory(tenantId: string, onlyPortaria?: boolean)`, `updateGateStatus(requestId: string, status: 'WAITING_ARRIVAL' | 'ARRIVED' | 'IN_ANALYSIS' | 'WAITING_EXIT' | 'EXIT_CONFERENCE')`, `confirmMovement(requestId: string, payload: { materialIds: string[]; type: 'ENTRY' | 'EXIT' | 'IN_PLANTA'; signature: string; photos?: string[]; observation?: string })`, `cancelEntry(requestId: string, reason: string)`, and `notifyDiscrepancy(requestId: string, reason: string)`
- [X] T010 [P] [US2] Create `frontend/src/features/admin/api/teamService.ts` using `api` from `frontend/src/lib/axios.ts` implementing `getTeamMembers()`, `updateTeamMember(id: string, data: Record<string, any>)`, `deleteTeamMember(id: string)`, `resetMemberPassword(id: string, newPassword: string)`, and `registerInternalMember(payload: Record<string, any>)`
- [X] T011 [P] [US2] Create `frontend/src/features/requests/api/requestService.ts` using `api` from `frontend/src/lib/axios.ts` implementing `getSectors()`, `createRequest(payload: Record<string, any>)`, `updateRequest(id: string, payload: Record<string, any>)`, `getPartnerProfile()`, `getPartnerRequests()`, `cancelPartnerRequest(id: string)`, and `deletePartnerRequest(id: string)`
- [X] T012 [P] [US2] Update `frontend/src/features/requests/api/dashboardService.ts` to add `getAuditReport(profileId: string)` (`GET /gestor/audit-report?profileId=${profileId}`) and remove orphaned `approveRequest` and `rejectRequest` methods
- [X] T013 [P] [US2] Refactor `frontend/src/features/requests/pages/PortariaDashboard.tsx` to replace all 6 raw `fetch()` calls (`fetchAuditHistory`, `handleUpdateGateStatus`, `fetchRequisicoes`, `handleConfirmMovement`, `handleCancelEntry`, `handleNotifyDiscrepancy`) with `gatekeeperService` methods from `frontend/src/features/requests/api/gatekeeperService.ts` (depends on T009)
- [X] T014 [P] [US2] Refactor `frontend/src/features/admin/components/dashboard/team/MemberList.tsx` to replace all raw `axios` calls with `teamService` methods from `frontend/src/features/admin/api/teamService.ts` and remove `import axios from 'axios'` (depends on T010)
- [X] T015 [P] [US2] Refactor `frontend/src/features/admin/components/dashboard/team/InviteGenerator.tsx` and `frontend/src/features/admin/components/dashboard/team/ManualRegisterForm.tsx` to replace raw `axios` calls with `teamService.getTeamMembers()` and `teamService.registerInternalMember()` from `frontend/src/features/admin/api/teamService.ts` and remove `import axios from 'axios'` (depends on T010)
- [X] T016 [P] [US2] Refactor `frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx` and `frontend/src/features/requests/pages/TerceirizadaDashboard.tsx` to replace raw `axios` and direct `api` calls with `requestService` methods from `frontend/src/features/requests/api/requestService.ts`, remove `import axios from 'axios'`, and remove the orphaned `fetchProfile()` query (`supabase.from('profiles')`) in `frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx` (depends on T011)
- [X] T017 [P] [US2] Refactor `frontend/src/features/requests/components/AuditSection.tsx` to replace raw `axios` calls with `dashboardService.getThirdPartyStats()` and `dashboardService.getAuditReport(selectedProfileId)` from `frontend/src/features/requests/api/dashboardService.ts` and remove `import axios from 'axios'` (depends on T012)
- [X] T018 [US2] Update `frontend/src/features/requests/components/dashboard/TransferModal.tsx` to use `requestService.getSectors()` from `frontend/src/features/requests/api/requestService.ts` instead of direct `api.get('/sectors')` (depends on T008, T011)

**Checkpoint**: User Stories 1 e 2 completas e verificáveis independentemente.

---

## Phase 5: User Story 3 - Padronização de Feedback Visual (Toasts e Modal de Confirmação) (Priority: P3)

**Goal**: Migrar 100% dos alertas (`Swal.fire`, `window.alert()`, `window.confirm()`) para `sonner` (`toast.success`, `toast.error`, `toast.warning`) e para o hook/componente `ConfirmDialog` (`useConfirm()`), eliminando qualquer dependência de `sweetalert2` no código-fonte.

**Independent Test**: Acionar fluxos de sucesso, erro de validação e confirmação destrutiva em `SessionTimeoutHandler`, `AcceptModal`, `ExitModal`, `TransferModal`, `MemberList`, `LiderDashboard`, `PortariaDashboard`, `TerceirizadaDashboard`, `RegisterGestor`, `InteractiveMap` e `NovaSolicitacao`, verificando exibição via `sonner` e `ConfirmDialog`.

### Implementation for User Story 3

- [X] T019 [P] [US3] Refactor `frontend/src/components/SessionTimeoutHandler.tsx` to replace `Swal.fire` with `toast.warning` from `sonner` before redirecting to login and remove `import Swal from 'sweetalert2'`
- [X] T020 [P] [US3] Refactor `frontend/src/features/requests/components/dashboard/AcceptModal.tsx`, `frontend/src/features/requests/components/dashboard/ExitModal.tsx`, and `frontend/src/features/requests/components/dashboard/TransferModal.tsx` to replace all `Swal.fire` validation alerts with `toast.warning` / `toast.error` from `sonner` and remove `import Swal from 'sweetalert2'`
- [X] T021 [US3] Refactor `frontend/src/features/admin/components/dashboard/team/MemberList.tsx` to replace `await Swal.fire` in `handleToggleStatus` with `await confirm(...)` via `useConfirm()` from `frontend/src/components/common/ConfirmDialog.tsx`, replace all remaining `Swal.fire` calls with `toast.success` / `toast.error` / `toast.warning` from `sonner`, and remove `import Swal from 'sweetalert2'` (depends on T014)
- [X] T022 [P] [US3] Refactor `frontend/src/features/requests/pages/LiderDashboard.tsx` to replace `alert()` (line 212) and `Swal.fire` notifications with `toast.success` / `toast.error` from `sonner`, replace `Swal.fire` transfer rejection prompt (line 328) with `useConfirm()` using `inputConfig: { type: 'textarea', required: true, placeholder: 'Descreva o motivo da recusa (ex: equipamento não solicitado, item avariado, setor incorreto)...', errorMessage: 'Você precisa informar o motivo da recusa!' }`, replace `Swal.fire` transfer cancellation prompt (line 389) with `useConfirm()`, and remove `import Swal from 'sweetalert2'`
- [X] T023 [US3] Refactor `frontend/src/features/requests/pages/PortariaDashboard.tsx` to replace `Swal.fire` notifications with `toast.success` / `toast.error` from `sonner`, replace `Swal.fire` discrepancy release confirmation (line 309) with `useConfirm()`, replace `Swal.fire` entry cancellation prompt (line 379) with `useConfirm()` using `inputConfig: { type: 'text', required: true, defaultValue: defaultCancelReason, errorMessage: 'Você precisa informar o motivo!' }`, and remove `import Swal from 'sweetalert2'` (depends on T013)
- [X] T024 [US3] Refactor `frontend/src/features/requests/pages/TerceirizadaDashboard.tsx` to replace `Swal.fire` confirmations in `handleCancel` and `handleDelete` with `useConfirm()`, replace `Swal.fire` notifications with `toast.success` / `toast.error` from `sonner`, and remove `sweetalert2` and `sweetalert2/dist/sweetalert2.min.css` imports (depends on T016)
- [X] T025 [P] [US3] Refactor `frontend/src/features/auth/pages/RegisterGestor.tsx`, `frontend/src/features/monitoring/components/InteractiveMap.tsx`, and `frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx` to replace all `alert()` calls and validation/error feedbacks with `toast.error` / `toast.warning` / `toast.success` from `sonner` (depends on T016)

**Checkpoint**: 100% dos alertas e confirmações migrados para `sonner` e `ConfirmDialog`; zero importações de `sweetalert2` restantes.

---

## Phase 6: User Story 4 - Limpeza de Código Morto e Dependências Órfãs (Priority: P4)

**Goal**: Remover componentes sem importadores ativos, imports órfãos e pacotes NPM não utilizados (`sweetalert2`, `zustand`, `react-signature-canvas`, `@types/react-signature-canvas`).

**Independent Test**: Verificar ausência física dos arquivos excluídos e pacotes removidos e executar `npm run build` sem erros.

### Implementation for User Story 4

- [X] T026 [P] [US4] Delete orphaned component files `frontend/src/components/SignaturePad.tsx` and `frontend/src/features/requests/components/dashboard/AdminSidebar.tsx`
- [X] T027 [P] [US4] Remove unused `import axios from 'axios'` and unused `token` variable from `frontend/src/features/monitoring/components/MonitoringDashboard.tsx`
- [X] T028 [US4] Remove unused dependencies `sweetalert2`, `zustand`, `react-signature-canvas`, and `@types/react-signature-canvas` from `frontend/package.json` (`npm uninstall sweetalert2 zustand react-signature-canvas @types/react-signature-canvas --prefix frontend`) (depends on T019, T020, T021, T022, T023, T024, T025, T026)

**Checkpoint**: Repositório limpo de código morto e dependências órfãs da Fase 1.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final de integridade estática e build de produção

- [X] T029 Run static verification checks from `specs/001-frontend-phase1-standardization/quickstart.md` across `frontend/src/` to confirm zero occurrences of `Swal`, `sweetalert2`, `alert(`, `confirm(`, and raw `axios` imports outside `frontend/src/lib/axios.ts`
- [X] T030 Execute production build validation (`npm run build --prefix frontend`) to verify TypeScript (`tsc -b`) and Vite bundle generation succeed with exit code `0`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — inicia imediatamente (`T001`, `T002`).
- **Foundational (Phase 2)**: Depende da Phase 1 — **BLOQUEIA** as User Stories até que `T003`, `T004` e `T005` estejam concluídas.
- **User Story 1 (Phase 3 - P1)**: Depende apenas da Phase 2 (`T006` → `T008`, `T007` em paralelo).
- **User Story 2 (Phase 4 - P2)**: Depende da Phase 2 (`T009`–`T012` criam os serviços em paralelo; `T013`–`T018` refatoram os consumidores).
- **User Story 3 (Phase 5 - P3)**: Depende da Phase 2 (`ConfirmDialog` + `sonner`) e coordena-se com `US2` nos arquivos compartilhados (`MemberList.tsx`, `PortariaDashboard.tsx`, `TerceirizadaDashboard.tsx`, `NovaSolicitacao.tsx`).
- **User Story 4 (Phase 6 - P4)**: `T026` e `T027` podem rodar em paralelo a qualquer momento após a Phase 2; `T028` (`npm uninstall sweetalert2 ...`) depende da conclusão da Phase 5 (`US3`) e de `T026`.
- **Polish (Phase 7)**: Depende da conclusão de todas as fases anteriores (`T029`, `T030`).

### Parallel Opportunities

- **Phase 2**: `T003` (`lib/axios.ts`) e `T004` (`ConfirmDialog.tsx`) podem ser executadas em paralelo.
- **Phase 3 (US1)**: `T006` (`DashboardContext.tsx`) e `T007` (`RoleDispatcher.tsx`) podem ser executadas em paralelo.
- **Phase 4 (US2)**:
  - Criação/atualização de serviços: `T009` (`gatekeeperService.ts`), `T010` (`teamService.ts`), `T011` (`requestService.ts`) e `T012` (`dashboardService.ts`) podem rodar 100% em paralelo.
  - Migração de consumidores: `T013`, `T014`, `T015`, `T016` e `T017` atuam em arquivos distintos e podem rodar em paralelo após seus respectivos serviços.
- **Phase 5 (US3)**: `T019`, `T020`, `T022` e `T025` atuam em arquivos independentes e podem rodar em paralelo.

---

## Parallel Example: User Story 2 (Criação de Serviços de Domínio)

```text
Task T009: "Create frontend/src/features/requests/api/gatekeeperService.ts using api from frontend/src/lib/axios.ts..."
Task T010: "Create frontend/src/features/admin/api/teamService.ts using api from frontend/src/lib/axios.ts..."
Task T011: "Create frontend/src/features/requests/api/requestService.ts using api from frontend/src/lib/axios.ts..."
Task T012: "Update frontend/src/features/requests/api/dashboardService.ts to add getAuditReport..."
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Concluir Phase 1 (`T001`–`T002`) e Phase 2 (`T003`–`T005`).
2. Concluir Phase 3 (`T006`–`T008` — Isolamento do `DashboardProvider` e `RoleDispatcher`).
3. **Validar MVP**: Confirmar zero erros `403 Forbidden` nos perfis `LIDER_SETOR` e `PORTARIA`.

### Incremental Delivery

1. **Foundation** (`T001`–`T005`): `sonner`, `ConfirmDialog` e interceptor `lib/axios.ts` ativos.
2. **US1** (`T006`–`T008`): Isolamento de sessão/contexto concluído.
3. **US2** (`T009`–`T018`): Camada de serviços HTTP (`gatekeeperService`, `teamService`, `requestService`, `dashboardService`) unificada.
4. **US3** (`T019`–`T025`): Todas as notificações e confirmações migradas para `sonner` + `ConfirmDialog`.
5. **US4 + Polish** (`T026`–`T030`): Exclusão dos arquivos e pacotes órfãos e validação do build de produção (`tsc -b && vite build`).

