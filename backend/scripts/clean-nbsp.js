import { connectDatabase } from "../src/database/connection.js";
import { Product } from "../src/models/index.js";

const cleanNbsp = async () => {
  await connectDatabase();
  console.log("Connected to DB, scanning products for NBSP...");

  const products = await Product.find({});
  let updatedCount = 0;

  for (const product of products) {
    let modified = false;

    if (product.content && (product.content.includes("\u00A0") || product.content.includes("&nbsp;"))) {
      product.content = product.content.replace(/&nbsp;|\u00A0/g, " ");
      modified = true;
    }

    if (product.shortDescription && (product.shortDescription.includes("\u00A0") || product.shortDescription.includes("&nbsp;"))) {
      product.shortDescription = product.shortDescription.replace(/&nbsp;|\u00A0/g, " ");
      modified = true;
    }

    if (product.name && (product.name.includes("\u00A0") || product.name.includes("&nbsp;"))) {
      product.name = product.name.replace(/&nbsp;|\u00A0/g, " ");
      modified = true;
    }

    if (modified) {
      await product.save();
      updatedCount++;
    }
  }

  console.log(`Successfully cleaned NBSP from ${updatedCount} products.`);
  process.exit(0);
};

cleanNbsp().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
