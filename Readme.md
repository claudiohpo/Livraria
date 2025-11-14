# 📚 Livraria Online — Plataforma de Vendas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-3178C6?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)

**Disciplina:** Engenharia de Software 🧑‍🏫  
**Faculdade:** FATEC Mogi das Cruzes 🏫  
**Autores:** Cláudio Oliveira & Mariana Teixeira 👥

---

## 🔍 Visão geral
Este repositório concentra o backend que sustenta o frontend da livraria online desenvolvido na disciplina. A API oferece serviços de catálogo, carrinho, checkout, pós-venda e integrações externas que alimentam a experiência de compras do site. O foco é aplicar boas práticas de engenharia de software (camadas, regras de negócio explícitas, domínio rico e integrações controladas).

### O que já está implementado
- ✅ Catálogo completo com categorias, livros, imagens e grupos de preço para cálculo automático.
- ✅ Cadastro de clientes, endereços, cartões e gerenciamento de carrinhos com reserva de estoque.
- ✅ Checkout com cálculo de frete (Melhor Envio), cupons, múltiplos pagamentos e gateway simulado.
- ✅ Pós-venda com vendas, cancelamentos, trocas, devoluções e processamento de reembolsos.
- ✅ Rotas de logística (cotações, criação e manutenção de envios).
- ✅ Integração com Groq (LLM) para assistente/recomendação no frontend.
- ✅ Job periódico para limpar reservas de estoque expiradas.

### Como o frontend utiliza esta API
- As páginas públicas consomem `/book`, `/category`, `/bookImages` e `/inventory` para montar o catálogo.
- A jornada de compra usa `/cart`, `/cart/:id/items`, `/checkout`, `/shipping/calculate` e `/sales`.
- Pós-venda, área do cliente e gerenciamento administrativo consomem `/returns`, `/exchanges`, `/refunds`, `/address`, `/creditcards` e `/price-groups`.
- O recurso `/groq` entrega respostas geradas por IA para recomendações de leitura ou suporte ao usuário.

---

## 🏗️ Arquitetura e organização
A base segue um modelo em camadas:
- **Entities** mapeiam o domínio no PostgreSQL via TypeORM.
- **Repositories** encapsulam consultas e persistência.
- **Services** concentram regras de negócio, integrações externas e transações.
- **Controllers** recebem as requisições Express e delegam aos services.
- **Routes** agrupam endpoints por domínio.
- **Middleware** expõe autenticação simulada (`devAuth`) e verificação de administrador (`isAdmin`).

Estrutura principal:
```
src/
├─ controller/        # Entrada da camada HTTP (Express)
├─ service/           # Regras de negócio por domínio
├─ repositories/      # Custom repositories TypeORM
├─ entities/          # Mapeamento das tabelas
├─ database/          # Conexão e migrations
├─ Middleware/        # Autenticação/Autorização de desenvolvimento
├─ routes/            # Definição de endpoints agrupados
├─ routes.ts          # Agregador das rotas de domínio
└─ server.ts          # Bootstrap do servidor Express
```

---

## ⚙️ Configuração e execução

### Pré-requisitos
- Node.js 18 ou superior
- npm (ou pnpm/yarn)
- PostgreSQL 12 ou superior
- (Opcional) Conta sandbox na [Melhor Envio](https://www.melhorenvio.com.br) e chave Groq para habilitar integrações

### Passo a passo
1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados PostgreSQL (usuário, senha e base). As credenciais padrão estão em `ormconfig.json`.
3. Crie um arquivo `.env` na raiz com as variáveis necessárias (modelo abaixo).
4. Rode as migrations se desejar controlar o schema via TypeORM:
   ```bash
   npm run typeorm migration:run
   ```
   > Em desenvolvimento o `ormconfig.json` está com `synchronize: true`; mantenha `false` em produção.
5. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```

### Scripts disponíveis
- `npm run dev` — inicia o servidor com `ts-node-dev` em hot reload.
- `npm run start` — executa via `ts-node` (útil para ambientes simples).
- `npm run typeorm` — acessa a CLI do TypeORM (`migration:run`, `migration:revert`, etc.).

### Exemplo de `.env`
```env
# Limpeza de reservas de estoque (ms)
RESERVATION_CLEANUP_INTERVAL_MS=30000

# Integração Melhor Envio
MELHOR_ENVIO_TOKEN=seu_token
MELHOR_ENVIO_ORIGIN_POSTAL_CODE=01001000
MELHOR_ENVIO_ENV=sandbox
APP_USER_AGENT=livraria-api/1.0 (+contato@exemplo.com)
VALIDATE_SELECTED_SHIPPING=false

# Integração Groq
GROQ_API_KEY=sua_chave
```

---

## 🔐 Variáveis de ambiente
| Nome | Descrição | Obrigatório | Default |
| --- | --- | --- | --- |
| `RESERVATION_CLEANUP_INTERVAL_MS` | Intervalo (ms) do job que devolve estoque de reservas vencidas | Não | `30000` |
| `MELHOR_ENVIO_TOKEN` | Token Bearer da API Melhor Envio para cotação e criação de envios | Sim (para frete) | `""` |
| `MELHOR_ENVIO_ORIGIN_POSTAL_CODE` | CEP de origem usado nas cotações | Sim (para frete) | `""` |
| `MELHOR_ENVIO_ENV` | Ambiente da API (`sandbox` ou `production`) | Não | `sandbox` |
| `APP_USER_AGENT` | User-Agent enviado à Melhor Envio (obrigatório pela API) | Sim (para frete) | `""` |
| `VALIDATE_SELECTED_SHIPPING` | Quando `true`, revalida no provedor o frete escolhido pelo cliente | Não | `false` |
| `GROQ_API_KEY` | Chave da Groq para gerar respostas no endpoint `/groq` | Sim (para IA) | `""` |

> Caso não utilize integrações externas, deixe as variáveis vazias e o serviço retornará 0 para frete ou bloqueará o uso correspondente.

---

## 🌐 Endpoints principais
| Domínio | Base | Métodos | Observações |
| --- | --- | --- | --- |
| Grupos de preço | `/price-groups` | `POST`, `GET`, `PUT/:id`, `DELETE/:id` | Margens, limites e regras de aprovação |
| Categorias | `/category` | `POST`, `GET`, `PUT/:id`, `DELETE/:id` | Classificação de livros |
| Livros | `/book` | `POST`, `GET`, `GET/:id`, `PUT/:id`, `DELETE/:id` | Calcula preço com base no grupo |
| Imagens de livros | `/bookImages` | `POST /book/:bookId/images`, `GET`, `PUT /images/:id`, `DELETE /images/:id` | Upload via URL |
| Clientes | `/costumers` | `POST`, `GET`, `GET /email/:email`, `PUT/:id`, `DELETE/:id` | Inclui ranking, CPF e aniversário |
| Endereços | `/address` | `POST`, `GET/:costumerId`, `PUT/:id`, `DELETE/:id` | Diferencia faturamento/entrega |
| Cartões | `/creditcards` | `POST`, `GET /id/:costumerId`, `GET /email/:email`, `PUT/:id`, `DELETE/:id` | Permite salvar novo cartão |
| Carrinho | `/cart` | `POST`, `GET/:id`, `PUT/:id`, `DELETE/:id`, `GET /costumer/:clienteId` | Mantém desconto aplicado e status |
| Itens do carrinho | `/cart/:cartId/items` | `POST`, `GET`, `PUT/:itemId`, `DELETE/:itemId` | Reserva estoque automaticamente |
| Inventário | `/inventory` | `POST`, `GET`, `POST /cleanup` | Entradas de estoque, listagem e limpeza manual |
| Checkout / Vendas | `/checkout` | `POST`, `GET`, `GET/:id` | Gera venda, calcula frete, aplica cupons |
| Vendas (admin) | `/sales` | `POST /:id/cancel`, `PUT /:id` | Atualiza status e cancela pedidos |
| Devoluções | `/returns` | `POST`, `POST /:id/authorize` | Cria devolução e autoriza (devAuth + isAdmin) |
| Trocas | `/exchanges` | `GET`, `POST`, `POST /:id/authorize`, `PUT /:id` | Fluxo de troca com confirmação |
| Reembolsos | `/refunds/:id/process` | `POST` | Processa refund (requere devAuth + isAdmin) |
| Cupons | `/coupons` | `POST`, `GET`, `PUT/:id`, `DELETE/:id` | Limites de valor e validade |
| Frete | `/shipping` | `POST /calculate`, `POST /`, `GET`, `GET/:id`, `PUT/:id`, `DELETE/:id` | Integração Melhor Envio |
| IA (Groq) | `/groq` | `POST` | Espera `{ prompt }` e responde com o JSON da Groq |

> Para testar rotas protegidas use `Authorization: Bearer mock-token-colaborador` ou envie o header `x-dev-user: admin` para ativar o middleware de administrador em ambiente de desenvolvimento.

---

## 🔁 Regras de negócio em destaque
- Calcula preço de livro a partir do custo + margem do grupo de preço.
- Reservas de estoque por item de carrinho expiram e são revertidas automaticamente.
- Checkout valida soma de pagamentos, valor mínimo de cartão (R$10) e uso combinado com cupons.
- Validação opcional de frete com a Melhor Envio garantindo consistência do valor escolhido.
- Devoluções calculam reembolsos proporcionais ou sequenciais e podem ser processadas automaticamente.
- Gateway de pagamento e processamento de refund são simulados para facilitar o desenvolvimento frontend.

---

## 🧪 Testes
Ainda não há suíte automatizada. Recomenda-se cobrir services críticos (checkout, estoque, devolução) com testes unitários/integrados em etapas futuras.

---

## ✉️ Contato
- Cláudio Henrique Pinheiro de Oliveira 
- Mariana Gomes Teixeira 

---

## 📝 Licença
Uso acadêmico.

