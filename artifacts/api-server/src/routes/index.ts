import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateRouter from "./generate";
import downloadRouter from "./download";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateRouter);
router.use(downloadRouter);

export default router;
