---

description: "Task list for Refatoração Frontend - Fase 2B: Decomposição Modular do LiderDashboard"
---

# Tasks: 003-lider-dashboard-decomposition

**Input**: Design documents from `/specs/003-lider-dashboard-decomposition/`  
**Prerequisites**: [plan.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/plan.md), [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md), [data-model.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/data-model.md), [contracts/leader-components-contract.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/contracts/leader-components-contract.md)  
**Tests**: Validação estática TypeScript (`tsc -b`), build de produção (`vite build`) e script de contagem de linhas via PowerShell (`quickstart.md`).  
**Organization**: As tarefas estão agrupadas por User Story (`US1` a `US4`) seguindo a prioridade (`P1` → `P4`) para permitir implementação atômica e incremental.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos distintos, sem dependências de tarefas não concluídas)
- **[Story]**: User Story à qual a tarefa pertence (`[US1]`, `[US2]`, `[US3]`, `[US4]`)
- Caminhos absolutos e relativos exatos estão incluídos em cada descrição

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Criação do diretório de componentes e tipos compartilhados do domínio do Líder

- [X] T001 Create directory `frontend/src/features/requests/components/lider/`
- [X] T002 [P] Create domain types and formatting utilities in `frontend/src/features/requests/components/lider/types.ts` defining `MaterialStatus`, `MovementRecord`, `Material`, `Requisicao`, `CompanyDetails`, `LiderInfo`, `LeaderActiveSection`, `MovementFilterType`, `getLocalDateStr`, and `formatDateTime` (max 350 lines)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Camada centralizada de serviços HTTP e hooks de tempo real / operações do Líder

**⚠️ CRITICAL**: Nenhuma User Story visual deve ser iniciada antes da conclusão desta fase

- [X] T003 [P] Create `frontend/src/features/requests/api/leaderService.ts` using `api` from `frontend/src/lib/axios.ts` implementing `getPendencias()`, `reviewRequest(id, payload)`, `getSectorMaterials()`, `transferMaterial(payload)`, `acceptTransfer(payload)`, `rejectTransfer(payload)`, `cancelTransfer(payload)`, `markMaterialForExit(payload)`, and `getSectorMovements(sectorId?)` without manual token headers (max 350 lines; depends on T002)
- [X] T004 [P] Create `frontend/src/features/requests/hooks/useLeaderRealtime.ts` subscribing to the Supabase channel `lider_dashboard_changes` for events on `materials`, `material_movements`, and `entry_requests` (max 350 lines)
- [X] T005 Create `frontend/src/features/requests/hooks/useLeaderOperations.ts` encapsulating state management, inventory filtering, history pagination, material selection, actions consuming `leaderService.ts`, and visual feedback with `sonner` and `ConfirmDialog` (max 350 lines; depends on T002, T003)

**Checkpoint**: Camada de dados e serviços do Líder pronta — implementação das visões liberada.

---

## Phase 3: User Story 1 - Aprovação e Recusa Justificada de Solicitações (Priority: P1) 🎯 MVP

**Goal**: Isolar a visão operacional de aprovações pendentes da terceirizada (`Fluxo 02` do `BUSINESS-FLOW.md`) e modal de justificativa de recusa.

**Independent Test**: Autenticar como Líder de Setor, abrir a aba de pendências, aprovar uma solicitação com notificação toast imediata e recusar outra informando o motivo obrigatório no modal.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `frontend/src/features/requests/components/lider/LeaderRejectReasonModal.tsx` rendering an accessible modal dialog to capture and validate the mandatory rejection reason before submitting rejection (max 350 lines; depends on T002)
- [X] T007 [P] [US1] Create `frontend/src/features/requests/components/lider/LeaderApprovalsView.tsx` rendering the list of pending entry requests (`requisicoes`), request cards, company logo/details trigger, technical material inspection trigger, and action buttons for approval and rejection (max 350 lines; depends on T002)

**Checkpoint**: Componentes de triagem e aprovação de solicitações (`US1`) prontos para integração.

---

## Phase 4: User Story 2 - Gestão de Inventário do Setor e Baixa para Saída (Priority: P2)

**Goal**: Isolar a visão de inventário de materiais sob custódia do setor e o acionamento de baixa para saída (`Fluxos 05 e 06` do `BUSINESS-FLOW.md`).

**Independent Test**: Acessar "Meu Setor", filtrar equipamentos pelo campo de busca em tempo real, selecionar itens e acionar "Solicitar Saída da Planta" abrindo o modal de baixa com matrícula.

### Implementation for User Story 2

- [X] T008 [P] [US2] Create `frontend/src/features/requests/components/lider/LeaderSectorInventoryView.tsx` rendering the sector inventory panel, "Em Planta" and "Chegando" status counters, search bar, batch selection checklist, company/material modal triggers, and action buttons for "Solicitar Saída da Planta" and "Transferir Equipamento" (max 350 lines; depends on T002)

**Checkpoint**: Componente de inventário do setor e baixa de saída (`US2`) pronto.

---

## Phase 5: User Story 3 - Controle de Transferências entre Setores (Priority: P3)

**Goal**: Isolar a visão operacional de transferências em trânsito com aceite, recusa justificada e cancelamento de envio (`Fluxo 05` do `BUSINESS-FLOW.md`).

**Independent Test**: Acessar "Transferências Pendentes", aceitar uma transferência recebida confirmando com matrícula, recusar outra justificando o motivo via `ConfirmDialog` e cancelar um envio ativo.

### Implementation for User Story 3

- [X] T009 [P] [US3] Create `frontend/src/features/requests/components/lider/LeaderMovementsView.tsx` rendering incoming transfers with accept and reject buttons, and outgoing transfers with cancel button, badge counters, and company/material modal triggers (max 350 lines; depends on T002)

**Checkpoint**: Componente de transferências entre setores (`US3`) pronto.

---

## Phase 6: User Story 4 - Consulta de Histórico, Modais Auxiliares e Recomposição do Container (Priority: P4)

**Goal**: Isolar a visão de histórico/auditoria de movimentações, encapsular modais auxiliares de visualização e recompor o container `LiderDashboard.tsx` com no máximo 200 linhas.

**Independent Test**: Navegar para "Histórico", alternar filtros de período e direção, inspecionar fotos de evidência e executar script de validação de contagem de linhas confirmando que `LiderDashboard.tsx` possui `<= 200` linhas.

### Implementation for User Story 4

- [X] T010 [P] [US4] Create `frontend/src/features/requests/components/lider/LeaderHistoryView.tsx` rendering the paginated sector movements table (10 items/page), date filter, direction filter buttons ("Todas", "Entradas no Setor", "Saídas do Setor"), text search, and photo evidence viewer trigger (max 350 lines; depends on T002)
- [X] T011 [P] [US4] Create `frontend/src/features/requests/components/lider/LeaderModals.tsx` encapsulating auxiliary inspection modals: company details modal (`selectedCompany`), material specifications modal (`selectedMaterial`), and photo lightbox modal (`selectedPhotos`) (max 350 lines; depends on T002)
- [X] T012 [US4] Refactor `frontend/src/features/requests/pages/LiderDashboard.tsx` to act solely as container/orchestrator consuming `useLeaderOperations` and `useLeaderRealtime`, rendering `DashboardHeader`, `LiderSidebar`, active views (`LeaderApprovalsView`, `LeaderSectorInventoryView`, `LeaderMovementsView`, `LeaderHistoryView`), `LeaderRejectReasonModal`, `LeaderModals`, `AcceptModal`, `TransferModal`, `ExitModal`, and `MobileNav` (max 200 lines; depends on T004, T005, T006, T007, T008, T009, T010, T011)

**Checkpoint**: Container `LiderDashboard.tsx` recomposto e todas as 4 User Stories integradas.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validação final de limites de linhas (`SC-001` e `SC-002`) e build de produção (`SC-005`)

- [X] T013 Run automated line-count verification from `specs/003-lider-dashboard-decomposition/quickstart.md` confirming `frontend/src/features/requests/pages/LiderDashboard.tsx` has `<= 200` lines and every file in `frontend/src/features/requests/components/lider/*.ts*`, `frontend/src/features/requests/hooks/useLeader*.ts`, and `frontend/src/features/requests/api/leaderService.ts` has `<= 350` lines
- [X] T014 Execute production build validation (`npm run build --prefix frontend`) to verify TypeScript (`tsc -b`) and Vite bundle generation succeed with exit code `0`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1: `T001`–`T002`)**: Sem dependências — inicia imediatamente.
- **Foundational (Phase 2: `T003`–`T005`)**: Depende de `T002` (`types.ts`).
- **User Stories (Phases 3–6: `T006`–`T011`)**: Dependem de `T002` (`types.ts`) e podem ser desenvolvidas em paralelo (`[P]`), culminando na recomposição do container em `T012`.
- **Polish (Phase 7: `T013`–`T014`)**: Depende da conclusão de `T012`.

### Parallel Opportunities

- `T003` (`leaderService.ts`) e `T004` (`useLeaderRealtime.ts`) podem ser executados em paralelo após `T002`.
- `T006` (`LeaderRejectReasonModal.tsx`), `T007` (`LeaderApprovalsView.tsx`), `T008` (`LeaderSectorInventoryView.tsx`), `T009` (`LeaderMovementsView.tsx`), `T010` (`LeaderHistoryView.tsx`) e `T011` (`LeaderModals.tsx`) atuam em arquivos novos distintos e podem ser executados em paralelo (`[P]`).

---

## Implementation Strategy

### Incremental & Safe Decomposition

1. **Setup & Types (`T001`–`T002`)**: Criar diretório `components/lider/` e extrair tipos sem alterar o código existente.
2. **API Service & Hooks (`T003`–`T005`)**: Centralizar endpoints em `leaderService.ts` e isolar estado e Realtime nos Custom Hooks.
3. **Views & Modals (`T006`–`T011`)**: Construir componentes especializados com teste e compilação contínua.
4. **Container Recomposition & Validation (`T012`–`T014`)**: Substituir o corpo monolítico de `LiderDashboard.tsx` pela orquestração modular enxuta (`<= 200` linhas) e validar compilação estática (`npm run build --prefix frontend`).
