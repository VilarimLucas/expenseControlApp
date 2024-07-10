# expenseControlApp
App desenvolvido nas aulas de Dispositivos móveis - FATEC COTIA 4º Semestre</br>

Este app é um controle de gastos em que usa técnicas de finanças pessoais para ajudar o usuário a controlar suas despesas.

--------------------

# Backend do Projeto

Este guia irá ajudá-lo a configurar o ambiente de desenvolvimento.

### 1. Clone o Repositório


```bash
git clone https://github.com/VilarimLucas/expenseControlApp.git
```

## [COM DOCKER]

### 1.1 Instalar a Docker
- Instalar o serviço de DOCKER de preferencia com UBUNTU: [docs.docker.com](https://docs.docker.com/engine/install/ubuntu/) 

### 1.2 Rede compartilhada entre os containers
- Os containers precisam estar na mesma rede, execute o seguinte comando:

```wsl

docker network create networkExpenseControl

```
### 1.3 Imagem do SGBD MySQL

- MySQL IMAGE: Pode acessar o DockerHub e pegar a ultima versão disponível em [hub.docker.com](https://hub.docker.com/_/mysql) ou executar o seguinte comando em seu terminal:

```wsl
docker run --name mysql --network networkExpenseControl -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql:8.2
```
### 1.4 Imagem do Interpretador javaScript NODE
- NODE IMAGE: Pode acessar o DockerHub e pegar a ultima versão disponível em [hub.docker.com](https://hub.docker.com/_/node) ou executar os seguintes comandos em seu terminal:

#### 1.4.1 Para buildar o node no repositório local.

```powershell

docker build -t node .

```
#### 1.4.2 Para executar o backend na porta 4000:

```powershell

docker run --name node --network networkExpenseControl -p 4000:4000 node

```

## 2 CONFIGURAÇÃO DE BANCO DE DADOS

Siga os passos abaixo para configurar o ambiente de desenvolvimento do backend.


### 2.1 MIGRATIONS - no terminal do node disponível na Docker

Pode utilizar o Docker desktop para configurar
```powershell

npx sequelize db:create
npx sequelize db:migrate
```
### 2.2 VIEWS

O sistema exige que algumas views sejam criadas no banco de dados, são elas:

- USER EXPENSE, EXPENSE CATEGORY, CATEGORY TAG, USER INCOME and INCOME CATEGORY
```sql

use expenseControlApp;

CREATE VIEW user_expense AS
select eu.id, eu.fk_UserLogin_id, ul.userName, ul.userEmail, ul.userPassword, ul.costOfLiving, ul.totalIncomeUser, eu.fk_Expense_id, e.expenseName, e.isFixedExpense, e.isVariableExpense, e.valueExpense from ExpenseUsers as eu
inner join UserLogins as ul on ul.id = eu.fk_UserLogin_id
inner join Expenses as e on e.id = eu.fk_Expense_id;

CREATE VIEW user_income AS
select ui.id, ui.fk_UserLogin_id, ul.userName, ul.userEmail, ul.userPassword, ul.costOfLiving, ul.totalIncomeUser, ui.fk_Income_id, i.incomeName, i.valueIncome from UserIncomes as ui
inner join UserLogins as ul on ul.id = ui.fk_UserLogin_id
inner join Incomes as i on i.id = ui.fk_Income_id;

CREATE VIEW expense_category AS
select ce.id, ce.fk_Category_id, c.categoryName, ce.fk_Expense_id, e.expenseName, e.isFixedExpense, e.isVariableExpense, e.valueExpense  from CategoryExpenses as ce
inner join Categories as c on c.id = ce.fk_Category_id
inner join Expenses as e on e.id = ce.fk_Expense_id;

CREATE VIEW income_category AS
select ci.id, ci.fk_Category_id, c.categoryName, ci.fk_Income_id, i.incomeName, i.valueIncome from CategoryIncomes as ci
inner join Categories as c on c.id = ci.fk_Category_id
inner join Incomes as i on i.id = ci.fk_Income_id;

CREATE VIEW category_tag AS
select ct.id, ct.fk_Category_id, c.categoryName, ct.fk_Tag_id, t.tagName  from CategoryTags as ct
inner join Categories as c on c.id = ct.fk_Category_id
inner join Tags as t on t.id = ct.fk_Tag_id;


```
### 2.3 TRIGGERS

-  USER EXPENSE
```sql

DELIMITER $

CREATE TRIGGER Tgr_costOfLiving_Insert AFTER INSERT
ON ExpenseUsers
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, Expenses as es SET ul.costOfLiving = ul.costOfLiving + es.valueExpense
WHERE ul.id = NEW.fk_UserLogin_id and es.id = NEW.fk_Expense_id;
END$

CREATE TRIGGER Tgr_costOfLiving_Update AFTER UPDATE
ON Expenses
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, ExpenseUsers as eu SET ul.costOfLiving = ul.costOfLiving + NEW.valueExpense - OLD.valueExpense
WHERE ul.id = eu.fk_UserLogin_id and new.id = eu.fk_Expense_id;
END$

CREATE TRIGGER Tgr_costOfLiving_Delete AFTER DELETE
ON ExpenseUsers
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, Expenses as es SET ul.costOfLiving = ul.costOfLiving - es.valueExpense
WHERE ul.id = OLD.fk_UserLogin_id and es.id = OLD.fk_Expense_id;
END$

DELIMITER ;
```

- USER INCOME
```sql

DELIMITER $

CREATE TRIGGER Tgr_totalIncomeUser_Insert AFTER INSERT
ON UserIncomes
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, Incomes as i SET ul.totalIncomeUser = ul.totalIncomeUser + i.valueIncome
WHERE ul.id = NEW.fk_UserLogin_id and i.id = NEW.fk_Income_id;
END$

CREATE TRIGGER Tgr_totalIncomeUser_Update AFTER UPDATE
ON Incomes
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, UserIncomes as ui SET ul.totalIncomeUser = ul.totalIncomeUser + NEW.valueIncome - OLD.valueIncome
WHERE ul.id = ui.fk_UserLogin_id and new.id = ui.fk_Income_id;
END$

CREATE TRIGGER Tgr_totalIncomeUser_Delete AFTER DELETE
ON UserIncomes
FOR EACH ROW
BEGIN
	UPDATE UserLogins as ul, Incomes as i SET ul.totalIncomeUser = ul.totalIncomeUser - i.valueIncome
WHERE ul.id = OLD.fk_UserLogin_id and i.id = OLD.fk_Income_id;
END$

DELIMITER ;
```

### [EXTRA] Configure o Backend NODE + EXPRESS: ESLINT

```powershell

npx eslint --init
```

- ? <small style="font-weight: lighter">Need to install the following packages: eslint@8.51.0 Ok to proceed (y) : </small><b style="font-size: larger; color: #0366d6" >y</b>

- ? <small style="font-weight: lighter">How would you like to use ESLint: </small><b style="font-size: larger; color: #0366d6" >To check syntax, find problems, and enforce code style</b>

- ? <small style="font-weight: lighter">What type of modules does your project use: </small><b style="font-size: larger; color: #0366d6" >ComonJS (require/exports)</b>

- ? <small style="font-weight: lighter">Which framework does your project use: </small><b style="font-size: larger; color: #0366d6" >None of these</b>

- ? <small style="font-weight: lighter">Does your  project use TypeScript: </small><b style="font-size: larger; color: #0366d6" >NO</b>

- ? <small style="font-weight: lighter">Where does your code run: </small><b style="font-size: larger; color: #0366d6" >Node</b>

- ? <small style="font-weight: lighter">How would you like to define a style for your project: </small><b style="font-size: larger; color: #0366d6" >Answer questions about your style</b>

- ? <small style="font-weight: lighter">What format do you want your config file to be in: </small><b style="font-size: larger; color: #0366d6" >JSON</b>

- ? <small style="font-weight: lighter">What style of indentation do you use: </small><b style="font-size: larger; color: #0366d6" >Spaces</b>

- ? <small style="font-weight: lighter">What quotes do you use for strings: </small><b style="font-size: larger; color: #0366d6" >Single</b>

- ? <small style="font-weight: lighter">What line endings do you use: </small><b style="font-size: larger; color: #0366d6" >Unix</b>

- ? <small style="font-weight: lighter">Do you require semicolons: </small><b style="font-size: larger; color: #0366d6" >Yes</b>

- <small style="font-weight: lighter">eslint@latest</br> ? Would you like to install then now:  </small><b style="font-size: larger; color: #0366d6" >Yes</b>

- ? <small style="font-weight: lighter">Do you require semicolons: </small><b style="font-size: larger; color: #0366d6" >Yes</b>

- ? <small style="font-weight: lighter">Which package manager do you want to use: </small><b style="font-size: larger; color: #0366d6" >npm</b>

## 3 Requisitos Prévios [SEM DOCKER]

- Node.js e npm instalados. Você pode baixá-los em [nodejs.org](https://nodejs.org/).
- MySQL: A configuração é local, mas pode ser facilmente reconfigurada no arquivo backend/config/config.json
    - [mySQL download](https://dev.mysql.com/downloads/installer/)
    - [Interface Workbench](https://dev.mysql.com/downloads/workbench/)

	*Caso opte por não utilizar docker, será necessário reconfigurar o host do banco de dados para localhost ou 127.0.0.1
	
	Disponível no caminho abaixo depois que o repositório git for clonado com o comando mencionado acima:

	```powershell
	cd expenseControlApp/backend/src/config/config.json
	```
### 3.1 Configure o Backend NODE + EXPRESS
```powershell

cd expenseControlApp/backend/src

npm install 

```

* Execute os passo da sessão 2 CONFIGURAÇÃO DE BANCO DE DADOS

### 3.2.1 Para rodar a API no modo DESENVOLVEDOR é necessário o seguinte comando no Powershell
```powershell

npm run dev
```

### 3.2.2 Para rodar a API
```powershell

npm start
```




