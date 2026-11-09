# Phase 0 Research: Refatoração Frontend - Fase 1 (Padronização de Feedback, Camada de API e Limpeza)

**Feature**: `001-frontend-phase1-standardization`  
**Date**: 2026-11-05

## 1. Inventário Exaustivo de Pontos de Mudança (`frontend/src/`)

### 1.1 Ocorrências de `sweetalert2` (`Swal.fire`), `alert(` e `confirm(`

| Arquivo | Linhas | Tipo Atual | Natureza da Interação | Destino na Fase 1 |
|---------|--------|------------|-----------------------|-------------------|
| `frontend/src/components/SessionTimeoutHandler.tsx` | 4, 38 | `Swal.fire` (warning com botão de redirecionamento) | Aviso de sessão expirada por inatividade (30 min) | `toast.warning` (`sonner`) + redirecionamento controlado |
| `frontend/src/features/admin/components/dashboard/team/MemberList.tsx` | 3, 85, 96, 141, 153, 175, 186, 206, 228, 239 | `Swal.fire` (sucesso, erro, warning de senha curta) | Feedback de atualização, ativação/desativação, exclusão e redefinição de senha | `toast.success` / `toast.error` / `toast.warning` (`sonner`) |
| `frontend/src/features/admin/components/dashboard/team/MemberList.tsx` | 115 | `await Swal.fire({ showCancelButton: true })` | Confirmação de ativação/desativação de membro | `ConfirmDialog` (`src/components/common/ConfirmDialog.tsx`) |
| `frontend/src/features/requests/components/dashboard/AcceptModal.tsx` | 4, 44, 59, 73 | `Swal.fire` (warning/error de validação de matrícula) | Validação de matrícula obrigatória/inválida no aceite | `toast.warning` / `toast.error` (`sonner`) |
| `frontend/src/features/requests/components/dashboard/ExitModal.tsx` | 6, 50, 65, 79 | `Swal.fire` (warning/error de validação de matrícula) | Validação de matrícula obrigatória/inválida na saída | `toast.warning` / `toast.error` (`sonner`) |
| `frontend/src/features/requests/components/dashboard/TransferModal.tsx` | 8, 136, 151, 165, 188 | `Swal.fire` (warning/error de validação de matrícula e setor destino) | Validação de formulário de transferência interna | `toast.warning` / `toast.error` (`sonner`) |
| `frontend/src/features/requests/pages/LiderDashboard.tsx` | 6, 212, 233, 244, 276, 312, 361, 373, 414, 426 | `alert()` (linha 212) e `Swal.fire` (sucesso/erro) | Feedback de revisão, transferência, saída, aceite, recusa e cancelamento | `toast.success` / `toast.error` (`sonner`) |
| `frontend/src/features/requests/pages/LiderDashboard.tsx` | 328, 389 | `await Swal.fire` (328: confirmação com `input: 'textarea'` para motivo de recusa; 389: confirmação de cancelamento de envio) | Confirmação de recusa de transferência (com motivo obrigatório) e cancelamento de transferência | `ConfirmDialog` (suportando campo opcional de motivo/justificativa quando requerido) |
| `frontend/src/features/requests/pages/PortariaDashboard.tsx` | 7, 166, 176, 179, 417, 420, 423 | `Swal.fire` (sucesso/erro) | Feedback de alteração de status no portão e cancelamento de entrada | `toast.success` / `toast.error` (`sonner`) |
| `frontend/src/features/requests/pages/PortariaDashboard.tsx` | 309, 379 | `await Swal.fire` (309: liberar com divergência; 379: cancelar entrada com `input: 'text'` para motivo) | Confirmação crítica na guarita | `ConfirmDialog` (com suporte a input de justificativa para o cancelamento de entrada) |
| `frontend/src/features/requests/pages/TerceirizadaDashboard.tsx` | 24, 25, 99, 115, 118, 124, 140, 143 | `Swal.fire` (99 e 124: confirmação de cancelamento/exclusão; demais: sucesso/erro) + CSS import | Cancelamento e exclusão de solicitações pela terceirizada | `ConfirmDialog` + `toast.success` / `toast.error` (`sonner`) |
| `frontend/src/features/auth/pages/RegisterGestor.tsx` | 74, 99, 102, 162 | `alert()` nativo | Validação de senha, erro de cadastro e cópia de link | `toast.warning` / `toast.error` / `toast.success` (`sonner`) |
| `frontend/src/features/monitoring/components/InteractiveMap.tsx` | 187 | `alert()` nativo | Erro ao salvar layout do mapa | `toast.error` (`sonner`) |
| `frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx` | 109, 209, 218-240, 287, 314-328 | Banner de erro ad-hoc (`errorMessage`) | Erros de validação e upload na abertura de solicitação | `toast.error` / `toast.warning` (`sonner`) (preservando ou limpando o estado ad-hoc sem perda de feedback) |

---

### 1.2 Ocorrências de Chamadas HTTP Despadronizadas (`fetch` nativo e `axios` puro) no Escopo da Fase 1

| Arquivo Consumidor | Chamadas Atuais | Serviço de Domínio Alvo | Endpoints Encapsulados |
|--------------------|-----------------|-------------------------|------------------------|
| `frontend/src/features/requests/pages/PortariaDashboard.tsx` | `fetch` manual (linhas 122, 149, 197, 324, 402, 435) | `frontend/src/features/requests/api/gatekeeperService.ts` | `GET /portaria/approved`, `GET /portaria/audit/:tenantId`, `POST /portaria/status/:id`, `POST /portaria/movimentacao/:id`, `POST /portaria/cancelar/:id`, `POST /portaria/divergencia/:id` |
| `frontend/src/features/admin/components/dashboard/team/MemberList.tsx`<br>`InviteGenerator.tsx`<br>`ManualRegisterForm.tsx` | `axios` puro (linhas 62, 80, 134, 170, 221 de `MemberList`; linha 38 de `InviteGenerator`; linhas 46, 139 de `ManualRegisterForm`) | `frontend/src/features/admin/api/teamService.ts` | `GET /gestor/team`, `PUT /gestor/team/:id`, `DELETE /gestor/team/:id`, `POST /gestor/team/:id/reset-password`, `POST /auth/register` |
| `frontend/src/features/requests/pages/Terceirizada/NovaSolicitacao.tsx`<br>`TerceirizadaDashboard.tsx` | `axios` puro em `NovaSolicitacao.tsx` (linhas 116, 265) e query órfã `supabase.from('profiles')` (linha 135) | `frontend/src/features/requests/api/requestService.ts` | `GET /sectors`, `POST /terceirizada/requisicao`, `PUT /terceirizada/requisicao/:id`, `GET /terceirizada/profile`, `GET /terceirizada/requisicoes`, `POST /terceirizada/requisicoes/:id/cancel`, `DELETE /terceirizada/requisicoes/:id` |
| `frontend/src/features/requests/components/AuditSection.tsx` | `axios` puro (linhas 50, 67) | `frontend/src/features/requests/api/dashboardService.ts` (ou `requestService.ts`) | `GET /gestor/third-parties` (já existe em `dashboardService.getThirdPartyStats()`), `GET /gestor/audit-report?profileId=:id` |
| `frontend/src/features/monitoring/components/MonitoringDashboard.tsx` | `import axios from 'axios'` (linha 2 — import órfão não utilizado no arquivo) | Remoção direta do import órfão | N/A |

---

## 2. Decisões Técnicas Consolidadas

### Decisão 1: Adoção do `sonner` no Layout Base (`App.tsx`)
- **Decision**: Instalar o pacote `sonner` em `frontend/package.json` e montar `<Toaster position="top-right" richColors closeButton />` dentro de `frontend/src/App.tsx`.
- **Rationale**: Atende ao Princípio III da Constituição, substitui notificações `Swal.fire` de sucesso/erro/aviso e `alert()` nativos com zero bloqueio de thread principal e suporte nativo a temas e acessibilidade.
- **Alternatives considered**: `react-hot-toast` ou manter modais de alerta customizados por tela — rejeitados porque a Constituição padroniza explicitamente em `sonner`.

### Decisão 2: Criação do Componente e Hook `ConfirmDialog` (`src/components/common/ConfirmDialog.tsx`)
- **Decision**: Criar `frontend/src/components/common/ConfirmDialog.tsx` estilizado com TailwindCSS, oferecendo tanto uso declarativo (`<ConfirmDialog ... />`) quanto imperativo/baseado em Promise via Provider/Hook (`useConfirm()`) com suporte a:
  - `title`, `description`, `confirmText`, `cancelText`, `variant` (`'danger' | 'warning' | 'primary'`), `isLoading`;
  - Campo opcional de input/textarea (`inputConfig?: { placeholder?: string; defaultValue?: string; required?: boolean; type?: 'text' | 'textarea'; errorMessage?: string }`) para substituir sem regressão os dois casos de `Swal.fire` que solicitam motivo (`PortariaDashboard.tsx:379` ao cancelar entrada e `LiderDashboard.tsx:328` ao recusar transferência).
- **Rationale**: Vários fluxos existentes (`MemberList.handleToggleStatus`, `PortariaDashboard.handleConfirmMovement`, `PortariaDashboard.handleCancelEntry`, `LiderDashboard.handleRejectClick`, `LiderDashboard.handleCancelTransferClick`, `TerceirizadaDashboard.handleCancel`, `TerceirizadaDashboard.handleDelete`) utilizam `const result = await Swal.fire(...)`. Um hook `useConfirm()` que retorna uma `Promise<{ isConfirmed: boolean; value?: string }>` permite substituir `Swal.fire` de forma limpa, mantendo a legibilidade assíncrona e respeitando acessibilidade (`role="dialog"`, `aria-modal="true"`, fechamento com `Escape`).
- **Alternatives considered**: Criar um estado booleano manual em cada tela — exigiria dezenas de estados locais extras nas telas monolíticas antes da Fase 2. O `ConfirmDialog` com suporte tanto a componente controlado quanto a hook `useConfirm()` resolve ambos os casos com mínimo acoplamento.

### Decisão 3: Extensão de `frontend/src/lib/axios.ts` para Token e Tenant Automáticos
- **Decision**: Estender o request interceptor de `frontend/src/lib/axios.ts` para:
  1. Obter o token da sessão ativa do Supabase (`supabase.auth.getSession()` com renovação preventiva se expirar em <10s) e aplicar fallback para `getAuthToken()` (`localStorage` / `sessionStorage`), preenchendo `config.headers.Authorization = Bearer <token>` se ainda não definido;
  2. Obter automaticamente o slug do tenant via `getSubdomain()` (`frontend/src/utils/subdomain.ts`) e injetar `config.headers['X-Tenant-Slug'] = slug` caso o cabeçalho não tenha sido explicitamente informado na chamada.
- **Rationale**: Elimina a repetição manual de `headers: { Authorization: Bearer ${getAuthToken()} }` e `'X-Tenant-Slug'` em cada componente e service.
- **Alternatives considered**: Passar `token` e `slug` como argumentos para todos os métodos dos services — rejeitado por poluir a assinatura dos serviços e acoplar componentes de UI a detalhes de autenticação.

### Decisão 4: Isolamento do `DashboardProvider` em `RoleDispatcher.tsx` e `useOptionalDashboard`
- **Decision**:
  1. Em `frontend/src/features/auth/components/RoleDispatcher.tsx`, remover `<DashboardProvider>` dos cases `'LIDER_SETOR'` e `'PORTARIA'`, mantendo-o apenas em `'GESTOR_SEGURANCA'`.
  2. Em `frontend/src/contexts/DashboardContext.tsx`, exportar `useOptionalDashboard = () => useContext(DashboardContext)` (que retorna `DashboardContextType | undefined` sem lançar exceção) e remover os métodos órfãos `approveRequest` e `rejectRequest`.
  3. Em `frontend/src/features/requests/components/dashboard/TransferModal.tsx`, substituir o bloco `try { const dashboard = useDashboard() } catch {}` por `const dashboard = useOptionalDashboard()`, buscando setores via `requestService.getSectors()` quando o contexto não estiver presente.
- **Rationale**: Impede que o `DashboardProvider` seja montado para `LIDER_SETOR` e `PORTARIA`, eliminando imediatamente as chamadas indevidas a `GET /gestor/monitoring` e `GET /gestor/dashboard` que geram `403 Forbidden`.
- **Alternatives considered**: Filtrar dentro do `DashboardProvider` por role — manteria um provider gerencial e assinaturas Realtime desnecessárias montados na árvore de componentes da Portaria e do Líder.

