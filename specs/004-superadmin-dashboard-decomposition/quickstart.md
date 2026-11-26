# Quickstart & Validation Guide: 004-superadmin-dashboard-decomposition

**Feature**: `004-superadmin-dashboard-decomposition`  
**Date**: 2026-11-25

---

## 1. Validação Automatizada de Limite de Linhas (`SC-001` e `SC-002`)

Execute no PowerShell na raiz do repositório:

```powershell
# 1. Verificar linhas do container SuperAdminDashboard.tsx (Meta: <= 220 linhas)
(Get-Content "frontend\src\features\admin\pages\SuperAdminDashboard.tsx").Count

# 2. Verificar linhas dos submódulos, hooks e serviço do SuperAdmin (Meta: <= 350 linhas cada)
& {
  foreach ($f in Get-ChildItem -Path "frontend\src\features\admin\api\superAdminService.ts", "frontend\src\features\admin\hooks\useSuperAdmin*.ts", "frontend\src\features\admin\components\superadmin\*.ts*") {
    [PSCustomObject]@{
      File  = $f.Name
      Lines = (Get-Content $f.FullName).Count
    }
  }
} | Format-Table -AutoSize
```

---

## 2. Auditoria de Rede (`SC-003`)

Confirmar **zero** ocorrências de `fetch(` ou `getAuthToken` dentro da feature `admin`:

```powershell
Select-String -Path "frontend\src\features\admin\pages\SuperAdminDashboard.tsx", "frontend\src\features\admin\hooks\useSuperAdmin*.ts", "frontend\src\features\admin\components\superadmin\*.ts*" -Pattern "fetch\(|getAuthToken"
```

Resultado esperado: nenhuma linha retornada.

---

## 3. Validação de Build e Tipagem (`SC-005`)

```powershell
npm run build --prefix frontend
```

Resultado esperado: `tsc -b && vite build` conclui com exit code `0`.

---

## 4. Roteiro Funcional (`SC-004`)

1. **Dashboard Geral (`PlatformStatsCards`)**: Conferir total de usinas, usuários, solicitações e lista de usinas recentes.
2. **Usinas (`TenantsManagementView` + `TenantFormModal`)**:
   - Criar usina testando a extração de branding via URL.
   - Copiar link de convite gerado ao concluir cadastro e via ação direta no card da usina.
   - Editar usina existente e alterar cores/logotipo.
   - Desativar, reativar e excluir usina via `ConfirmDialog`, conferindo feedback em toast `sonner`.
3. **Usuários Globais (`GlobalUsersView`)**:
   - Filtrar por unidade, categoria (`all` | `internal` | `terceirizada`), status e busca textual.
   - Validar bloqueio ao tentar desativar o próprio usuário logado.
   - Alternar status de um usuário de outra conta via `ConfirmDialog`.
4. **Auditoria (`TenantAuditView`)**:
   - Selecionar uma usina, verificar carregamento de logs e navegar entre páginas.
