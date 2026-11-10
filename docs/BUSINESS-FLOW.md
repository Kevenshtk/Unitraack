# Business Flow

# 1. Objetivo

Este documento descreve o funcionamento do negócio representado pelo sistema, os papéis envolvidos, suas responsabilidades e os principais fluxos relacionados à entrada, controle, movimentação e saída de equipamentos de empresas terceirizadas dentro da indústria.

O objetivo é estabelecer uma visão do negócio independente da implementação atual do sistema, servindo como base para as decisões de arquitetura.

---

# 2. Visão geral do negócio

O processo central do sistema é o **controle da operação de equipamentos de empresas terceirizadas dentro da indústria**.

Uma operação começa quando uma empresa terceirizada cria uma solicitação para levar equipamentos para dentro da indústria.

A solicitação passa por aprovação do Líder do Setor, posteriormente é validada pela Portaria no momento da entrada e, após a entrada, os equipamentos passam a ser controlados dentro da planta.

Durante sua permanência na indústria, os equipamentos podem ser movimentados entre setores. Essas movimentações precisam ser registradas e aceitas pelo setor de destino.

Ao final da operação, os equipamentos podem ser direcionados para saída da indústria, sendo novamente validados pela Portaria.

O ciclo pode ser representado, de forma geral, como:

```text
Terceirizada
    ↓
Criação da Solicitação
    ↓
Aprovação do Líder do Setor
    ↓
Validação da Portaria
    ↓
Entrada na Planta
    ↓
Equipamento em um Setor
    ↓
Movimentações entre Setores
    ↓
Baixa / Saída
    ↓
Validação da Portaria
    ↓
Equipamento fora da Planta
```
---

# 3. Atores do sistema

## 3.1 Terceirizada

A empresa terceirizada é responsável por solicitar a entrada de equipamentos na indústria.

Suas principais responsabilidades são:

- Criar solicitações de entrada.
- Informar setor e subsetor de destino.
- Informar previsão de chegada.
- Informar motorista e veículo.
- Cadastrar os equipamentos que serão transportados.
- Informar dados dos equipamentos:
  - Foto.
  - Nome.
  - Marca.
  - Modelo.
  - Número de série.
  - Condição.
  - Descrição de avarias.
- Acompanhar o status das solicitações.
- Visualizar detalhes das solicitações.
- Editar solicitações enquanto estiverem nos estados permitidos.
- Excluir solicitações canceladas do histórico.
- Visualizar seus equipamentos dentro da planta e aqueles que já saíram.
---

## 3.2 Líder de Setor

O Líder de Setor é responsável por analisar solicitações destinadas ao seu setor e controlar os equipamentos presentes nele.

Suas principais responsabilidades são:

- Analisar solicitações pendentes.
- Visualizar informações da solicitação e dos equipamentos.
- Aprovar solicitações.
- Visualizar equipamentos presentes no seu setor.
- Consultar equipamentos.
- Solicitar movimentação de equipamentos para outro setor.
- Informar o setor e subsetor de destino.
- Registrar evidência fotográfica da movimentação.
- Informar observação da evidência.
- Informar a matrícula do responsável pela movimentação.
- Dar baixa em equipamentos para saída da indústria.
- Receber movimentações destinadas ao seu setor.
- Aceitar ou recusar movimentações.
- Confirmar a aceitação utilizando sua matrícula.

### Movimentações
- Consultar o histórico dos eventos de localização dos equipamentos relacionados ao seu setor.
- Visualizar entradas pela Portaria, transferências entre setores/subsetores e baixas para saída relacionadas aos equipamentos do seu setor.
- Visualizar informações como origem, destino, data, hora e evidências relacionadas.
---

## 3.3 Portaria

A Portaria é responsável por validar fisicamente as operações de entrada e saída da indústria.

Suas principais responsabilidades são:

### Entrada

- Visualizar solicitações aprovadas pelo Líder do Setor.
- Conferir os dados da solicitação.
- Conferir os equipamentos.
- Conferir motorista e veículo.
- Conferir data e horário agendados.
- Liberar a entrada utilizando a matrícula do funcionário logado.
- Registrar divergências quando houver irregularidade.
- Cancelar uma entrada informando o motivo.

### Equipamentos em planta

- Visualizar solicitações que tiveram a entrada liberada pela Portaria.
- Consultar os equipamentos relacionados às solicitações.

### Saída

- Visualizar solicitações cujos equipamentos receberam baixa.
- Conferir os equipamentos.
- Registrar fotos da operação, quando necessário.
- Registrar observações.
- Liberar a saída utilizando a matrícula do funcionário logado.

### Histórico

- Consultar entradas e saídas realizadas.
- Visualizar equipamentos envolvidos.
- Visualizar setores de origem ou destino.
- Consultar data, hora e evidências fotográficas.

### Papel da Portaria nos fluxos
A Portaria possui dois papéis distintos no sistema:
- **Como setor da planta:** pode receber equipamentos por meio de uma movimentação interna, seguindo as mesmas regras de movimentação entre setores. Nesse caso, o equipamento pode permanecer na Portaria e ser visualizado como parte do setor Portaria.
- **Como ponto de controle de entrada e saída:** realiza a validação física da entrada e da saída dos equipamentos da indústria. Nesse caso, o equipamento não está sendo movimentado internamente para o setor Portaria, mas passando pelo controle de entrada ou saída da planta.

  **Regra:** Um equipamento estar na Portaria não significa necessariamente que ele esteja no fluxo de saída. É necessário distinguir quando a Portaria está atuando como setor da planta e quando está atuando como ponto de controle da entrada ou saída.
---

## 3.4 Gestor

O Gestor é responsável pela administração e acompanhamento das operações da unidade.

Suas responsabilidades estão relacionadas a:

- Acompanhar indicadores da operação.
- Visualizar solicitações autorizadas.
- Visualizar equipamentos atualmente dentro da planta.
- Acompanhar movimentações.
- Administrar membros da equipe.
- Cadastrar e gerenciar setores e subsetores.
- Monitorar equipamentos por setor.
- Administrar o mapa industrial.
- Consultar auditoria e rastreabilidade.
- Consultar informações das empresas terceirizadas.
- Gerar relatórios operacionais e de auditoria.

O Gestor também pode:

- Cadastrar colaboradores internos.
- Gerar convites para novos colaboradores.
- Editar membros.
- Resetar senhas.
- Desativar contas.
- Excluir membros.
- Criar e excluir setores e subsetores.
- Posicionar subsetores no mapa industrial.

### Auditoria e rastro
- Consultar o histórico geral de eventos relacionados à localização dos equipamentos na indústria.
- Acompanhar entradas na planta, movimentações entre setores, baixas e saídas da planta.
---

## 3.5 Super Admin

O Super Admin atua em um nível superior à unidade industrial.

Suas responsabilidades estão relacionadas à administração das usinas/unidades e dos usuários cadastrados.

Pode:

- Visualizar quantidade de usinas.
- Visualizar quantidade total de usuários.
- Visualizar solicitações ativas.
- Buscar e administrar usinas.
- Cadastrar novas unidades.
- Editar unidades.
- Excluir unidades.
- Acessar o portal de uma unidade.
- Consultar usuários por unidade/empresa.
- Consultar movimentações e informações de monitoramento de uma unidade.
---

# 4. Entidades do negócio

### 4.1 Unidade

**O que representa:**  
A usina/indústria onde ocorrem as operações controladas pelo sistema.

**Informações principais:**
- Identificação da unidade.
- Estrutura de setores e subsetores.
- Usuários vinculados à unidade.
- Configuração do mapa industrial.

**Relacionamentos:**
- Possui setores.
- Possui usuários.
- Possui empresas terceirizadas relacionadas às operações da unidade.
- Possui configuração do mapa industrial.

**Observações:**
- O sistema possui contexto de unidade.
- A administração das unidades é realizada pelo Super Admin.
---

### 4.2 Setor

**O que representa:**  
Uma divisão da unidade industrial utilizada para organizar a localização dos equipamentos e a responsabilidade dos Líderes.

**Informações principais:**
- Identificação do setor.
- Subsetores pertencentes ao setor.
- Líder responsável pelo setor.

**Relacionamentos:**
- Pertence a uma unidade.
- Possui subsetores.
- Possui um Líder responsável.
- Pode ser destino de uma solicitação.
- Pode ser origem ou destino de uma movimentação.
- Pode ser a localização atual de equipamentos.

**Observações:**
- O setor participa da definição da localização atual do equipamento.
---

### 4.3 Subsetor

**O que representa:**  
Uma localização específica dentro de um setor da unidade.

**Informações principais:**
- Identificação do subsetor.
- Setor ao qual pertence.
- Posicionamento no mapa industrial, quando aplicável.

**Relacionamentos:**
- Pertence a um setor.
- Pode ser destino de uma solicitação.
- Pode ser origem ou destino de uma movimentação.
- Pode ser a localização atual de um equipamento.

**Observações:**
- Um equipamento dentro da planta deve possuir setor e subsetor atual definidos.
---

### 4.4 Empresa Terceirizada

**O que representa:**  
Empresa responsável pelos equipamentos que entram e circulam dentro da indústria.

**Informações principais:**
- Identificação da empresa.

**Relacionamentos:**
- Pode criar solicitações.
- Possui equipamentos envolvidos nas operações.
- É relacionada às operações de entrada e saída dos equipamentos.

**Observações:**
- A empresa acompanha o estado de suas solicitações e equipamentos.
---

### 4.5 Usuário

**O que representa:**  
Pessoa que utiliza o sistema para executar ou acompanhar operações.

**Papéis definidos no sistema:**
- Super Admin.
- Gestor.
- Líder de Setor.
- Portaria.
- Terceirizada.

**Relacionamentos:**
- Pertence a uma unidade, conforme seu contexto de acesso.
- Pode estar associado a um setor quando exercer a função de Líder.
- Executa ações de acordo com seu papel.

**Observações:**
- Líder, Gestor e Portaria representam papéis de atuação no sistema, não entidades de negócio independentes.
---

### 4.6 Solicitação

**O que representa:**  
Pedido de uma empresa terceirizada para levar equipamentos para dentro da indústria.

**Informações principais:**
- Empresa terceirizada.
- Setor de destino.
- Subsetor de destino.
- Previsão de chegada.
- Nome do motorista.
- Placa do veículo.
- Equipamentos associados.
- Estado da solicitação.

**Relacionamentos:**
- Pertence a uma empresa terceirizada.
- Possui um ou mais equipamentos.
- Possui um setor e subsetor de destino.
- É analisada pelo Líder do setor de destino.
- É validada pela Portaria durante a entrada.
- É acompanhada pelo Gestor.

**Estados definidos:**
- Análise (Líder).
- Autorizado.
- Recusado (Líder).
- Recusado (Portaria).
- Dentro da Planta.
- Cancelado.
- Finalizado.

**Regras principais:**
- Pode ser editada enquanto estiver em Análise (Líder).
- Após aprovação, não pode mais ser editada.
- Solicitações recusadas pelo Líder ou pela Portaria podem ser editadas e reenviadas.
- Pode ser cancelada enquanto estiver em Análise (Líder) ou após determinadas recusas.
- Uma solicitação cancelada pode ser excluída do histórico.
---

### 4.7 Equipamento

**O que representa:**  
Ativo pertencente a uma empresa terceirizada que pode permanecer dentro da indústria durante uma operação.

**Informações principais:**
- Foto.
- Nome.
- Marca/fabricante.
- Modelo.
- Número de série.
- Condição.
- Descrição de avarias.
- Estado atual.
- Setor atual.
- Subsetor atual.

**Relacionamentos:**
- Pertence a uma empresa terceirizada.
- É associado a uma solicitação durante sua entrada.
- Possui uma localização atual dentro da planta.
- Pode participar de movimentações.
- Possui histórico relacionado à sua entrada, movimentações e saída.

**Estados definidos:**
- Em Planta.
- Saindo.
- Chegando.
- Baixa.
- Fora de Operação (Saída).

**Regras principais:**
- Ao ter a entrada liberada pela Portaria, passa a ser considerado dentro da planta.
- Enquanto estiver dentro da planta, deve possuir setor e subsetor atual.
- Pode ser movimentado entre setores.
- Ao receber baixa pelo Líder, deixa de aparecer em Meu Setor e passa a aguardar a saída na Portaria.
- A saída somente é finalizada após a confirmação da Portaria.
---

### 4.8 Movimentação

**O que representa:**  
Transferência de um equipamento entre setores/subsetores da indústria.

**Informações principais:**
- Equipamento.
- Setor de origem.
- Subsetor de origem.
- Setor de destino.
- Subsetor de destino.
- Evidência fotográfica.
- Observação da evidência.
- Matrícula do Líder do setor de origem.
- Estado da movimentação.
- Data e hora.

**Relacionamentos:**
- Está relacionada a um equipamento.
- Possui uma localização de origem.
- Possui uma localização de destino.
- Envolve o Líder do setor de origem.
- Envolve o Líder do setor de destino.

**Estados definidos:**
- SAINDO.
- CHEGANDO.
- Aceita.
- Recusada.

**Regras principais:**
- É iniciada pelo Líder do setor onde o equipamento está.
- O setor de destino deve ser informado.
- O equipamento passa para SAINDO após a confirmação do Líder de origem.
- O Líder de destino recebe o equipamento como CHEGANDO.
- O aceite exige confirmação por matrícula.
- Após o aceite, a localização atual do equipamento é atualizada.
- Em caso de recusa, o equipamento retorna para EM PLANTA no setor de origem.
---

# 5. Relações entre as entidades

### Unidade
- Possui vários setores.
- Possui usuários.
- Possui estrutura de subsetores.

### Empresa Terceirizada
- Possui equipamentos.
- Cria solicitações.

### Solicitação
- Pertence a uma empresa terceirizada.
- Possui equipamentos.
- Possui setor e subsetor de destino.

### Equipamento
- Pertence a uma empresa terceirizada.
- Pode estar associado a uma solicitação.
- Possui localização atual.
- Pode possuir várias movimentações.

### Movimentação
- Pertence a um equipamento.
- Possui origem e destino.
- Envolve Líderes dos setores de origem e destino.
---

# 6. Regras de negócio por entidade

## 6.1 Unidade

**O que representa:**  
A usina/indústria onde ocorrem as operações controladas pelo sistema.

### Regras de negócio

- Cada unidade possui sua própria estrutura de setores e subsetores.
- Os usuários devem estar vinculados à unidade conforme seu contexto de acesso.
- As empresas terceirizadas devem estar relacionadas às operações da unidade.
- A unidade possui uma configuração do mapa industrial.
- A administração das unidades é responsabilidade do Super Admin.
- O contexto da unidade deve ser considerado nas operações realizadas dentro dela.

### Pendências — a definir

- O que acontece com os usuários, setores, subsetores, solicitações e equipamentos quando uma unidade é excluída?
- Uma unidade pode ser desativada sem ser excluída? Qual é o comportamento esperado?
- Quais regras determinam se uma unidade está ativa ou inativa?
- Como funciona a situação de contrato regularizado ou irregularizado mencionada no fluxo de administração de unidades?
- Quais dados e operações devem ser isolados obrigatoriamente entre unidades?

---

## 6.2 Setor

**O que representa:**  
Uma divisão da unidade industrial utilizada para organizar a localização dos equipamentos e a responsabilidade dos Líderes.

### Regras de negócio

- Todo setor pertence a uma unidade.
- Um setor pode possuir vários subsetores.
- Cada setor possui um Líder responsável, conforme a definição atual do negócio.
- O setor pode ser utilizado como destino de uma solicitação.
- O setor pode ser a origem ou o destino de uma movimentação.
- O setor participa da definição da localização atual de um equipamento.
- O Líder pode solicitar a movimentação de equipamentos que estão sob responsabilidade do seu setor.
- O Líder do setor de destino é responsável por aceitar ou recusar uma movimentação recebida.
- Os equipamentos que receberam baixa deixam de aparecer em “Meu setor” e passam a aguardar a conferência de saída pela Portaria.

### Pendências — a definir

- Um setor pode ficar sem Líder responsável? Se sim, como ficam as solicitações e movimentações destinadas a ele?
- O que acontece quando o Líder responsável é desativado ou removido?
- O que acontece quando um setor que possui equipamentos ou histórico de movimentações precisa ser excluído?
- É permitido alterar o nome ou a estrutura de um setor que já possui operações registradas?
- Existe alguma regra para impedir a movimentação de um equipamento para o mesmo setor em que já se encontra?

---

## 6.3 Subsetor

**O que representa:**  
Uma localização específica dentro de um setor da unidade.

### Regras de negócio

- Todo subsetor pertence a um setor.
- Um subsetor pode ser utilizado como destino de uma solicitação.
- Um subsetor pode ser a origem ou o destino de uma movimentação.
- O subsetor participa da definição da localização atual do equipamento.
- Um equipamento dentro da planta deve possuir um setor e um subsetor atuais definidos.
- O subsetor pode possuir um posicionamento no mapa industrial, quando aplicável.
- Ao concluir uma movimentação, o setor e o subsetor de destino passam a representar a localização atual do equipamento.

### Pendências — a definir

- O que acontece quando um subsetor que possui equipamentos é excluído?
- É permitido excluir ou alterar um subsetor que possui movimentações registradas?
- Um subsetor pode ficar temporariamente sem setor associado? A definição atual indica que ele pertence a um setor, mas não descreve esse cenário.
- Como o sistema deve tratar equipamentos quando um subsetor muda de setor?
- O posicionamento no mapa industrial é obrigatório para todos os subsetores ou somente para aqueles representados no mapa?

---

## 6.4 Empresa Terceirizada

**O que representa:**  
Empresa responsável pelos equipamentos que entram e circulam dentro da indústria.

### Regras de negócio

- A empresa terceirizada pode criar solicitações para entrada de equipamentos na indústria.
- A empresa terceirizada deve informar o setor e o subsetor de destino, a previsão de chegada, o motorista, o veículo e os equipamentos associados à solicitação.
- A empresa terceirizada acompanha os estados das próprias solicitações.
- A empresa terceirizada pode editar uma solicitação somente nos estados permitidos.
- A empresa terceirizada pode cancelar uma solicitação nos estados em que o cancelamento é permitido.
- Uma solicitação cancelada pode ser excluída do histórico da empresa terceirizada.
- A empresa terceirizada acompanha os equipamentos associados às suas operações, incluindo aqueles que estão dentro da planta e os que já saíram.
- Quando uma solicitação é recusada pelo Líder ou pela Portaria, a empresa terceirizada pode corrigir as informações e reenviá-la, respeitando as regras do estado correspondente.

### Pendências — a definir

- Quais são os critérios para cadastrar, ativar, desativar ou excluir uma empresa terceirizada?
- O que acontece com as solicitações e os equipamentos quando uma empresa é desativada?
- Uma empresa terceirizada pode ter mais de um usuário?
- Como é definido o acesso de cada usuário aos dados da empresa?
- A exclusão de uma solicitação cancelada remove somente sua exibição do histórico ou elimina também seus registros relacionados? O comportamento de exclusão dos dados não está definido.
- Existem restrições para criar solicitações quando a empresa está inativa ou com alguma irregularidade contratual?

---

## 6.5 Usuário

**O que representa:**  
Pessoa que utiliza o sistema para executar ou acompanhar operações.

### Regras de negócio

- O usuário executa ações de acordo com seu papel no sistema.
- Os papéis definidos são Super Admin, Gestor, Líder de Setor, Portaria e Terceirizada.
- O usuário pertence a uma unidade conforme seu contexto de acesso.
- Quando exerce a função de Líder, o usuário pode estar associado a um setor.
- O Líder de Setor analisa solicitações destinadas ao seu setor.
- O Líder de Setor controla os equipamentos do seu setor e pode iniciar ou receber movimentações.
- A Portaria realiza a conferência física e a liberação das operações de entrada e saída.
- O Gestor acompanha as operações da unidade, administra sua estrutura e consulta informações de monitoramento e auditoria.
- O Super Admin administra as unidades e acompanha informações gerais do sistema.
- A Portaria pode ser acessada por funcionários que realizam o controle de entrada e saída, não apenas pelo Líder do setor Portaria.
- A matrícula é utilizada para confirmar ações específicas, como a liberação de entrada ou saída pela Portaria e a confirmação de movimentações pelos Líderes.

### Pendências — a definir

- Quais ações cada papel pode executar e quais ações são proibidas?
- Como são definidas as permissões de um usuário que possui mais de um papel, caso essa situação seja permitida?
- Um usuário pode estar vinculado a mais de uma unidade?
- Um Líder pode ser responsável por mais de um setor?
- Como ocorre a substituição de um Líder responsável?
- Quais regras se aplicam à criação, edição, desativação, exclusão e recuperação de acesso de usuários?
- Como o sistema valida a matrícula informada e o que acontece quando ela é inválida?
- A matrícula precisa corresponder ao usuário autenticado em todas as ações que a exigem? A documentação indica seu uso como confirmação, mas não formaliza todos os critérios de validação.

---

## 6.6 Solicitação

**O que representa:**  
Pedido de uma empresa terceirizada para levar equipamentos para dentro da indústria.

### Regras de negócio

**Criação e informações**

- A solicitação é criada pela empresa terceirizada.
- Deve conter o setor e o subsetor de destino, a previsão de chegada, o nome do motorista, a placa do veículo e os equipamentos associados.
- Cada equipamento deve ser cadastrado individualmente, com foto, nome, marca, modelo, número de série, condição e descrição de avarias.
- O envio não deve ser permitido quando os dados obrigatórios estiverem incompletos.
- Após o envio, a solicitação entra em `Análise (Líder)` e fica disponível para o Líder do setor de destino.

**Análise e aprovação**

- O Líder do setor de destino analisa as informações da solicitação e dos equipamentos.
- O Líder pode aprovar ou recusar a solicitação.
- A recusa pelo Líder exige o registro de um motivo.
- Quando aprovada, a solicitação passa para `Autorizado` e fica disponível para a conferência de entrada pela Portaria.
- Quando recusada pelo Líder, a solicitação passa para `Recusado (Líder)` e a empresa terceirizada pode editar e reenviar a solicitação.
- A aprovação ou recusa deve refletir o resultado correspondente para a empresa terceirizada.

**Edição e cancelamento**

- A solicitação pode ser editada enquanto estiver em `Análise (Líder)`.
- Depois da aprovação do Líder, a solicitação não pode mais ser editada, salvo quando uma recusa posterior permitir sua edição.
- Uma solicitação em `Recusado (Líder)` pode ser editada, cancelada ou reenviada.
- Uma solicitação em `Recusado (Portaria)` pode ser editada, cancelada ou reenviada para nova análise do Líder.
- A solicitação pode ser cancelada enquanto estiver em `Análise (Líder)` ou após as recusas que permitem cancelamento.
- Uma solicitação cancelada pode ser removida do histórico apresentado à empresa terceirizada.

**Entrada e permanência na planta**

- A Portaria deve conferir os dados da solicitação, o motorista, o veículo, o agendamento e os equipamentos transportados.
- Se houver divergência na entrada, a Portaria registra o motivo e a solicitação passa para `Recusado (Portaria)`.
- Quando a entrada é liberada, a solicitação passa para `Dentro da Planta`.
- A solicitação permanece ativa enquanto os equipamentos associados estiverem em operação na planta.
- A baixa de um equipamento, isoladamente, não significa que a solicitação inteira foi finalizada.
- A saída é considerada concluída após a confirmação da Portaria.
- Após a conclusão da saída, a solicitação passa para `Finalizado`.

**Saída recusada**

- Se a Portaria identificar uma divergência na conferência de saída, a solicitação passa para `Recusado (Saída)`.
- O motivo da recusa deve ser apresentado nos detalhes da solicitação.
- O Gestor acompanha a divergência em “Casos Pendentes”.
- O Gestor é responsável por regularizar a saída após resolver a divergência identificada.
pós a regularização realizada pelo Gestor, o equipamento passa de `Recusado (Saída)` para `Dentro da Planta` e a portaria realiza uma nova conferência.

**Solicitação com múltiplos equipamentos e saídas parciais**

- Uma solicitação pode conter vários equipamentos.
- Os equipamentos podem receber baixa e sair da planta em momentos diferentes, permitindo saídas parciais.
- A baixa é registrada individualmente para cada equipamento.
- A solicitação permanece em `Dentro da Planta` enquanto houver equipamentos associados que ainda não receberam baixa.
- A solicitação só passa para `Finalizado` quando **todos os equipamentos associados a ela tiverem recebido baixa**.
- A baixa de um equipamento não finaliza automaticamente a solicitação quando ainda existem outros equipamentos sem baixa.

### Pendências — a definir

- Em quais condições a Portaria pode cancelar uma entrada e como esse cancelamento se relaciona com `Cancelado`?
- Quais alterações podem ser feitas depois de uma recusa: todos os dados ou somente os dados que originaram a divergência?
- A exclusão de uma solicitação cancelada afeta os equipamentos, as evidências e o histórico de auditoria relacionados?
- Como deve ser tratada uma solicitação cuja previsão de chegada já passou?
- Quais eventos obrigatoriamente precisam ser registrados no histórico da solicitação?

---

## 6.7 Equipamento

**O que representa:**  
Ativo pertencente a uma empresa terceirizada que pode permanecer dentro da indústria durante uma operação.

### Regras de negócio

**Cadastro e identificação**

- O equipamento é cadastrado individualmente pela empresa terceirizada durante a criação da solicitação.
- O cadastro contém foto, nome, marca/fabricante, modelo, número de série, condição e descrição de avarias.
- O equipamento pertence a uma empresa terceirizada.
- O equipamento é associado a uma solicitação durante o processo de entrada.
- As informações cadastradas servem de referência para a conferência física na entrada e na saída da planta.

**Entrada e localização**

- O equipamento passa a ser considerado dentro da planta quando a Portaria libera sua entrada.
- Enquanto estiver dentro da planta, o equipamento deve possuir setor e subsetor atuais definidos.
- A localização atual é determinada pelo setor e subsetor aos quais o equipamento está associado.
- O equipamento pode ser visualizado pela empresa terceirizada, pelo Líder responsável, pela Portaria e pelo Gestor, conforme as áreas de acompanhamento definidas para cada papel.
- Estar na Portaria não significa necessariamente que o equipamento esteja aguardando saída: ele também pode estar associado ao setor Portaria após uma movimentação interna.

**Movimentação**

- O equipamento pode ser movimentado entre setores e subsetores.
- Quando o Líder de origem confirma o envio, o equipamento passa para `Saindo`.
- Quando chega ao fluxo do setor de destino, passa para `Chegando`, aguardando a decisão do Líder de destino.
- A localização atual só é atualizada para o destino depois que a movimentação é aceita.
- Se a movimentação for recusada, o equipamento retorna para `Em Planta` no setor de origem.
- Enquanto aguarda a aceitação da movimentação, o equipamento não deve ficar sem uma localização de referência.

**Baixa e saída**

- O Líder do setor onde o equipamento está pode dar baixa enquanto o equipamento estiver em `Em Planta`.
- Após a baixa, o equipamento deixa de aparecer em “Meu setor” e passa a aguardar a conferência de saída pela Portaria.
- O equipamento é encaminhado para a fila de saída da Portaria, aguardando a conclusão do processo de saída.
- Enquanto aguarda na fila, o equipamento ainda não é considerado fisicamente fora da planta.
- A baixa não significa que o equipamento já saiu da planta.
- O equipamento só é considerado fora da planta depois que a Portaria confirma a saída.
- Após a confirmação da saída, o equipamento passa para `Fora de Operação (Saída)`.

### Pendências — a definir

- A baixa pode ser cancelada ou revertida?
- Como deve ser tratado um equipamento cuja saída foi recusada pela Portaria?
- Um equipamento pode participar de mais de uma movimentação simultaneamente?
- Como devem ser tratadas alterações no cadastro de um equipamento depois da aprovação da solicitação ou depois de sua entrada na planta?
- O número de série é obrigatório e deve ser único? A documentação registra esse dado, mas não define a validação.
- Como funciona o vínculo do mesmo equipamento com solicitações posteriores, após sua saída?
- Quais são as regras para corrigir a localização atual caso seja identificada uma informação incorreta?
- Qual é o comportamento de um equipamento quando a solicitação associada possui vários equipamentos e somente um deles recebe baixa ou sai da planta?

---

## 6.8 Movimentação

**O que representa:**  
Transferência de um equipamento entre setores ou subsetores da indústria.

### Regras de negócio

**Início da movimentação**

- A movimentação é iniciada pelo Líder do setor onde o equipamento está.
- Para iniciar a movimentação, é necessário informar o setor e o subsetor de destino, a evidência fotográfica, uma observação da evidência (opcional) e a matrícula do Líder do setor de origem para confirmar a movimentação.
- A movimentação deve estar relacionada a um equipamento.
- A movimentação registra a localização de origem, a localização de destino e a data e hora.
- O equipamento passa para `Saindo` após a confirmação do Líder de origem.

**Chegada e decisão do destino**

- O equipamento passa para `Chegando` quando a movimentação aparece no fluxo do setor de destino.
- O Líder responsável pelo setor de destino pode aceitar ou recusar o recebimento.
- O aceite exige a confirmação por matrícula do Líder de destino.
- Ao aceitar a movimentação, o Líder de destino confirma o recebimento do equipamento.
- enquanto o Líder de destino não aceitar nem recusar a movimentação, o equipamento permanece no estado `Saindo`.
- o Líder de origem pode cancelar a movimentação. Após o cancelamento, o equipamento deixa de ser exibido para o Líder de destino.
- O estado do equipamento retorna para `Em Planta`.

**Movimentação aceita**

- Quando a movimentação é aceita, o equipamento passa a ser associado ao setor e subsetor de destino.
- O equipamento volta a ser apresentado como `Em Planta` no setor de destino.
- O equipamento deixa de aparecer em “Meu setor” do Líder de origem e passa a aparecer em “Meu setor” do Líder de destino.
- A movimentação deve aparecer no histórico de movimentações dos dois setores envolvidos.
- O Gestor deve visualizar a localização atualizada nas áreas de Monitoramento, Mapa Industrial e Auditoria e Rastro.

**Movimentação recusada**

- O Líder de destino pode recusar o recebimento.
- Após a recusa, o equipamento retorna para `Em Planta` no setor de origem.
- O equipamento deixa de aparecer no fluxo de chegada do Líder de destino.
- Atualmente, a recusa não é registrada no histórico de movimentações.

**Portaria como destino**

- A Portaria pode ser o destino de uma movimentação interna.
- Quando isso acontece, o equipamento é tratado como parte do setor Portaria e pode ser visualizado no painel do Líder desse setor.
- Essa situação é diferente de um equipamento enviado à Portaria para conferência de saída após receber baixa.
- O fato de o equipamento estar na Portaria não determina, por si só, que ele esteja no fluxo de saída da planta.

### Pendências — a definir

- Existe prazo para aceitar ou recusar? A documentação atual não define um prazo.
- Em que momento exato o equipamento é considerado fisicamente no destino: ao registrar a chegada ou somente após o aceite?
- A recusa deve continuar fora do histórico ou deverá ser registrada para rastreabilidade?
- Quais dados devem ser registrados quando uma movimentação é cancelada?
- Como impedir movimentações simultâneas para destinos diferentes?
- Existe alguma restrição para movimentar um equipamento para o mesmo setor ou subsetor atual?
- Como deve ser tratada uma movimentação com destino ao setor Portaria que permaneça pendente?
- A matrícula confirma apenas a ciência da movimentação ou também representa uma confirmação de responsabilidade pelo equipamento? A documentação atual não detalha esse significado.
---


# 7. Conceitos principais do negócio

## 7.1 Solicitação

Representa o pedido de uma empresa terceirizada para levar equipamentos para dentro da indústria.

Uma solicitação contém, entre outras informações:

- Empresa terceirizada.
- Setor de destino.
- Subsetor de destino.
- Data agendada.
- Horário previsto.
- Motorista.
- Placa do veículo.
- Equipamentos da remessa.

A solicitação possui um ciclo de vida e pode assumir diferentes estados.

Estados identificados atualmente:

```text
Análise pelo Líder
        ↓
Autorizado
        ↓
Dentro da Planta
        ↓
Finalizado
```

Também existe o estado:

```text
Cancelado
```

A regra exata de transição entre todos os estados ainda precisa ser formalizada.

---

## 7.2 Equipamento

Representa um ativo pertencente a uma empresa terceirizada que pode permanecer dentro da indústria durante uma operação.

São registrados:

- Foto.
- Nome.
- Marca/Fabricante.
- Modelo.
- Número de série.
- Condição.
- Descrição de avarias.

O equipamento possui um histórico de localização e movimentações enquanto estiver dentro da planta.

---

## 7.3 Setor e Subsetor

A indústria possui setores principais e subsetores.

Os equipamentos são associados a um subsetor enquanto estão dentro da planta.

Os subsetores também são utilizados como destino das solicitações e das movimentações internas.

---

## 7.4 Movimentação

Representa a transferência de um equipamento de um setor/subsetor para outro.

Uma movimentação registra:

- Equipamento.
- Setor de origem.
- Setor/subsetor de destino.
- Evidência fotográfica.
- Observação.
- Matrícula do responsável pela movimentação.
- Data e hora.
- Líder responsável pela aprovação/aceite.

A movimentação possui pelo menos os estados identificados na interface:

```text
SAINDO
   ↓
CHEGANDO
   ↓
Aceita / Recusada
```

A regra completa desses estados ainda precisa ser formalizada.

---

# 8. Ciclo de vida de uma operação

Uma operação envolvendo equipamentos de uma terceirizada pode ser entendida em cinco grandes etapas:

### 1. Solicitação

A terceirizada informa que deseja levar equipamentos para a indústria.

### 2. Aprovação

O Líder do Setor analisa a solicitação e os equipamentos e decide se a solicitação pode prosseguir.

### 3. Entrada

A Portaria confere a solicitação aprovada e os equipamentos apresentados no momento da chegada.

Se estiver tudo de acordo, a entrada é liberada.

Caso exista alguma irregularidade, a Portaria pode registrar uma divergência ou cancelar a entrada.

### 4. Operação dentro da planta

Os equipamentos passam a ser considerados ativos dentro da planta.

Durante a operação, podem permanecer no setor de destino ou serem movimentados para outros setores.

### 5. Saída

Quando o equipamento não precisa mais permanecer na indústria, o Líder do Setor pode dar baixa para a saída.

A Portaria então confere e libera a saída.

Após a saída, o equipamento passa a fazer parte do histórico de ativos finalizados daquela operação.

---

# 9. Rastreabilidade

O sistema mantém informações para permitir rastrear a permanência dos equipamentos dentro da indústria.

O histórico pode relacionar:

```text
Empresa terceirizada
      ↓
Solicitação / Check-in
      ↓
Equipamentos
      ↓
Setor / Subsetor
      ↓
Movimentações
      ↓
Saída
```

Para cada equipamento podem ser consultados:

- Dados de identificação.
- Condição.
- Último setor.
- Quantidade de movimentações.
- Histórico de movimentações.
- Setor de origem.
- Setor de destino.
- Data e hora.
- Líder relacionado à movimentação.
- Evidências registradas.
---

# 10. Auditoria

O Gestor pode consultar o histórico operacional de uma empresa terceirizada.

A auditoria reúne informações como:

- Total de contratos/entradas analisados.
- Ativos atuais na planta.
- Ativos finalizados.
- Status da empresa na planta.
- Histórico de acessos e validações.
- Histórico de movimentações por equipamento.

Essas informações podem ser utilizadas para gerar um relatório de auditoria e rastreabilidade em PDF.

---

# 11. Relatórios e acompanhamento

O Gestor possui uma visão consolidada da operação da unidade.

Entre os indicadores identificados estão:

- Solicitações pendentes.
- Ativos atualmente na planta.
- Média de movimentações.
- Volume de requisições.
- Volume de movimentações.
- Total de equipamentos na planta.
- Dados consolidados por empresa terceirizada.

Essas informações podem ser utilizadas para acompanhamento operacional e geração de relatórios.

---

# 12. Administração da unidade

Além do processo de entrada e movimentação de equipamentos, o Gestor administra a estrutura necessária para a operação:

```text
Unidade
 ├── Setores
 │    └── Subsetores
 │
 ├── Usuários
 │    ├── Líderes
 │    └── Portaria
 │
 └── Mapa Industrial
      └── Subsetores
```

O Super Admin atua acima dessa estrutura, administrando as unidades e seus usuários.

---

# 13. Fluxos de negócio

## 13.1 Status dos fluxos

| Fluxo | Status | Observação |
|---|---|---|
| **01 — Criação de uma solicitação** | ✅ Detalhado | Fluxo definido |
| **02 — Análise e aprovação pelo Líder** | ✅ Detalhado | Fluxo definido |
| **03 — Entrada na Portaria** | ✅ Detalhado | Fluxo definido |
| **04 — Equipamento dentro da planta** | ✅ Detalhado | Fluxo definido |
| **05 — Movimentação entre setores** | ✅ Detalhado | Inclui aceite, recusa e cancelamento |
| **06 — Baixa do equipamento** | ⚠️ Detalhado parcialmente | Existe comportamento não definido após a baixa |
| **07 — Saída pela Portaria** | ✅ Detalhado | Fluxo definido |

## 13.2 Fluxos detalhados

### Fluxo 01 — Criação de uma solicitação

1. Quem inicia?
      
      R: A terceirizada

2. Quais informações são obrigatórias?
      
      R: Setor e Sub-setor de destino, Previsão de Chegada, Nome do Motorista, Placa do Veículo e os Equipamentos

3. Como os equipamentos são cadastrados?

      R: Os equipamentos são cadastrados pela terceirizada durante a criação da solicitação. Cada equipamento é adicionado à remessa individualmente. Para cada equipamento, informa foto, nome, marca, modelo, número de série, condição (usado, novo ou danificado) e descrição de avarias. Os equipamentos ficam vinculados à solicitação e posteriormente são utilizados pelo Líder para análise e pela Portaria para conferência da entrada.

4. Qual é o estado inicial?

      R: Análise (líder).

5. O que acontece depois do envio?

      R: Após o envio, a solicitação é registrada com o estado “Em análise” e fica disponível para o Líder do setor de destino analisar e aprovar.

6. Quando a solicitação pode ser editada?
      
      R: A solicitação pode ser editada enquanto estiver nos estados “Análise (líder)”, “Recusado (Líder)” ou “Recusado (Portaria)”. Após a aprovação do Líder, quando estiver “Autorizado”, não pode mais ser editada.

7. Quando a terceirizada pode cancelar a solicitação?

      R: A terceirizada pode cancelar a solicitação enquanto estiver nos estados “Análise (líder)”, “Recusado (Líder)” ou “Recusado (Portaria)”. Após a aprovação do Líder, quando estiver “Autorizado”, não pode mais ser cancelada.

8. Quando a terceirizada pode excluir uma solicitação do histórico?

      R: A solicitação pode ser excluída do histórico se estiver com o estado "Cancelado".

9. O que acontece quando faltam dados obrigatórios?

      R: A solicitação não pode ser enviada enquanto houver informações obrigatórias não preenchidas. É exibido um alerta e o formulário mantém o envio indisponível até que todos os dados obrigatórios sejam preenchidos.

---

### Fluxo 02 — Análise e aprovação pelo Líder

1. Como a solicitação chega ao Líder?

      R: Após ser enviada pela terceirizada, a solicitação fica disponível na página “Aprovações” do Líder do setor de destino, aparecendo como uma solicitação pendente para análise.

2. O que ele precisa verificar?

      R: O Líder verifica se o setor e subsetor de destino estão de acordo com o que foi combinado anteriormente e se os equipamentos informados na solicitação correspondem ao que foi combinado.

3. Quais informações influenciam a decisão?

      R: A solicitação pode ser recusada caso o setor de destino seja diferente do combinado ou caso os equipamentos informados não correspondam ao que foi acordado com o Líder.

4. O que acontece ao aprovar?

      R: É exibido um alerta de confirmação e solicitação some para o líder, no painel da terceirizada o estado fica "Autorizado" e no painel da portaria a solicitação entra na fila de triagem da entrada na planta.

5. O que acontece ao recusar, caso exista essa possibilidade?

      R: É exibido uma janela para o líder justificar o porque da recusa e ao confirmar no painel da terceirizada o estado fica "Recusado (Líder)" e ao ver os detalhes da solicitação mostra o motivo.

6. Quem recebe a informação da decisão?

      R: No caso de aprovação a terceirizada, a portaria e o gestor e em caso de recusa apenas a terceirizada.

7. O que acontece depois de uma recusa?

      R: No painel da terceirizada, o estado passa para “Recusado (Líder)”. A terceirizada pode cancelar a solicitação ou editá-la e reenviá-la para uma nova análise do Líder.

---

### Fluxo 03 — Entrada na Portaria

1. Como uma solicitação aprovada chega à Portaria?

      R: Após a aprovação do líder do setor, a solicitação fica disponível em “Entrada na planta” do painel da portaria, aparecendo em Fila de Triagem para análise.

2. O que precisa ser conferido?

      R: É conferido se o setor e subsetor de destino estão de acordo com o que foi informado ao motorista e se os equipamentos informados na solicitação correspondem aos equipamentos transportados.

3. Como equipamentos são comparados com a solicitação?

      R: O funcionário da portaria abre a solicitação e verifica se as informações dos equipamentos batem com o que está com o motorista.

4. O que acontece quando existe divergência?

      R: É exibido uma janela para informar o porque da divergência e um uma mensagem para entrar em contato com o líder ou o gestor e ao confirmar, no painel da terceirizada o estado fica "Recusado (Portaria)", ao ver os detalhes da solicitação mostra o motivo, o contato com o líder ou o gestor é para eles entrarem em contato com a terceirizada para editar ou cancelar aquela solicitação, e no caso do gestor é informado a divergência em Casos Pendentes no seu painel.

5. O que acontece quando a entrada é cancelada?

      R: É exibido uma janela para informar o porque do cancelamento, no painel da terceirizada o estado fica "Cancelado", ao ver os detalhes da solicitação mostra o motivo.

6. O que acontece quando a entrada é liberada?

      R: O funcionário informa sua matricula em "Matrícula de Confirmação" e é exibido um alerta de Entrada Confirmada, a solicitação vai para "em planta" do painel da portaria, no painel da terceirizada o estado fica "Dentro da Planta", no painel do líder do setor em "meu setor" mostra os equipamentos e no painel do gestor some a solicitação do Avisos de Entrada, altera o número de Ativos no Pátio, em monitoramento consta o(s) equipamentos no subsetor, no mapa industrial mostra um ícone do subsetor indicando o equipamento, em auditoria e rastro no histórico daquela terceirizada é adicionado um novo Check-in Realizado e em relatórios os status daquela terceirizada mundão(Total Requisições e Eq. na Planta).

7. Quando o equipamento passa a ser considerado "dentro da planta"?

      R: quando a solicitação é liberada para entrada.

8. Depois que uma solicitação é recusada pela Portaria, ela pode ser reenviada para uma nova análise?

      R: Sim, caso seja editada e reenviada, a solicitação retorna para o estado Análise (líder) e deverá ser aprovada novamente pelo Líder do setor antes de poder ser apresentada novamente à Portaria.

---

### Fluxo 04 — Equipamento dentro da planta

1. Como o equipamento é associado ao setor/subsetor?

      R: O equipamento é associado ao setor e subsetor definidos na solicitação. Após a entrada na planta ser liberada, ele passa a ser considerado localizado nesse subsetor.

2. Qual é o estado do equipamento?

      R: Em Planta.

3. Quem pode visualizar o equipamento?

      R: A terceirizada, o gestor, o líder do setor e a portaria.

4. Quais informações representam sua localização atual?

      R: A localização atual do equipamento é representada pelo setor e subsetor em que ele está registrado dentro da planta.

5. Como o sistema identifica que ele está atualmente na planta?

      R: Pelo seu estado e setor atual.

6. O equipamento pode mudar de setor/subsetor?

      R: Sim. A movimentação ocorre por meio do processo de transferência entre setores/subsetores.

7. O que acontece com o equipamento quando ele é movimentado?

      R: No painel do líder durante a movimentação, o equipamento fica como Saindo no setor/subsetor de origem e como Chegando no setor/subsetor de destino. Para o gestor, o Monitoramento apresenta os dois estados, indicando a origem e o destino da movimentação.

8. O equipamento pode ficar temporariamente sem localização definida?

      R: Não. Um equipamento em planta deve sempre possuir um setor e um subsetor como localização atual.

9. O que acontece com o equipamento quando ele recebe baixa para saída?

      R: Após receber baixa para saída, o equipamento deixa de ser exibido no painel "Meu setor" do Líder. A movimentação fica registrada no painel Movimentações. Na Portaria, a solicitação aparece em Saída da planta para conferência. Para o Gestor, o equipamento permanece visível no Monitoramento e no Mapa industrial, associado à Portaria e com estado Baixa.

10. O histórico de movimentações é mantido?

      R: Sim. Para os Líderes, o histórico apresenta os eventos de localização relacionados ao seu setor, incluindo a entrada inicial pela Portaria, movimentações para outros setores, retornos ao seu setor e baixa dos equipamentos para saída da planta. Para o Gestor, é mantido o histórico completo dos eventos de localização dos equipamentos pela indústria.
---

### Fluxo 05 — Movimentação entre setores

1. Quem pode iniciar uma movimentação?

      R: Os Líderes dos setores podem iniciar movimentações de equipamentos entre setores/subsetores.

2. Como o destino é escolhido?

      R: é selecionado o setor e subsetor de destino ao iniciar uma movimentação.

3. O que precisa ser informado?

      R: É necessário informar o setor e subsetor de destino, a evidência fotográfica, uma observação da evidência (opcional) e a matrícula do Líder do setor de origem para confirmar a movimentação.

4. Quando o equipamento passa para o estado SAINDO?

      R: Quando é confirmado a transferência pelo líder do setor de origem.

5. Quando passa para CHEGANDO?

      R: O equipamento passa para CHEGANDO quando a movimentação é disponibilizada para o Líder do setor de destino.

6. Como o Líder do setor de destino recebe a movimentação?

      R: no painel "meu setor" do líder é mostrado o equipamento com o status chegando e com a opção de "aceitar" ou "recusar".

7. Como ele aceita ou recusa?

      R: Ao aceitar a movimentação, o Líder informa sua própria matrícula para confirmar a ciência e o recebimento do equipamento. A recusa não exige matrícula, apenas a confirmação da ação.

8. O que acontece depois da aceitação?

      R: o equipamento passar a estar no painel "meu setor" do líder do setor de destino com o estado "em planta" enquanto do painel do líder do setor de origem não é exibido mais e a movimentação fica registrada no painel "movimentações" de ambos os lideres e para o gestor é atualizado a localização do equipamento no painel de "monitoramento", "mapa industrial" e "auditoria e rastro".

9. O que acontece depois da recusa?

      R: O equipamento não é mais exibido no painel do líder do setor de destino e o estado volta para "em planta" no painel do líder do setor de origem, e a recusa não é registrada no histórico de movimentações.

10. Como o setor atual do equipamento é atualizado?

      R: O setor atual do equipamento é atualizado após a movimentação ser concluída e aceita pelo Líder do setor de destino, passando a registrar o novo setor e subsetor como sua localização atual.

11. Um equipamento pode permanecer na Portaria após a entrada na planta?

      R: Sim.

12. Como esse equipamento é identificado enquanto estiver na Portaria?

      R: Quando o equipamento estiver na Portaria por baixa para saída, ele será controlado pelo painel de entrada e saída da Portaria. Quando estiver na Portaria como destino de uma movimentação interna, será tratado como um equipamento do setor da Portaria e exibido no painel do Líder desse setor, seguindo o mesmo funcionamento dos demais setores.

13. O que acontece se o Líder do setor de destino não aceitar a movimentação?

      R: Não existe um prazo definido para o Líder do setor de destino aceitar a movimentação. Enquanto estiver pendente, o Líder do setor de origem pode cancelar a movimentação.

14. O que acontece se o Líder do setor de origem cancelar a movimentação?

      R: O equipamento volta para o estado "em planta" no setor e subsetor de origem, deixa de aparecer no setor de destino e a movimentação cancelada não é registrada no histórico de Movimentações.

---

### Fluxo 06 — Baixa do equipamento

1. Quem pode solicitar a baixa?

      R: O líder do setor em que o equipamento está

2. Em que momento ela pode acontecer?

      R: A baixa pode ser solicitada enquanto o equipamento estiver no setor e com o estado "em planta".

3. O que muda no equipamento?

      R: O equipamento deixa de ser exibido no painel "Meu setor" do Líder e a baixa fica registrada nas "Movimentações" do setor, indicando que o equipamento foi encaminhado para a Portaria e está aguardando a saída da planta.

4. O que muda na solicitação?

      R: A solicitação permanece com o estado Dentro da Planta para a Terceirizada e EM OPERAÇÃO para o Gestor até que a saída do equipamento seja confirmada pela Portaria.

5. Quando o equipamento passa a estar apto para saída?

      R: O equipamento passa a estar apto para saída quando o Líder do setor realiza a baixa, encaminhando o equipamento para a Portaria.

6. O que acontece se o equipamento não for levado à Portaria após a baixa?

      R: Não existe um comportamento definido para essa situação.

---

### Fluxo 07 — Saída pela Portaria

1. Como a Portaria identifica equipamentos aguardando saída?

      R: Os equipamentos aguardando saída são identificados no painel "Saída da planta" da Portaria.

2. O que precisa ser conferido?

      R: A Portaria deve conferir se os equipamentos apresentados para saída correspondem aos equipamentos registrados na solicitação.

3. Quando fotos são registradas?

      R: As fotos são registradas quando os equipamentos chegam à Portaria, como evidência do estado em que se encontram no momento da saída.

4. Como divergências são tratadas, caso existam?

      R: É exibido uma janela para informar o porque da divergência e um uma mensagem para entrar em contato com o líder ou o gestor e ao confirmar, no painel da terceirizada o estado fica "Recusado (Saída)", ao ver os detalhes da solicitação mostra o motivo e no caso do gestor é informado a divergência em Casos Pendentes no seu painel.

5. O que acontece quando a saída é liberada?

      R: Ele não é exibido mais no painel da portaria e é registrado no histórico da portaria, no painel "meus equipamentos" da terceirizada é exibido o equipamento em "Já Deu Saída (Finalizado)" e pro gestor no painel de "auditoria e rastro" ao encontrar a solicitação o equipamento está como "Fora de Operação (Saída)"

6. Quando o equipamento passa a ser considerado finalizado/fora da planta?

      R: Quando a portaria confirma a saída 

7. O que acontece após uma Recusa (Saída)?

      R: Após a recusa, o Gestor deve investigar o motivo da divergência e tomar as medidas necessárias para resolver a situação. Após a resolução, a saída poderá ser liberada pela Portaria.

8. O que acontece depois que o Gestor resolve a situação de uma Recusa (Saída)?

      R: O equipamento retorna para a fila de Saída da planta da Portaria para uma nova conferência.

9. A saída pode ser cancelada pela Portaria depois de iniciada?

      R: Não existe atualmente um comportamento definido para essa situação.

---

## 13.3 Fluxos ainda não detalhados

### Fluxo 08 — Cancelamento de uma operação

Descrever:

- Quem pode cancelar.
- Em quais estados pode ocorrer.
- O que acontece com a solicitação.
- O que acontece com os equipamentos relacionados.
- O que aparece no histórico.

---

### Fluxo 09 — Rastreabilidade de um equipamento

Descrever como é possível reconstruir:

```text
Entrada
  ↓
Setor inicial
  ↓
Movimentação 1
  ↓
Movimentação 2
  ↓
...
  ↓
Saída
```

Também definir quais eventos precisam obrigatoriamente ser registrados.

---

### Fluxo 10 — Auditoria de uma empresa terceirizada

Descrever:

- Como uma empresa é selecionada.
- Quais operações são consideradas.
- Como são calculados os ativos atuais.
- Como são identificados os ativos finalizados.
- Como os check-ins são relacionados aos equipamentos.
- Como as movimentações são apresentadas.
- Como o relatório é gerado.

---

### Fluxo 11 — Administração da equipe

Descrever:

- Como um Gestor cadastra um colaborador.
- Como funciona o convite.
- Quais funções podem ser atribuídas.
- Como o setor/subsetor é associado ao usuário.
- Como ocorre edição.
- Como ocorre desativação.
- Como ocorre exclusão.
- Como funciona o reset de senha.

---

### Fluxo 12 — Administração de setores

Descrever:

- Como um setor principal é criado.
- Como subsetores são criados.
- Como equipamentos são relacionados aos subsetores.
- O que acontece ao excluir um setor.
- O que acontece ao excluir um subsetor que possui equipamentos.

---

### Fluxo 13 — Administração do mapa industrial

Descrever:

- Como o mapa é criado/configurado.
- Como subsetores são adicionados.
- Como sua posição é definida.
- Como são editados.
- Como equipamentos são relacionados visualmente aos subsetores.

---

### Fluxo 14 — Administração de unidades pelo Super Admin

Descrever:

- Como uma unidade é cadastrada.
- Como sua identidade visual é configurada.
- Como usuários são relacionados à unidade.
- Como a unidade é ativada/desativada.
- O que significa contrato regularizado/irregularizado.
- O que acontece ao excluir uma unidade.

---

## 13.4 Pendências dos fluxos detalhados

### Fluxo 06 — Baixa do equipamento

**PEND-06-01 — Equipamento não levado à Portaria após a baixa**

Após o Líder realizar a baixa, o equipamento:
- continua disponível em Saída da planta para a Portaria;
- não é mais exibido em Meu setor do Líder.

Porém, não existe ainda um comportamento definido para o caso em que o equipamento não seja levado à Portaria.

É necessário definir, por exemplo, se a situação permanece indefinidamente dessa forma ou se existe alguma ação, prazo, cancelamento ou outra transição de estado.

Status: ⚠️ A definir.

---

# 14. Estados e transições do domínio

### 14.1 Visão consolidada
O sistema possui três conjuntos de estados relacionados, mas com responsabilidades diferentes:

| Conceito | Representa | Exemplo |
|---|---|---|
| **Solicitação** | Situação da solicitação feita pela terceirizada | `Análise (Líder)`, `Autorizado`, `Dentro da Planta` |
| **Equipamento** | Situação atual do equipamento dentro do processo | `Em Planta`, `Saindo`, `Chegando`, `Baixa` |
| **Movimentação** | Situação de uma transferência de equipamento entre setores | `Saindo`, `Chegando`, `Aceita`, `Recusada` |

Os estados não devem ser tratados como uma única sequência. Uma solicitação pode permanecer em determinado estado enquanto seus equipamentos possuem estados próprios, e uma movimentação representa uma operação específica sobre um equipamento.

### 14.2 Estados da Solicitação
A Solicitação representa o processo iniciado pela terceirizada para entrada de equipamentos na planta e acompanha o processo até sua finalização ou cancelamento.

| Estado | Descrição | Próximas situações |
|---|---|---|
| `Análise (Líder)` | Solicitação enviada pela terceirizada e aguardando análise do Líder do setor de destino. | `Autorizado`, `Recusado (Líder)` ou `Cancelado` |
| `Recusado (Líder)` | Solicitação recusada pelo Líder, com motivo registrado. A terceirizada pode editar e reenviar a solicitação. | `Análise (Líder)` ou `Cancelado` |
| `Autorizado` | Solicitação aprovada pelo Líder e aguardando a entrada pela Portaria. | `Dentro da Planta`, `Recusado (Portaria)` ou `Cancelado` |
| `Recusado (Portaria)` | Entrada recusada pela Portaria devido a divergência identificada na conferência. A terceirizada pode editar e reenviar a solicitação, retornando para nova análise do Líder. | `Análise (Líder)` ou `Cancelado` |
| `Dentro da Planta` | Entrada confirmada pela Portaria. A solicitação permanece ativa enquanto os equipamentos estiverem em operação na planta. | `Recusado (Saída)` ou `Finalizado` |
| `Recusado (Saída)` | Saída do equipamento recusada pela Portaria devido a uma divergência na conferência de saída. | A definir conforme regularização da situação |
| `Finalizado` | Processo concluído após a Portaria confirmar a saída do equipamento da planta. | — |
| `Cancelado` | Solicitação cancelada pela terceirizada antes da aprovação ou após uma recusa que permita edição/cancelamento. | — |

**Observação:** Fila de Triagem, Entrada na planta e Saída da planta representam áreas/filas da Portaria e não devem ser tratados como estados da solicitação.

### 14.3 Estados do Equipamento
O Equipamento possui um ciclo de vida próprio, relacionado à sua presença e localização dentro da planta.

| Estado | Descrição |
|---|---|
| `Em Planta` | Equipamento está dentro da planta e associado a um setor e subsetor atuais. |
| `Saindo` | Equipamento está em processo de saída do setor de origem para outra localização ou para a Portaria. |
| `Chegando` | Equipamento está em processo de chegada a um setor de destino e aguarda a confirmação do Líder desse setor. |
| `Baixa` | Líder solicitou a retirada do equipamento do setor e o equipamento está aguardando a conferência de saída pela Portaria. |
| `Fora de Operação (Saída)` | Portaria confirmou a saída do equipamento da planta, encerrando sua operação. |

O estado Em Planta representa a condição operacional do equipamento. Já Saindo, Chegando e Baixa representam situações de transição relacionadas à movimentação ou retirada do equipamento.
A localização atual do equipamento é determinada pelo setor e subsetor aos quais ele está associado.

### 14.4 Estados da Movimentação
A Movimentação representa uma transferência de equipamento entre setores da planta. Ela possui um ciclo próprio, iniciado pelo Líder do setor de origem.

| Estado | Descrição | Responsável pela ação |
|---|---|---|
| `Saindo` | Líder do setor de origem confirmou o envio do equipamento para outro setor. | Líder do setor de origem |
| `Chegando` | Equipamento chegou ao fluxo do setor de destino e aguarda a confirmação do Líder responsável. | Líder do setor de destino |
| `Aceita` | Líder do setor de destino confirmou o recebimento do equipamento. | Líder do setor de destino |
| `Recusada` | Líder do setor de destino recusou o recebimento. O equipamento retorna ao estado `Em Planta` no setor de origem. | Líder do setor de destino |

Para iniciar uma movimentação, é necessário informar:
- setor e subsetor de destino;
- evidência fotográfica;
- observação da evidência, quando necessário;
- matrícula do Líder do setor de origem para confirmação da movimentação.

Quando a movimentação é aceita, o setor e subsetor de destino passam a representar a localização atual do equipamento.

Quando a movimentação é recusada, o equipamento retorna ao estado Em Planta no setor de origem. Atualmente, a recusa da movimentação não é registrada no histórico de movimentações.

### 14.5 Relação entre os estados
Os três conceitos devem ser entendidos da seguinte forma:

```text
SOLICITAÇÃO
    │
    ├── controla o processo de entrada e saída
    │
    └── possui EQUIPAMENTOS
              │
              ├── possui estado atual
              │
              ├── possui setor/subsetor atual
              │
              └── pode possuir MOVIMENTAÇÕES
                         │
                         ├── Saindo
                         ├── Chegando
                         ├── Aceita
                         └── Recusada
```

Essa separação evita utilizar o mesmo estado para representar situações diferentes. Por exemplo, Dentro da Planta representa a situação da solicitação, enquanto Em Planta representa a situação do equipamento. Da mesma forma, Saindo e Chegando estão relacionados principalmente à movimentação do equipamento, e não devem ser confundidos com estados permanentes da solicitação.

---

# 15. Pontos de negócio ainda não definidos

Durante a documentação dos fluxos, devem ser esclarecidas principalmente as regras que não estão explícitas na descrição atual.

Entre elas:

- Quais são exatamente todos os estados de uma solicitação?
- Existe rejeição pelo Líder ou apenas aprovação?
- Quem pode cancelar uma solicitação?
- O que acontece quando a Portaria encontra uma divergência?
- Uma divergência bloqueia obrigatoriamente a entrada?
- O equipamento pode ser alterado depois da aprovação?
- O que acontece com uma movimentação recusada?
- Quando exatamente o setor atual do equipamento é alterado?
- Um equipamento pode ter mais de uma movimentação simultânea?
- Quem pode dar baixa no equipamento?
- A baixa pode ser revertida?
- O que acontece se a Portaria recusar uma saída?
- Quais eventos formam o histórico de rastreabilidade?
- O que diferencia uma solicitação, um check-in, uma remessa e um contrato?
- Quais regras são específicas de uma unidade/tenant?
- Quais informações são obrigatórias para auditoria?

Essas respostas devem ser definidas antes de transformar os fluxos em regras arquiteturais.

---

# 16. Relação com a arquitetura

Este documento representa **o negócio**, e não a estrutura do código.

Os conceitos descritos aqui não determinam automaticamente que cada um deve se tornar:

- uma pasta;
- uma feature;
- um domínio;
- um Context;
- um componente;
- um service;
- uma página.

A arquitetura deve ser definida posteriormente a partir dos processos e regras de negócio identificados neste documento.

Por exemplo:

```text
Business Flow
      ↓
Domínios / capacidades
      ↓
Responsabilidades das camadas
      ↓
Dependências
      ↓
Services / Hooks / Components / Contexts
      ↓
Rotas e páginas
```

O objetivo é evitar que a arquitetura futura simplesmente replique a estrutura atual das telas.
