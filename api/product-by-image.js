const fs = require("fs");
const path = require("path");
const { readCSVWithLimit } = require("../lib/csv-utils");

const PRODUCT_LIMIT = 1000;

// ============================================
// Enable CORS
// ============================================
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ============================================
// API ENDPOINT: Find product by image
// Handles both URL input (POST/GET) and file upload (POST)
// ============================================
async function handler(req, res) {
  setCorsHeaders(res);

  // Handle OPTIONS request for CORS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // ============================================
    // CASE 1: POST with JSON body (imageUrl)
    // ============================================
    if (req.method === "POST" && req.body && req.body.imageUrl) {
      const imageUrl = req.body.imageUrl.trim();

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Image URL cannot be empty",
        });
      }

      // Read first 1,000 rows from sample_test.csv
      const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      const testRows = await readCSVWithLimit(sampleTestPath, PRODUCT_LIMIT);

      // Find matching image (exact match first)
      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === imageUrl
      );

      // Fallback: Partial match
      if (!matchedProduct) {
        matchedProduct = testRows.find(
          (row) =>
            row.image_link &&
            row.image_link.toLowerCase().includes(imageUrl.toLowerCase())
        );
      }

      if (!matchedProduct) {
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      // Extract product info
      const sampleId = matchedProduct.sample_id;
      const description = matchedProduct.catalog_content || "No description available";

      // Read first 1,000 rows from sample_test_out.csv to find price
      const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");
      const priceRows = await readCSVWithLimit(sampleTestOutPath, PRODUCT_LIMIT);

      const priceRow = priceRows.find((row) => row.sample_id === sampleId);
      const price = priceRow ? parseFloat(priceRow.price) : null;

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        source: "url-match",
        message: "Product found successfully",
      });
    }

    // ============================================
    // CASE 2: GET with URL query parameter
    // ============================================
    if (req.method === "GET" && req.query && req.query.url) {
      const imageUrl = req.query.url;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Missing 'url' query parameter",
        });
      }

      // Read first 100 rows from sample_test.csv
      const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      const testRows = await readCSVWithLimit(sampleTestPath, 100);

      // Find matching image (exact match)
      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === imageUrl.trim()
      );

      // Fallback: Partial match
      if (!matchedProduct) {
        matchedProduct = testRows.find(
          (row) =>
            row.image_link &&
            row.image_link.toLowerCase().includes(imageUrl.toLowerCase())
        );
      }

      if (!matchedProduct) {
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      // Extract sample_id and description
      const sampleId = matchedProduct.sample_id;
      const description = matchedProduct.catalog_content || "No description available";

      // Read first 100 rows from sample_test_out.csv to find price
      const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");
      const priceRows = await readCSVWithLimit(sampleTestOutPath, 100);

      // Find matching price
      const priceRow = priceRows.find((row) => row.sample_id === sampleId);

      if (!priceRow || !priceRow.price) {
        return res.status(404).json({
          success: false,
          found: true,
          description: description,
          message: "Product found but price data not available",
        });
      }

      // Extract price
      const price = parseFloat(priceRow.price);

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        message: "Product found successfully",
      });
    }

    // No valid input provided
    return res.status(400).json({
      success: false,
      message: "Please provide either 'imageUrl' in JSON (POST) or 'url' query parameter (GET)",
    });
  } catch (error) {
    console.error("❌ Error in /api/product-by-image:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
}

module.exports = handler;
