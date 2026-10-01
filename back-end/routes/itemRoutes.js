const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const verificarToken = require("../middleware/auth");
const upload = require("../middleware/upload");

// Públicas
router.get("/categorias", itemController.listarCategorias);
router.get("/", itemController.listarItens);
router.get("/:id", itemController.buscarItem);

// Protegidas
router.post("/", verificarToken, upload.single("imagem"), itemController.criarItem);
router.put("/:id", verificarToken, itemController.atualizarItem);
router.put("/:id/status", verificarToken, itemController.atualizarStatus);
router.delete("/:id", verificarToken, itemController.excluirItem);

module.exports = router;
