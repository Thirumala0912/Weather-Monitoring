const express = require("express");
const router = express.Router();

const { setAlert } = require("../controllers/alertController");

router.post("/setAlert", setAlert);

module.exports = router;