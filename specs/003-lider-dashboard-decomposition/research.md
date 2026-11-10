# Research & Technical Decisions: 003-lider-dashboard-decomposition

**Feature**: `003-lider-dashboard-decomposition`  
**Date**: 2026-11-09  
**Parent**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md)  

---

## 1. Contexto e Diagnóstico do `LiderDashboard.tsx`

O arquivo `frontend/src/features/requests/pages/LiderDashboard.tsx` acumula atualmente 1.671 linhas de código e combina múltiplas responsabilidades de forma acoplada:
1. **Chamadas HTTP Diretas:** Dispersão de 9 chamadas de rede usando `api.get` e `api.post` com injeção manual redundante de cabeçalhos (`{ headers: { Authorization: \`Bearer \${getAuthToken()}\` } }`), violando o Princípio II da Constituição (que exige uso de serviços de domínio com interceptors centrais).
2. **Mistura de Estados Operacionais:** Estados de 4 abas funcionais distintas (Aprovações, Meu Setor, Transferências e Histórico), somados a 6 estados de modais, fotos, paginação e seleções em lote no mesmo componente.
3. **Subscrições Realtime Implícitas:** Listener do Supabase misturado no `useEffect` principal que re-dispara todas as buscas simultaneamente sem isolamento por contexto.
4. **Violação do Limite de Linhas:** Ultrapassa em mais de 4 vezes o teto de 400 linhas estabelecido no Princípio IV da Constituição.

---

## 2. Decisões Arquiteturais

### Decisão 1: Criação do `leaderService.ts` (`features/requests/api/`)
- **Problema:** O `LiderDashboard.tsx` faz requisições cruas para endpoints `/lider/*`.
- **Solução:** Criar `leaderService.ts` consumindo a instância padronizada `api` de `frontend/src/lib/axios.ts` (onde o token e o tenant já são injetados automaticamente pelos interceptors).
- **Mapeamento de Métodos:**
  - `getPendencias()`: `GET /lider/pendencias` → Retorna `{ requests: Requisicao[], lider: LiderInfo }`.
  - `reviewRequest(id: string, payload: { acao: 'APPROVE' | 'REJECT'; reason?: string })`: `POST /lider/revisar/:id`.
  - `getSectorMaterials()`: `GET /lider/meu-setor` → Retorna `Material[]`.
  - `transferMaterial(payload: LeaderTransferPayload)`: `POST /lider/transferir`.
  - `acceptTransfer(payload: { materialIds: string[]; signature: string; photos?: string[] })`: `POST /lider/aceitar-transferencia`.
  - `rejectTransfer(payload: { materialIds: string[]; reason: string })`: `POST /lider/recusar-transferencia`.
  - `cancelTransfer(payload: { materialIds: string[] })`: `POST /lider/cancelar-transferencia`.
  - `markMaterialForExit(payload: LeaderExitPayload)`: `POST /lider/marcar-saida`.
  - `getSectorMovements(sectorId?: string)`: `GET /lider/movimentacoes?sectorId=:id`.

### Decisão 2: Extração de Custom Hooks (`features/requests/hooks/`)
- **`useLeaderOperations.ts`:**
  - Gerencia o estado de carregamento (`loading`, `isProcessing`).
  - Fornece funções de ação (`handleApprove`, `handleReject`, `handleTransfer`, `handleMarkExit`, `handleAcceptTransfer`, `handleRejectTransfer`, `handleCancelTransfer`).
  - Emite notificações padronizadas via `sonner` (`toast.success`, `toast.error`).
  - Controla seleção múltipla de materiais para transferência/saída (`selectedForTransfer`, `toggleSelectMaterial`, `selectAllMaterials`).
- **`useLeaderRealtime.ts`:**
  - Conecta-se ao canal Supabase `lider_dashboard_changes`.
  - Ouve eventos de `INSERT`, `UPDATE` e `DELETE` nas tabelas `materials`, `material_movements` e `entry_requests`.
  - Executa revalidações sob demanda (`onMaterialsChange`, `onMovementsChange`, `onRequestsChange`).

### Decisão 3: Decomposição de Componentes de Visão (`features/requests/components/lider/`)
Cada aba/seção da tela será isolada em um arquivo próprio com limite estrito de `<= 350` linhas:
1. **`LeaderApprovalsView.tsx`:** Fila de triagem das solicitações enviadas pelas empresas parceiras. Exibe cards de requisições, logos, informações de motorista e botões de aprovar ou recusar.
2. **`LeaderSectorInventoryView.tsx`:** Painel de inventário do setor com contadores de status ("Em Planta" e "Chegando"), barra de busca, checklist de materiais e botões de lote ("Solicitar Saída da Planta" e "Transferir Equipamento").
3. **`LeaderMovementsView.tsx`:** Painel de transferências em trânsito dividido em:
   - *Transferências Recebidas:* Ações de aceitar (abre `AcceptModal`) e recusar (diálogo de justificativa via `ConfirmDialog`).
   - *Transferências Enviadas:* Ação de cancelar envio via `ConfirmDialog`.
4. **`LeaderHistoryView.tsx`:** Tabela de auditoria do setor com paginação (10 itens/página), busca textual, filtro de data e filtros de fluxo ("Todas", "Entradas no Setor", "Saídas do Setor").
5. **`LeaderRejectReasonModal.tsx`:** Modal acessível para captura da justificativa de recusa de solicitação com validação de campo obrigatório.
6. **`types.ts`:** Tipos e interfaces compartilhados do domínio do Líder.

### Decisão 4: Container Orquestrador `LiderDashboard.tsx` (`<= 200` linhas)
- O componente de página atuará puramente como montador:
  - Invoca `useLeaderOperations` e `useLeaderRealtime`.
  - Renderiza `DashboardHeader`, `LiderSidebar`, a visão ativa selecionada (`activeSection`) e os modais (`TransferModal`, `ExitModal`, `AcceptModal`, `LeaderRejectReasonModal`, etc.).
  - Renderiza `MobileNav` para navegação móvel.

---

## 3. Avaliação de Conformidade com a Constituição

| Princípio | Avaliação de Conformidade |
| :--- | :--- |
| **I. Preservação de Regras de Negócio** | **PASS**: Fluxos 02 (Aprovação), 05 (Movimentação interna) e 06 (Baixa para portaria) permanecem com os mesmos contratos de dados, regras de status e autorização. |
| **II. Padronização de Clientes HTTP** | **PASS**: 100% das chamadas HTTP migradas para `leaderService.ts` usando `lib/axios.ts`. Zero chamadas `api.*` dispersas em componentes. |
| **III. Padronização de Feedback Visual** | **PASS**: Notificações mantidas via `sonner` e confirmações destrutivas com motivo via `ConfirmDialog`. Zero dependência de `sweetalert2`. |
| **IV. Decomposição Modular** | **PASS**: `LiderDashboard.tsx` reduzido de 1.671 para `<= 200` linhas; todos os novos subcomponentes e hooks com `<= 350` linhas. |
| **V. Higiene de Código** | **PASS**: Remoção de imports órfãos e injeção manual de tokens; isolamento completo de escopo do líder. |

