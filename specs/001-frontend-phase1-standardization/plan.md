# Implementation Plan: Refatoração Frontend - Fase 1: Padronização de Feedback, Camada de API e Limpeza de Dependências

**Branch**: `001-frontend-phase1-standardization` | **Date**: 2026-11-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-frontend-phase1-standardization/spec.md`

## Summary

Unificar a camada de feedback visual (substituindo 100% de `sweetalert2` e `alert`/`confirm` nativos por toasts `sonner` e um componente/hook acessível `ConfirmDialog` em TailwindCSS), padronizar as chamadas HTTP dispersas (`fetch` e `axios` puro) em serviços de domínio sobre `frontend/src/lib/axios.ts` (com interceptors automáticos de token JWT e `X-Tenant-Slug`), isolar o `DashboardProvider` no `RoleDispatcher.tsx` apenas para o papel `GESTOR_SEGURANCA` (eliminando erros `403 Forbidden` em `LiderDashboard` e `PortariaDashboard`) e remover arquivos e pacotes órfãos mapeados no inventário de base.

## Technical Context

**Language/Version**: TypeScript `~6.0.2`, React `^19.2.4`, Vite `^8.0.4`

**Primary Dependencies**: `axios` (`^1.14.0`), `sonner` (a instalar), `@supabase/supabase-js` (`^2.101.1`), `lucide-react` (`^1.7.0`), `tailwindcss` (`^4.2.2`), `react-router-dom` (`^7.14.0`)

**Storage**: Supabase Storage (`material-images` para upload de fotos de materiais) e `localStorage`/`sessionStorage` (`usinalins-auth-token-v1` gerenciado pelo interceptor HTTP e Supabase Auth)

**Testing**: Validação estática via TypeScript (`tsc -b`), `vite build`, `eslint` e roteiro de verificação funcional em `quickstart.md` (não há suíte de testes automatizados configurada na baseline atual)

**Target Platform**: Aplicação Web SPA / PWA responsiva (Desktop, Tablets de Guarita e Mobile)

**Project Type**: Web application (`frontend/` + `backend/` em monorepo)

**Performance Goals**: Redução imediata do bundle JS/CSS pela remoção de `sweetalert2`, `zustand` e `react-signature-canvas`; eliminação de 2 requisições HTTP inúteis (`403 Forbidden`) por carregamento de página nos perfis `LIDER_SETOR` e `PORTARIA`

**Constraints**: Preservação estrita de 100% das regras de negócio e contratos de payload com o backend (`docs/BUSINESS-FLOW.md`); zero alterações no schema do banco de dados

**Scale/Scope**: 18 arquivos no diretório `frontend/` (criação de 4 novos arquivos de infraestrutura/serviços, atualização de 12 arquivos existentes e remoção de 2 componentes órfãos + 4 dependências NPM)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio da Constituição (v1.0.0) | Status Pré-Pesquisa | Status Pós-Design | Justificativa / Evidência |
|------------------------------------|---------------------|-------------------|---------------------------|
| **I. Preservação Estrita das Regras de Negócio** | PASS | PASS | Nenhum payload, endpoint de backend ou transição de status é modificado; todas as validações de matrícula e justificativas obrigatórias são preservadas no `ConfirmDialog`. |
| **II. Padronização de Camadas e Clientes HTTP** | PASS | PASS | `lib/axios.ts` centraliza interceptors de token e `X-Tenant-Slug`; `gatekeeperService.ts`, `teamService.ts`, `requestService.ts` e `dashboardService.ts` encapsulam as chamadas HTTP; a query órfã `supabase.from('profiles')` em `NovaSolicitacao.tsx` é removida. |
| **III. Padronização de Feedback Visual e Modais** | PASS | PASS | `sonner` configurado globalmente em `App.tsx` e `ConfirmDialog.tsx` criado em `src/components/common/ConfirmDialog.tsx` substituindo `sweetalert2` e `alert()` nativos. |
| **IV. Decomposição Modular e Limite de Responsabilidade** | PASS | PASS | A Fase 1 extrai lógica de serviços de API e modais de confirmação sem aumentar o acoplamento; a quebra estrutural das telas monolíticas (<400 linhas) será executada na Fase 2 sobre esta base limpa. |
| **V. Higiene de Código e Isolamento de Contexto por Papel** | PASS | PASS | `RoleDispatcher.tsx` isola `DashboardProvider` apenas para `GESTOR_SEGURANCA`; `SignaturePad.tsx`, `AdminSidebar.tsx`, métodos órfãos e pacotes sem uso são removidos. |

## Project Structure

### Documentation (this feature)

```text
specs/001-frontend-phase1-standardization/
├── plan.md              # Este plano de implementação (/speckit-plan)
├── research.md          # Inventário de alertas/fetches e decisões técnicas (Phase 0)
├── data-model.md        # Interfaces e modelos de serviços e ConfirmDialog (Phase 1)
├── quickstart.md        # Guia de validação estática e funcional (Phase 1)
├── contracts/           # Contratos de UI Feedback e Serviços HTTP (Phase 1)
│   ├── ui-feedback-contract.md
│   └── frontend-api-services-contract.md
└── tasks.md             # Lista de tarefas ordenadas (/speckit-tasks - próxima etapa)
```

### Source Code (repository root)

```text
frontend/
├── package.json                                                       # [MODIFICAR] +sonner, -sweetalert2, -zustand, -react-signature-canvas, -@types/react-signature-canvas
└── src/
    ├── App.tsx                                                        # [MODIFICAR] Montar <Toaster /> (sonner) e <ConfirmDialogProvider />
    ├── lib/
    │   └── axios.ts                                                   # [MODIFICAR] Interceptor automático de token fallback + X-Tenant-Slug
    ├── components/
    │   ├── common/
    │   │   └── ConfirmDialog.tsx                                      # [CRIAR] Modal acessível TailwindCSS + ConfirmDialogProvider + hook useConfirm()
    │   ├── SessionTimeoutHandler.tsx                                  # [MODIFICAR] Migrar Swal.fire para toast.warning (sonner)
    │   └── SignaturePad.tsx                                           # [REMOVER] Componente órfão sem importadores
    ├── contexts/
    │   └── DashboardContext.tsx                                       # [MODIFICAR] Remover approveRequest/rejectRequest órfãos; exportar useOptionalDashboard
    └── features/
        ├── admin/
        │   ├── api/
        │   │   └── teamService.ts                                     # [CRIAR] Serviço de domínio para equipe (/gestor/team/* e /auth/register)
        │   └── components/
        │       └── dashboard/
        │           └── team/
        │               ├── InviteGenerator.tsx                        # [MODIFICAR] Substituir axios puro por teamService
        │               ├── ManualRegisterForm.tsx                     # [MODIFICAR] Substituir axios puro por teamService
        │               └── MemberList.tsx                             # [MODIFICAR] Substituir axios puro por teamService e Swal.fire por sonner + useConfirm()
        ├── auth/
        │   ├── components/
        │   │   └── RoleDispatcher.tsx                                 # [MODIFICAR] Renderizar DashboardProvider apenas para GESTOR_SEGURANCA
        │   └── pages/
        │       └── RegisterGestor.tsx                                 # [MODIFICAR] Substituir alert() nativo por sonner
        ├── monitoring/
        │   └── components/
        │       ├── InteractiveMap.tsx                                 # [MODIFICAR] Substituir alert() nativo por toast.error (sonner)
        │       └── MonitoringDashboard.tsx                            # [MODIFICAR] Remover import órfão de axios
        └── requests/
            ├── api/
            │   ├── dashboardService.ts                                # [MODIFICAR] Remover approveRequest/rejectRequest; adicionar getAuditReport
            │   ├── gatekeeperService.ts                               # [CRIAR] Serviço de domínio da Portaria (/portaria/*)
            │   └── requestService.ts                                  # [CRIAR] Serviço de domínio de solicitações e setores (/sectors, /terceirizada/*)
            ├── components/
            │   ├── AuditSection.tsx                                   # [MODIFICAR] Substituir axios puro por dashboardService
            │   └── dashboard/
            │       ├── AcceptModal.tsx                                # [MODIFICAR] Substituir Swal.fire por sonner
            │       ├── AdminSidebar.tsx                               # [REMOVER] Componente órfão sem importadores
            │       ├── ExitModal.tsx                                  # [MODIFICAR] Substituir Swal.fire por sonner
            │       └── TransferModal.tsx                              # [MODIFICAR] Usar useOptionalDashboard, requestService.getSectors() e sonner
            └── pages/
                ├── LiderDashboard.tsx                                 # [MODIFICAR] Substituir alert() e Swal.fire por sonner + useConfirm()
                ├── PortariaDashboard.tsx                              # [MODIFICAR] Substituir fetch() por gatekeeperService e Swal.fire por sonner + useConfirm()
                ├── TerceirizadaDashboard.tsx                          # [MODIFICAR] Substituir Swal.fire por sonner + useConfirm() e usar requestService
                └── Terceirizada/
                    └── NovaSolicitacao.tsx                            # [MODIFICAR] Substituir axios puro por requestService, remover fetchProfile órfão e integrar sonner
```

**Structure Decision**: Mantida a arquitetura modular baseada em `features/<domínio>/api/*.ts` já iniciada no projeto (`features/auth/api/` e `features/requests/api/`), adicionando `features/admin/api/teamService.ts`, `features/requests/api/gatekeeperService.ts`, `features/requests/api/requestService.ts` e o componente compartilhado `components/common/ConfirmDialog.tsx`.

## Complexity Tracking

Nenhuma violação da Constituição foi introduzida. Tabela de exceções não aplicável.
