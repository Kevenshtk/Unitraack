# Phase 0 Research: Decomposição Modular do PortariaDashboard

**Feature**: `002-portaria-dashboard-decomposition`  
**Date**: 2026-11-06  
**Source File Analyzed**: `frontend/src/features/requests/pages/PortariaDashboard.tsx` (1.834 linhas)

---

## 1. Mapeamento Completo de Estado, Efeitos e Handlers em `PortariaDashboard.tsx`

### 1.1 Inventário de `useState` (24 estados identificados)

| # | Estado | Linha Atual | Tipo | Classificação | Destino na Decomposição |
|---|---|---|---|---|---|
| 1 | `requisicoes` | L72 | `Requisicao[]` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 2 | `loading` | L73 | `boolean` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 3 | `searchTerm` | L74 | `string` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 4 | `selecionadoId` | L75 | `string \| null` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 5 | `activeTab` | L78 | `'ENTRY' \| 'EXIT' \| 'IN_PLANTA'` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 6 | `entrySubFilter` | L95 | `'WAITING' \| 'ARRIVED' \| 'ANALYSIS'` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 7 | `exitSubFilter` | L96 | `'WAITING' \| 'CONFERENCE'` | **Global da Tela (Fila)** | `useGatekeeperQueue` |
| 8 | `mobileSection` | L83 | `'list' \| 'details' \| 'history'` | **Global da Tela (Navegação)** | `useGatekeeperQueue` |
| 9 | `auditHistory` | L84 | `any[]` | **Global da Tela (Histórico)** | `useGatekeeperQueue` |
| 10 | `isHistoryPageOpen` | L85 | `boolean` | **Global da Tela (Histórico)** | `useGatekeeperQueue` |
| 11 | `loadingHistory` | L86 | `boolean` | **Global da Tela (Histórico)** | `useGatekeeperQueue` |
| 12 | `currentTime` | L87 | `Date` | **Local de UI (Relógio)** | `GatekeeperHeader.tsx` |
| 13 | `processing` | L76 | `boolean` | **Volátil de Ação** | `useGatekeeperOperations` |
| 14 | `selectedMaterials` | L79 | `string[]` | **Volátil de Ação (Checklist)** | `useGatekeeperOperations` |
| 15 | `signature` | L90 | `string` | **Volátil de Ação (Matrícula)** | `useGatekeeperOperations` |
| 16 | `photos` | L91 | `string[]` | **Volátil de Ação (Evidências)** | `useGatekeeperOperations` |
| 17 | `observation` | L94 | `string` | **Volátil de Ação (Observação)** | `useGatekeeperOperations` |
| 18 | `showDiscrepancyModal` | L81 | `boolean` | **Volátil de Modal (Divergência)** | `useGatekeeperOperations` |
| 19 | `discrepancyReason` | L82 | `string` | **Volátil de Modal (Divergência)** | `useGatekeeperOperations` |
| 20 | `showSuccessModal` | L88 | `boolean` | **Volátil de Modal (Feedback)** | `useGatekeeperOperations` |
| 21 | `modalConfig` | L89 | `{ title, message, type }` | **Volátil de Modal (Feedback)** | `useGatekeeperOperations` |
| 22 | `isCameraOpen` | L93 | `boolean` | **Volátil de Modal (Câmera)** | `useGatekeeperOperations` |
| 23 | `detailMaterial` | L80 | `Material \| null` | **Volátil de Modal (Inspeção)** | `useGatekeeperOperations` |
| 24 | `selectedCompany` | L77 | `CompanyDetails \| null` | **Volátil de Modal (Empresa)** | `useGatekeeperQueue` (aciona `fetchAuditHistory`) |
| 25 | `selectedPhotos` | L92 | `string[] \| null` | **Volátil de Modal (Lightbox)** | `useGatekeeperOperations` |

---

### 1.2 Inventário de `useEffect` (7 efeitos identificados)

| # | Efeito | Linhas Atuais | Dependências | Responsabilidade | Destino na Decomposição |
|---|---|---|---|---|---|
| 1 | Timer do relógio (`setInterval` 1s) | L98–101 | `[]` | Atualizar horário exibido na barra superior | `GatekeeperHeader.tsx` |
| 2 | Carregar histórico da empresa selecionada | L133–137 | `[selectedCompany]` | Buscar histórico ao abrir modal de empresa | `useGatekeeperQueue` |
| 3 | Carregar histórico da unidade ao abrir página de histórico | L139–143 | `[isHistoryPageOpen, userProfile?.tenant_id]` | Buscar histórico geral da portaria | `useGatekeeperQueue` |
| 4 | Resetar seleção e carregar fila ao trocar `activeTab` | L191–198 | `[activeTab]` | Buscar requisições e limpar estado de aba anterior | `useGatekeeperQueue` + `useGatekeeperOperations` |
| 5 | Polling de 30s da fila | L201–206 | `[activeTab]` | Sincronizar chegadas agendadas e fila a cada 30s | `useGatekeeperRealtime` |
| 6 | Canal Realtime Supabase (`portaria_dashboard_changes`) | L208–224 | `[activeTab]` | Escutar `entry_requests` e `material_movements` e atualizar fila | `useGatekeeperRealtime` |
| 7 | Pré-selecionar materiais elegíveis e alternar `mobileSection` ao selecionar protocolo | L228–241 | `[selecionadoId]` | Marcar todos os itens pendentes do protocolo selecionado e exibir detalhes no mobile | `useGatekeeperOperations` / `useGatekeeperQueue` |

---

### 1.3 Inventário de Funções e Handlers (8 funções identificadas)

| # | Função | Linhas Atuais | Responsabilidade | Destino na Decomposição |
|---|---|---|---|---|
| 1 | `formatDateTime(dateStr)` | L103–117 | Normalizar string ISO/UTC e formatar data e hora (`pt-BR`) | `features/requests/components/portaria/types.ts` (utilitário compartilhado) |
| 2 | `fetchAuditHistory(id?)` | L119–131 | Consultar `gatekeeperService.getAuditHistory(targetId, true)` | `useGatekeeperQueue` |
| 3 | `fetchRequisicoes()` | L172–189 | Consultar `gatekeeperService.getApprovedRequests(statusList)` conforme `activeTab` | `useGatekeeperQueue` |
| 4 | `handleUpdateGateStatus(targetId, newStatus)` | L145–170 | Atualizar status do portão via `gatekeeperService.updateGateStatus` + `toast` | `useGatekeeperOperations` |
| 5 | `handleToggleMaterial(id)` | L243–247 | Marcar/desmarcar equipamento para conferência | `useGatekeeperOperations` |
| 6 | `handleCapturePhoto(e)` / `removePhoto(index)` | L249–264 | Comprimir imagem via `compressImage` e gerenciar array `photos` | `useGatekeeperOperations` |
| 7 | `handleConfirmMovement()` | L266–331 | Validar matrícula, confirmar liberação com divergência via `useConfirm()`, chamar `gatekeeperService.confirmMovement` e abrir modal de protocolo | `useGatekeeperOperations` |
| 8 | `handleCancelEntry()` / `handleNotifyDiscrepancy()` | L333–398 | Solicitar motivo via `useConfirm()` e chamar `gatekeeperService.cancelEntry` / `gatekeeperService.notifyDiscrepancy` | `useGatekeeperOperations` |

---

## 2. Decisões Arquiteturais

### Decision 1: Divisão da Camada de Hooks em 3 Custom Hooks Coesos (`features/requests/hooks/`)
- **Decision**: Criar três hooks especializados em `frontend/src/features/requests/hooks/`:
  1. `useGatekeeperQueue.ts`: Gerencia `activeTab`, `entrySubFilter`, `exitSubFilter`, `searchTerm`, `requisicoes`, `filteredReqs`, `selecionadoId`, `selectedReq`, `mobileSection`, `isHistoryPageOpen`, `auditHistory`, `loading`, `loadingHistory`, `selectedCompany`, `fetchRequisicoes` e `fetchAuditHistory`.
  2. `useGatekeeperRealtime.ts`: Encapsula a subscrição do canal Supabase (`portaria_dashboard_changes` para `entry_requests` e `material_movements`) e o polling periódico de 30 segundos, recebendo `activeTab` e o callback `onRefresh` (`fetchRequisicoes`).
  3. `useGatekeeperOperations.ts`: Encapsula o estado volátil de conferência (`selectedMaterials`, `signature`, `photos`, `observation`, `processing`, `showDiscrepancyModal`, `discrepancyReason`, `showSuccessModal`, `modalConfig`, `isCameraOpen`, `detailMaterial`, `selectedPhotos`) e todas as ações (`handleUpdateGateStatus`, `handleToggleMaterial`, `handleSelectAllMaterials`, `handleCapturePhoto`, `removePhoto`, `handleConfirmMovement`, `handleCancelEntry`, `handleNotifyDiscrepancy`).
- **Rationale**: Atende simultaneamente às diretrizes de `/speckit-specify` (`useGatekeeperQueue` + ações) e `/speckit-plan` (`useGatekeeperRealtime` + `useGatekeeperOperations`), mantendo cada hook abaixo de 220 linhas com responsabilidade única e testável.
- **Alternatives considered**:
  - *Um único hook `usePortariaDashboard`*: Rejeitado porque concentraria ~350 linhas misturando listagem, filtros, realtime e formulários transacionais.

### Decision 2: Decomposição dos Componentes de Apresentação em `features/requests/components/portaria/`
- **Decision**: Extrair a interface em componentes especializados dentro de `frontend/src/features/requests/components/portaria/`:
  1. `types.ts` (~65 linhas): Interfaces `Material`, `Requisicao`, `CompanyDetails`, `GateStatus`, `ActiveTab`, `EntrySubFilter`, `ExitSubFilter` e helper `formatDateTime`.
  2. `GatekeeperHeader.tsx` (~95 linhas): Barra de navegação superior com logo/nome do tenant, relógio em tempo real (`currentTime`), nome do operador, `NotificationDropdown`, botão de alternância do Histórico e botão de Logout.
  3. `GatekeeperTabs.tsx` (~240 linhas): Coluna lateral contendo o seletor das 3 abas (`ENTRY`, `EXIT`, `IN_PLANTA`), campo de busca, subfiltros de Entrada (Aguardando, Chegada, Em Análise) e Saída (Aguardando Saída, Conferência) com contadores dinâmicos e a lista de cards de veículos/solicitações.
  4. `GatekeeperEntryQueue.tsx` (~310 linhas): Painel de conferência de entrada (`activeTab === 'ENTRY'`), contendo cabeçalho do protocolo, stepper de 4 fases + botões de transição (`ARRIVED`, `IN_ANALYSIS`, `WAITING_ARRIVAL`), alerta de divergência, metadados do veículo/motorista/destino, checklist de equipamentos, seção de fotos/observação, campo de matrícula e barra de ações (`Liberar Entrada`, `Divergência`, `Cancelar Entrada`).
  5. `GatekeeperExitQueue.tsx` (~285 linhas): Painel de conferência de saída (`activeTab === 'EXIT'`), contendo cabeçalho do protocolo, stepper de 3 fases de saída + botões de transição (`EXIT_CONFERENCE`, `WAITING_EXIT`), alerta de divergência, metadados do veículo/motorista/destino, checklist de equipamentos para baixa, seção de fotos/observação, campo de matrícula e barra de ações (`Confirmar Saída`, `Divergência`).
  6. `GatekeeperInPlantView.tsx` (~170 linhas): Painel de consulta de ativos em planta (`activeTab === 'IN_PLANTA'`), contendo cabeçalho do protocolo, banner de divergência (se houver), metadados de destino/motorista/placa/horário, lista somente leitura de equipamentos em planta com atalhos para fotos e detalhes técnicos, e rodapé informativo.
  7. `GatekeeperDiscrepancyModal.tsx` (~85 linhas): Modal dedicado para justificativa e envio de alerta de divergência ao Gestor de Segurança / Líder.
  8. `GatekeeperModals.tsx` (~250 linhas): Agrupa os modais de inspeção e suporte da guarita (`MaterialDetailModal`, `CompanyDetailModal`, `OperationFeedbackModal` e `PhotoLightboxModal`).
- **Rationale**: Garante que nenhum arquivo ultrapasse 350 linhas (`SC-002`) e reduz `PortariaDashboard.tsx` para ~145 linhas (`SC-001`), preservando 100% da marcação TailwindCSS e comportamento visual existentes.
- **Alternatives considered**:
  - *Manter `GatekeeperEntryQueue` e `GatekeeperExitQueue` em um único componente condicional*: Rejeitado porque o arquivo resultante teria ~480 linhas (violando o teto de 350 linhas) e manteria condicionais entrelaçadas de `activeTab === 'ENTRY'` vs `'EXIT'`.

