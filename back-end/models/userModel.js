const db = require("../config/database");

function criarUsuario(usuario, callback) {
    const sql = `
        INSERT INTO usuarios
        (nome, email, telefone, cpf, senha, cep, cidade, estado, bairro, endereco, numero, complemento, foto_perfil, foto_documento)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [
        usuario.nome,
        usuario.email,
        usuario.telefone,
        usuario.cpf,
        usuario.senha,
        usuario.cep,
        usuario.cidade,
        usuario.estado,
        usuario.bairro,
        usuario.endereco,
        usuario.numero,
        usuario.complemento,
        usuario.foto_perfil,
        usuario.foto_documento
    ], callback);
}

function buscarPorEmailOuCpf(email, cpf, callback) {
    const sql = `SELECT * FROM usuarios WHERE email = ? OR cpf = ?`;
    db.query(sql, [email, cpf], callback);
}

function buscarPorEmail(email, callback) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    db.query(sql, [email], callback);
}

function buscarPorId(id, callback) {
    const sql = `
        SELECT id, nome, email, telefone, cpf, cep, cidade, estado,
               bairro, endereco, numero, complemento, foto_perfil
        FROM usuarios
        WHERE id = ?
    `;
    db.query(sql, [id], callback);
}

function atualizarUsuario(usuario, callback) {
    const sql = `
        UPDATE usuarios
        SET nome = ?, telefone = ?, cep = ?, cidade = ?, estado = ?,
            bairro = ?, endereco = ?, numero = ?, complemento = ?
        WHERE id = ?
    `;

    db.query(sql, [
        usuario.nome,
        usuario.telefone,
        usuario.cep,
        usuario.cidade,
        usuario.estado,
        usuario.bairro,
        usuario.endereco,
        usuario.numero,
        usuario.complemento,
        usuario.id
    ], callback);
}

function excluirUsuario(id, callback) {
    const sql = `DELETE FROM usuarios WHERE id = ?`;
    db.query(sql, [id], callback);
}

module.exports = {
    criarUsuario,
    buscarPorEmailOuCpf,
    buscarPorEmail,
    buscarPorId,
    atualizarUsuario,
    excluirUsuario
};
