import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from "../services/product.service.js";

export const listProducts = async (req, res) => {
  const data = await getProducts(req.query);
  res.json({ success: true, data });
};

export const getProduct = async (req, res) => {
  const data = await getProductById(req.params.id);
  res.json({ success: true, data });
};

export const storeProduct = async (req, res) => {
  const data = await createProduct(req.validated.body);
  res.status(201).json({ success: true, message: "Product created", data });
};

export const editProduct = async (req, res) => {
  const data = await updateProduct(req.params.id, req.validated.body);
  res.json({ success: true, message: "Product updated", data });
};

export const destroyProduct = async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ success: true, message: "Product deleted" });
};
