import { Router } from "express";
import {
  CreateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  UpdateProductByProducId,
} from "../Controllers/Product.Controller";

const router = Router();

router.post("/create", CreateProduct);
router.patch("/update/:productId", UpdateProductByProducId);
router.delete("/deleteProduct/:productId", DeleteProduct);
router.get("/:productId", GetProductById);
router.get("/all", GetAllProducts);

export default router;
