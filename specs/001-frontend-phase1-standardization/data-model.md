# Phase 1 Data Model & Internal Types: Refatoração Frontend - Fase 1

**Feature**: `001-frontend-phase1-standardization`  
**Date**: 2026-11-05

> Como esta funcionalidade trata de padronização arquitetural no Frontend (camada de feedback visual, camada de serviços HTTP e isolamento de contexto), não há criação ou alteração de tabelas no banco de dados PostgreSQL. Este documento define os modelos de estado, contratos de props e DTOs de serviços de domínio do Frontend.

---

## 1. Modelo do Diálogo de Confirmação (`ConfirmDialog`)

Localização planejada: `frontend/src/components/common/ConfirmDialog.tsx`

### 1.1 Entidades e Propriedades

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `isOpen` | `boolean` | Sim (modo declarativo) | Controla a visibilidade do modal |
| `title` | `string` | Sim | Título principal exibido no cabeçalho do diálogo |
| `description` | `string` | Sim | Mensagem explicativa sobre a ação e suas consequências |
| `confirmText` | `string` | Não (default: `'Confirmar'`) | Rótulo do botão de confirmação |
| `cancelText` | `string` | Não (default: `'Cancelar'`) | Rótulo do botão de cancelamento |
| `variant` | `'danger' \| 'warning' \| 'primary'` | Não (default: `'danger'`) | Define a semântica visual (vermelho/rose para ações destrutivas, âmbar para alertas, azul/teal para confirmações padrão) |
| `isLoading` | `boolean` | Não (default: `false`) | Desabilita botões e exibe indicador visual de processamento |
| `inputConfig` | `ConfirmInputConfig` | Não | Configuração opcional para coleta de justificativa/motivo no próprio modal |

### 1.2 Configuração de Input Opcional (`ConfirmInputConfig`)

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | `'text' \| 'textarea'` | Não (default: `'text'`) | Tipo de campo de entrada |
| `placeholder` | `string` | Não | Texto de ajuda dentro do campo |
| `defaultValue` | `string` | Não | Valor inicial pré-preenchido |
| `required` | `boolean` | Não (default: `true`) | Exige preenchimento não-vazio antes de habilitar/concluir confirmação |
| `errorMessage` | `string` | Não | Mensagem exibida quando `required === true` e o valor está em branco |

### 1.3 Resultado do Hook Imperativo (`ConfirmResult`)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `isConfirmed` | `boolean` | `true` se o usuário confirmou a ação, `false` se cancelou ou pressionou `Escape` |
| `value` | `string \| undefined` | Texto digitado pelo usuário quando `inputConfig` estiver presente |

---

## 2. Modelos de Serviços de Domínio HTTP (`src/features/*/api/*.service.ts`)

### 2.1 `gatekeeperService` (`frontend/src/features/requests/api/gatekeeperService.ts`)

| Método | Parâmetros | Retorno | Descrição |
|--------|------------|---------|-----------|
| `getApprovedRequests(statuses: string[])` | `statuses: string[]` | `Promise<Requisicao[]>` | Busca solicitações filtradas por lista de status (`GET /portaria/approved`) |
| `getAuditHistory(tenantId: string, onlyPortaria?: boolean)` | `tenantId: string`, `onlyPortaria = true` | `Promise<any[]>` | Busca histórico de auditoria da portaria (`GET /portaria/audit/:tenantId`) |
| `updateGateStatus(requestId: string, status: GateStatus)` | `requestId: string`, `status: 'WAITING_ARRIVAL' \| 'ARRIVED' \| 'IN_ANALYSIS' \| 'WAITING_EXIT' \| 'EXIT_CONFERENCE'` | `Promise<any>` | Atualiza etapa da triagem no portão (`POST /portaria/status/:id`) |
| `confirmMovement(requestId: string, payload: GateMovementPayload)` | `requestId: string`, `payload: { materialIds: string[]; type: 'ENTRY' \| 'EXIT' \| 'IN_PLANTA'; signature: string; photos?: string[]; observation?: string }` | `Promise<any>` | Confirma entrada ou saída física na portaria (`POST /portaria/movimentacao/:id`) |
| `cancelEntry(requestId: string, reason: string)` | `requestId: string`, `reason: string` | `Promise<any>` | Cancela entrada com justificativa (`POST /portaria/cancelar/:id`) |
| `notifyDiscrepancy(requestId: string, reason: string)` | `requestId: string`, `reason: string` | `Promise<any>` | Registra divergência na conferência física (`POST /portaria/divergencia/:id`) |

### 2.2 `teamService` (`frontend/src/features/admin/api/teamService.ts`)

| Método | Parâmetros | Retorno | Descrição |
|--------|------------|---------|-----------|
| `getTeamMembers()` | Nenhum | `Promise<TeamMember[]>` | Lista membros internos da unidade (`GET /gestor/team`) |
| `updateTeamMember(id: string, data: Partial<TeamMember>)` | `id: string`, `data: Record<string, any>` | `Promise<any>` | Atualiza cadastro ou status `is_active` do membro (`PUT /gestor/team/:id`) |
| `deleteTeamMember(id: string)` | `id: string` | `Promise<any>` | Remove membro da equipe (`DELETE /gestor/team/:id`) |
| `resetMemberPassword(id: string, newPassword: string)` | `id: string`, `newPassword: string` | `Promise<any>` | Redefine senha provisória do membro (`POST /gestor/team/:id/reset-password`) |
| `registerInternalMember(payload: RegisterInternalPayload)` | `payload: Record<string, any>` | `Promise<any>` | Cadastra novo membro interno (`POST /auth/register`) |

### 2.3 `requestService` (`frontend/src/features/requests/api/requestService.ts`)

| Método | Parâmetros | Retorno | Descrição |
|--------|------------|---------|-----------|
| `getSectors()` | Nenhum | `Promise<Sector[]>` | Lista setores e subsetores da unidade (`GET /sectors`) |
| `createRequest(payload: UpsertRequestPayload)` | `payload: UpsertRequestPayload` | `Promise<any>` | Cria nova solicitação de entrada pela terceirizada (`POST /terceirizada/requisicao`) |
| `updateRequest(id: string, payload: UpsertRequestPayload)` | `id: string`, `payload: UpsertRequestPayload` | `Promise<any>` | Atualiza solicitação existente (`PUT /terceirizada/requisicao/:id`) |
| `getPartnerProfile()` | Nenhum | `Promise<any>` | Obtém perfil da empresa terceirizada (`GET /terceirizada/profile`) |
| `getPartnerRequests()` | Nenhum | `Promise<any[]>` | Lista solicitações da terceirizada (`GET /terceirizada/requisicoes`) |
| `cancelPartnerRequest(id: string)` | `id: string` | `Promise<any>` | Cancela solicitação pendente (`POST /terceirizada/requisicoes/:id/cancel`) |
| `deletePartnerRequest(id: string)` | `id: string` | `Promise<any>` | Exclui solicitação do histórico (`DELETE /terceirizada/requisicoes/:id`) |

### 2.4 `dashboardService` (`frontend/src/features/requests/api/dashboardService.ts`)

- **Métodos mantidos**: `getMonitoring()`, `getDashboard()`, `updateMaterialPosition()`, `updateMapLayout()`, `getThirdPartyStats()`.
- **Método adicionado**: `getAuditReport(profileId: string)` (`GET /gestor/audit-report?profileId=${profileId}`) para substituir o `axios.get` direto em `AuditSection.tsx`.
- **Métodos órfãos removidos**: `approveRequest()`, `rejectRequest()`.

