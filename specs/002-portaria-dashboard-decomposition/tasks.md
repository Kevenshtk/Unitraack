---

description: "Task list for Refatoração Frontend - Fase 2A: Decomposição Modular do Painel de Portaria"
---

# Tasks: Refatoração Frontend - Fase 2A: Decomposição Modular do Painel de Portaria

**Input**: Design documents from `/specs/002-portaria-dashboard-decomposition/`

**Prerequisites**: `plan.md` (required), `spec.md` (required for user stories), `research.md`, `data-model.md`, `contracts/`

**Tests**: Validação automatizada de limite de linhas (`SC-001` <= 200 linhas e `SC-002` <= 350 linhas) e validação de compilação/build de produção (`npm run build --prefix frontend`) conforme `quickstart.md`.

**Organization**: As tarefas estão organizadas por fase e User Story (`US1` a `US4`) seguindo a ordem de prioridade (`P1` → `P4`).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode ser executada em paralelo (arquivos distintos, sem dependências de tarefas incompletas)
- **[Story]**: User Story à qual a tarefa pertence (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos exatos dos arquivos estão incluídos em cada descrição

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação da estrutura de diretórios e tipos compartilhados da Portaria

- [X] T001 Create directories `frontend/src/features/requests/hooks/` and `frontend/src/features/requests/components/portaria/` per implementation plan
- [X] T002 Create `frontend/src/features/requests/components/portaria/types.ts` defining shared interfaces `Material` (with `status: 'PENDING' | 'IN_PLANTA' | 'OUT_PLANTA' | 'MOVING' | 'WAITING_EXIT' | 'EXIT_CONFERENCE'`), `Requisicao` (with `id`, `tenant_id`, `sector`, `entry_date`, `created_at`, `status`, `reason?`, `rejection_reason?`, `gate_checked_at?`, `driver_name?`, `plate?`, `profile`, `materials`), `CompanyDetails`, `ActiveTab` (`'ENTRY' | 'EXIT' | 'IN_PLANTA'`), `EntrySubFilter` (`'WAITING' | 'ARRIVED' | 'ANALYSIS'`), `ExitSubFilter` (`'WAITING' | 'CONFERENCE'`), `MobileSection` (`'list' | 'details' | 'history'`), `GateStatus` (`'WAITING_ARRIVAL' | 'ARRIVED' | 'IN_ANALYSIS' | 'WAITING_EXIT' | 'EXIT_CONFERENCE'`), and utility `formatDateTime(dateStr: string)` (max 350 lines)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Extração dos Custom Hooks de estado/efeitos e dos componentes base de navegação superior e lateral que suportam todas as User Stories

**⚠️ CRITICAL**: Nenhuma User Story deve ser finalizada antes da conclusão desta fase

- [X] T003 [P] Create `frontend/src/features/requests/hooks/useGatekeeperQueue.ts` implementing `GatekeeperQueueState` (`activeTab`, `entrySubFilter`, `exitSubFilter`, `searchTerm`, `requisicoes`, `filteredReqs`, `selecionadoId`, `selectedReq`, `loading`, `mobileSection`, `isHistoryPageOpen`, `auditHistory`, `loadingHistory`, `selectedCompany`, `fetchRequisicoes`, `fetchAuditHistory`) with chronological sorting and subfilter rules from `data-model.md` (max 350 lines; depends on T002)
- [X] T004 [P] Create `frontend/src/features/requests/hooks/useGatekeeperRealtime.ts` implementing the 30-second polling interval and Supabase Realtime subscription (`portaria_dashboard_changes` listening to `entry_requests` and `material_movements`) triggered by `activeTab` (max 350 lines; depends on T002)
- [X] T005 [P] Create `frontend/src/features/requests/hooks/useGatekeeperOperations.ts` implementing `GatekeeperOperationsState` (`processing`, `selectedMaterials`, `signature`, `photos`, `observation`, `showDiscrepancyModal`, `discrepancyReason`, `showSuccessModal`, `modalConfig`, `isCameraOpen`, `detailMaterial`, `selectedPhotos`) and handlers (`handleUpdateGateStatus`, `handleToggleMaterial`, `handleCapturePhoto`, `removePhoto`, `handleConfirmMovement`, `handleCancelEntry`, `handleNotifyDiscrepancy`) using `gatekeeperService`, `compressImage`, `toast`, and `useConfirm()` (max 350 lines; depends on T002)
- [X] T006 [P] Create `frontend/src/features/requests/components/portaria/GatekeeperHeader.tsx` rendering the top navigation bar with tenant logo/name, isolated 1-second clock (`currentTime`), operator name, `NotificationDropdown`, History toggle button, and Logout button (max 350 lines; depends on T002)
- [X] T007 [P] Create `frontend/src/features/requests/components/portaria/GatekeeperTabs.tsx` rendering the sidebar with the 3 main tab selectors (`ENTRY`, `EXIT`, `IN_PLANTA`), search input, `ENTRY` subfilters (`WAITING`, `ARRIVED`, `ANALYSIS`) and `EXIT` subfilters (`WAITING`, `CONFERENCE`) with live counters, and the scrollable vehicle/request card list (max 350 lines; depends on T002)

**Checkpoint**: Custom Hooks e componentes base de navegação prontos.

---

## Phase 3: User Story 1 - Triagem e Liberação de Entrada de Veículos e Equipamentos (Priority: P1) 🎯 MVP

**Goal**: Isolar a visão operacional de conferência e liberação de entrada (`Fluxo 03` do `BUSINESS-FLOW.md`) em um subcomponente dedicado e coeso.

**Independent Test**: Selecionar uma solicitação na aba `Entrada na Planta`, avançar pelas etapas `Aguardando Chegada` → `Chegada no Portão` → `Em Análise`, marcar/desmarcar itens, anexar foto e observação e confirmar a entrada com matrícula válida.

### Implementation for User Story 1

- [X] T008 [P] [US1] Create `frontend/src/features/requests/components/portaria/GatekeeperEntryQueue.tsx` rendering the `ENTRY` inspection panel: protocol header, 4-step visual stepper (`Aguardando Chegada` → `Chegada no Portão` → `Em Análise` → `Em Planta`), quick status transition buttons (`ARRIVED`, `IN_ANALYSIS`, `WAITING_ARRIVAL`), discrepancy alert banner, destination/driver/plate/schedule info, item-by-item material checklist, photo capture/gallery and observation section, confirmation registration (`signature`) input, and action buttons (`Liberar Entrada`, `Divergência`, `Não Compareceu / Cancelar Entrada`) enforcing that `Liberar Entrada` is enabled only when `status` is `'IN_ANALYSIS'` or `'DISCREPANCY'`, `selectedMaterials.length > 0`, and `signature.trim().length > 0` (max 350 lines; depends on T002)

**Checkpoint**: Componente de triagem e liberação de entrada (`US1`) pronto.

---

## Phase 4: User Story 2 - Tratativa de Divergências e Cancelamento na Entrada (Priority: P2)

**Goal**: Isolar o modal de justificativa e notificação de divergência ao Gestor/Líder em um subcomponente dedicado.

**Independent Test**: Em uma solicitação na etapa `Em Análise` ou `Conferência`, acionar `Divergência`, preencher a justificativa e enviar o alerta ao Gestor.

### Implementation for User Story 2

- [X] T009 [P] [US2] Create `frontend/src/features/requests/components/portaria/GatekeeperDiscrepancyModal.tsx` rendering the discrepancy notification modal with irregularity reason textarea (`discrepancyReason`), cancel button, and submit alert button (`onConfirm`) disabled when `!discrepancyReason || processing` (max 350 lines; depends on T002)

**Checkpoint**: Modal de tratativa de divergências (`US2`) pronto.

---

## Phase 5: User Story 3 - Conferência e Liberação de Saída de Equipamentos (Priority: P3)

**Goal**: Isolar a visão operacional de conferência e liberação de saída (`Fluxo 07` do `BUSINESS-FLOW.md`) em um subcomponente dedicado.

**Independent Test**: Alternar para `Saída da Planta`, selecionar um protocolo em `Aguardando Saída`, acionar `Iniciar Conferência de Saída`, conferir os itens e confirmar a saída com matrícula válida.

### Implementation for User Story 3

- [X] T010 [P] [US3] Create `frontend/src/features/requests/components/portaria/GatekeeperExitQueue.tsx` rendering the `EXIT` conference panel: protocol header, 3-step visual stepper (`Aguardando Saída` → `Conferência` → `Saiu da Usina`), quick status transition buttons (`EXIT_CONFERENCE`, `WAITING_EXIT`), discrepancy alert banner, destination/driver/plate/schedule info, exit material checklist (`WAITING_EXIT` / `EXIT_CONFERENCE`), optional photo capture/gallery and observation section, confirmation registration (`signature`) input, and action buttons (`Confirmar Saída`, `Divergência`) enforcing that `Confirmar Saída` is enabled only when in `'EXIT_CONFERENCE'` (or `'DISCREPANCY'`), `selectedMaterials.length > 0`, and `signature.trim().length > 0` (max 350 lines; depends on T002)

**Checkpoint**: Componente de conferência e liberação de saída (`US3`) pronto.

---

## Phase 6: User Story 4 - Consulta de Equipamentos em Planta, Detalhes e Histórico Operacional (Priority: P4)

**Goal**: Isolar a visão somente leitura de equipamentos `Em Planta`, os modais auxiliares de inspeção (detalhes técnicos, empresa, feedback e lightbox de fotos) e recompor o container `PortariaDashboard.tsx` com no máximo 200 linhas.

**Independent Test**: Navegar para a aba `Em Planta` e para `Histórico`, abrir os modais de detalhes do equipamento, perfil da terceirizada e galeria de fotos em tela cheia, e alternar entre `Fila`, `Operação` e `Histórico` no mobile.

### Implementation for User Story 4

- [X] T011 [P] [US4] Create `frontend/src/features/requests/components/portaria/GatekeeperInPlantView.tsx` rendering the read-only `IN_PLANTA` inspection panel: protocol header, discrepancy observation banner (when present), destination/driver/plate/schedule info, list of `IN_PLANTA` materials with photo counter badge and technical detail button, and operational status footer (max 350 lines; depends on T002)
- [X] T012 [P] [US4] Create `frontend/src/features/requests/components/portaria/GatekeeperModals.tsx` rendering the auxiliary inspection modals: `MaterialDetailModal` (`detailMaterial`), `CompanyDetailModal` (`selectedCompany` with `auditHistory`), `OperationFeedbackModal` (`showSuccessModal` and `modalConfig`), and `PhotoLightboxModal` (`selectedPhotos`) (max 350 lines; depends on T002)
- [X] T013 [US4] Refactor `frontend/src/features/requests/pages/PortariaDashboard.tsx` to act solely as the container/orchestrator consuming `useGatekeeperQueue`, `useGatekeeperRealtime`, and `useGatekeeperOperations`, rendering `GatekeeperHeader`, `PortariaHistoryView`, `GatekeeperTabs`, the active queue view (`GatekeeperEntryQueue`, `GatekeeperExitQueue`, `GatekeeperInPlantView`, or empty state), `GatekeeperDiscrepancyModal`, `GatekeeperModals`, `WebcamModal`, and `MobileNav` (max 200 lines; depends on T003, T004, T005, T006, T007, T008, T009, T010, T011, T012)

**Checkpoint**: Container `PortariaDashboard.tsx` recomposto e todas as 4 User Stories integradas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final de limites de linhas (`SC-001` e `SC-002`) e build de produção (`SC-004`)

- [X] T014 Run automated line-count verification from `specs/002-portaria-dashboard-decomposition/quickstart.md` confirming `frontend/src/features/requests/pages/PortariaDashboard.tsx` has `<= 200` lines and every file in `frontend/src/features/requests/hooks/useGatekeeper*.ts` and `frontend/src/features/requests/components/portaria/*.ts*` has `<= 350` lines
- [X] T015 Execute production build validation (`npm run build --prefix frontend`) to verify TypeScript (`tsc -b`) and Vite bundle generation succeed with exit code `0`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1: `T001`–`T002`)**: Sem dependências — inicia imediatamente.
- **Foundational (Phase 2: `T003`–`T007`)**: Depende de `T001` e `T002` (`types.ts`).
- **User Stories (Phases 3–6: `T008`–`T012`)**: Dependem de `T002` (`types.ts`) e podem ser criadas em paralelo (`[P]`), culminando na recomposição do container em `T013`.
- **Polish (Phase 7: `T014`–`T015`)**: Depende da conclusão de `T013`.

### Parallel Opportunities

- `T003`, `T004`, `T005`, `T006` e `T007` atuam em arquivos novos distintos e podem ser executadas de forma independente após `T002`.
- `T008` (`GatekeeperEntryQueue.tsx`), `T009` (`GatekeeperDiscrepancyModal.tsx`), `T010` (`GatekeeperExitQueue.tsx`), `T011` (`GatekeeperInPlantView.tsx`) e `T012` (`GatekeeperModals.tsx`) são componentes independentes em arquivos separados (`[P]`).

---

## Parallel Example: Subcomponents Creation

```bash
Task: "T008 [P] [US1] Create frontend/src/features/requests/components/portaria/GatekeeperEntryQueue.tsx"
Task: "T009 [P] [US2] Create frontend/src/features/requests/components/portaria/GatekeeperDiscrepancyModal.tsx"
Task: "T010 [P] [US3] Create frontend/src/features/requests/components/portaria/GatekeeperExitQueue.tsx"
Task: "T011 [P] [US4] Create frontend/src/features/requests/components/portaria/GatekeeperInPlantView.tsx"
Task: "T012 [P] [US4] Create frontend/src/features/requests/components/portaria/GatekeeperModals.tsx"
```

---

## Implementation Strategy

### Incremental & Safe Decomposition

1. **Setup & Types (`T001`–`T002`)**: Criar diretórios e extrair os tipos e utilitários (`types.ts`) sem quebrar o arquivo existente.
2. **Custom Hooks & Base Navigation (`T003`–`T007`)**: Criar `useGatekeeperQueue`, `useGatekeeperRealtime`, `useGatekeeperOperations`, `GatekeeperHeader` e `GatekeeperTabs`.
3. **Queue Views & Modals (`T008`–`T012`)**: Criar `GatekeeperEntryQueue`, `GatekeeperDiscrepancyModal`, `GatekeeperExitQueue`, `GatekeeperInPlantView` e `GatekeeperModals`.
4. **Container Recomposition & Validation (`T013`–`T015`)**: Substituir o corpo monolítico de `PortariaDashboard.tsx` pela composição modular enxuta (`<= 200` linhas) e validar contagem de linhas + build TypeScript/Vite.

