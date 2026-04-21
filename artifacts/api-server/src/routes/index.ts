import { Router, type IRouter } from "express";
import healthRouter from "./health";
import generateRouter from "./generate";
import downloadRouter from "./download";
import checkoutRouter from "./checkout";

const router: IRouter = Router();

router.use(healthRouter);
router.use(generateRouter);
router.use(downloadRouter);
router.use(checkoutRouter);

export default router;
