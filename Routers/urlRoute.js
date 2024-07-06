import express from "express";
import { createShortUrl, getUrlStats, redirectUrl } from "../Controllers/urlController.js";

const router = express.Router();

router.post('/shorten',createShortUrl)
router.get('/:code',redirectUrl);
router.get('/stats',getUrlStats)
export default router;