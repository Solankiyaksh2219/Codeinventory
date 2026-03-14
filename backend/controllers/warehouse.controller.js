const Warehouse = require("../models/Warehouse");

exports.addWarehouse = async (req, res) => {
  const warehouse = await Warehouse.create(req.body);
  res.json(warehouse);
};

exports.getWarehouses = async (req, res) => {
  const data = await Warehouse.find();
  res.json(data);
};