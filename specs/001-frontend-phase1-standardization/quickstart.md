# Quickstart & Validation Guide: Fase 1 Frontend Standardization

**Feature**: `001-frontend-phase1-standardization`  
**Date**: 2026-11-05

## 1. Pré-requisitos

- Node.js 20+ e npm instalados.
- Variáveis de ambiente configuradas em `frontend/.env` (`VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- Referências de contratos:
  - [UI Feedback Contract](./contracts/ui-feedback-contract.md)
  - [Frontend API Services Contract](./contracts/frontend-api-services-contract.md)
  - [Data Model](./data-model.md)

## 2. Verificação de Dependências e Build Estático

```powershell
cd frontend
npm run build
npm run lint
```

**Resultado Esperado**:
- Compilação TypeScript (`tsc -b`) e bundle Vite (`vite build`) concluem com código `0`.
- `sweetalert2`, `zustand`, `react-signature-canvas` e `@types/react-signature-canvas` ausentes de `frontend/package.json`.
- `sonner` presente em `frontend/package.json`.

## 3. Verificação por Busca Estática (Critérios SC-001, SC-002 e SC-005)

Execute na raiz do repositório:

```powershell
# 1. Zero ocorrências de SweetAlert2 ou alert()/confirm() nativos em código-fonte
Get-ChildItem -Path frontend\src -Recurse -Include *.ts,*.tsx | Select-String -Pattern "Swal|sweetalert2|\balert\(|\bconfirm\("

# 2. Zero importações diretas de axios fora de lib/axios.ts nos módulos escopados
Get-ChildItem -Path frontend\src\features -Recurse -Include *.ts,*.tsx | Select-String -Pattern "from 'axios'|from `"axios`""

# 3. Verificar remoção dos arquivos órfãos
Test-Path frontend\src\components\SignaturePad.tsx
Test-Path frontend\src\features\requests\components\dashboard\AdminSidebar.tsx
```

**Resultado Esperado**:
- Comandos 1 e 2 não retornam linhas ativas de código.
- Comando 3 retorna `False` para ambos os arquivos.

## 4. Cenários de Validação Funcional Ponta a Ponta

1. **Isolamento de Contexto (`LIDER_SETOR` e `PORTARIA` — SC-003)**:
   - Autenticar com perfil `LIDER_SETOR` e com perfil `PORTARIA`.
   - Inspecionar aba **Network** e **Console** do DevTools: nenhuma requisição para `/gestor/monitoring` ou `/gestor/dashboard` deve ocorrer; zero erros `403 Forbidden`.
   - No `LiderDashboard`, abrir o `TransferModal`, selecionar setor de destino e confirmar: os setores devem ser carregados via `GET /sectors` e a transferência deve exibir toast `sonner`.
2. **Padronização de Serviços (`NovaSolicitacao`, `PortariaDashboard`, `MemberList`, `AuditSection` — SC-002 / SC-004)**:
   - Em `NovaSolicitacao`, criar e editar uma solicitação verificando chamadas via `requestService`.
   - Em `PortariaDashboard`, alterar status de chegada/análise, registrar divergência, cancelar entrada (testando o input de justificativa no `ConfirmDialog`) e confirmar movimentação via `gatekeeperService`.
   - Em `MemberList` / `InviteGenerator` / `ManualRegisterForm`, listar, editar, ativar/desativar (via `ConfirmDialog`) e cadastrar membro via `teamService`.
   - Em `AuditSection`, selecionar empresa terceirizada e visualizar linha do tempo via `dashboardService`.

