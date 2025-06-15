# E-commerce Project

Este é um projeto de e-commerce básico não tendo implementacão de login,pagamento ou seguranca, sendo somente um MVP, consome das apis para receber os produtos e une em uma lista, cria um pedido com os produtos selecionados e armazena os dados. O projeto tem um backend, front-end e aplicacão Android(Flutter)

## 🏗️ Arquitetura do Projeto

O projeto é dividido em três partes principais:

- **Backend**: API REST em NestJS (Node.js) com TypeScript
- **Frontend Web**: Aplicação React com TypeScript e Vite
- **Mobile**: Aplicativo Android desenvolvido com Flutter

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- Yarn (gerenciador de pacotes)
- Flutter SDK
- Android Studio
- Docker e Docker Compose (opcional)

### Execução com Docker (Recomendado)

1. Na raiz do projeto, execute:
```bash
docker-compose up
```

Isso irá iniciar:
- Backend na porta 3000 (http://localhost:3000)
- Frontend na porta 80 (http://localhost)

Para parar os containers:
```bash
docker-compose down
```

### Execução Manual

#### Backend (NestJS)

1. Navegue até a pasta do backend:
```bash
cd ecommerce-backend
```

2. Instale as dependências:
```bash
yarn install
```

3. Configure o banco de dados (Prisma):
```bash
yarn prisma generate
```

4. Execute o projeto em modo de desenvolvimento:
```bash
yarn start:dev
```

O servidor backend estará disponível em `http://localhost:3000`

#### Frontend Web (React + Vite)

1. Navegue até a pasta do frontend:
```bash
cd ecommerce-frontend
```

2. Instale as dependências:
```bash
yarn install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
yarn dev
```

O frontend web estará disponível em `http://localhost:5173`

### Aplicativo Android

1. Abra o projeto no Android Studio:
   - Abra o Android Studio
   - Selecione "Open an existing project"
   - Navegue até a pasta `andoid-frontend/android` e selecione-a

2. Para executar como aplicativo web (Chrome):
   - No Android Studio, selecione "Chrome" como dispositivo de destino
   - Clique no botão "Run" (▶️)

## 🛠️ Decisões Técnicas

### Backend (NestJS)
- **NestJS**
- **TypeScript**: Adiciona tipagem estática 
- **Prisma**: ORM para gerenciar bd 
- **Class Validator**: Validação de dados usando decorators
- **Jest**: Framework de testes unitários e e2e

### Frontend Web
- **React**
- **TypeScript**: Adiciona tipagem estática 
- **Vite**: Build tool rápido pra agilizar o setup
- **React Router**: Gerenciamento de rotas
- **Axios**: Cliente para comunicação com a API

### Mobile
- **Flutter**: Framework cross-platform que permite desenvolvimento nativo
- **Material Design**: Seguindo as diretrizes de design do Android

## 🔄 Integração

- O frontend web e o aplicativo Android se comunicam com o backend através de APIs REST
- O backend fornece endpoints padronizados que são consumidos por ambas as interfaces
- Autenticação e autorização são gerenciadas pelo backend
- O backend usa Prisma com sqlite para persistencia dos dados das compras
- O front-end permite filtrar os produtos por nacionalidade e range de preco
- O front-end tem um carrinho onde é possivel adicionar produtos (o estado do carrinho fica salvo)

## 📦 Estrutura de Diretórios

```
.
├── ecommerce-backend/     # Backend NestJS
│   ├── src/              # Código fonte
│   ├── prisma/           # Configuração do banco de dados
├── ecommerce-frontend/    # Frontend React + Vite
│   ├── src/              # Código fonte
│   └── public/           # Arquivos estáticos
├── andoid-frontend/       # Aplicativo Android
└── docker-compose.yml     # Configuração Docker
```



## 📡 Endpoints do Backend

### Produtos (`/products`)

#### GET `/products`
Retorna a lista de produtos unificada dos fornecedores brasileiro e europeu.

**Query Parameters:**
- `search` (opcional): Busca produtos por nome
- `origin` (opcional): Filtra por origem ('Brasil' ou 'Europa')
- `minPrice` (opcional): Preço mínimo
- `maxPrice` (opcional): Preço máximo

**Exemplo de Resposta:**
```json
[
  {
    "id": "br-1",
    "name": "Produto Brasileiro",
    "description": "Descrição do produto",
    "price": 100.00,
    "imageUrl": "http://exemplo.com/imagem.jpg",
    "origin": "Brasil"
  },
  {
    "id": "eu-1",
    "name": "Produto Europeu",
    "description": "Product description",
    "price": 200.00,
    "imageUrl": "http://exemplo.com/image.jpg",
    "origin": "Europa"
  }
]
```

### Pedidos (`/orders`)

#### GET `/orders`
Retorna todos os pedidos realizados.

**Exemplo de Resposta:**
```json
[
  {
    "id": "1",
    "total": 400.00,
    "items": [
      {
        "productId": "br-1",
        "productName": "Produto Brasileiro",
        "quantity": 2,
        "price": 100.00
      },
      {
        "productId": "eu-1",
        "productName": "Produto Europeu",
        "quantity": 1,
        "price": 200.00
      }
    ],
    "createdAt": "2024-03-20T10:00:00Z",
    "updatedAt": "2024-03-20T10:00:00Z"
  }
]
```

#### POST `/orders`
Cria um novo pedido.

**Request Body:**
```json
{
  "items": [
    {
      "productId": "br-1",
      "productName": "Produto Brasileiro",
      "quantity": 2,
      "price": 100.00
    },
    {
      "productId": "eu-1",
      "productName": "Produto Europeu",
      "quantity": 1,
      "price": 200.00
    }
  ]
}
```

**Exemplo de Resposta:**
```json
{
  "id": "1",
  "total": 400.00,
  "items": [
    {
      "productId": "br-1",
      "productName": "Produto Brasileiro",
      "quantity": 2,
      "price": 100.00
    },
    {
      "productId": "eu-1",
      "productName": "Produto Europeu",
      "quantity": 1,
      "price": 200.00
    }
  ],
  "createdAt": "2024-03-20T10:00:00Z",
  "updatedAt": "2024-03-20T10:00:00Z"
}
```

**Obs adicionais:**
- O backend consome duas APIs externas de produtos (brasileira e europeia)
- Os IDs dos produtos são prefixados com 'br-' ou 'eu-' para identificar a origem
- Os pedidos são persistidos em um banco SQLite usando Prisma
- O total do pedido é calculado automaticamente com base nos itens
- A imagem de alguns produtos não estão funcionado por problemas nos links fornecidos pela API de produtos que é consumida pelo back-end