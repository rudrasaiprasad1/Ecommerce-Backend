import { Request, Response } from "express";
import Product from "../Models/Product";

export const CreateProduct = async (
  req: Request,
  rsp: Response
  //   next: NextFunction
) => {
  try {
    const { productId, productName } = req.body;
    console.log(productId, productName);
    const saved = await Product.create({
      productId: productId,
      productName: productName,
    });
    return rsp.status(201).json(saved);
  } catch (error) {
    if (error instanceof Error) {
      return rsp.status(400).json({ error: error.message });
    }
  }
};
export const GetProductById = async (
  req: Request,
  rsp: Response
  //   next: NextFunction
) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const product = await Product.findById({
      _id: productId,
    });
    return rsp.status(201).json(product);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rsp.status(500).json({ error: error.message });
    }
  }
};
export const GetAllProducts = async (
  req: Request,
  rsp: Response
  //   next: NextFunction
) => {
  try {
    const products = await Product.find();
    return rsp.status(201).json(products);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rsp.status(500).json({ error: error.message });
    }
  }
};
export const UpdateProductByProducId = async (
  req: Request,
  rsp: Response
  //   next: NextFunction
) => {
  try {
    const { productName } = req.body;
    const { productId } = req.params;
    console.log(productId, productName);
    const reQuestBody = {
      productId: productId,
      productName: productName,
    };
    const updated = await Product.findByIdAndUpdate(productId, reQuestBody, {
      new: true,
    });
    return rsp.status(201).json(updated);
  } catch (error) {
    if (error instanceof Error) {
      return rsp.status(400).json({ error: error.message });
    }
  }
};

export const DeleteProduct = async (
  req: Request,
  rsp: Response
  //   next: NextFunction
) => {
  try {
    const { productId } = req.params;
    console.log(productId);
    const deleted = await Product.findByIdAndDelete({
      _id: productId,
    });
    return rsp.status(201).json(deleted);
  } catch (error) {
    if (error instanceof Error) {
      return rsp.status(400).json({ error: error.message });
    }
  }
};
