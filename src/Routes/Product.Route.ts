import { Router } from "express";
import {
  CreateProduct,
  DeleteProduct,
  GetAllProducts,
  GetProductById,
  UpdateProductByProducId,
} from "../Controllers/Product.Controller";
import { protect } from "../middleware/auth"; // ✅ import middleware

const router = Router();

// ✅ Protect all routes
router.use(protect);

router.post("/create", protect, CreateProduct);
router.patch("/update/:productId", UpdateProductByProducId);
router.delete("/deleteProduct/:productId", DeleteProduct);
router.get("/:productId", GetProductById);
router.get("/all", GetAllProducts);

export default router;
