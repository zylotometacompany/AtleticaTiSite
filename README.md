# Atlética TI — Frontend

Frontend da aplicação Atlética TI, responsável pela interface do usuário, navegação entre páginas, autenticação, integração com a API e funcionalidades relacionadas à loja, pedidos, pagamentos e ZCard.

## 1. Estrutura do projeto

```text
atletica-ti/
├── src/
│   ├── components/
│   │   └── zCardPreview/
│   ├── constans/
│   │   └── auth.ts
│   ├── hooks/
│   │   ├── store/
│   │   │   ├── comprador/
│   │   │   ├── useDownloadReceipt.ts
│   │   │   ├── useGetStoreOrder.ts
│   │   │   ├── useGetStoresSales.ts
│   │   │   └── useWaitPayment.ts
│   │   ├── useCreateCheckout.tsx
│   │   ├── useGetProduct.tsx
│   │   ├── useViewTransitionNavigate.tsx
│   │   └── useZCardRequest.tsx
│   ├── layout/
│   ├── pages/
│   ├── routes/
│   │   └── CompradorProtectedRoute.tsx
│   ├── service/
│   │   └── api.ts
│   ├── store/
│   ├── types/
│   ├── App.css
│   ├── App.tsx
│   └── index.css
├── .env
└── README.md
```

## 2. Organização das pastas

### `src/components/`

Contém componentes reutilizáveis da aplicação.

Esses componentes podem ser utilizados em diferentes páginas, evitando duplicação de código e facilitando a manutenção.

**`zCardPreview/`**

Agrupa componentes relacionados à pré-visualização do ZCard, como a apresentação visual da carteirinha.

### `src/constans/`

Armazena constantes utilizadas pela aplicação.

**`auth.ts`**

Arquivo destinado a centralizar informações constantes relacionadas à autenticação, como nomes de chaves, identificadores ou configurações de acesso.

### `src/hooks/`

Contém hooks personalizados do React.

Os hooks são utilizados para encapsular lógicas que podem ser reutilizadas por diferentes componentes, mantendo as páginas mais organizadas.

| Hook | Responsabilidade |
|---|---|
| `useCreateCheckout.tsx` | Gerenciar a criação de checkout |
| `useGetProduct.tsx` | Buscar informações de produtos |
| `useZCardRequest.tsx` | Gerenciar solicitações relacionadas ao ZCard |
| `useViewTransitionNavigate.tsx` | Centralizar a navegação com transições visuais |

**`hooks/store/`**

Agrupa hooks relacionados à loja e ao fluxo de compras.

| Hook | Responsabilidade |
|---|---|
| `useDownloadReceipt.ts` | Realizar o download de comprovantes |
| `useGetStoreOrder.ts` | Consultar informações de pedidos |
| `useGetStoresSales.ts` | Consultar vendas da loja |
| `useWaitPayment.ts` | Acompanhar o processamento ou a confirmação de pagamentos |

**`hooks/store/comprador/`**

Diretório reservado às lógicas específicas do fluxo do comprador.

A utilização de hooks permite separar a lógica de negócio e as requisições da interface visual.

### `src/layout/`

Contém os layouts utilizados pelas páginas.

Um layout pode definir elementos compartilhados, como:

- Cabeçalho e menu de navegação.
- Rodapé.
- Área principal de conteúdo.
- Estrutura visual comum entre páginas.

### `src/pages/`

Contém as páginas da aplicação.

Cada página representa uma tela ou funcionalidade acessível pelo usuário.

As páginas podem utilizar componentes, hooks e serviços para apresentar informações e permitir interações.

### `src/routes/`

Contém os componentes relacionados ao controle de navegação e à proteção de rotas.

**`CompradorProtectedRoute.tsx`**

Componente destinado a proteger páginas específicas do comprador.

Sua responsabilidade é verificar se o usuário atende às condições necessárias para acessar determinada rota.

Dependendo da implementação, pode verificar autenticação, sessão ou permissões e redirecionar usuários que não possuem acesso.

Exemplo conceitual:

```tsx
<Route
  path="/comprador/pedidos"
  element={
    <CompradorProtectedRoute>
      <Pedidos />
    </CompradorProtectedRoute>
  }
/>
```

O exemplo demonstra a finalidade do componente, não necessariamente sua implementação atual.

### `src/service/`

Centraliza a comunicação com serviços externos.

**`api.ts`**

Arquivo responsável pela configuração da comunicação entre frontend e backend.

Pode conter:

- URL base da API.
- Configuração do cliente HTTP.
- Headers de autenticação.
- Interceptadores de requisição e resposta.
- Configurações compartilhadas de chamadas HTTP.

Exemplo utilizando Axios:

```ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

Esse exemplo é ilustrativo e deve ser adaptado à implementação real.

### `src/store/`

Responsável pelo gerenciamento de estados compartilhados da aplicação.

Pode armazenar informações utilizadas por diferentes componentes, como dados do comprador, carrinho de compras ou estado de autenticação.

A tecnologia utilizada e os estados disponíveis devem ser consultados na implementação.

### `src/types/`

Centraliza definições de tipos e interfaces TypeScript.

Exemplo:

```ts
export interface Product {
  id: string;
  name: string;
  price: number;
}
```

Essa organização contribui para a tipagem consistente e facilita a manutenção do projeto.

## 3. Arquivo principal — `App.tsx`

O arquivo `App.tsx` é o componente principal da aplicação React.

Ele funciona como ponto central da estrutura visual e pode concentrar a declaração das rotas e dos provedores globais.

Entre suas possíveis responsabilidades estão:

- Definir as rotas disponíveis.
- Associar URLs às páginas.
- Aplicar layouts.
- Integrar rotas protegidas.
- Configurar provedores necessários à aplicação.

Exemplo conceitual:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

**Importante:** as rotas e os imports acima são exemplos. As rotas reais devem ser consultadas no `App.tsx`.

### Como a navegação funciona

O React Router permite associar caminhos da URL aos componentes que serão renderizados.

Quando o usuário acessa uma rota, o roteador identifica a página correspondente e renderiza o componente.

Se a rota estiver protegida, o componente responsável pela proteção poderá validar o acesso antes de permitir a renderização.

## 4. Fluxo de comunicação com a API

A comunicação com o backend deve seguir uma organização em camadas.

```text
Usuário
   |
   v
Página (pages/)
   |
   v
Hook (hooks/)
   |
   v
Serviço HTTP (service/api.ts)
   |
   v
Backend / API
   |
   v
Resposta processada pelo Hook
   |
   v
Atualização da interface
```

**Exemplo: consulta de produtos**

1. O usuário acessa uma página da loja.
2. A página utiliza o hook responsável pelos produtos.
3. O hook realiza a requisição utilizando o serviço HTTP.
4. O backend processa a solicitação.
5. O hook recebe a resposta.
6. A página apresenta os dados recebidos.

Essa separação permite modificar a lógica das requisições sem precisar reestruturar toda a interface.

## 5. Variáveis de ambiente — `.env`

O arquivo `.env` é utilizado para configurar valores que podem variar conforme o ambiente de execução.

Por exemplo, a aplicação pode utilizar uma URL de API diferente em desenvolvimento, homologação e produção.

### Exemplo

```env
VITE_API_URL=http://localhost:3000
```

No código:

```ts
const apiUrl = import.meta.env.VITE_API_URL;
```

**Atenção:** `VITE_API_URL` é um exemplo. O nome real da variável deve corresponder ao utilizado no projeto.

### Boas práticas

- Não versionar arquivos `.env` que contenham informações sensíveis.
- Criar um `.env.example` com as variáveis necessárias, sem valores secretos.
- Configurar as variáveis correspondentes no ambiente de deploy.
- Reiniciar o servidor de desenvolvimento após alterar variáveis de ambiente, quando necessário.

Em projetos Vite, variáveis prefixadas com `VITE_` são expostas ao código executado no navegador. Portanto, não devem conter senhas, tokens privados ou outras credenciais secretas.

Exemplo de `.env.example`:

```env
VITE_API_URL=
```

## 6. Estilos da aplicação

**`App.css`**

Arquivo destinado aos estilos relacionados à aplicação e seus componentes principais.

**`index.css`**

Arquivo normalmente utilizado para estilos globais, como fontes, resets CSS, cores e configurações gerais.

## 7. Fluxo geral da aplicação

```text
App.tsx
   |
   +-- Configuração de rotas
   |       |
   |       +-- Rotas públicas
   |       |
   |       +-- Rotas protegidas
   |
   +-- Layouts
   |       |
   |       +-- Pages
   |              |
   |              +-- Components
   |              |
   |              +-- Hooks
   |                     |
   |                     +-- Service / API
   |                     |
   |                     +-- Store
   |
   +-- Estilos globais
```

## 8. Padrões de desenvolvimento

Para manter a organização do projeto, recomenda-se:

1. Criar páginas dentro de `pages/`.
2. Criar componentes reutilizáveis dentro de `components/`.
3. Centralizar lógicas reutilizáveis em `hooks/`.
4. Utilizar `service/api.ts` para manter uma configuração HTTP consistente.
5. Centralizar tipos compartilhados em `types/`.
6. Utilizar `store/` para estados globais quando necessário.
7. Manter as verificações de acesso nas rotas protegidas.
8. Evitar colocar credenciais privadas no frontend.

## 9. Manutenção e evolução

Ao adicionar uma nova funcionalidade, deve-se avaliar quais camadas precisam ser alteradas.

Por exemplo, para adicionar uma página de histórico de pedidos:

- Criar a página em `pages/`.
- Criar ou reutilizar o hook de consulta de pedidos.
- Utilizar o serviço HTTP configurado.
- Definir os tipos necessários em `types/`.
- Registrar a rota no local responsável pela navegação.
- Aplicar proteção de acesso, se necessário.

Essa abordagem facilita a evolução da aplicação e mantém as responsabilidades separadas.

---
## 10. Versionamento e fluxo de desenvolvimento (Git)

O projeto utiliza um fluxo de desenvolvimento baseado em branches, com o objetivo de manter o código organizado, facilitar a revisão e evitar alterações diretas na branch principal de desenvolvimento.

### 10.1. Criando uma nova branch

Antes de iniciar qualquer implementação, o desenvolvedor deve atualizar a branch `develop` e criar uma nova branch a partir dela.

```bash
git checkout develop
git pull origin develop
git checkout -b nome-develop
```

Substitua `nome-develop` por um nome que identifique a funcionalidade ou alteração.

Exemplos:

```bash
git checkout -b checkout-develop
git checkout -b zcard-develop
git checkout -b correcao-login-develop
```

**Regra:** não realizar alterações diretamente na branch `develop`.

### 10.2. Desenvolvendo a funcionalidade

Todas as alterações devem ser realizadas na branch criada.

Durante o desenvolvimento:

- Respeitar a estrutura de pastas existente.
- Reutilizar componentes e hooks sempre que possível.
- Manter a tipagem TypeScript.
- Evitar alterações em arquivos que não estejam relacionados à tarefa.
- Testar as funcionalidades antes de enviar o código.

### 10.3. Realizando o commit

Após finalizar e testar a implementação, verificar os arquivos modificados:

```bash
git status
```

Adicionar os arquivos ao commit:

```bash
git add .
```

Criar um commit com uma mensagem objetiva:

```bash
git commit -m "feat: implementa funcionalidade de checkout"
```

Padrões recomendados:

| Prefixo | Utilização |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bugs |
| `refactor:` | Refatoração de código |
| `style:` | Alterações de estilo e formatação |
| `docs:` | Alterações na documentação |
| `chore:` | Manutenção e configurações |

### 10.4. Enviando a branch para o repositório

Após realizar o commit:

```bash
git push -u origin nome-develop
```

Esse comando envia a branch para o repositório remoto.

### 10.5. Solicitando um Pull Request

Com a branch enviada, o desenvolvedor deve acessar o repositório remoto e criar um **Pull Request (PR)**.

Configuração obrigatória:

```text
Base (destino): develop
Compare (origem): nome-develop
```

O Pull Request deve conter:

- Título objetivo da alteração.
- Descrição do que foi desenvolvido.
- Informações sobre correções realizadas.
- Evidências de testes, quando aplicável.
- Screenshots, caso existam alterações visuais.

**Importante:** o desenvolvedor não deve realizar o merge diretamente na `develop` sem a revisão e aprovação do responsável pelo projeto.

### 10.6. Fluxo completo

```text
develop
   |
   | Criar nova branch
   v
nome-develop
   |
   | Desenvolver funcionalidade
   v
Testar alterações
   |
   | git add .
   | git commit
   v
Enviar branch
   |
   | git push
   v
Abrir Pull Request
   |
   | Destino: develop
   v
Revisão de código
   |
   | Aprovação
   v
Merge na develop
```

### 10.7. Regras de colaboração

1. Nunca desenvolver diretamente na `develop`.
2. Criar uma branch específica para cada tarefa.
3. Utilizar nomes de branches descritivos, seguindo o padrão `nome-develop`.
4. Realizar commits com mensagens claras.
5. Não enviar arquivos `.env` com credenciais.
6. Verificar se a aplicação compila e funciona antes de abrir o PR.
7. Solicitar Pull Request sempre para a branch `develop`.
8. Aguardar a revisão e aprovação antes do merge.

**Resumo:** toda implementação deve seguir o fluxo `develop` → `nome-develop` → commit → push → Pull Request para `develop` → revisão → merge.


**Nota:** esta documentação foi elaborada com base na estrutura de arquivos apresentada. Para documentar com precisão os endpoints, os caminhos das rotas, os parâmetros dos hooks e as variáveis de ambiente, é necessário consultar o conteúdo dos arquivos correspondentes.