<!--
Sync Impact Report
- Version change: N/A (unpopulated template) → 1.0.0
- List of modified principles:
  - [PRINCIPLE_1_NAME] → I. Preservação Estrita das Regras de Negócio (NON-NEGOTIABLE)
  - [PRINCIPLE_2_NAME] → II. Padronização de Camadas e Clientes HTTP
  - [PRINCIPLE_3_NAME] → III. Padronização de Feedback Visual e Modais
  - [PRINCIPLE_4_NAME] → IV. Decomposição Modular e Limite de Responsabilidade
  - [PRINCIPLE_5_NAME] → V. Higiene de Código e Isolamento de Contexto por Papel
- Added sections:
  - Requisitos de Segurança e Isolamento Multi-Tenant ([SECTION_2_NAME])
  - Fluxo de Desenvolvimento e Portões de Qualidade ([SECTION_3_NAME])
  - Governance ([GOVERNANCE_RULES])
- Removed sections: None
- Follow-up TODOs: None
-->
# Unitraack Constitution

## Core Principles

### I. Preservação Estrita das Regras de Negócio (NON-NEGOTIABLE)

Os fluxos operacionais descritos em `docs/BUSINESS-FLOW.md` — abrangendo solicitação de materiais
pela terceirizada, aprovação prévia pelo líder de setor, conferência/check-in e baixa de saída na
portaria, movimentações internas entre setores, tratativa de divergências e monitoramento gerencial
— DEVEM (MUST) ser integralmente preservados sem alteração de comportamento para o usuário final.
Nenhuma refatoração estrutural, decomposição de componente ou limpeza técnica PODE (MUST NOT)
alterar transições de status (`PENDENTE`, `APROVADO`, `ENTREGUE`, `DIVERGENCIA`, `REJEITADO`,
`SAIU`, `EM_TRANSITO`), regras de permissão por perfil ou contratos de dados ativos sem uma
especificação formalmente aprovada.

**Racional**: Garantir continuidade operacional e zero regressão funcional durante a evolução
arquitetural e o pagamento de dívida técnica do sistema.

### II. Padronização de Camadas e Clientes HTTP

No Frontend, toda comunicação HTTP com a API Backend DEVE (MUST) passar obrigatoriamente pela
instância central configurada em `frontend/src/lib/axios.ts` e ser encapsulada em serviços de
domínio (`services/`). O uso direto do pacote `axios` avulso, chamadas `fetch` nativas dispersas
ou queries diretas às tabelas do banco de dados via Supabase Client dentro de componentes ou
páginas React é ESTRITAMENTE PROIBIDO (MUST NOT). O uso do Supabase Client (`frontend/src/lib/supabase.ts`)
no Frontend DEVE (MUST) ficar restrito exclusivamente a Autenticação (`auth`), canais de tempo
real (`realtime`) e armazenamento de arquivos (`storage`).

**Racional**: Centralizar interceptors de autenticação JWT, tratamento de erros HTTP e contratos
de serviço, eliminando acoplamento direto entre a camada de apresentação e o banco de dados.

### III. Padronização de Feedback Visual e Modais

Toda notificação transitória (toast) da aplicação DEVE (MUST) utilizar exclusivamente a biblioteca
`sonner`. Confirmações de ações críticas ou destrutivas DEVEM (MUST) utilizar um componente modal
de confirmação único, acessível (com suporte a foco, teclado e atributos ARIA) e estilizado com
TailwindCSS. O uso de `sweetalert2`, diálogos nativos bloqueantes do navegador (`window.alert`,
`window.confirm`, `window.prompt`) ou estados de erro/sucesso ad-hoc duplicados por tela é
PROIBIDO (MUST NOT), devendo ser progressivamente erradicado.

**Racional**: Garantir consistência visual, acessibilidade e experiência de usuário uniforme em
todos os módulos, além de reduzir o tamanho do bundle final removendo bibliotecas redundantes.

### IV. Decomposição Modular e Limite de Responsabilidade

Nenhum arquivo de componente ou página React no Frontend DEVE (MUST NOT) ultrapassar 400 linhas de
código. Telas complexas ou monolíticas (como `SuperAdminDashboard`, `PortariaDashboard`,
`LiderDashboard` e `NovaSolicitacao`) DEVEM (MUST) ser decompostas em subcomponentes coesos de
apresentação e Custom Hooks dedicados à orquestração de estado e efeitos. No Backend, os
controllers HTTP DEVEM (MUST) respeitar a separação estrita por contexto de domínio, dividindo
responsabilidades em controllers dedicados (`RequestController`, `MaterialMovementController`,
`GatekeeperController` e `NotificationController`), onde cada controller atua apenas como adaptador
HTTP para os respectivos casos de uso (`application/use-cases/`).

**Racional**: Evitar o surgimento de God Components e God Controllers, facilitando manutenção,
revisão de código, testabilidade unitária e isolamento de falhas.

### V. Higiene de Código e Isolamento de Contexto por Papel

O repositório NÃO DEVE (MUST NOT) manter imports órfãos, componentes sem importadores ativos,
rotas não montadas, dependências externas sem uso real no código (como `zustand` sem stores) ou
métodos de serviço legados mapeados em `docs/BASELINE-INVENTORY.md`. Além disso, provedores de
contexto React (como `DashboardProvider`) DEVEM (MUST) respeitar estritamente o papel (`role`) do
usuário autenticado, garantindo que telas de outros perfis (como `LIDER_SETOR` e `PORTARIA`) nunca
disparem chamadas automáticas para endpoints exclusivos de gestão que resultem em erros `403 Forbidden`.

**Racional**: Reduzir a carga cognitiva de manutenção, eliminar superfície de código morto e
impedir requisições indevidas que poluem logs de auditoria e degradam a performance da aplicação.

## Requisitos de Segurança e Isolamento Multi-Tenant

- **Defesa em Profundidade (Frontend + Backend + RLS)**: O controle de acesso por papel
  (`SUPER_ADMIN`, `GESTOR`, `LIDER_SETOR`, `PORTARIA`, `TERCEIRIZADA`) e o isolamento entre
  unidades (`unidade_id`), setores (`setor_id`) e empresas (`empresa_id`) DEVEM (MUST) ser
  validados obrigatoriamente no Backend (`authMiddleware` e `tenantMiddleware`) e no PostgreSQL
  (Row-Level Security), nunca confiando apenas em guardas visuais do Frontend.
- **Restrição do `supabaseAdmin` (`service_role`)**: A chave `SUPABASE_SERVICE_KEY` NUNCA DEVE
  (MUST NOT) ser exposta ao Frontend. No Backend, o uso de `supabaseAdmin` (que ignora RLS) só
  PODE (MUST) ocorrer após validação explícita de identidade e escopo de tenant no middleware ou
  caso de uso.
- **Proteção de Borda e Sessão**: Endpoints públicos e sensíveis DEVEM (MUST) manter rate limiting
  ativo, cabeçalhos de segurança (`helmet`), validação de CORS restrita e expiração de sessão por
  inatividade no cliente.

## Fluxo de Desenvolvimento e Portões de Qualidade

- **Tipagem Estrita e Contratos**: Todo código novo ou refatorado em TypeScript (Frontend e
  Backend) DEVE (MUST) possuir tipagem explícita para payloads, respostas e props, evitando a
  introdução de novos usos de `any`.
- **Execução Orientada por Especificação (Spec-First)**: Nenhuma refatoração estrutural ou nova
  funcionalidade PODE (MUST NOT) ser implementada sem antes passar pelo fluxo do Spec Kit
  (`/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`), confrontando o
  escopo com `docs/BUSINESS-FLOW.md`, `docs/SEGURANCA.md` e `docs/BASELINE-INVENTORY.md`.
- **Limites de Autonomia de Agentes de IA**: Agentes de codificação NÃO DEVEM (MUST NOT) criar
  regras de negócio implícitas, alterar políticas de RLS, excluir tabelas/colunas ou remover
  arquivos fora do escopo aprovado na tarefa atual sem confirmação humana explícita.

## Governance

Esta Constituição é a fonte suprema de governança técnica e arquitetural do projeto Unitraack,
prevalecendo sobre instruções ad-hoc ou diretrizes conflitantes em documentos auxiliares (como
`docs/AGENTS.md`).

- **Procedimento de Emenda**: Qualquer alteração nesta Constituição exige documentação explícita da
  motivação, avaliação de impacto nos documentos de base (`docs/BUSINESS-FLOW.md`,
  `docs/SEGURANCA.md`, `docs/BASELINE-INVENTORY.md`) e aprovação humana.
- **Política de Versionamento**: Esta Constituição segue o Versionamento Semântico (`MAJOR.MINOR.PATCH`):
  - `MAJOR`: Remoção ou redefinição incompatível de princípios ou controles de segurança.
  - `MINOR`: Adição de novo princípio/seção ou expansão material de diretrizes obrigatórias.
  - `PATCH`: Esclarecimentos redacionais, correções tipográficas ou refinamentos sem alteração de regra.
- **Revisão de Conformidade**: Toda especificação (`spec.md`), plano de implementação (`plan.md`),
  lista de tarefas (`tasks.md`) e Pull Request DEVE (MUST) verificar conformidade explícita com os
  5 Princípios Fundamentais desta Constituição antes de ser aprovado.

**Version**: 1.0.0 | **Ratified**: 2026-11-05 | **Last Amended**: 2026-11-05
