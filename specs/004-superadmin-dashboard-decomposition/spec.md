# Feature Specification: Refatoração Frontend - Fase 2C: Decomposição Modular e Padronização de Rede do SuperAdminDashboard

**Feature Branch**: `004-superadmin-dashboard-decomposition`  
**Created**: 2026-11-25  
**Status**: Draft  
**Input**: User description: "Refatoração Frontend - Fase 2C: Decomposição Modular e Padronização de Rede do SuperAdminDashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestão de Usinas, Branding e Convites de Gestores (Priority: P1)

Como Super Administrador da plataforma Unitraack, quero visualizar, cadastrar, editar (com extração automática de identidade visual por URL), ativar/desativar, excluir e gerar links de convite para usinas (`tenants`) em visões modulares e padronizadas, mantendo 100% do comportamento atual da Seção 3.5 e Fluxo 14 do `BUSINESS-FLOW.md`.

**Why this priority**: A gestão do ciclo de vida das usinas (tenants) e a geração de convites para Gestores de Segurança constituem o núcleo operacional do Super Administrador; qualquer regressão aqui bloqueia o onboarding e a administração de novas unidades industriais.

**Independent Test**: Autenticar como Super Administrador, acessar a gestão de usinas, cadastrar uma nova usina utilizando a detecção automática de cores/logotipo por URL, copiar o link de convite gerado para o Gestor, editar uma usina existente e alternar o status (desativar/reativar) confirmando via diálogo de confirmação padronizado e recebendo notificação toast.

**Acceptance Scenarios**:

1. **Given** que o Super Administrador acessa a aba de Usinas, **When** busca pelo nome ou CNPJ de uma unidade ou expande seus detalhes, **Then** a listagem filtrada exibe corretamente os dados da usina, quantidade de gestores e ações disponíveis (convidar, editar, ativar/desativar, excluir).
2. **Given** que o Super Administrador abre o formulário de cadastro de usina e informa uma URL válida do site da empresa, **When** aciona a extração automática de identidade visual, **Then** o sistema preenche o logotipo e a paleta de 3 cores sugerida (ou exibe feedback de erro claro caso o site não responda), permitindo salvar a usina e exibir o link de convite para o Gestor.
3. **Given** que o Super Administrador solicita desativar, reativar ou excluir uma usina, **When** confirma a ação no diálogo de confirmação acessível, **Then** o status ou remoção é persistido, a lista de usinas é atualizada e uma notificação de feedback é exibida.

---

### User Story 2 - Gestão Global de Usuários e Controle de Acesso (Priority: P2)

Como Super Administrador, quero consultar a listagem global de usuários da plataforma filtrando por usina, categoria (internos ou terceirizadas), status (ativo/inativo) e busca textual, além de poder ativar ou desativar contas com segurança.

**Why this priority**: O controle global de contas garante governança multi-tenant, permitindo bloquear ou restabelecer acessos rapidamente sem interferir no restante das operações da plataforma.

**Independent Test**: Acessar a aba de Usuários, combinar filtros de unidade industrial, categoria e status, localizar um colaborador ou terceirizada e alternar seu status de ativo/inativo mediante confirmação.

**Acceptance Scenarios**:

1. **Given** que o Super Administrador acessa a aba de Usuários, **When** aplica filtros de usina, categoria, status ou termo de busca, **Then** apenas os perfis correspondentes são exibidos com seus respectivos papéis e unidades vinculadas.
2. **Given** que o Super Administrador tenta desativar o próprio usuário logado, **When** aciona a opção de desativação, **Then** o sistema bloqueia a operação e informa ao administrador que não é possível desativar o próprio acesso.
3. **Given** que o Super Administrador seleciona outro usuário ativo ou inativo, **When** confirma a alteração de status no diálogo de confirmação, **Then** o estado da conta é atualizado na listagem e o usuário recebe feedback visual imediato.

---

### User Story 3 - Indicadores Globais da Plataforma e Auditoria por Usina (Priority: P3)

Como Super Administrador, quero acompanhar os indicadores globais da plataforma (total de usinas, total de usuários e solicitações ativas) e consultar os registros de auditoria operacional filtrados por usina com paginação.

**Why this priority**: A visibilidade consolidada da plataforma e a trilha de auditoria por unidade permitem monitoramento operacional contínuo e rastreabilidade de eventos críticos.

**Independent Test**: Acessar o painel inicial para conferir os cartões de métricas globais e, na aba de Monitoramento/Auditoria, selecionar uma usina específica para carregar e paginar seus registros de auditoria.

**Acceptance Scenarios**:

1. **Given** que o Super Administrador acessa a visão geral do painel, **When** os dados da plataforma são carregados, **Then** os cartões de métricas exibem os totais consolidados de usinas, usuários e solicitações.
2. **Given** que o Super Administrador acessa a aba de Auditoria e seleciona uma usina, **When** os registros são retornados, **Then** os eventos são listados com paginação funcional e estado vazio informativo caso a unidade não possua registros.

---

### User Story 4 - Padronização de Rede e Orquestração Modular do Painel (Priority: P4)

Como equipe de engenharia da Unitraack, queremos que toda a comunicação com a API do Super Administrador utilize a camada de serviço centralizada e que a página principal atue exclusivamente como orquestradora enxuta de navegação, subcomponentes e modais dentro dos limites de complexidade do projeto.

**Why this priority**: Eliminar chamadas HTTP cruas dispersas e reduzir o monolito de 2.459 linhas reduz o risco de regressões, padroniza o tratamento de autenticação/erros e viabiliza manutenção independente por domínio.

**Independent Test**: Inspecionar o código-fonte confirmando ausência total de chamadas `fetch(` nos componentes e hooks do Super Admin, verificar contagem de linhas (`SuperAdminDashboard.tsx <= 220` linhas e demais módulos `<= 350` linhas) e validar build de produção sem erros.

**Acceptance Scenarios**:

1. **Given** a nova estrutura modular do painel do Super Administrador, **When** o build de produção do frontend é executado, **Then** a compilação estática e a geração do bundle concluem sem erros.
2. **Given** os arquivos refatorados da feature administrativa, **When** a contagem de linhas e o uso de cliente HTTP são auditados, **Then** o container principal possui no máximo 220 linhas, cada novo submódulo/hook possui no máximo 350 linhas e nenhuma chamada `fetch(` direta existe nos arquivos da tela.

---

### Edge Cases

- O que acontece quando a extração automática de branding recebe uma URL vazia, inválida ou de um site inacessível? O sistema deve orientar o administrador sobre a necessidade da URL válida ou exibir mensagem de falha controlada sem limpar dados já preenchidos manualmente.
- O que acontece ao tentar excluir uma usina que já possui usuários ou histórico operacional vinculado? O sistema deve preservar o erro retornado pelo servidor em diálogo informativo/notificação, mantendo a integridade referencial sem fechar inesperadamente o estado da tela.
- O que acontece quando o Super Administrador tenta desativar sua própria conta na listagem global de usuários? A ação deve ser impedida preventivamente com aviso claro.
- O que acontece quando uma usina selecionada na aba de auditoria não possui eventos registrados ou ocorre falha temporária de rede? A interface deve encerrar o indicador de carregamento e exibir estado vazio adequado sem quebrar a paginação.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE preservar integralmente todas as funcionalidades administrativas do Super Administrador descritas na Seção 3.5 e Fluxo 14 do `docs/BUSINESS-FLOW.md` (gestão de usinas, branding, convites, usuários globais, métricas e auditoria).
- **FR-002**: O sistema DEVE centralizar toda a comunicação HTTP administrativa (`/admin/tenants`, `/admin/tenants/:id`, `/admin/tenants/:id/status`, `/admin/tenants/invite`, `/admin/extract-branding`, `/admin/users`, `/admin/users/:id/status`, `/admin/stats`, `/admin/audit/:tenantId`) em uma camada de serviço dedicada sobre o cliente HTTP padronizado da aplicação, eliminando 100% das chamadas `fetch(` nativas e manipulação manual de token nos componentes.
- **FR-003**: O sistema DEVE isolar a lógica de estado, carregamento, filtros e operações de usinas, usuários globais e estatísticas/auditoria em hooks especializados (`useSuperAdminTenants`, `useSuperAdminUsers`, `useSuperAdminStats`).
- **FR-004**: O sistema DEVE decompor a interface em subcomponentes coesos para métricas da plataforma (`PlatformStatsCards`), gestão de usinas (`TenantsManagementView`), formulário de usina com extração de branding (`TenantFormModal`), gestão global de usuários (`GlobalUsersView`) e auditoria por usina (`TenantAuditView`).
- **FR-005**: O sistema DEVE utilizar exclusivamente `sonner` para notificações transitórias e o componente modal de confirmação padronizado (`ConfirmDialog`) para ações destrutivas ou críticas (desativar/reativar usina, excluir usina, desativar/reativar usuário), mantendo acessibilidade e consistência visual da Fase 1.
- **FR-006**: O container principal `SuperAdminDashboard.tsx` DEVE atuar exclusivamente como orquestrador de abas, navegação e integração entre hooks e subcomponentes, respeitando o teto máximo de 220 linhas.
- **FR-007**: Nenhum novo arquivo de componente, hook ou serviço criado nesta refatoração PODE ultrapassar 350 linhas de código.
- **FR-008**: O sistema DEVE manter o bloqueio preventivo contra autodesativação do Super Administrador logado e a validação de campos obrigatórios no cadastro/edição de usinas.

### Key Entities

- **Usina (`Tenant`)**: Unidade industrial cadastrada na plataforma, contendo identificação (`id`, `name`, `subdomain`, `cnpj`), estado de ativação (`active`), identidade visual (`logo_url`, `company_color`, `secondary_color`, `tertiary_color`), contagem de gestores e data de criação.
- **Perfil Global (`GlobalProfile`)**: Usuário cadastrado em qualquer unidade da plataforma, com dados de identificação (`id`, `full_name`, `email`), papel (`role`), setor, dados empresariais quando terceirizada, estado de ativação (`is_active`) e vínculo com a usina (`tenant`).
- **Métricas da Plataforma (`PlatformStats`)**: Resumo consolidado contendo totais de usinas (`totalTenants`), usuários (`totalUsers`) e solicitações (`totalRequests`).
- **Registro de Auditoria (`AuditLog`)**: Evento operacional ou administrativo vinculado a uma usina específica consultado na aba de monitoramento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O arquivo container `frontend/src/features/admin/pages/SuperAdminDashboard.tsx` é reduzido de 2.459 linhas para no máximo **220 linhas** (redução superior a 90%).
- **SC-002**: 100% dos novos arquivos criados (`superAdminService.ts`, hooks `useSuperAdmin*.ts` e componentes em `components/superadmin/*.ts*`) possuem **no máximo 350 linhas** cada.
- **SC-003**: **Zero** ocorrências de chamadas `fetch(` nativas ou leitura manual de `getAuthToken()` nos arquivos do módulo Super Admin após a refatoração.
- **SC-004**: 100% das jornadas administrativas (cadastro/edição de usina com branding, geração/cópia de convite, ativação/desativação/exclusão com confirmação, filtros/status de usuários e auditoria paginada) operam sem regressão funcional em relação ao comportamento original.
- **SC-005**: A verificação estática de tipos e geração do bundle de produção do frontend (`npm run build --prefix frontend`) conclui com **código de saída 0** e zero erros de TypeScript.

## Assumptions

- Os contratos HTTP existentes do backend para os endpoints `/admin/*` permanecem inalterados e compatíveis com a instância `lib/axios.ts` (que já injeta o token de autenticação e trata respostas padronizadas).
- Os componentes compartilhados da Fase 1 (`ConfirmDialog` e `sonner`) já estão disponíveis e configurados na aplicação.
- O comportamento de extração de branding por URL e geração de link de convite (`/register-gestor?token=...`) permanece idêntico ao fluxo atual no backend.
