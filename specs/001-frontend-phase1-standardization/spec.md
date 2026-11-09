# Feature Specification: Refatoração Frontend - Fase 1: Padronização de Feedback, Camada de API e Limpeza de Dependências

**Feature Branch**: `001-frontend-phase1-standardization`

**Created**: 2026-11-05

**Status**: Draft

**Input**: User description: "Refatoração Frontend - Fase 1: Padronização de Feedback, Camada de API e Limpeza de Dependências"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Isolamento de Sessão e Contexto por Papel sem Erros 403 (Priority: P1)

Quando um usuário com perfil **Líder de Setor** (`LIDER_SETOR`) ou **Portaria** (`PORTARIA`) realiza login e navega pelo seu painel operacional, o sistema deve carregar apenas os dados e contextos pertinentes ao seu papel, sem disparar requisições em segundo plano para endpoints exclusivos de Gestão (`GESTOR` / `SUPER_ADMIN`). Além disso, ao realizar uma transferência de material entre setores (`TransferModal`), o Líder de Setor deve conseguir concluir a operação e atualizar sua listagem normalmente sem depender do contexto exclusivo do Gestor.

**Why this priority**: Corrige uma falha ativa de isolamento de escopo (`RoleDispatcher` envolvendo `PortariaDashboard` e `LiderDashboard` com `DashboardProvider`) que gera erros `403 Forbidden` no console e nos logs do servidor a cada acesso de Líder ou Portaria.

**Independent Test**: Fazer login com um usuário `LIDER_SETOR` e um usuário `PORTARIA`, inspecionar o tráfego de rede e o console do navegador ao abrir o painel e ao realizar uma transferência de setor, verificando zero chamadas a `/gestor/monitoring` ou `/gestor/dashboard` e zero erros `403 Forbidden`.

**Acceptance Scenarios**:

1. **Given** um usuário autenticado com perfil `LIDER_SETOR`, **When** o roteador de papéis (`RoleDispatcher`) carrega o `LiderDashboard`, **Then** nenhuma requisição para endpoints de monitoramento gerencial (`/gestor/*`) é disparada e zero erros `403 Forbidden` ocorrem.
2. **Given** um usuário autenticado com perfil `PORTARIA`, **When** o roteador de papéis (`RoleDispatcher`) carrega o `PortariaDashboard`, **Then** nenhuma requisição para endpoints de monitoramento gerencial (`/gestor/*`) é disparada e zero erros `403 Forbidden` ocorrem.
3. **Given** um usuário `LIDER_SETOR` no `LiderDashboard`, **When** ele abre o modal de transferência (`TransferModal`) e confirma a transferência de um material para outro setor, **Then** a transferência é registrada com sucesso e a tela do líder é atualizada sem erros de contexto ausente.
4. **Given** um usuário autenticado com perfil `GESTOR` ou `SUPER_ADMIN` (em modo de visualização de unidade), **When** ele acessa o painel gerencial (`Dashboard`), **Then** o `DashboardProvider` continua fornecendo normalmente os dados de monitoramento e KPIs.

---

### User Story 2 - Padronização da Camada de Comunicação HTTP e Serviços de Domínio (Priority: P2)

Quando usuários dos perfis **Terceirizada** (`NovaSolicitacao`), **Portaria** (`PortariaDashboard`), **Gestor** (`MemberList`) e **Super Admin** (`AuditSection`) executam operações de listagem, criação de solicitações, conferência de entrada, baixa de saída, gestão de membros ou consulta de auditoria, todas as comunicações HTTP com o backend devem ocorrer exclusivamente por meio de serviços de domínio dedicados que utilizam o cliente HTTP centralizado (`lib/axios.ts`), preservando integralmente o comportamento funcional existente.

**Why this priority**: Elimina a fragmentação atual de 4 padrões concorrentes de rede (`lib/axios.ts`, `axios` puro, `fetch` nativo com token manual e chamadas diretas de banco via `supabase.from` em componentes), garantindo envio consistente de cabeçalhos de autenticação e tratamento uniforme de sessão.

**Independent Test**: Executar os fluxos de criação de solicitação (`NovaSolicitacao`), conferência e baixa de saída na portaria (`PortariaDashboard`), listagem/criação/exclusão de membros (`MemberList`) e filtragem/exportação de logs (`AuditSection`), confirmando que 100% das chamadas passam pelos serviços padronizados com `lib/axios.ts` e que os dados são persistidos e exibidos sem regressão.

**Acceptance Scenarios**:

1. **Given** um usuário `TERCEIRIZADA` na tela `NovaSolicitacao`, **When** a tela carrega os setores disponíveis e o usuário submete uma nova solicitação com itens e fotos, **Then** o upload de fotos utiliza o Storage e a listagem de setores e criação da solicitação ocorrem via serviço de domínio dedicado sobre `lib/axios.ts`, redirecionando o usuário após o sucesso.
2. **Given** um usuário `PORTARIA` no `PortariaDashboard`, **When** ele registra a conferência de entrada (com ou sem divergência) ou a baixa de saída (`ExitModal`), **Then** as requisições para `/portaria/conferencia/:id` e `/portaria/saida/:id` são executadas via serviço de domínio com `lib/axios.ts`, sem uso de `fetch()` manual.
3. **Given** um usuário `GESTOR` ou `SUPER_ADMIN` em `MemberList`, **When** ele lista, cadastra ou remove membros da equipe, **Then** todas as requisições utilizam o serviço de domínio sobre `lib/axios.ts`, sem importação direta do pacote `axios`.
4. **Given** um usuário `SUPER_ADMIN` em `AuditSection`, **When** ele consulta ou filtra os registros de auditoria, **Then** a busca utiliza um serviço de domínio sobre `lib/axios.ts`, sem chamadas `fetch()` manuais.

---

### User Story 3 - Padronização de Feedback Visual (Toasts e Modal de Confirmação) (Priority: P3)

Quando qualquer usuário realiza uma ação que produz feedback (sucesso, erro, aviso de validação) ou exige confirmação prévia (como excluir usuário, remover unidade/empresa, rejeitar solicitação ou descartar ação crítica), o sistema deve apresentar notificações não-bloqueantes padronizadas (`sonner`) e um diálogo modal de confirmação acessível construído em TailwindCSS, sem utilizar `SweetAlert2`, `window.alert()`, `window.confirm()` ou banners temporários ad-hoc.

**Why this priority**: Unifica a experiência visual e de acessibilidade em todos os módulos da aplicação e permite remover a dependência pesada `sweetalert2`.

**Independent Test**: Acionar fluxos de sucesso, erro de validação e confirmação destrutiva nas telas `NovaSolicitacao`, `SuperAdminDashboard`, `AdminDashboard`, `PortariaDashboard`, `LiderDashboard` e `TransferModal`, verificando que todos os avisos aparecem via `sonner` e todas as confirmações utilizam o novo componente modal acessível.

**Acceptance Scenarios**:

1. **Given** um usuário em qualquer tela do sistema (`NovaSolicitacao`, `SuperAdminDashboard`, `AdminDashboard`, `PortariaDashboard`, `LiderDashboard`, `TransferModal`), **When** ocorre um erro de validação, falha de rede ou conclusão de operação com sucesso, **Then** o feedback visual é exibido exclusivamente por meio de notificações `sonner`.
2. **Given** um administrador ou operador prestes a executar uma ação destrutiva ou crítica (ex.: exclusão de registro ou confirmação operacional que antes usava `Swal.fire` ou `window.confirm`), **When** ele aciona o botão correspondente, **Then** o sistema exibe o componente modal de confirmação unificado (com suporte a fechamento via `Esc`, foco acessível e botões de confirmação/cancelamento claros) antes de prosseguir.
3. **Given** o modal de confirmação aberto, **When** o usuário cancela a ação, **Then** nenhuma alteração de dados é enviada ao servidor e o modal é fechado.

---

### User Story 4 - Limpeza de Código Morto e Dependências Órfãs (Priority: P4)

Como mantenedor do sistema, preciso que componentes sem importadores ativos, funções órfãs e bibliotecas não utilizadas sejam removidos do repositório Frontend sem afetar a compilação ou os fluxos em produção.

**Why this priority**: Reduz o tamanho do bundle, elimina código morto documentado no inventário de base e previne confusão em manutenções futuras.

**Independent Test**: Executar a compilação de produção (`npm run build`) do Frontend após a remoção dos arquivos e pacotes órfãos e verificar zero erros de compilação ou imports quebrados.

**Acceptance Scenarios**:

1. **Given** os componentes sem importadores ativos mapeados no inventário (`frontend/src/components/SignaturePad.tsx` e `frontend/src/features/admin/components/AdminSidebar.tsx`), **When** são removidos do projeto, **Then** o build TypeScript/Vite conclui com sucesso sem referências pendentes.
2. **Given** as dependências não utilizadas ou substituídas (`sweetalert2`, `zustand`, `react-signature-canvas` e `@types/react-signature-canvas`), **When** são removidas do `frontend/package.json`, **Then** nenhuma funcionalidade ativa é impactada e o pacote de produção é gerado sem erros.
3. **Given** métodos órfãos mapeados no inventário (como `fetchProfile` sem efeito em `NovaSolicitacao.tsx` e funções sem chamadores em `dashboardService.ts` / `DashboardContext.tsx`), **When** são removidos, **Then** todos os componentes consumidores continuam compilando e funcionando sem alterações de comportamento.

---

### Edge Cases

- **Expiração de Token JWT durante chamadas via `lib/axios.ts`**: Caso a sessão do usuário expire ou esteja ausente no momento da requisição, o interceptor de `lib/axios.ts` deve continuar encaminhando o erro `401 Unauthorized` de forma limpa, exibindo notificação via `sonner` sem travar a interface.
- **Cliques duplos no Modal de Confirmação**: Enquanto uma ação confirmada no modal estiver em processamento (`loading`), os botões de confirmação e cancelamento devem ficar desabilitados para impedir submissões duplicadas.
- **Falha no Upload de Imagem ao Criar Solicitação (`NovaSolicitacao`)**: Caso o upload para o bucket do Supabase Storage falhe ou a imagem seja inválida, o sistema deve interromper a criação da solicitação e exibir uma mensagem clara de erro via `sonner`, mantendo os dados preenchidos no formulário.
- **Transferência de Setor pelo Líder vs. Gestor (`TransferModal`)**: Quando o `TransferModal` for utilizado dentro do `LiderDashboard` (sem `DashboardProvider`), a atualização pós-transferência deve utilizar o callback `onSuccess` da própria tela do líder sem lançar exceções.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE criar um componente reutilizável e acessível de modal de confirmação estilizado com TailwindCSS (`ConfirmModal` / `ConfirmationModal`), suportando título, descrição, texto customizável de confirmação/cancelamento, variante visual (padrão/destrutiva), estado de carregamento (`isLoading`) e fechamento por tecla `Escape`.
- **FR-002**: O sistema DEVE substituir 100% dos usos de `sweetalert2` (`Swal.fire`), `window.alert()`, `window.confirm()` e estados de toast manuais/ad-hoc no Frontend por notificações `sonner` (`toast.success`, `toast.error`, `toast.warning`, `toast.info`) e pelo novo modal de confirmação.
- **FR-003**: O componente `NovaSolicitacao.tsx` DEVE realizar a busca de setores e a criação de solicitações através de serviços de domínio baseados em `frontend/src/lib/axios.ts`, mantendo apenas o upload de imagens no Supabase Storage (`storage`) e removendo a função órfã `fetchProfile`.
- **FR-004**: O componente `PortariaDashboard.tsx` DEVE executar as operações de conferência de entrada (`/portaria/conferencia/:id`) e registro de saída (`/portaria/saida/:id`) por meio de funções no serviço de domínio (`gatekeeperService.ts`) utilizando `frontend/src/lib/axios.ts`, eliminando chamadas `fetch()` nativas.
- **FR-005**: O componente `MemberList.tsx` DEVE realizar todas as chamadas HTTP através de um serviço de domínio utilizando `frontend/src/lib/axios.ts`, eliminando a importação direta do pacote `axios` e a leitura manual de `supabase.auth.getSession()` no componente.
- **FR-006**: O componente `AuditSection.tsx` DEVE realizar a busca de logs de auditoria (`/admin/audit-logs`) através de um serviço de domínio utilizando `frontend/src/lib/axios.ts`, eliminando chamadas `fetch()` nativas.
- **FR-007**: O roteador `RoleDispatcher.tsx` DEVE envolver apenas o painel gerencial (`GESTOR` / `SUPER_ADMIN` visualizando unidade) com o `<DashboardProvider>`, renderizando `PortariaDashboard` e `LiderDashboard` sem o `<DashboardProvider>`.
- **FR-008**: O componente `TransferModal.tsx` DEVE operar de forma desacoplada do `DashboardContext`, utilizando o serviço HTTP de domínio (`dashboardService.transferSector` ou equivalente) e notificando a tela pai via callback `onSuccess` para atualização dos dados locais.
- **FR-009**: Os arquivos órfãos `frontend/src/components/SignaturePad.tsx` e `frontend/src/features/admin/components/AdminSidebar.tsx`, bem como os métodos não utilizados `approveRequest` e `rejectRequest` em `DashboardContext.tsx` / `dashboardService.ts`, DEVEM ser removidos.
- **FR-010**: Os pacotes `sweetalert2`, `zustand`, `react-signature-canvas` e `@types/react-signature-canvas` DEVEM ser removidos do arquivo `frontend/package.json`.
- **FR-011**: Todas as regras de negócio, validações de formulário, transições de status e permissões visuais existentes nas telas refatoradas DEVEM permanecer inalteradas para o usuário final.

### Key Entities

- **Notificação de Feedback (`Toast` / `ConfirmModal`)**: Representa o mecanismo padronizado de comunicação visual com o usuário para alertas transitórios (sucesso, erro, aviso) e confirmações de decisão antes de operações críticas.
- **Serviço de Domínio HTTP**: Camada intermediária do Frontend responsável por encapsular chamadas à API Backend através da instância autenticada `lib/axios.ts`.
- **Escopo de Contexto por Papel (`RoleDispatcher` / `DashboardContext`)**: Fronteira de estado que garante que apenas perfis autorizados (`GESTOR`, `SUPER_ADMIN`) inicializem consultas de monitoramento gerencial.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 0 ocorrências de `sweetalert2`, `window.alert()`, `window.confirm()` ou `window.prompt()` permanecem no código-fonte do Frontend (`frontend/src/`) e `sweetalert2` não consta mais em `frontend/package.json`.
- **SC-002**: 0 chamadas `fetch()` manuais para endpoints da API Backend ou importações diretas do pacote `axios` fora de `frontend/src/lib/axios.ts` permanecem em componentes ou páginas React.
- **SC-003**: 0 erros `403 Forbidden` ocorrem no console ou na aba de rede do navegador ao autenticar e navegar com os perfis `LIDER_SETOR` e `PORTARIA`.
- **SC-004**: 100% dos fluxos de negócio das telas `NovaSolicitacao`, `PortariaDashboard`, `LiderDashboard`, `MemberList`, `AuditSection`, `AdminDashboard` e `SuperAdminDashboard` preservam seu comportamento funcional e compilam sem erros (`npm run build` com código de saída `0`).
- **SC-005**: 100% dos arquivos e pacotes órfãos listados no escopo (`SignaturePad.tsx`, `AdminSidebar.tsx`, `sweetalert2`, `zustand`, `react-signature-canvas`, `@types/react-signature-canvas`) são removidos sem quebrar nenhuma importação.

## Assumptions

- Para `NovaSolicitacao.tsx`, assume-se que a listagem de setores utilizará o endpoint existente `GET /api/setores` (filtrando por `unidade_id` da empresa quando aplicável ou mantendo o contrato atual suportado pela API/RLS) e a criação da solicitação utilizará o endpoint autenticado `POST /api/terceirizada/request` (ou serviço equivalente), mantendo o upload prévio das imagens para o Supabase Storage. Caso algum endpoint do Backend precise de ajuste mínimo de filtro para refletir exatamente os campos retornados hoje na tela `NovaSolicitacao`, isso será detalhado na etapa `/speckit-plan`.
- Os demais usos diretos do Supabase Client para queries de banco em outras telas que serão decompostas na Fase 2 (`SuperAdminDashboard.tsx`, `AdminDashboard.tsx`, `LiderDashboard.tsx`, `PortariaHistoryView.tsx`) não fazem parte do lote de migração HTTP desta Fase 1, exceto naquilo que tange à substituição de alertas (`SweetAlert2` / `alert` / `confirm`) por `sonner` e pelo modal de confirmação Tailwind.
- A divergência do nome do bucket (`material-images` vs `material_images`) mapeada no inventário não será alterada silenciosamente nesta fase sem definição explícita no plano técnico, preservando o identificador atualmente em uso no Frontend (`material-images`).

