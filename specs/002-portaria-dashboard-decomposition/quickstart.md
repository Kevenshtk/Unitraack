# Quickstart & Validation Guide: Decomposição Modular do PortariaDashboard

**Feature**: `002-portaria-dashboard-decomposition`  
**Date**: 2026-11-06  
**References**:
- [Data Model](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/002-portaria-dashboard-decomposition/data-model.md)
- [Component & Hook Contracts](file:///c:/Users/keven/Documentos/GitHub/Unitraack/specs/002-portaria-dashboard-decomposition/contracts/portaria-components-contract.md)

---

## 1. Pré-requisitos

- Node.js 20+ e dependências instaladas em `frontend/`
- Alterações da Fase 1 (`001-frontend-phase1-standardization`) aplicadas (`gatekeeperService.ts`, `sonner`, `ConfirmDialog.tsx`)

---

## 2. Validação Automatizada de Limite de Linhas (`SC-001` e `SC-002`)

Execute no PowerShell na raiz do repositório para verificar que `PortariaDashboard.tsx` possui `<= 200` linhas e todos os novos arquivos em `hooks/` e `components/portaria/` possuem `<= 350` linhas:

```powershell
# 1. Verificar linhas de PortariaDashboard.tsx (Meta: <= 200 linhas)
(Get-Content "frontend\src\features\requests\pages\PortariaDashboard.tsx").Count

# 2. Verificar linhas de cada novo hook e subcomponente da Portaria (Meta: <= 350 linhas cada)
Get-ChildItem -Path "frontend\src\features\requests\hooks\useGatekeeper*.ts","frontend\src\features\requests\components\portaria\*.ts*" | ForEach-Object {
  [PSCustomObject]@{
    File  = $_.Name
    Lines = (Get-Content $_.FullName).Count
  }
} | Format-Table -AutoSize
```

**Resultado Esperado**:
- `PortariaDashboard.tsx`: `<= 200` linhas
- Todos os arquivos listados em `hooks/` e `components/portaria/`: `<= 350` linhas

---

## 3. Validação de Compilação TypeScript e Build de Produção (`SC-004`)

```powershell
npm run build --prefix frontend
```

**Resultado Esperado**:
- `tsc -b` e `vite build` concluídos com código de saída `0` e zero erros de tipagem ou importações órfãs.

---

## 4. Cenários de Verificação Funcional (`SC-003` — Fluxos 03 e 07)

1. **Triagem e Liberação de Entrada (`GatekeeperEntryQueue`)**:
   - Acessar com perfil `PORTARIA`, alternar entre subfiltros `Aguardando`, `Chegada` e `Em Análise` em `GatekeeperTabs`.
   - Selecionar uma solicitação e acionar `Registrar Chegada` → `Iniciar Análise`.
   - Marcar/desmarcar itens, capturar/anexar foto, preencher observação e informar matrícula para acionar `Liberar Entrada`.
2. **Notificação de Divergência e Cancelamento (`GatekeeperDiscrepancyModal`)**:
   - Em uma solicitação `Em Análise`, clicar em `Divergência`, informar o motivo e enviar alerta.
   - Testar a confirmação explícita de liberação com divergência e o botão `Não Compareceu / Cancelar Entrada`.
3. **Conferência de Saída (`GatekeeperExitQueue`)**:
   - Alternar para `Saída da Planta`, iniciar `Conferência de Saída` e confirmar saída com matrícula.
4. **Consulta Em Planta, Modais e Histórico (`GatekeeperInPlantView`, `GatekeeperModals`, `PortariaHistoryView`)**:
   - Alternar para `Em Planta`, abrir ficha técnica do material, perfil da terceirizada, lightbox de fotos e painel de `Histórico`.

