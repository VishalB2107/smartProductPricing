const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const PRODUCT_LIMIT = 1000;
let cachedProducts = null;

// ============================================
// Enable CORS
// ============================================
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ============================================
// Load all products from train.csv (cached)
// ============================================
async function loadProducts() {
  if (cachedProducts) {
    return cachedProducts;
  }

  return new Promise((resolve, reject) => {
    const products = [];
    let rowCount = 0;
    const filePath = path.join(process.cwd(), "dataset", "train.csv");

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (rowCount < PRODUCT_LIMIT) {
          products.push(row);
          rowCount++;
        }
      })
      .on("end", () => {
        cachedProducts = products;
        resolve(products);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// ============================================
// API ENDPOINT: Get all products or specific product by ID
// GET /api/products - Returns all products
// GET /api/products?id=ASIN - Returns specific product
// ============================================
async function handler(req, res) {
  console.log("API HIT: /api/products");

  setCorsHeaders(res);

  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed. Use GET."
    });
  }

  try {
    const products = await loadProducts();

    // ============================================
    // Case 1: Get specific product by ID
    // ============================================
    if (req.query.id) {
      const product = products.find((p) => p.asin === req.query.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: product
      });
    }

    // ============================================
    // Case 2: Get all products
    // ============================================
    return res.status(200).json({
      success: true,
      data: {
        count: products.length,
        products: products
      }
    });
  } catch (error) {
    console.error("❌ Error in /api/products:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error: " + error.message
    });
  }
}

module.exports = handler;
