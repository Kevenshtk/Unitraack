# Quickstart & Validation Guide: Decomposição Modular do LiderDashboard

**Feature**: `003-lider-dashboard-decomposition`  
**Date**: 2026-11-09  
**References**:
- [Spec](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/spec.md)
- [Research & Decisions](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/research.md)
- [Data Model](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/data-model.md)
- [Contracts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/003-lider-dashboard-decomposition/contracts/leader-components-contract.md)

---

## 1. Pré-requisitos

- Node.js 20+ e dependências instaladas em `frontend/`
- Padronização de rede e feedback da Fase 1 ativa (`lib/axios.ts`, `sonner`, `ConfirmDialog`)

---

## 2. Validação Automatizada de Limite de Linhas (`SC-001` e `SC-002`)

Execute no PowerShell na raiz do repositório para verificar que `LiderDashboard.tsx` possui `<= 200` linhas e todos os novos arquivos criados em `components/lider/` e `hooks/useLeader*.ts` possuem `<= 350` linhas:

```powershell
# 1. Verificar linhas do container LiderDashboard.tsx (Meta: <= 200 linhas)
(Get-Content "frontend\src\features\requests\pages\LiderDashboard.tsx").Count

# 2. Verificar linhas dos submódulos e hooks do Líder (Meta: <= 350 linhas cada)
Get-ChildItem -Path "frontend\src\features\requests\api\leaderService.ts","frontend\src\features\requests\hooks\useLeader*.ts","frontend\src\features\requests\components\lider\*.ts*" | ForEach-Object {
  [PSCustomObject]@{
    File  = $_.Name
    Lines = (Get-Content $_.FullName).Count
  }
} | Format-Table -AutoSize
```

**Critério de Aprovação**:
- `LiderDashboard.tsx`: `<= 200` linhas
- Cada arquivo listado em `api/leaderService.ts`, `hooks/useLeader*.ts` e `components/lider/`: `<= 350` linhas

---

## 3. Validação de Compilação Estática e Build (`SC-005`)

```powershell
npm run build --prefix frontend
```

**Critério de Aprovação**:
- `tsc -b && vite build` conclui com status `0` e zero erros de tipagem.

---

## 4. Roteiro de Verificação Funcional (`SC-003`)

1. **Aprovações Pendentes (`LeaderApprovalsView`)**:
   - Autenticar como Líder de Setor (`LIDER_SETOR`).
   - Aprovar uma requisição de entrada e verificar remoção do card e notificação toast.
   - Recusar outra requisição através de `LeaderRejectReasonModal`, preenchendo o motivo obrigatório.
2. **Meu Setor / Inventário (`LeaderSectorInventoryView`)**:
   - Filtrar equipamentos pelo campo de busca.
   - Selecionar itens e abrir o modal de transferência entre setores.
   - Selecionar itens e abrir o modal de baixa para portaria.
3. **Transferências em Trânsito (`LeaderMovementsView`)**:
   - Aceitar transferência recebida digitando a matrícula de confirmação.
   - Recusar transferência recebida justificando o motivo via `ConfirmDialog`.
   - Cancelar envio de transferência em andamento.
4. **Histórico do Setor (`LeaderHistoryView`)**:
   - Navegar entre páginas do histórico (10 itens por página).
   - Filtrar por data e por direção ("Entradas", "Saídas" e "Todas").
   - Abrir lightbox de fotos de evidência registradas na movimentação.

