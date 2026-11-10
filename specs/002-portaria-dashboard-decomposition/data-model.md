# Phase 1 Data Model: Decomposição Modular do PortariaDashboard

**Feature**: `002-portaria-dashboard-decomposition`  
**Date**: 2026-11-06  
**Target Module**: `frontend/src/features/requests/components/portaria/types.ts`

---

## 1. Domain Entities (`types.ts`)

### 1.1 `Material`
Representa um equipamento vinculado a uma solicitação de entrada/saída sob conferência na guarita.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | Sim | UUID do equipamento |
| `name` | `string` | Sim | Nome/identificação do equipamento |
| `brand` | `string` | Sim | Marca/fabricante |
| `model` | `string` | Sim | Modelo |
| `serial_number` | `string` | Sim | Número de série |
| `description` | `string` | Sim | Descrição técnica ou de avarias |
| `condition` | `string` | Sim | Condição declarada (`NOVO`, `USADO`, `DANIFICADO`) |
| `code` | `string` | Não | Código interno opcional |
| `image_url` | `string` | Não | URL da foto de referência cadastrada pela terceirizada |
| `status` | `'PENDING' \| 'IN_PLANTA' \| 'OUT_PLANTA' \| 'MOVING' \| 'WAITING_EXIT' \| 'EXIT_CONFERENCE'` | Sim | Estado operacional atual do equipamento |
| `photos` | `string[]` | Não | Fotos associadas ao item |

---

### 1.2 `Requisicao`
Representa a solicitação de entrada/permanência/saída exibida nas filas da Portaria.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | Sim | UUID da solicitação |
| `tenant_id` | `string` | Sim | UUID da unidade industrial |
| `sector` | `string` | Sim | Nome do setor/subsetor de destino |
| `entry_date` | `string` | Sim | Data/hora agendada para chegada |
| `created_at` | `string` | Sim | Data/hora de criação |
| `status` | `string` | Sim | Status atual (`APPROVED_LIDER`, `APPROVED_GESTOR`, `APPROVED`, `WAITING_ARRIVAL`, `ARRIVED`, `IN_ANALYSIS`, `DISCREPANCY`, `IN_PLANTA`, `WAITING_EXIT`, `EXIT_CONFERENCE`, `COMPLETED`, `CANCELED`) |
| `reason` | `string` | Não | Motivo de divergência ou observação |
| `rejection_reason` | `string` | Não | Motivo de recusa/divergência |
| `gate_checked_at` | `string` | Não | Timestamp de conferência no portão |
| `driver_name` | `string` | Não | Nome do motorista |
| `plate` | `string` | Não | Placa do veículo |
| `profile` | `CompanyProfileSummary` | Sim | Dados resumidos da empresa terceirizada |
| `materials` | `Material[]` | Sim | Lista de equipamentos vinculados |

---

### 1.3 `CompanyDetails`
Representa o perfil detalhado da empresa terceirizada exibido no modal institucional.

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | `string` | Sim | UUID do perfil/tenant da empresa |
| `full_name` | `string` | Sim | Razão social / nome fantasia |
| `representative_name` | `string` | Não | Nome do representante responsável |
| `phone` | `string` | Não | Telefone de contato |
| `cnpj` | `string` | Não | CNPJ da empresa |
| `logo_url` | `string` | Não | URL do logotipo |
| `theme_color` | `string` | Não | Cor hexadecimal de destaque |

---

## 2. State Models (Custom Hooks)

### 2.1 `GatekeeperQueueState` (`useGatekeeperQueue`)
Gerencia a navegação entre abas, subfiltros, busca e listagem sincronizada da Portaria:
- `activeTab: 'ENTRY' | 'EXIT' | 'IN_PLANTA'`
- `entrySubFilter: 'WAITING' | 'ARRIVED' | 'ANALYSIS'`
- `exitSubFilter: 'WAITING' | 'CONFERENCE'`
- `searchTerm: string`
- `requisicoes: Requisicao[]`
- `filteredReqs: Requisicao[]`
- `selecionadoId: string | null`
- `selectedReq: Requisicao | null`
- `loading: boolean`
- `mobileSection: 'list' | 'details' | 'history'`
- `isHistoryPageOpen: boolean`
- `auditHistory: any[]`
- `loadingHistory: boolean`
- `selectedCompany: CompanyDetails | null`

### 2.2 `GatekeeperOperationsState` (`useGatekeeperOperations`)
Gerencia o estado volátil de conferência física e modais operacionais do protocolo selecionado:
- `processing: boolean`
- `selectedMaterials: string[]`
- `signature: string`
- `photos: string[]`
- `observation: string`
- `showDiscrepancyModal: boolean`
- `discrepancyReason: string`
- `showSuccessModal: boolean`
- `modalConfig: { title: string; message: string; type: 'success' | 'error' }`
- `isCameraOpen: boolean`
- `detailMaterial: Material | null`
- `selectedPhotos: string[] | null`

---

## 3. Regras de Validação e Transições de Estado

### 3.1 Fluxo de Entrada (`activeTab === 'ENTRY'`)
1. **Aguardando Chegada** (`APPROVED_LIDER` / `APPROVED_GESTOR` / `APPROVED` / `WAITING_ARRIVAL`) → ação `Registrar Chegada` → transita para `ARRIVED`.
2. **Chegada no Portão** (`ARRIVED`) → ação `Iniciar Análise` → transita para `IN_ANALYSIS` (ou `Desfazer` → retorna para `WAITING_ARRIVAL`).
3. **Em Análise** (`IN_ANALYSIS` / `DISCREPANCY`):
   - Habilita botão `Liberar Entrada` quando `selectedMaterials.length > 0` e `signature.trim().length > 0`.
   - Habilita botão `Divergência` quando `status === 'IN_ANALYSIS'`.
   - Se `status === 'DISCREPANCY'`, `Liberar Entrada` exige confirmação explícita via `useConfirm()` antes de invocar `gatekeeperService.confirmMovement`.
4. **Cancelamento de Entrada**: Disponível em qualquer sub-etapa de `ENTRY`, exigindo motivo obrigatório via `useConfirm({ inputConfig: { type: 'text', required: true } })`.

### 3.2 Fluxo de Saída (`activeTab === 'EXIT'`)
1. **Aguardando Saída** (`WAITING_EXIT`) → ação `Iniciar Conferência de Saída` → transita para `EXIT_CONFERENCE`.
2. **Conferência de Saída** (`EXIT_CONFERENCE`):
   - Habilita `Confirmar Saída` quando `selectedMaterials.length > 0` e `signature.trim().length > 0`.
   - Habilita `Divergência` para reportar irregularidade na saída.
   - Permite retornar para `WAITING_EXIT` via botão `Voltar p/ Aguardando`.

