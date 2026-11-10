# Implementation Plan: 003-lider-dashboard-decomposition

**Branch**: `003-lider-dashboard-decomposition` | **Date**: 2026-11-09 | **Spec**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md)

**Input**: Feature specification from `specs/003-lider-dashboard-decomposition/spec.md`

## Summary

Decomposição modular da tela `frontend/src/features/requests/pages/LiderDashboard.tsx` (atualmente com 1.671 linhas) em submódulos coesos, isolando regras de negócio e chamadas de API em Custom Hooks (`useLeaderOperations`, `useLeaderRealtime`), centralizando a comunicação HTTP em `leaderService.ts` e dividindo a interface em componentes especializados (`LeaderApprovalsView`, `LeaderSectorInventoryView`, `LeaderMovementsView`, `LeaderHistoryView`, `LeaderRejectReasonModal`, `LeaderModals`), garantindo que o container `LiderDashboard.tsx` fique com `<= 200` linhas e nenhum subcomponente ultrapasse `350` linhas, sem alterar o comportamento dos Fluxos 02, 05 e 06 do `BUSINESS-FLOW.md`.

## Technical Context

**Language/Version**: TypeScript 5.8+ / React 19  
**Primary Dependencies**: React, TailwindCSS v4, Lucide React, Sonner, Axios (via `lib/axios.ts`), Supabase JS (Realtime)  
**Storage**: PostgreSQL via Supabase (banco gerenciado pelo backend)  
**Testing**: Compilação estática TypeScript (`tsc -b`), build de produção (`vite build`) e validação de limites de linhas via PowerShell  
**Target Platform**: Navegador Web (Desktop e Mobile responsivo)  
**Project Type**: Web Application (Single-Page Application com React + Vite)  
**Performance Goals**: Carregamento instantâneo de abas, sincronização Realtime sem polling excessivo, feedback visual em menos de 100ms  
**Constraints**: Zero alteração de regras de negócio; nenhum componente React acima de 350 linhas; container principal com `<= 200` linhas; 100% das chamadas HTTP encapsuladas em `leaderService.ts`  
**Scale/Scope**: 1 tela monolítica refatorada em 1 service de API, 2 Custom Hooks e 6 subcomponentes  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição | Verificação de Conformidade | Status |
| :--- | :--- | :---: |
| **I. Preservação Estrita das Regras de Negócio** | Mantém intactos os Fluxos 02 (Aprovação pelo Líder), 05 (Movimentação entre Setores) e 06 (Baixa para Saída). Mesmos status e transições (`PENDING`, `IN_PLANTA`, `MOVING`, `WAITING_EXIT`). | **PASS** |
| **II. Padronização de Camadas e Clientes HTTP** | Criação de `leaderService.ts` consumindo `lib/axios.ts`. Eliminação de 100% das chamadas diretas a `api.get` / `api.post` com injeção manual de cabeçalho na tela. | **PASS** |
| **III. Padronização de Feedback Visual** | Mantém Sonner para toasts e `ConfirmDialog` para recusas/cancelamentos destrutivos. Zero `sweetalert2` ou `alert()` nativo. | **PASS** |
| **IV. Decomposição Modular e Limite de Responsabilidade** | Container `LiderDashboard.tsx` limitado a `<= 200` linhas. Subcomponentes e hooks com limite máximo de `<= 350` linhas. | **PASS** |
| **V. Higiene de Código e Isolamento por Papel** | Elimina código duplicado de paginação e filtragem, remove injeção manual de tokens e mantém isolamento estrito de setor do líder. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/003-lider-dashboard-decomposition/
├── plan.md                                          # Este arquivo (Estratégia de implementação)
├── research.md                                      # Decisões técnicas e arquiteturais
├── data-model.md                                    # Interfaces de domínio, payloads e utilitários
├── quickstart.md                                    # Guia de validação de linhas e testes funcionais
├── contracts/
│   └── leader-components-contract.md                # Contratos TypeScript dos hooks, componentes e serviço
└── checklists/
    └── requirements.md                              # Checklist de qualidade da especificação
```

### Source Code Layout

```text
frontend/src/features/requests/
├── api/
│   ├── leaderService.ts                             # [NOVO] Camada de serviços HTTP do Líder (/lider/*)
│   ├── gatekeeperService.ts                         # [Existente] Serviços da Portaria
│   ├── requestService.ts                            # [Existente] Serviços de Solicitações
│   └── dashboardService.ts                          # [Existente] Serviços do Gestor
├── hooks/
│   ├── useLeaderOperations.ts                       # [NOVO] Custom Hook de estado, ações e feedback do Líder
│   ├── useLeaderRealtime.ts                         # [NOVO] Custom Hook de subscrição Realtime do setor
│   ├── useGatekeeperQueue.ts                        # [Existente] Hook de fila da Portaria
│   ├── useGatekeeperOperations.ts                   # [Existente] Hook de operações da Portaria
│   └── useGatekeeperRealtime.ts                     # [Existente] Hook Realtime da Portaria
├── components/lider/
│   ├── types.ts                                     # [NOVO] Interfaces de domínio e utilitários de data/hora
│   ├── LeaderApprovalsView.tsx                      # [NOVO] Aba de aprovações pendentes da terceirizada
│   ├── LeaderSectorInventoryView.tsx                # [NOVO] Aba de inventário ("Em Planta" e "Chegando")
│   ├── LeaderMovementsView.tsx                      # [NOVO] Aba de transferências (recebidas e enviadas)
│   ├── LeaderHistoryView.tsx                        # [NOVO] Aba de histórico paginado com filtros de fluxo
│   ├── LeaderRejectReasonModal.tsx                  # [NOVO] Modal de justificativa de recusa de solicitação
│   └── LeaderModals.tsx                             # [NOVO] Modais de detalhes técnicos, empresa e fotos
└── pages/
    └── LiderDashboard.tsx                           # [REFATORADO] Container/Orquestrador (<= 200 linhas)
```

## Phased Implementation Plan

### Phase 1: Setup & Domain Types
- Criar diretório `frontend/src/features/requests/components/lider/`.
- Criar `frontend/src/features/requests/components/lider/types.ts` extraindo e exportando todas as interfaces e funções utilitárias (`getLocalDateStr`, `formatDateTime`).

### Phase 2: API Service Layer
- Criar `frontend/src/features/requests/api/leaderService.ts` centralizando todos os 9 endpoints do Líder (`/lider/*`) sobre `lib/axios.ts`.

### Phase 3: Custom Hooks
- Criar `frontend/src/features/requests/hooks/useLeaderRealtime.ts` para listeners isolados do Supabase no setor do líder.
- Criar `frontend/src/features/requests/hooks/useLeaderOperations.ts` encapsulando estados, filtros, paginação, chamadas ao `leaderService` e feedbacks com `sonner`.

### Phase 4: Views & Modals Subcomponents
- Criar `frontend/src/features/requests/components/lider/LeaderApprovalsView.tsx` (Aprovações pendentes).
- Criar `frontend/src/features/requests/components/lider/LeaderSectorInventoryView.tsx` (Inventário do setor e seleção para baixa/transferência).
- Criar `frontend/src/features/requests/components/lider/LeaderMovementsView.tsx` (Transferências em trânsito com aceite, recusa e cancelamento).
- Criar `frontend/src/features/requests/components/lider/LeaderHistoryView.tsx` (Histórico de movimentações paginado).
- Criar `frontend/src/features/requests/components/lider/LeaderRejectReasonModal.tsx` (Modal de justificativa de recusa).
- Criar `frontend/src/features/requests/components/lider/LeaderModals.tsx` (Modais de detalhes da empresa, ficha técnica e fotos).

### Phase 5: Container Recomposition
- Refatorar `frontend/src/features/requests/pages/LiderDashboard.tsx` para atuar exclusivamente como container/orquestrador consumindo os hooks e renderizando a barra superior, navegação e visões ativas (`<= 200` linhas).

### Phase 6: Verification & Polish
- Executar script de validação de linhas (`SC-001` e `SC-002`).
- Executar validação de build TypeScript/Vite (`npm run build --prefix frontend`).

