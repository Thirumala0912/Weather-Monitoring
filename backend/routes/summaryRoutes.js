const express = require("express");
const router = express.Router();

const { getSummary } = require("../controllers/summaryController");

router.get("/summaries/:city", getSummary);

module.exports = router;