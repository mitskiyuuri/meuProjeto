# Doe-se — projeto ajustado

## Estrutura
- `front-end/`: páginas HTML, CSS e JavaScript
- `back-end/`: API Node.js/Express + MySQL
- `back-end/DATABASE.sql`: estrutura do banco
- `back-end/.env`: configurações locais do banco e porta

## 1. Banco de dados
Abra o XAMPP e ligue o **MySQL**.

No phpMyAdmin, importe/execute:
`back-end/DATABASE.sql`

O banco usado pelo projeto é `doe_se`.

## 2. Backend
Abra um terminal na pasta `back-end`:

```bash
npm install
npm start
```

O esperado é:

```text
Servidor iniciado e rodando na porta 3000!
Conectado ao banco de dados MySQL com sucesso!
```

A API fica em:
`http://localhost:3000`

Teste no navegador:
`http://localhost:3000/`

Deve aparecer:
`Servidor funcionando!`

## 3. Frontend
Abra a pasta `front-end` no VS Code e rode com **Live Server**.

O endereço normalmente será:
`http://127.0.0.1:5500`

O frontend já está configurado para usar:
`http://localhost:3000`

## O que foi alinhado
- Cadastro agora envia e salva CEP, estado, número e complemento.
- Listagem de categorias foi criada.
- Busca de item por ID foi criada.
- Atualização de status foi criada e usa os valores existentes no banco.
- Listagem de itens usa a tabela `imagens_itens` corretamente.
- Cadastro de item salva a imagem na tabela `imagens_itens`.
- Filtros de nome, categoria, cidade e bairro funcionam na API.
- Comentários foram implementados para as chamadas que o frontend já fazia.
- Upload de imagens usa um caminho absoluto para a pasta `back-end/uploads`.
- CORS está habilitado.
- O `.env` é carregado mesmo que o servidor seja iniciado a partir de outra pasta.

## Se o cadastro ainda der erro
Verifique primeiro se:
1. MySQL está ligado no XAMPP.
2. O banco `doe_se` existe.
3. O backend está rodando na porta 3000.
4. O terminal do backend não mostra erro de conexão com o MySQL.
