const express = require("express");
const router = express.Router();
const controller = require("../controllers/warehouse.controller");

router.post("/add", controller.addWarehouse);
router.get("/list", controller.getWarehouses);

module.exports = router;