const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const fileUpload = require("express-fileupload");

const app = express();
app.use(cors());
app.use(fileUpload()); // Enable file upload support
app.use(express.json()); // Parse JSON request bodies

let products = [];
const filePath = path.join(__dirname, "../dataset/test.csv");
const PRODUCT_LIMIT = 1000; // Load only top 1,000 products for faster loading

let rowCount = 0;
fs.createReadStream(filePath)
  .pipe(csv())
  .on("data", (row) => {
    if (rowCount < PRODUCT_LIMIT) {
      products.push(row);
      rowCount++;
    }
  })
  .on("end", () => {
    console.log("✅ CSV Loaded:", products.length, "products (limited to top 1,000)");
  });

// ============================================
// HELPER FUNCTION: Read CSV with row limit
// ============================================
function readCSVWithLimit(csvFilePath, limitRows = 1000) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let rowCount = 0;

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        if (rowCount < limitRows) {
          rows.push(row);
          rowCount++;
        }
      })
      .on("end", () => {
        resolve(rows);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// ============================================
// API ENDPOINT: Find product by image (POST)
// Handles both URL input and file upload
// ============================================
app.post("/product-by-image", async (req, res) => {
  try {
    // CASE 1: URL Input (JSON body)
    if (req.body.imageUrl) {
      const imageUrl = req.body.imageUrl.trim();

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Image URL cannot be empty",
        });
      }

      // Read first 1,000 rows from sample_test.csv
      const sampleTestPath = path.join(__dirname, "../sample_test.csv");
      const testRows = await readCSVWithLimit(sampleTestPath, PRODUCT_LIMIT);

      // Find matching image (exact match first)
      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === imageUrl
      );

      // Fallback: Partial match (e.g., URL without protocol)
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
      const sampleTestOutPath = path.join(__dirname, "../sample_test_out.csv");
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

    // CASE 2: File Upload
    if (req.files && req.files.imageFile) {
      const uploadedFile = req.files.imageFile;
      const filename = uploadedFile.name.toLowerCase();

      // Validate file type (images only)
      const validImageTypes = ["jpg", "jpeg", "png", "gif", "webp"];
      const fileExt = filename.split(".").pop();

      if (!validImageTypes.includes(fileExt)) {
        return res.status(400).json({
          success: false,
          message: `Invalid file type. Accepted: ${validImageTypes.join(", ")}`,
        });
      }

      // Read first 1,000 rows from sample_test.csv
      const sampleTestPath = path.join(__dirname, "../sample_test.csv");
      const testRows = await readCSVWithLimit(sampleTestPath, PRODUCT_LIMIT);

      // ============================================
      // SIMULATED MATCHING (for demo purposes)
      // TODO: Replace with real ML image similarity model
      // ============================================
      // For now, try to match filename keywords in product descriptions
      const filenameKeywords = filename
        .replace(/[._-]/g, " ")
        .split(" ")
        .filter((word) => word.length > 2);

      let matchedProduct = null;

      // Try keyword matching in descriptions
      if (filenameKeywords.length > 0) {
        matchedProduct = testRows.find((row) => {
          const content = (row.catalog_content || "").toLowerCase();
          return filenameKeywords.some((keyword) => content.includes(keyword));
        });
      }

      // Fallback: Return first product from 100 rows (placeholder behavior)
      if (!matchedProduct) {
        matchedProduct = testRows[0];
      }

      if (!matchedProduct) {
        return res.status(404).json({
          success: false,
          found: false,
          message: "No products available in sample set",
        });
      }

      // Extract product info
      const sampleId = matchedProduct.sample_id;
      const description = matchedProduct.catalog_content || "No description available";

      // Read first 1,000 rows from sample_test_out.csv to find price
      const sampleTestOutPath = path.join(__dirname, "../sample_test_out.csv");
      const priceRows = await readCSVWithLimit(sampleTestOutPath, PRODUCT_LIMIT);

      const priceRow = priceRows.find((row) => row.sample_id === sampleId);
      const price = priceRow ? parseFloat(priceRow.price) : null;

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        source: "file-upload-simulated",
        filename: uploadedFile.name,
        message: "Product matched (simulated - using filename & descriptions)",
      });
    }

    // No input provided
    return res.status(400).json({
      success: false,
      message: "Please provide either 'imageUrl' in JSON or upload an 'imageFile'",
    });
  } catch (error) {
    console.error("❌ Error in POST /product-by-image:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

// ============================================
// API ENDPOINT: Find product by image URL (GET)
// Kept for backward compatibility
// ============================================
app.get("/product-by-image", async (req, res) => {
  try {
    const imageUrl = req.query.url;

    // Validation
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Missing 'url' query parameter",
      });
    }

    // Read first 100 rows from sample_test.csv
    const sampleTestPath = path.join(__dirname, "../sample_test.csv");
    const testRows = await readCSVWithLimit(sampleTestPath, 100);

    // Find matching image (exact match)
    let matchedProduct = testRows.find(
      (row) => row.image_link && row.image_link.trim() === imageUrl.trim()
    );

    // Fallback: Partial match (useful for URL variations)
    if (!matchedProduct) {
      matchedProduct = testRows.find(
        (row) =>
          row.image_link &&
          row.image_link.toLowerCase().includes(imageUrl.toLowerCase())
      );
    }

    // If no match found
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
    const sampleTestOutPath = path.join(__dirname, "../sample_test_out.csv");
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
  } catch (error) {
    console.error("❌ Error in /product-by-image:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const product = products.find((p) => p.asin === req.params.id);
  product ? res.json(product) : res.status(404).json({ message: "Not found" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`⚙️ Server running on port ${PORT}`));
