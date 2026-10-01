const multer = require("multer");
const path = require("path");

// Configuração do local de armazenamento e nome do arquivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"));
    },
    filename: (req, file, cb) => {
        // Gera um nome único: timestamp + número aleatório + extensão original
        const sufixoUnico = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const extensao = path.extname(file.originalname).toLowerCase();
        cb(null, `${file.fieldname}-${sufixoUnico}${extensao}`);
    }
});

// Filtro de segurança para permitir APENAS imagens
const fileFilter = (req, file, cb) => {
    const tiposPermitidos = /jpeg|jpg|png|webp/;
    const extensaoValida = tiposPermitidos.test(path.extname(file.originalname).toLowerCase());
    const mimeTypeValido = tiposPermitidos.test(file.mimetype);

    if (extensaoValida && mimeTypeValido) {
        return cb(null, true);
    } else {
        return cb(new Error("Apenas arquivos de imagem (JPG, JPEG, PNG, WEBP) são permitidos!"), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB por imagem
    },
    fileFilter: fileFilter
});

module.exports = upload;