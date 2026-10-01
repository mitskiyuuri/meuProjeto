const comentarioModel = require("../models/comentarioModel");

exports.listar = (req, res) => {
    comentarioModel.listarPorItem(req.params.itemId, (err, results) => {
        if (err) {
            console.error("Erro ao listar comentários:", err);
            return res.status(500).json({ mensagem: "Erro ao listar comentários." });
        }
        res.json(results || []);
    });
};

exports.criar = (req, res) => {
    const texto = String(req.body.comentario || "").trim();

    if (!texto) {
        return res.status(400).json({ mensagem: "O comentário não pode estar vazio." });
    }

    if (texto.length > 500) {
        return res.status(400).json({ mensagem: "O comentário pode ter no máximo 500 caracteres." });
    }

    comentarioModel.criar({
        item_id: req.params.itemId,
        usuario_id: req.usuario.id,
        comentario: texto
    }, (err, result) => {
        if (err) {
            console.error("Erro ao criar comentário:", err);
            return res.status(500).json({ mensagem: "Erro ao publicar comentário." });
        }
        res.status(201).json({ mensagem: "Comentário publicado!", id: result.insertId });
    });
};

exports.excluir = (req, res) => {
    comentarioModel.excluir(req.params.id, req.usuario.id, (err, result) => {
        if (err) {
            console.error("Erro ao excluir comentário:", err);
            return res.status(500).json({ mensagem: "Erro ao excluir comentário." });
        }
        if (!result.affectedRows) {
            return res.status(404).json({ mensagem: "Comentário não encontrado ou sem permissão." });
        }
        res.json({ mensagem: "Comentário excluído!" });
    });
};
