const express = require("express");
const router = express.Router();
const controller = require("../controllers/comentarioController");
const verificarToken = require("../middleware/auth");

router.get("/:itemId", controller.listar);
router.post("/:itemId", verificarToken, controller.criar);
router.delete("/:id", verificarToken, controller.excluir);

module.exports = router;
