# Feature Specification: Refatoração Frontend - Fase 2A: Decomposição Modular do Painel de Portaria

**Feature Branch**: `002-portaria-dashboard-decomposition`

**Created**: 2026-11-06

**Status**: Draft

**Input**: User description: "Refatoração Frontend - Fase 2A: Decomposição Modular do PortariaDashboard — Decompor o componente monolítico frontend/src/features/requests/pages/PortariaDashboard.tsx em submódulos coesos, isolando regras de negócio em Custom Hooks e dividindo a interface em componentes especializados com limite máximo de 350 linhas por arquivo e container principal com máximo de 200 linhas."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Triagem e Liberação de Entrada de Veículos e Equipamentos (Priority: P1)

Como operador de Portaria na guarita industrial, preciso visualizar a fila de solicitações autorizadas pelos líderes, registrar a chegada do veículo no portão, iniciar a análise física dos equipamentos item a item, anexar fotos e observações da inspeção e liberar a entrada mediante minha matrícula de confirmação, mantendo a sincronização automática da fila sem recarregar a página.

**Why this priority**: O controle de entrada física (Fluxo 03 do `BUSINESS-FLOW.md`) é a operação primária do posto de guarita; qualquer falha ou perda de estado durante a conferência bloqueia o acesso de prestadores de serviço à planta industrial.

**Independent Test**: Pode ser testada selecionando uma solicitação autorizada na fila de entrada, avançando pelas etapas "Aguardando Chegada" → "Chegada no Portão" → "Em Análise", marcando/desmarcando equipamentos, adicionando foto e observação e confirmando a entrada com matrícula válida, verificando que o registro migra para "Em Planta" sem perda de dados.

**Acceptance Scenarios**:

1. **Given** que o operador está na visão "Entrada na Planta" e existem solicitações autorizadas, **When** o operador filtra por sub-etapa ("Aguardando", "Chegada" ou "Em Análise") ou busca por empresa/placa/protocolo/equipamento, **Then** a listagem lateral e os contadores de cada sub-etapa exibem apenas os protocolos correspondentes em ordem cronológica de agendamento.
2. **Given** uma solicitação selecionada em "Aguardando Chegada", **When** o operador aciona "Registrar Chegada" e em seguida "Iniciar Análise", **Then** o indicador visual de 4 passos avança imediatamente para "Em Análise" e habilita os controles de conferência de itens, registro de divergência e liberação de entrada.
3. **Given** uma solicitação na etapa "Em Análise" com ao menos um equipamento marcado e matrícula informada, **When** o operador aciona "Liberar Entrada", **Then** o sistema valida a matrícula, registra a entrada dos itens selecionados com as fotos e observações anexadas, exibe a confirmação da operação e remove o protocolo da fila de entrada.
4. **Given** que o painel de Portaria está aberto na guarita, **When** uma nova solicitação é aprovada por um líder ou atualizada em outra estação, **Then** a fila da Portaria é atualizada automaticamente sem intervenção manual do operador.

---

### User Story 2 - Tratativa de Divergências e Cancelamento na Entrada (Priority: P2)

Como operador de Portaria, quando identifico irregularidades físicas na conferência de entrada (equipamento divergente, avaria não declarada ou ausência do veículo no prazo), preciso notificar a divergência ao Gestor/Líder com justificativa detalhada ou cancelar a entrada registrando o motivo, ou ainda liberar uma entrada com divergência registrada após confirmação explícita.

**Why this priority**: Garante a conformidade patrimonial e a rastreabilidade de exceções operacionais na guarita conforme o Fluxo 03 do `BUSINESS-FLOW.md`.

**Independent Test**: Pode ser testada abrindo uma solicitação na etapa "Em Análise", acionando "Divergência", preenchendo a justificativa e enviando o alerta; em seguida, testando tanto o botão de cancelamento de entrada quanto a liberação com confirmação explícita de divergência.

**Acceptance Scenarios**:

1. **Given** uma solicitação na etapa "Em Análise", **When** o operador aciona "Divergência", informa a descrição da irregularidade e confirma o envio, **Then** a solicitação recebe a marcação visual de divergência, o alerta é enviado ao Gestor e o motivo fica visível no painel de detalhes.
2. **Given** uma solicitação com divergência registrada na aba de entrada, **When** o operador tenta acionar "Liberar Entrada" com matrícula preenchida, **Then** o sistema solicita uma confirmação explícita destacando o motivo da divergência antes de concluir a liberação.
3. **Given** uma solicitação na fila de entrada, **When** o operador aciona "Não Compareceu / Cancelar Entrada" (ou "Cancelar / Recusar Entrada (Divergência)") e confirma o motivo no diálogo, **Then** a entrada é cancelada e removida da fila ativa.

---

### User Story 3 - Conferência e Liberação de Saída de Equipamentos (Priority: P3)

Como operador de Portaria, preciso visualizar os veículos/solicitações cujos equipamentos receberam baixa pelos líderes de setor, iniciar a conferência física de saída, registrar fotos e observações do estado de saída e confirmar a liberação definitiva da planta mediante minha matrícula.

**Why this priority**: Completa o ciclo de vida operacional do ativo dentro da indústria (Fluxo 07 do `BUSINESS-FLOW.md`), assegurando que nenhum material saia sem baixa e conferência física.

**Independent Test**: Pode ser testada alternando para a aba "Saída da Planta", selecionando um protocolo em "Aguardando Saída", acionando "Iniciar Conferência de Saída", conferindo os itens marcados, anexando evidência fotográfica opcional e confirmando a saída com matrícula válida.

**Acceptance Scenarios**:

1. **Given** que o operador seleciona a aba "Saída da Planta", **When** alterna entre os subfiltros "Aguardando Saída" e "Conferência", **Then** a fila exibe apenas as solicitações que possuem equipamentos nos respectivos estados de saída com seus contadores atualizados.
2. **Given** uma solicitação selecionada em "Aguardando Saída", **When** o operador aciona "Iniciar Conferência de Saída", **Then** o indicador de 3 passos avança para "Conferência" e habilita a confirmação de saída e o botão de notificação de divergência.
3. **Given** uma solicitação em "Conferência" com itens selecionados e matrícula preenchida, **When** o operador aciona "Confirmar Saída", **Then** a baixa de saída é concluída, o protocolo deixa a fila de saída e passa a constar no histórico da Portaria.

---

### User Story 4 - Consulta de Equipamentos em Planta, Detalhes e Histórico Operacional (Priority: P4)

Como operador de Portaria, preciso consultar os veículos e equipamentos atualmente dentro da planta industrial, inspecionar fichas técnicas e galerias de fotos dos materiais, consultar os dados cadastrais e o histórico da empresa terceirizada e acessar o histórico geral de movimentações da Portaria em desktop e dispositivos móveis.

**Why this priority**: Permite auditoria rápida no posto de controle e suporte operacional em tablets/smartphones utilizados pelos agentes na guarita.

**Independent Test**: Pode ser testada navegando para a aba "Em Planta" e para a tela "Histórico", abrindo os modais de detalhes do equipamento, perfil da empresa terceirizada e galeria de fotos em tela cheia, além de validar a alternância entre "Fila", "Operação" e "Histórico" em visualização móvel.

**Acceptance Scenarios**:

1. **Given** que o operador está na aba "Em Planta", **When** seleciona um protocolo ativo, **Then** o painel exibe os equipamentos atualmente em operação na unidade em modo somente leitura (sem campos de matrícula ou botões de liberação), permitindo abrir a ficha técnica e as fotos de cada item.
2. **Given** qualquer solicitação selecionada, **When** o operador clica no ícone de informações da empresa terceirizada, **Then** é exibido o modal com dados do representante, CNPJ, telefone e histórico de movimentações associado.
3. **Given** que o operador acessa o sistema em um dispositivo móvel ou tablet, **When** seleciona um item na fila ou utiliza a barra de navegação inferior ("Fila", "Operação", "Histórico"), **Then** a interface alterna suavemente entre a lista e os detalhes operacionais sem perda de contexto.

---

### Edge Cases

- **Tentativa de liberar entrada ou saída sem iniciar etapa de análise/conferência**: Os botões "Liberar Entrada", "Confirmar Saída" e "Divergência" permanecem desabilitados e um aviso contextual orienta o operador a iniciar primeiro a etapa "Em Análise" (na entrada) ou "Conferência" (na saída).
- **Tentativa de confirmar operação com matrícula em branco ou inválida**: Quando a matrícula está vazia ou não é reconhecida/autorizada pelo servidor, o sistema bloqueia a operação e apresenta o feedback de erro correspondente sem limpar as fotos, observações ou seleção de itens já preenchidas pelo operador.
- **Troca de aba principal ("Entrada", "Saída", "Em Planta") durante preenchimento**: Ao alternar entre as abas principais, a seleção de solicitação ativa, seleção de materiais, fotos anexadas e subfiltros são reinicializados de forma previsível para evitar submissão cruzada entre entrada e saída.
- **Falha na compressão ou captura de imagem**: Caso um arquivo de imagem falhe ao ser processado, o sistema registra o erro de forma segura sem interromper o funcionamento do formulário ou travar a tela da guarita.
- **Datas sem fuso horário explícito**: Registros de data/hora recebidos sem sufixo de fuso horário continuam sendo normalizados de forma consistente para exibição no padrão local (`pt-BR`), tratando valores ausentes ou inválidos sem quebrar a renderização.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O módulo de Portaria DEVE preservar integralmente todas as regras operacionais e comportamentos de interface dos Fluxos 03 (Entrada na Portaria) e 07 (Saída pela Portaria) definidos em `docs/BUSINESS-FLOW.md`.
- **FR-002**: O painel principal da Portaria DEVE atuar exclusivamente como container e coordenador de layout entre o cabeçalho, as abas/filas operacionais, o histórico e os modais auxiliares, mantendo até 200 linhas de código.
- **FR-003**: A gestão de estado das filas operacionais (listagem de solicitações, filtros por aba e sub-etapa, busca textual, seleção de solicitação ativa, atualização periódica automática e escuta de eventos em tempo real) DEVE ser isolada da camada visual em uma abstração dedicada de estado da fila.
- **FR-004**: As ações transacionais do operador de Portaria (atualização de status de portão, confirmação de entrada/saída com matrícula, captura/remoção de fotos, notificação de divergência e cancelamento de entrada) DEVEM ser isoladas da camada visual em uma abstração dedicada de ações operacionais.
- **FR-005**: A navegação superior e os seletores de abas/subfiltros com contadores em tempo real DEVEM ser separados em componentes dedicados de cabeçalho e navegação de fila.
- **FR-006**: As visões operacionais de cada fluxo DEVEM ser divididas em componentes independentes e especializados para:
  1. Fila de triagem e conferência de entrada;
  2. Visualização de equipamentos atualmente em planta;
  3. Conferência e liberação de saída;
  4. Modal de registro e notificação de divergência.
- **FR-007**: Os modais de apoio à inspeção (detalhes técnicos do equipamento, perfil/histórico da empresa terceirizada e visualização ampliada de evidências fotográficas) DEVEM ser desacoplados do container principal, respeitando o limite máximo de 350 linhas por arquivo criado.
- **FR-008**: Todas as comunicações de rede, notificações visuais transitórias e diálogos de confirmação do módulo de Portaria DEVEM manter o padrão unificado estabelecido na Fase 1 (serviço de domínio da portaria, toasts padronizados e modal de confirmação acessível).

### Key Entities *(include if feature involves data)*

- **Solicitação de Portaria (`Requisicao`)**: Representa o protocolo de acesso vinculado a uma empresa terceirizada, contendo setor de destino, data/horário agendado, motorista, placa do veículo, status operacional do portão, motivos de divergência/recusa e lista de equipamentos.
- **Equipamento (`Material`)**: Ativo individual vinculado a uma solicitação, contendo identificação (nome, marca, modelo, número de série, código), condição física, descrição, fotos/imagem de referência e status operacional (`PENDING`, `IN_PLANTA`, `OUT_PLANTA`, `MOVING`, `WAITING_EXIT`, `EXIT_CONFERENCE`).
- **Perfil da Empresa Terceirizada (`CompanyDetails`)**: Dados institucionais da empresa responsável pela remessa (nome, representante, CNPJ, telefone, cor de tema e logotipo) acompanhados de seu histórico de movimentações na unidade.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O arquivo principal do painel de Portaria possui no máximo 200 linhas de código, reduzindo em pelo menos 88% o volume de linhas concentradas no arquivo monolítico original (1.834 linhas).
- **SC-002**: 100% dos novos arquivos de subcomponentes e módulos de estado criados para a Portaria possuem no máximo 350 linhas de código cada, cumprindo integralmente o limite de responsabilidade da Constituição do projeto.
- **SC-003**: 100% dos fluxos operacionais da Portaria (registro de chegada, início de análise, seleção parcial/total de itens, captura de fotos por câmera/galeria, registro de divergência, cancelamento de entrada, liberação de entrada com matrícula, conferência/liberação de saída e consulta de histórico) executam com paridade funcional completa e zero perda de dados em formulários ou atualizações em tempo real.
- **SC-004**: O processo de validação estática de tipos e empacotamento de produção do aplicativo é concluído com código de saída `0` e zero erros de compilação.

## Assumptions

- O componente de histórico geral da Portaria (`PortariaHistoryView`), o modal de captura de câmera (`WebcamModal`), o menu de notificações (`NotificationDropdown`) e a barra de navegação móvel (`MobileNav`) já existentes serão reutilizados sem alteração de suas regras internas.
- O comportamento de atualização automática da fila (sincronização periódica a cada 30 segundos combinada com eventos em tempo real nas tabelas de solicitações e movimentações) deve ser mantido exatamente com a mesma frequência e escopo atuais.
- O modal de feedback de operação ("Entrada Confirmada" / "Saída Confirmada" / "Divergência Registrada" / "Matrícula Inválida") presente no fluxo de confirmação do protocolo pode ser mantido como parte dos modais operacionais da Portaria para preservar a experiência visual exata na guarita.

