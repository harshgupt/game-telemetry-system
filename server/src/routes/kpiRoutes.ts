import { Router } from "express";
import { getKPIs, getHourlyTrends } from "../controllers/kpiController.js";

const router = Router();

// GET ".../api/kpis"
router.get("/", getKPIs);

// GET ".../api/kpis/hourly"
router.get("/hourly", getHourlyTrends);

export default router;
