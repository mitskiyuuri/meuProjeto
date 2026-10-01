const itemModel = require("../models/itemModel");

exports.criarItem = (req, res) => {
    const { titulo, descricao, categoria_id, estado, cidade, bairro, cep, endereco, numero } = req.body;

    if (!titulo || !descricao || !categoria_id || !estado) {
        return res.status(400).json({
            mensagem: "Preencha os campos obrigatórios: título, descrição, categoria e estado."
        });
    }

    const item = {
        titulo,
        descricao,
        categoria_id,
        estado,
        cep: cep || "",
        cidade: cidade || req.usuario.cidade || "",
        bairro: bairro || req.usuario.bairro || "",
        endereco: endereco || "",
        numero: numero || "",
        imagem: req.file ? req.file.filename : null,
        usuario_id: req.usuario.id
    };

    itemModel.criarItem(item, (err, result) => {
        if (err) {
            console.error("Erro ao criar item:", err);
            return res.status(500).json({ mensagem: "Erro ao cadastrar item." });
        }

        return res.status(201).json({
            mensagem: "Item cadastrado com sucesso!",
            itemId: result.insertId
        });
    });
};

exports.listarCategorias = (req, res) => {
    itemModel.listarCategorias((err, results) => {
        if (err) {
            console.error("Erro ao listar categorias:", err);
            return res.status(500).json({ mensagem: "Erro ao listar categorias." });
        }
        res.json(results || []);
    });
};

exports.listarItens = (req, res) => {
    itemModel.listarItens(req.query, (err, results) => {
        if (err) {
            console.error("Erro ao listar itens:", err);
            return res.status(500).json({ mensagem: "Erro ao listar itens." });
        }
        res.json(results || []);
    });
};

exports.buscarItem = (req, res) => {
    itemModel.buscarItemPorId(req.params.id, (err, results) => {
        if (err) {
            console.error("Erro ao buscar item:", err);
            return res.status(500).json({ mensagem: "Erro ao buscar item." });
        }
        if (!results || !results.length) {
            return res.status(404).json({ mensagem: "Item não encontrado." });
        }
        res.json(results[0]);
    });
};

exports.atualizarItem = (req, res) => {
    const item = {
        id: req.params.id,
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        categoria_id: req.body.categoria_id,
        estado: req.body.estado,
        usuario_id: req.usuario.id
    };

    itemModel.atualizarItem(item, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar item:", err);
            return res.status(500).json({ mensagem: "Erro ao atualizar item." });
        }
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado ou você não tem permissão para alterá-lo."
            });
        }
        res.json({ mensagem: "Item atualizado com sucesso!" });
    });
};

exports.atualizarStatus = (req, res) => {
    const statusValidos = ["Disponível", "Reservado", "Doado"];
    const { status } = req.body;

    if (!statusValidos.includes(status)) {
        return res.status(400).json({ mensagem: "Status inválido." });
    }

    itemModel.atualizarStatus(req.params.id, status, req.usuario.id, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar status:", err);
            return res.status(500).json({ mensagem: "Erro ao atualizar status." });
        }
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado ou você não tem permissão para alterá-lo."
            });
        }
        res.json({ mensagem: "Status atualizado com sucesso!" });
    });
};

exports.excluirItem = (req, res) => {
    itemModel.excluirItem(req.params.id, req.usuario.id, (err, result) => {
        if (err) {
            console.error("Erro ao excluir item:", err);
            return res.status(500).json({ mensagem: "Erro ao excluir item." });
        }
        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Item não encontrado ou você não tem permissão para excluí-lo."
            });
        }
        res.json({ mensagem: "Item excluído com sucesso!" });
    });
};
