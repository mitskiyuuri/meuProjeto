const db = require("../config/database");

// 1. Criar solicitação/pedido de um item
function criarSolicitacao(solicitacao, callback) {
    const sql = `
        INSERT INTO solicitacoes
        (item_id, usuario_id, mensagem)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [
            solicitacao.item_id,
            solicitacao.usuario_id,
            solicitacao.mensagem
        ],
        callback
    );
}

// 2. Listar solicitações do usuário
function listarMinhasSolicitacoes(usuario_id, callback) {
    const sql = `
    SELECT
        s.*,
        i.titulo AS item_titulo,
        (
            SELECT ii.caminho_imagem
            FROM imagens_itens ii
            WHERE ii.item_id = i.id
            ORDER BY ii.id
            LIMIT 1
        ) AS item_imagem,
        u.nome AS nome_doador
    FROM solicitacoes s
    JOIN itens i ON s.item_id = i.id
    JOIN usuarios u ON i.usuario_id = u.id
    WHERE s.usuario_id = ?
    ORDER BY s.id DESC
`;

    db.query(sql, [usuario_id], callback);
}

// 3. Atualizar status (pendente, aceita, recusada)
function atualizarStatus(id, status, callback) {
    const sql = `
        UPDATE solicitacoes
        SET status = ?
        WHERE id = ?
    `;

    db.query(sql, [status, id], callback);
}

// 4. Excluir solicitação
function excluirSolicitacao(id, usuario_id, callback) {
    const sql = `
        DELETE FROM solicitacoes
        WHERE id = ? AND usuario_id = ?
    `;

    db.query(sql, [id, usuario_id], callback);
}

module.exports = {
    criarSolicitacao,
    listarMinhasSolicitacoes,
    atualizarStatus,
    excluirSolicitacao
};