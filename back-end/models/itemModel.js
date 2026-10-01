const db = require("../config/database");

function criarItem(item, callback) {
    const sql = `
        INSERT INTO itens
        (usuario_id, categoria_id, titulo, descricao, estado, cep, cidade, bairro, endereco, numero)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        item.usuario_id,
        item.categoria_id,
        item.titulo,
        item.descricao,
        item.estado,
        item.cep || null,
        item.cidade || null,
        item.bairro || null,
        item.endereco || null,
        item.numero || null
    ], (err, result) => {
        if (err) return callback(err);

        if (!item.imagem) return callback(null, result);

        const imageSql = `
            INSERT INTO imagens_itens (item_id, caminho_imagem)
            VALUES (?, ?)
        `;

        db.query(imageSql, [result.insertId, item.imagem], imageErr => {
            if (imageErr) return callback(imageErr);
            callback(null, result);
        });
    });
}

function listarCategorias(callback) {
    db.query(`SELECT id, nome FROM categorias ORDER BY nome`, callback);
}

function listarItens(filtros, callback) {
    let sql = `
        SELECT
            i.id, i.usuario_id, i.categoria_id, i.titulo, i.descricao,
            i.estado, i.cep, i.cidade, i.bairro, i.endereco, i.numero,
            i.status, i.data_doacao, i.criado_em,
            u.nome AS nome_doador,
            c.nome AS categoria,
            (
                SELECT ii.caminho_imagem
                FROM imagens_itens ii
                WHERE ii.item_id = i.id
                ORDER BY ii.id
                LIMIT 1
            ) AS imagem
        FROM itens i
        JOIN usuarios u ON i.usuario_id = u.id
        LEFT JOIN categorias c ON i.categoria_id = c.id
        WHERE 1=1
    `;

    const params = [];
    if (filtros.nome) {
        sql += ` AND i.titulo LIKE ?`;
        params.push(`%${filtros.nome}%`);
    }
    if (filtros.categoria) {
        sql += ` AND i.categoria_id = ?`;
        params.push(filtros.categoria);
    }
    if (filtros.cidade) {
        sql += ` AND i.cidade LIKE ?`;
        params.push(`%${filtros.cidade}%`);
    }
    if (filtros.bairro) {
        sql += ` AND i.bairro LIKE ?`;
        params.push(`%${filtros.bairro}%`);
    }

    sql += ` ORDER BY i.id DESC`;
    db.query(sql, params, callback);
}

function buscarItemPorId(id, callback) {
    const itemSql = `
        SELECT
            i.*,
            u.nome AS nome_doador,
            c.nome AS categoria
        FROM itens i
        JOIN usuarios u ON i.usuario_id = u.id
        LEFT JOIN categorias c ON i.categoria_id = c.id
        WHERE i.id = ?
    `;

    db.query(itemSql, [id], (err, results) => {
        if (err) return callback(err);
        if (!results.length) return callback(null, []);

        const item = results[0];
        db.query(
            `SELECT id, caminho_imagem FROM imagens_itens WHERE item_id = ? ORDER BY id`,
            [id],
            (imageErr, images) => {
                if (imageErr) return callback(imageErr);
                item.imagens = images || [];
                callback(null, [item]);
            }
        );
    });
}

function atualizarItem(item, callback) {
    const sql = `
        UPDATE itens
        SET titulo = ?, descricao = ?, categoria_id = ?, estado = ?
        WHERE id = ? AND usuario_id = ?
    `;

    db.query(sql, [
        item.titulo,
        item.descricao,
        item.categoria_id,
        item.estado,
        item.id,
        item.usuario_id
    ], callback);
}

function atualizarStatus(id, status, usuario_id, callback) {
    const sql = `
        UPDATE itens
        SET status = ?
        WHERE id = ? AND usuario_id = ?
    `;
    db.query(sql, [status, id, usuario_id], callback);
}

function excluirItem(id, usuario_id, callback) {
    const sql = `DELETE FROM itens WHERE id = ? AND usuario_id = ?`;
    db.query(sql, [id, usuario_id], callback);
}

module.exports = {
    criarItem,
    listarCategorias,
    listarItens,
    buscarItemPorId,
    atualizarItem,
    atualizarStatus,
    excluirItem
};
