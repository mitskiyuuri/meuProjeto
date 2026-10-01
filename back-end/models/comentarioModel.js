const db = require("../config/database");

function listarPorItem(itemId, callback) {
    const sql = `
        SELECT c.id, c.item_id, c.usuario_id, c.comentario, c.data,
               u.nome AS nome_usuario
        FROM comentarios c
        JOIN usuarios u ON c.usuario_id = u.id
        WHERE c.item_id = ?
        ORDER BY c.data ASC, c.id ASC
    `;
    db.query(sql, [itemId], callback);
}

function criar(comentario, callback) {
    const sql = `
        INSERT INTO comentarios (item_id, usuario_id, comentario)
        VALUES (?, ?, ?)
    `;
    db.query(sql, [
        comentario.item_id,
        comentario.usuario_id,
        comentario.comentario
    ], callback);
}

function excluir(id, usuarioId, callback) {
    const sql = `
        DELETE FROM comentarios
        WHERE id = ? AND usuario_id = ?
    `;
    db.query(sql, [id, usuarioId], callback);
}

module.exports = { listarPorItem, criar, excluir };
