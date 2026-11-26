# Technical Research & Decisions: 004-superadmin-dashboard-decomposition

**Feature**: `004-superadmin-dashboard-decomposition`  
**Date**: 2026-11-25  
**Parent**: [plan.md](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/004-superadmin-dashboard-decomposition/plan.md)

---

## 1. Mapeamento das Chamadas `fetch()` para `lib/axios.ts`

Foram identificadas 10 chamadas `fetch()` nativo em `SuperAdminDashboard.tsx` usando `import.meta.env.VITE_API_URL` e injeção manual de `Bearer ${getAuthToken()}`:

| Método no Serviço | Endpoint Backend | Verbo | Observação de Contrato |
| :--- | :--- | :---: | :--- |
| `getPlatformStats()` | `/admin/stats` | `GET` | Retorna `{ totalTenants, totalUsers, totalRequests }` |
| `listTenants()` | `/admin/tenants` | `GET` | Retorna `Tenant[]` |
| `createTenant(payload)` | `/admin/tenants` | `POST` | Envia `{ tenantName, tenantCnpj, logo_url, company_color, secondary_color, tertiary_color }`; retorna `{ inviteToken, ... }` |
| `updateTenant(id, payload)` | `/admin/tenants/${id}` | `PUT` | Envia `{ name, cnpj, logo_url, company_color, secondary_color, tertiary_color }` |
| `toggleTenantStatus(id, isActive)` | `/admin/tenants/${id}/status` | `PATCH` | Envia `{ active: isActive }` |
| `deleteTenant(id)` | `/admin/tenants/${id}` | `DELETE` | Remove usina se sem vínculos |
| `generateTenantInvite(payload)` | `/admin/tenants/invite` | `POST` | Envia `{ tenantId }`; retorna `{ inviteToken }` |
| `extractBranding(url)` | `/admin/extract-branding` | `POST` | Envia `{ url }`; retorna `{ success, data: { suggestedName, logoUrl, primaryColor, secondaryColor, tertiaryColor, palette }, error? }` |
| `listAllUsers()` | `/admin/users` | `GET` | Retorna `GlobalProfile[]` |
| `toggleUserStatus(id, isActive)` | `/admin/users/${id}/status` | `PATCH` | Envia `{ is_active: isActive }` |
| `getTenantAudit(tenantId)` | `/admin/audit/${tenantId}` | `GET` | Retorna `{ success, data: AuditLog[] }` |

**Decisão**: A instância `api` em `frontend/src/lib/axios.ts` já possui interceptor de request que injeta o `Authorization` token automaticamente. Assim, `getAuthToken()` e `import.meta.env.VITE_API_URL` são completamente removidos dos hooks e componentes do Super Admin.

---

## 2. Substituição de `confirmDialog` e `infoDialog` Ad-Hoc

No monolito atual, existem ~200 linhas dedicadas a estados e JSX de `confirmDialog` e `infoDialog` locais:
- **Confirmações destrutivas/críticas** (desativar/reativar usina, excluir usina, desativar/reativar usuário): passam a usar `const confirm = useConfirm()` de `frontend/src/components/common/ConfirmDialog.tsx`. Como `ConfirmDialog` aceita `variant: 'danger' | 'warning' | 'primary'`, ações de reativação utilizam `variant: 'primary'` e ações de desativação/exclusão utilizam `'warning'` ou `'danger'`.
- **Feedbacks informativos e de erro/sucesso**: passam a usar `toast.success`, `toast.warning`, `toast.error` e `toast.info` de `sonner`.
- **Link de convite gerado (`generateTenantInvite`)**: continua copiando o link para a área de transferência via `navigator.clipboard.writeText(link)` e exibe feedback imediato via `toast.success('Convite Gerado & Copiado!', { description: link })`. Na criação de nova usina pelo `TenantFormModal`, o card de sucesso com o link copiável permanece dentro do próprio modal.

---

## 3. Controle do Limite de 350 Linhas nos Subcomponentes Maiores

A inspeção do arquivo original mostrou que dois blocos possuem ~400 linhas no monolito:
1. **Aba `users` (`GlobalUsersView`)**: possui ~402 linhas porque renderiza listas distintas para colaboradores internos e empresas terceirizadas com estrutura visual repetida.
   - **Decisão**: Unificar a renderização de cards/linhas de usuários em um subcomponente interno ou helper paramétrico dentro de `GlobalUsersView.tsx`, eliminando JSX duplicado e mantendo o arquivo abaixo de 320 linhas.
2. **Modal de Usina (`TenantFormModal`)**: possui ~414 linhas por conter o estado de sucesso do convite, extração de branding por URL, seletor interativo de 3 slots de cor e inputs do formulário.
   - **Decisão**: Manter estado e handlers de branding/submit no hook `useSuperAdminTenants` e utilizar um mapa declarativo para os 3 slots de cor (`primary`, `secondary`, `tertiary`), mantendo `TenantFormModal.tsx` abaixo de 320 linhas.
