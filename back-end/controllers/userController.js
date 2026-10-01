const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// 1. Cadastro
exports.cadastrarUsuario = async (req, res) => {
    try {
        const { nome, email, telefone, cpf, senha, cep, cidade, estado, bairro, endereco, numero, complemento } = req.body;

        if (!nome || !email || !cpf || !senha || !cep || !cidade || !estado || !bairro || !endereco || !numero) {
            return res.status(400).json({
                mensagem: "Preencha todos os campos obrigatórios."
            });
        }

        userModel.buscarPorEmailOuCpf(email, cpf, async (err, results) => {
            if (err) {
                console.error("Erro ao buscar e-mail/cpf:", err);
                return res.status(500).json({
                    mensagem: "Erro ao verificar usuário."
                });
            }

            if (results && results.length > 0) {
                return res.status(400).json({
                    mensagem: "E-mail ou CPF já cadastrado."
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const usuario = {
                nome,
                email,
                telefone: telefone || "",
                cpf,
                senha: senhaCriptografada,
                cep,
                cidade,
                estado: String(estado).toUpperCase(),
                bairro,
                endereco,
                numero,
                complemento: complemento || "",
                foto_perfil: null,
                foto_documento: null
            };

            userModel.criarUsuario(usuario, (err) => {
                if (err) {
                    console.error("Erro ao criar usuário:", err);
                    return res.status(500).json({
                        mensagem: "Erro ao criar usuário."
                    });
                }

                return res.status(201).json({
                    mensagem: "Usuário criado com sucesso!"
                });
            });
        });

    } catch (erro) {
        console.error("Erro interno no cadastro:", erro);
        return res.status(500).json({
            mensagem: "Erro interno do servidor."
        });
    }
};

// 2. Login
exports.loginUsuario = (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({
            mensagem: "Informe e-mail e senha."
        });
    }

    userModel.buscarPorEmail(email, async (err, results) => {
        if (err) {
            console.error("Erro na busca de e-mail:", err);
            return res.status(500).json({
                mensagem: "Erro ao buscar usuário."
            });
        }

        if (!results || results.length === 0) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const usuario = results[0];

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos."
            });
        }

        const secretKey = process.env.JWT_SECRET || "secreta_padrao_doese";

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            secretKey,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            mensagem: "Login realizado com sucesso!",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cidade: usuario.cidade,
                bairro: usuario.bairro
            }
        });
    });
};

// 3. Buscar perfil
exports.buscarPerfil = (req, res) => {
    userModel.buscarPorId(req.usuario.id, (err, results) => {
        if (err) {
            console.error("Erro ao buscar perfil:", err);
            return res.status(500).json({
                mensagem: "Erro ao buscar perfil."
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        const usuario = { ...results[0] };
        delete usuario.senha; // Oculta a senha antes de responder ao front

        return res.status(200).json(usuario);
    });
};

// 4. Atualizar perfil
exports.atualizarPerfil = (req, res) => {
    const usuario = {
        id: req.usuario.id,
        nome: req.body.nome,
        telefone: req.body.telefone,
        cep: req.body.cep,
        cidade: req.body.cidade,
        estado: req.body.estado,
        bairro: req.body.bairro,
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento
    };

    userModel.atualizarUsuario(usuario, (err, result) => {
        if (err) {
            console.error("Erro ao atualizar perfil:", err);
            return res.status(500).json({
                mensagem: "Erro ao atualizar perfil."
            });
        }

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Perfil atualizado com sucesso!"
        });
    });
};

// 5. Excluir perfil
exports.excluirPerfil = (req, res) => {
    userModel.excluirUsuario(req.usuario.id, (err, result) => {
        if (err) {
            console.error("Erro ao excluir perfil:", err);
            return res.status(500).json({
                mensagem: "Erro ao excluir perfil."
            });
        }

        if (!result || result.affectedRows === 0) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Perfil excluído com sucesso!"
        });
    });
};