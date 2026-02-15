const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const dmController = require("../controllers/dm.controller");

router.post("/create", verifyToken, dmController.getOrCreateDM);
router.get("/workspace/:workspaceId", verifyToken, dmController.getWorkspaceDMs);
router.get("/:dmId/messages", verifyToken, dmController.getDMMessages);

module.exports = router;
