# Sistema de Gestão de Tickets / Kanban

Um sistema moderno de gestão de tickets e tarefas com visualização em Kanban Board e Tabela, desenvolvido em [Next.js](https://nextjs.org/) (App Router).

## 🚀 Tecnologias Utilizadas

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19)
- **Estilização:** [Tailwind CSS 4](https://tailwindcss.com/) + UI components baseados no [shadcn/ui](https://ui.shadcn.com/)
- **Gerenciamento de Estado/Dados:** [TanStack React Query](https://tanstack.com/query/latest)
- **Formulários e Validação:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Requisições HTTP:** [Axios](https://axios-http.com/)

## 📂 Visão Geral e Estrutura

O aplicativo possui as seguintes funcionalidades principais:

- **Autenticação:** Telas de Login e Registro (`app/(auth)`).
- **Dashboard:** Visão geral com métricas (`app/(dashboard)/dashboard`).
- **Kanban Board:** Gerenciamento visual dos tickets arrastando e soltando cartões (`app/(dashboard)/kanban`).
- **Lista de Tickets:** Tabela detalhada de todos os tickets com funcionalidades de busca e filtros, além da capacidade de visualizar os detalhes, criar, atualizar e excluir, caso o usuário tenha um perfil aplicável.

### Estrutura de Pastas e Organização:

- `/app`: Configuração das rotas da aplicação seguindo o App Router.
- `/components`: Componentes da aplicação divididos por responsabilidade (`layout`, `ui`, `auth`, `tickets`).
- `/hooks`: Hooks customizados, incluindo a integração com a API usando React Query.
- `/lib`: Configurações do Axios, validações Zod e funções utilitárias.
- `/types`: Definições das tipagens de dados usadas no projeto.

## 🛠 Como executar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/en/) (versão 20+ recomendada)
- `npm`, `yarn` ou `pnpm` instaldados.

### Passos:

1. **Clone o repositório ou acesse o diretório do projeto:**
   ```bash
   cd untitledponente
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configure as variáveis de ambiente (se houver):**
   *Crie um arquivo `.env` ou `.env.local` na raiz do projeto com base nas requisições da sua API, como por exemplo, a URL base conectada ao front-end.*

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

5. O aplicativo estará disponível em: [http://localhost:3000](http://localhost:3000).

## 📦 Build de Produção

Para compilar a aplicação para produção rode:

```bash
npm run build
```

E para iniciar a aplicação já em ambiente finalizado de build, utilize:

```bash
npm run start
```

