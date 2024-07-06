import express from "express";
import { createShortUrl, redirectUrl } from "../Controllers/urlController.js";

const router = express.Router();

router.post('/shorten',createShortUrl)
router.get('/:code',redirectUrl);

export default router;