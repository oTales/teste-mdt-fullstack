# 🎟️ Tickets-MDT (Task Board API)

Um sistema de gerenciamento de tickets e acompanhamento de tarefas (estilo Kanban), desenvolvido sob uma arquitetura limpa e robusta utilizando Laravel 11. O projeto foi desenhado focando em facilidade de ambiente de desenvolvimento (inteiramente Dockerizado) e clareza na manutenção das regras de negócio.

---

## 🏛️ Arquitetura do Projeto

O projeto utiliza **Laravel** em uma arquitetura orientada a domínios (DDD - *Domain-Driven Design*) adaptada. As responsabilidades estão rigorosamente separadas para manter o código organizado à medida em que o sistema cresce:

- **`app/Domains/`**: O coração das regras de negócios. Separado por contextos (ex: `User`, `Ticket`).
  - **Services**: Cuidam da lógica complexa, de formatações de senhas na inserção e envios de e-mail (através dos hooks `beforeSave` / `afterSave`).
  - **Repositories**: Isolam toda comunicação com o Model/Eloquent, sendo a camada preferencial para buscas, paginações e filtros complexos.
- **`app/Common/`**: Classes abstratas (`AbstractService`, `AbstractRepository`, `AbstractController`) que injetam os métodos padrões de CRUD em todos os domínios do sistema sem duplicação de de código.
- **Filas e E-mails**: Ações demoradas (como enviar o e-mail estilizado de "Bem-vindo" ou "Novo Ticket") rodam via filas, captadas pelo **Redis** e visíveis localmente através do **Mailhog**.

---

## 🛠️ Tecnologias
- **PHP 8.4**
- **Laravel 13**
- **MySQL 8.4**
- **Redis 7** (Filas de Emails e Sessões)
- **Nginx**
- **Docker & Docker Compose**

---

## 🚀 Como Rodar o Projeto

Toda a infraestrutura roda através do Docker. Não é necessário ter PHP ou MySQL instalados localmente na sua máquina.

### Pré-requisitos
- [Docker](https://docs.docker.com/get-docker/) instalado e rodando na sua máquina.

### Passo a passo da Instalação

1. **Clone o repositório e acesse a pasta**:
   ```bash
   git clone https://github.com/oTales/teste-mdt-fullstack.git
   cd teste-mdt-fullstack
   cd backend
   ```

2. **Configure as Variáveis de Ambiente**:
   Crie seu `.env` copiando o arquivo base.
   ```bash
   cp .env.example .env
   ```

3. **Suba todos os Containers**:
   Execute o docker-compose para construir a imagem do app e baixar os bancos.
   ```bash
   docker-compose up -d --build
   ```

4. **Instale e Configure o App no Container**:
   Acesse o shell interativo do container principal:
   ```bash
   docker exec -it mdt bash
   ```
   *(Dentro do container, rode)*:
   ```bash
   composer install
   php artisan key:generate
   php artisan migrate --seed
   ```

> 💡 **Dica - Aliases de Terminal:**
> O container `mdt` já vem configurado com alguns atalhos legais para desenvolvimento. Ao invés de digitar `php artisan migrate`, basta digitar **`migrate`**. Ao invés de `php artisan db:seed`, use **`seed`**.

### Portas e Acessos:
* 🌐 **API Base URL**: [http://localhost:8009](http://localhost:8009)
* 📧 **Mailhog (Visualização de e-mails disparados)**: [http://localhost:8025](http://localhost:8025)

---

## 📖 Documentação da API

Você não precisa ler código para testar a API! A documentação está viva e interativa usando **[`Dedoc Scramble`](https://scramble.dedoc.co/)**.

- 🔗 **Interface OpenAPI/Swagger:** [http://localhost:8009/docs/api](http://localhost:8009/docs/api)
  - Tudo interpretado automaticamente em tempo real pelas anotações de PHPDoc, Requests e Responses da sua aplicação.

### Resumo dos Endpoints Principais

Caso precise passar as rotas à um time Front-end de forma rápida, aqui vão as cruciais:

#### 1. Autenticação (Auth)
* **Registro de Usuário** (`POST /api/register`)
  ```json
  {
    "name": "João",
    "email": "joao@example.com",
    "password": "SenhaSegura123!",
    "password_confirmation": "SenhaSegura123!"
  }
  ```
* **Login** (`POST /api/login`) -> Retorna o `token` Bearer (Sanctum).
* **Usuário Autenticado** (`GET /api/me`) -> Headers requerem: `Authorization: Bearer <seu-token>`

#### 2. Tickets (Obrigatório Token Bearer Auth)

* **Listar Tickets (Paginação e Filtros)**
  `GET /api/tickets?search=erro&status=1&priority=2`
  - Filtro flexível para montar tabelas ou listagens Kanban baseadas no status.
* **Recuperar Ticket Específico**
  `GET /api/tickets/{hash}`
* **Criar Novo Ticket**
  `POST /api/tickets`
  ```json
  {
    "subject": "Problema de login",
    "description": "Não consigo alterar a foto de perfil...",
    "priority": 3,
    "status": 1
  }
  ```
* **Atualizar Ticket (ex: Mover Kanban)**
  `PUT /api/tickets/{hash}`
  Serve tanto para alterar descrição profunda quanto para o simples ato de modificar um Status na visualização Kanban.

#### 3. Dashboard
* **Métricas Gerais** (`GET /api/metrics`)
  Retorna quantidades absolutas de tickets por status (ex: total Aberto, em Progresso, Concluído) útil para montar gráficos gerenciais ou os painéis de cabeçalho do Dashboard.
