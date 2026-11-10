# Implementation Plan: Refatoração Frontend - Fase 2A: Decomposição Modular do Painel de Portaria

**Branch**: `002-portaria-dashboard-decomposition` | **Date**: 2026-11-06 | **Spec**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/002-portaria-dashboard-decomposition/spec.md)

**Input**: Feature specification from `/specs/002-portaria-dashboard-decomposition/spec.md`

## Summary

Decompor o componente monolítico `frontend/src/features/requests/pages/PortariaDashboard.tsx` (1.834 linhas) em uma arquitetura modular baseada em 3 Custom Hooks (`useGatekeeperQueue`, `useGatekeeperRealtime` e `useGatekeeperOperations` em `frontend/src/features/requests/hooks/`) e 7 subcomponentes especializados em `frontend/src/features/requests/components/portaria/` (`GatekeeperHeader`, `GatekeeperTabs`, `GatekeeperEntryQueue`, `GatekeeperExitQueue`, `GatekeeperInPlantView`, `GatekeeperDiscrepancyModal` e `GatekeeperModals`), reduzindo o container `PortariaDashboard.tsx` para menos de 200 linhas e garantindo que nenhum novo arquivo ultrapasse 350 linhas, com preservação estrita dos Fluxos 03 e 07 do `BUSINESS-FLOW.md`.

## Technical Context

**Language/Version**: TypeScript ~6.0.2 / React 19.2.4  

**Primary Dependencies**: React 19, React Router DOM 7.14.0, Axios 1.14.0 (`lib/axios.ts` via `gatekeeperService.ts`), Sonner 2.0.8, Lucide React 1.7.0, TailwindCSS 4.2.2, `@supabase/supabase-js` 2.101.1 (exclusivo para Realtime)  

**Storage**: N/A (estado em memória no cliente; persistência via `gatekeeperService` e eventos via Supabase Realtime)  

**Testing**: Validação estática de tipos e bundle de produção (`npm run build --prefix frontend` -> `tsc -b && vite build`) + verificação automatizada de contagem de linhas (`quickstart.md`)  

**Target Platform**: Navegadores Web Desktop e Mobile/Tablet (postos de guarita industrial)  

**Project Type**: Web application (Frontend SPA React + Vite)  

**Performance Goals**: Zero re-renderizações desnecessárias do painel principal a cada tick de 1 segundo do relógio (isolado em `GatekeeperHeader.tsx`); sincronização de fila em tempo real + polling de 30s mantidos sem vazamento de canais  

**Constraints**: `PortariaDashboard.tsx` <= 200 linhas; cada novo subcomponente ou hook <= 350 linhas; zero alterações de contrato HTTP ou regras de negócio dos Fluxos 03 e 07  

**Scale/Scope**: 1 página container refatorada (`PortariaDashboard.tsx`), 3 novos Custom Hooks em `features/requests/hooks/` e 8 novos arquivos em `features/requests/components/portaria/` (7 componentes + 1 arquivo de tipos/utilitários)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição (v1.0.0) | Status Pré-Design | Status Pós-Design | Evidência / Justificativa |
|---|---|---|---|
| **I. Preservação Estrita das Regras de Negócio (NON-NEGOTIABLE)** | ✅ PASS | ✅ PASS | Fluxos 03 (Entrada na Portaria) e 07 (Saída pela Portaria) mantêm exatamente as mesmas transições (`WAITING_ARRIVAL`, `ARRIVED`, `IN_ANALYSIS`, `DISCREPANCY`, `IN_PLANTA`, `WAITING_EXIT`, `EXIT_CONFERENCE`), validações de matrícula e payloads. |
| **II. Padronização de Camadas e Clientes HTTP** | ✅ PASS | ✅ PASS | `useGatekeeperQueue` e `useGatekeeperOperations` consomem exclusivamente `gatekeeperService.ts` (sobre `lib/axios.ts`). `useGatekeeperRealtime` utiliza `supabase` apenas para `channel('portaria_dashboard_changes')` (Realtime permitido pela Constituição). |
| **III. Padronização de Feedback Visual e Modais** | ✅ PASS | ✅ PASS | Mantém 100% das notificações via `toast` (`sonner`) e confirmações destrutivas/críticas via `useConfirm()` (`ConfirmDialog.tsx`). |
| **IV. Decomposição Modular e Limite de Responsabilidade** | ✅ PASS | ✅ PASS | Elimina o God Component de 1.834 linhas, impondo teto estrito de 200 linhas para `PortariaDashboard.tsx` e 350 linhas para cada subcomponente/hook (abaixo do limite constitucional de 400 linhas). |
| **V. Higiene de Código e Isolamento de Contexto por Papel** | ✅ PASS | ✅ PASS | Nenhum import órfão ou código morto; `PortariaDashboard` permanece isolado do `DashboardProvider` conforme configurado na Fase 1. |

## Project Structure

### Documentation (this feature)

```text
specs/002-portaria-dashboard-decomposition/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0: Inventário de 24 estados, 7 efeitos e decisões arquiteturais
├── data-model.md        # Phase 1: Entidades e modelos de estado dos hooks
├── quickstart.md        # Phase 1: Guia de validação de limites de linhas e build
├── contracts/           # Phase 1: Contratos de interface de hooks e props
│   └── portaria-components-contract.md
└── tasks.md             # Phase 2 (/speckit-tasks - gerado na próxima etapa)
```

### Source Code (repository root)

```text
frontend/
└── src/
    └── features/
        └── requests/
            ├── api/
            │   └── gatekeeperService.ts                # Existente (Fase 1)
            ├── hooks/
            │   ├── useGatekeeperQueue.ts               # NOVO (~155 linhas): Estado de fila, filtros, busca e histórico
            │   ├── useGatekeeperRealtime.ts            # NOVO (~45 linhas): Subscrição Realtime Supabase + polling 30s
            │   └── useGatekeeperOperations.ts          # NOVO (~210 linhas): Ações operacionais, fotos, matrícula e modais
            ├── components/
            │   ├── dashboard/
            │   │   ├── MobileNav.tsx                   # Existente (reutilizado)
            │   │   ├── NotificationDropdown.tsx        # Existente (reutilizado)
            │   │   └── PortariaHistoryView.tsx         # Existente (reutilizado)
            │   └── portaria/
            │       ├── types.ts                        # NOVO (~65 linhas): Tipos compartilhados e formatDateTime
            │       ├── GatekeeperHeader.tsx            # NOVO (~95 linhas): Navbar com relógio local isolado e ações
            │       ├── GatekeeperTabs.tsx              # NOVO (~240 linhas): Abas, busca, subfiltros com contadores e lista
            │       ├── GatekeeperEntryQueue.tsx        # NOVO (~310 linhas): Conferência e liberação de entrada (Fluxo 03)
            │       ├── GatekeeperExitQueue.tsx         # NOVO (~285 linhas): Conferência e liberação de saída (Fluxo 07)
            │       ├── GatekeeperInPlantView.tsx       # NOVO (~170 linhas): Visualização somente leitura de itens Em Planta
            │       ├── GatekeeperDiscrepancyModal.tsx  # NOVO (~85 linhas): Modal de justificativa e alerta de divergência
            │       └── GatekeeperModals.tsx            # NOVO (~250 linhas): Modais de material, empresa, feedback e lightbox
            └── pages/
                └── PortariaDashboard.tsx               # REFATORADO (<= 200 linhas): Container orquestrador
```

**Structure Decision**: Adotada a estrutura modular dentro da feature `frontend/src/features/requests/`, separando a lógica de estado e efeitos em `hooks/` (`useGatekeeperQueue`, `useGatekeeperRealtime`, `useGatekeeperOperations`) e os componentes visuais de guarita em `components/portaria/`, mantendo `pages/PortariaDashboard.tsx` como container enxuto.

## Complexity Tracking

Nenhuma violação à Constituição identificada. Todos os 5 princípios fundamentais foram atendidos integralmente.
