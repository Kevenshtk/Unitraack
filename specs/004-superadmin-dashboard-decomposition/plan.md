# Implementation Plan: 004-superadmin-dashboard-decomposition

**Branch**: `004-superadmin-dashboard-decomposition` | **Date**: 2026-11-25 | **Spec**: [spec.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/spec.md)

**Input**: Feature specification from `specs/004-superadmin-dashboard-decomposition/spec.md`

## Summary

Decomposição modular da tela `frontend/src/features/admin/pages/SuperAdminDashboard.tsx` (atualmente com 2.459 linhas) em submódulos coesos, migrando 100% das 10 chamadas `fetch()` nativo para a camada de serviço dedicada `superAdminService.ts` sobre `lib/axios.ts`, isolando estado e regras administrativas em três Custom Hooks (`useSuperAdminTenants`, `useSuperAdminUsers`, `useSuperAdminStats`) e dividindo a interface em cinco subcomponentes especializados (`PlatformStatsCards`, `TenantsManagementView`, `TenantFormModal`, `GlobalUsersView`, `TenantAuditView`), reduzindo o container `SuperAdminDashboard.tsx` para `<= 220` linhas e limitando todos os novos arquivos a `<= 350` linhas.

## Technical Context

**Language/Version**: TypeScript 5.8+ / React 19  
**Primary Dependencies**: React, TailwindCSS v4, Lucide React, Sonner, Axios (via `lib/axios.ts`), `ConfirmDialog` (`useConfirm`)  
**Storage**: PostgreSQL via Supabase (gerenciado pelo Backend; nenhuma query direta no Frontend)  
**Testing**: Compilação estática TypeScript (`tsc -b`), build de produção (`vite build`), auditoria de ausência de `fetch(` e validação de limites de linhas via PowerShell  
**Target Platform**: Navegador Web (Desktop e Mobile responsivo)  
**Project Type**: Web Application (Single-Page Application com React + Vite)  
**Performance Goals**: Carregamento paralelo inicial (`tenants`, `stats`, `users`), auditoria sob demanda por usina selecionada e filtragem instantânea em memória sem requisições redundantes  
**Constraints**: Zero alteração de regras de negócio (Seção 3.5 e Fluxo 14 do `BUSINESS-FLOW.md`); container `SuperAdminDashboard.tsx <= 220` linhas; novos módulos `<= 350` linhas cada; 100% das chamadas HTTP em `superAdminService.ts` sem `fetch(` ou `getAuthToken()` manual  
**Scale/Scope**: 1 página monolítica de 2.459 linhas refatorada em 1 arquivo de tipos, 1 serviço de API (11 métodos), 3 Custom Hooks e 5 subcomponentes visuais

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição | Verificação de Conformidade | Status |
| :--- | :--- | :---: |
| **I. Preservação Estrita das Regras de Negócio** | Mantém intactos todos os fluxos da Seção 3.5 e Fluxo 14 do `BUSINESS-FLOW.md`: CRUD de usinas, extração de branding, convite para Gestor, bloqueio de autodesativação, filtros de usuários e auditoria por usina. | **PASS** |
| **II. Padronização de Camadas e Clientes HTTP** | Criação de `superAdminService.ts` consumindo exclusivamente `lib/axios.ts`. Eliminação de todas as 10 chamadas `fetch()` nativo e remoção da importação de `getAuthToken()` na tela. | **PASS** |
| **III. Padronização de Feedback Visual e Modais** | Substitui os modais ad-hoc `confirmDialog` e `infoDialog` internos pelo `useConfirm()` (`ConfirmDialog`) da Fase 1 e por toasts `sonner`. | **PASS** |
| **IV. Decomposição Modular e Limite de Responsabilidade** | `SuperAdminDashboard.tsx` limitado a `<= 220` linhas. Todos os hooks, serviços e subcomponentes limitados a `<= 350` linhas (abaixo do teto constitucional de 400 linhas). | **PASS** |
| **V. Higiene de Código e Isolamento por Papel** | Elimina duplicação de marcação de modais e cartões, remove estados ad-hoc mortos e mantém isolamento estrito do papel `SUPER_ADMIN`. | **PASS** |

## Project Structure

### Documentation (this feature)

```text
specs/004-superadmin-dashboard-decomposition/
├── plan.md                                              # Este arquivo (Estratégia de implementação)
├── research.md                                          # Decisões técnicas e arquiteturais
├── data-model.md                                        # Interfaces de domínio, payloads e filtros
├── quickstart.md                                        # Guia de validação de linhas, rede e build
├── contracts/
│   └── superadmin-components-contract.md                # Contratos TypeScript de serviços, hooks e views
└── checklists/
    └── requirements.md                                  # Checklist de qualidade da especificação
```

### Source Code (repository root)

```text
frontend/src/features/admin/
├── api/
│   └── superAdminService.ts                             # [NOVO] Serviço HTTP (/admin/*) sobre lib/axios.ts
├── hooks/
│   ├── useSuperAdminTenants.ts                          # [NOVO] CRUD de usinas, branding, convites e status
│   ├── useSuperAdminUsers.ts                            # [NOVO] Listagem global, filtros e status de usuários
│   └── useSuperAdminStats.ts                            # [NOVO] Métricas globais e auditoria por usina
├── components/superadmin/
│   ├── types.ts                                         # [NOVO] Interfaces de domínio e tipos compartilhados
│   ├── PlatformStatsCards.tsx                           # [NOVO] Cards de métricas e visão geral inicial
│   ├── TenantsManagementView.tsx                        # [NOVO] Listagem, busca e ações de usinas
│   ├── TenantFormModal.tsx                              # [NOVO] Modal de criação/edição e branding por URL
│   ├── GlobalUsersView.tsx                              # [NOVO] Listagem global de usuários com filtros
│   └── TenantAuditView.tsx                              # [NOVO] Auditoria e monitoramento por unidade
└── pages/
    └── SuperAdminDashboard.tsx                          # [REFATORADO] Container/Orquestrador (<= 220 linhas)
```

**Structure Decision**: Adotar o mesmo padrão modular por domínio estabelecido nas Fases 2A (`portaria`) e 2B (`lider`), organizando a feature `features/admin/` em `api/`, `hooks/`, `components/superadmin/` e `pages/SuperAdminDashboard.tsx`.

## Phased Implementation Strategy

1. **Setup & Tipos Compartilhados**: Criar `frontend/src/features/admin/components/superadmin/types.ts` com `Tenant`, `PlatformStats`, `GlobalProfile`, `AuditLog`, `TenantFormData`, `BrandingExtractionResult` e payloads de serviço.
2. **Camada de API (`superAdminService.ts`)**: Implementar os 11 métodos tipados (`getPlatformStats`, `listTenants`, `createTenant`, `updateTenant`, `toggleTenantStatus`, `deleteTenant`, `generateTenantInvite`, `extractBranding`, `listAllUsers`, `toggleUserStatus`, `getTenantAudit`) sobre `api` (`lib/axios.ts`).
3. **Custom Hooks (`useSuperAdminTenants`, `useSuperAdminUsers`, `useSuperAdminStats`)**: Isolar estado, efeitos, confirmações (`useConfirm`), notificações (`sonner`) e regras de negócio (incluindo guarda de autodesativação e tratamento de erros Axios).
4. **Subcomponentes Visuais (`components/superadmin/`)**: Extrair `PlatformStatsCards.tsx`, `TenantsManagementView.tsx`, `TenantFormModal.tsx`, `GlobalUsersView.tsx` e `TenantAuditView.tsx`, mantendo cada arquivo com `<= 350` linhas.
5. **Recomposição do Container (`SuperAdminDashboard.tsx`)**: Refatorar para gerenciar exclusivamente navegação lateral/mobile, cabeçalho, estado de aba ativa (`dashboard` | `tenants` | `users` | `monitoring`) e composição dos hooks/subcomponentes em `<= 220` linhas.

## Complexity Tracking

Nenhuma violação à Constituição detectada; todos os arquivos permanecem abaixo de 350 linhas (e container abaixo de 220 linhas).
