# Feature Specification: 003-lider-dashboard-decomposition

**Feature Branch**: `003-lider-dashboard-decomposition`  
**Created**: 2026-11-09  
**Status**: Draft  
**Input**: Refatoração Frontend - Fase 2B: Decomposição Modular do LiderDashboard  
**Parent Specification**: [Unitraack Constitution](file:///c:/Users/keven/Documentos/GitHub/Unitraack/.specify/memory/constitution.md)  
**Target Codebase**: `frontend/src/features/requests/pages/LiderDashboard.tsx` (1.671 linhas)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Aprovação e Recusa Justificada de Solicitações de Entrada (Priority: P1) 🎯 MVP

Como Líder de Setor autenticado,
Quero analisar detalhadamente cada solicitação de entrada de materiais vinculada ao meu setor de responsabilidade,
Para que eu possa aprovar o acesso ou recusá-lo fornecendo uma justificativa clara para a terceirizada e auditoria antes da chegada do veículo ao portão.

**Why this priority**: A aprovação do líder de setor (Fluxo 02 do `BUSINESS-FLOW.md`) é a porta de entrada obrigatória para qualquer material terceirizado. Sem ela, nenhuma portaria ou movimentação interna pode ocorrer.

**Independent Test**: Autenticar com credenciais de Líder de Setor, navegar para a aba "Aprovações Pendentes", inspecionar uma requisição de teste, aprovar uma solicitação com feedback imediato via toast e recusar outra informando o motivo através do modal dedicado.

**Acceptance Scenarios**:

1. **Given** que há solicitações com status `PENDING` para o setor do líder, **When** o líder clicar em "Aprovar Requisição", **Then** o sistema deve enviar a aprovação via serviço HTTP, exibir notificação toast de sucesso via Sonner, remover o card da lista pendente e atualizar o inventário do setor.
2. **Given** uma solicitação pendente com irregularidades, **When** o líder clicar em "Recusar", **Then** o sistema deve abrir o modal de justificativa de recusa exigindo texto obrigatório; ao confirmar, deve enviar a recusa e notificar a terceirizada com o motivo registrado.
3. **Given** que o líder clica no logo ou nome da empresa parceira no card de solicitação, **Then** o modal com detalhes cadastrais da empresa deve ser exibido.
4. **Given** que o líder clica sobre um item de equipamento, **Then** a ficha técnica com foto e especificações deve ser aberta.

---

### User Story 2 - Gestão de Inventário do Setor e Solicitação de Baixa para Saída (Priority: P2)

Como Líder de Setor,
Quero visualizar todos os equipamentos que estão fisicamente operando no meu setor ou a caminho da usina,
Para que eu possa acompanhar sua localização e solicitar a baixa com encaminhamento para a portaria (Fluxo 06) quando o serviço for concluído.

**Why this priority**: Garante o controle patrimonial em tempo real dentro da planta industrial, permitindo identificar o que está em operação e autorizar formalmente a saída pela portaria com conferência de assinatura/matrícula e fotos.

**Independent Test**: Navegar para a aba "Meu Setor", filtrar por nome ou número de série, selecionar um ou mais equipamentos em planta e acionar "Solicitar Saída da Planta", confirmando os dados no modal de saída com matrícula e observação.

**Acceptance Scenarios**:

1. **Given** que o líder acessa "Meu Setor", **When** a página carregar, **Then** o sistema deve listar todos os materiais do setor agrupados ou identificados por status ("Em Planta" e "Chegando"), exibindo contadores totais atualizados.
2. **Given** um termo digitado no campo de busca, **When** o usuário digitar o nome ou número de série, **Then** a lista deve ser filtrada em tempo real no cliente.
3. **Given** um ou mais materiais selecionados com status `IN_PLANTA`, **When** o líder clicar no botão de saída, **Then** o modal de baixa de saída deve ser aberto solicitando matrícula de confirmação e evidências opcionais. Ao confirmar, o status deve transicionar para `WAITING_EXIT` e notificar a portaria.

---

### User Story 3 - Controle de Transferências e Movimentações entre Setores (Priority: P3)

Como Líder de Setor,
Quero enviar equipamentos para outros setores e aceitar ou recusar transferências enviadas ao meu setor,
Para que o deslocamento físico de equipamentos dentro da usina (Fluxo 05) mantenha rastreabilidade total de custódia e responsabilidade.

**Why this priority**: Evita desvios e perda de equipamentos entre áreas operacionais, garantindo que nenhum item mude de custódia sem o consentimento mútuo entre o remetente e o destinatário.

**Independent Test**: Selecionar itens no setor e transferir para outro setor de destino; no setor destinatário, verificar a aba "Transferências Pendentes", aceitar uma com matrícula de conferência e recusar outra justificando a devolução.

**Acceptance Scenarios**:

1. **Given** itens selecionados no setor, **When** o líder abrir o modal de transferência, escolher o setor de destino e confirmar com matrícula, **Then** os itens devem mudar para status `MOVING`, ficar bloqueados para novas ações locais e notificar o líder destinatário.
2. **Given** uma transferência recebida com status `MOVING` destinada ao setor do líder, **When** o líder clicar em "Aceitar Transferência", **Then** deve abrir o modal de aceite exigindo matrícula para validação de custódia.
3. **Given** uma transferência recebida incompatível, **When** o líder clicar em "Recusar", **Then** deve ser exibido o diálogo de confirmação exigindo justificativa obrigatória; ao confirmar, o item deve retornar ao setor de origem.
4. **Given** uma transferência enviada erroneamente pelo próprio líder, **When** ele clicar em "Cancelar Envio", **Then** o equipamento deve ser restituído imediatamente ao seu setor e o destinatário notificado.

---

### User Story 4 - Consulta de Histórico do Setor, Auditoria e Orquestração Enxuta (Priority: P4)

Como Líder de Setor e Desenvolvedor do Sistema,
Quero acessar o histórico detalhado de movimentações do setor com paginação e filtros por data/direção, enquanto a página `LiderDashboard.tsx` permanece desacoplada e com menos de 200 linhas,
Para que a interface seja rápida, organizada e a base de código seja fácil de manter e testar.

**Why this priority**: Completa a governança de auditoria (Fluxo de Histórico) e consolida a meta técnica de decomposição da arquitetura frontend sem alterar nenhuma regra de negócio.

**Independent Test**: Abrir a aba "Histórico", filtrar por período e tipo de movimentação (Entrada/Saída), inspecionar registros paginados com fotos/assinaturas e executar script de contagem de linhas validando que o container possui `<= 200` linhas e todos os subcomponentes possuem `<= 350` linhas.

**Acceptance Scenarios**:

1. **Given** a aba "Histórico" ativa, **When** o líder selecionar uma data específica ou tipo de filtro ("Entradas no Setor" / "Saídas do Setor"), **Then** a tabela de auditoria deve atualizar dinamicamente exibindo ator, data/hora local, setores e evidências fotográficas.
2. **Given** subscrições ativas do Supabase Realtime nas tabelas `materials`, `material_movements` e `entry_requests`, **When** ocorrer alteração no setor, **Then** as listas devem sincronizar em tempo real sem refresh manual.
3. **Given** o arquivo `frontend/src/features/requests/pages/LiderDashboard.tsx`, **When** inspecionado, **Then** seu tamanho deve ser `<= 200` linhas, atuando apenas como orquestrador dos hooks e visões.

---

### Edge Cases

- **Setor sem Líder formalmente atribuído no profile**: O sistema deve manter fallback para o `profile.sector_id` e exibir estado vazio amigável caso não haja dados vinculados.
- **Falha de rede ou timeout durante aprovação/transferência**: O estado de processamento (`isProcessing`) deve ser liberado, mantendo a interface reativa e emitindo notificação de erro via Sonner com a mensagem detalhada do backend.
- **Recusa sem preenchimento de justificativa**: O botão de confirmação do modal de recusa deve permanecer desabilitado ou acionar validação inline bloqueando o envio vazio.
- **Transição de itens concorrente**: Se outro usuário aceitar ou movimentar um item simultaneamente, a resposta HTTP de conflito deve ser tratada com toast de alerta e recarga automática do inventário via Realtime.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE fornecer um serviço dedicado `leaderService.ts` em `frontend/src/features/requests/api/` centralizando todos os endpoints HTTP do Líder (`/lider/pendencias`, `/lider/meu-setor`, `/lider/movimentacoes`, `/lider/revisar/:id`, `/lider/transferir`, `/lider/aceitar-transferencia`, `/lider/recusar-transferencia`, `/lider/cancelar-transferencia`, `/lider/marcar-saida`) através da instância padronizada `lib/axios.ts`.
- **FR-002**: O sistema NÃO DEVE realizar chamadas diretas com `api.get` ou `api.post` com cabeçalho de autorização manual dentro de nenhum componente ou página da tela do Líder.
- **FR-003**: O sistema DEVE isolar a lógica de estado, filtros e operações operacionais em um Custom Hook `useLeaderOperations.ts` localizado em `frontend/src/features/requests/hooks/`.
- **FR-004**: O sistema DEVE isolar os listeners de tempo real do Supabase (`materials`, `material_movements`, `entry_requests`) em um Custom Hook `useLeaderRealtime.ts` localizado em `frontend/src/features/requests/hooks/`.
- **FR-005**: O sistema DEVE decompor as seções visuais em subcomponentes coesos dentro de `frontend/src/features/requests/components/lider/`:
  - `LeaderApprovalsView.tsx`: Gerenciamento e aprovação de solicitações da terceirizada.
  - `LeaderSectorInventoryView.tsx`: Inventário do setor com agrupamento por status e ações em lote.
  - `LeaderMovementsView.tsx`: Fila de transferências pendentes (recebidas e enviadas).
  - `LeaderHistoryView.tsx`: Histórico paginado com filtros por data e direção de fluxo.
  - `LeaderRejectReasonModal.tsx`: Diálogo modal para captura e envio da justificativa obrigatória de recusa.
- **FR-006**: O sistema DEVE padronizar todas as mensagens de feedback e confirmações de erros em `sonner` (`toast.success`, `toast.error`) e `ConfirmDialog` (`useConfirm`).
- **FR-007**: A página `LiderDashboard.tsx` DEVE atuar exclusivamente como container e orquestrador de seções, possuindo no máximo 200 linhas de código.
- **FR-008**: Nenhum novo subcomponente ou Custom Hook criado DEVE ultrapassar o limite de 350 linhas de código.

---

### Key Entities

- **Requisicao (EntryRequest)**: Solicitação de entrada de materiais criada pela terceirizada, contendo dados da empresa, setor de destino, data agendada e lista de equipamentos associados.
- **Material**: Equipamento cadastrado, possuindo número de série, marca, modelo, status operacional (`PENDING`, `IN_PLANTA`, `OUT_PLANTA`, `MOVING`, `WAITING_EXIT`) e histórico de movimentações.
- **MovementRecord**: Registro de auditoria contendo dados da movimentação (origem, destino, autor, assinatura, fotos de evidência, observação e timestamp).
- **LiderInfo**: Informações cadastrais do líder logado e seu setor industrial vinculado.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O arquivo `frontend/src/features/requests/pages/LiderDashboard.tsx` possui no máximo **200 linhas** de código após a refatoração (redução de mais de 88% do volume monolítico de 1.671 linhas).
- **SC-002**: 100% dos novos arquivos criados em `frontend/src/features/requests/components/lider/` e `frontend/src/features/requests/hooks/` possuem no máximo **350 linhas** cada.
- **SC-003**: 100% de preservação funcional e comportamental dos Fluxos 02 (Aprovação de Líder), 05 (Movimentação entre Setores) e 06 (Baixa para Saída) do `docs/BUSINESS-FLOW.md`.
- **SC-004**: Zero chamadas HTTP cruas ou importações avulsas de `api` fora de `leaderService.ts` nas telas do Líder.
- **SC-005**: O comando de compilação estática e build de produção (`npm run build --prefix frontend`) executa com código de saída `0` sem erros de tipagem TypeScript.

---

## Assumptions

- A infraestrutura de autenticação, interceptors em `lib/axios.ts`, `ConfirmDialog` e `sonner` implantada na Fase 1 está ativa e plenamente funcional.
- Os endpoints de backend em `/lider/*` continuam obedecendo aos contratos existentes em `backend/src/presentation/http/routes/leaderRoutes.ts`.
- Os modais compartilhados existentes (`AcceptModal`, `TransferModal`, `ExitModal`, `MobileNav`, `LiderSidebar`, `DashboardHeader`) permanecem compatíveis com as props consumidas pela tela do Líder.

