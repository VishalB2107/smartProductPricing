import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple CSV parser function
function parseCSV(data) {
  const lines = data.toString().split("\n");
  const headers = lines[0].split(",");
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const obj = {};
    const line = lines[i];
    
    // Handle CSV with quoted fields
    let currentField = "";
    let inQuotes = false;
    let fieldIndex = 0;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        obj[headers[fieldIndex].trim()] = currentField.replace(/^"|"$/g, "");
        currentField = "";
        fieldIndex++;
      } else {
        currentField += char;
      }
    }
    
    if (fieldIndex < headers.length) {
      obj[headers[fieldIndex].trim()] = currentField.replace(/^"|"$/g, "");
    }
    
    result.push(obj);
  }
  
  return result;
}

function readCSVWithLimit(filePath, limitRows = 1000) {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const rows = parseCSV(data);
    return rows.slice(0, limitRows);
  } catch (error) {
    console.error("Error reading CSV:", error);
    return [];
  }
}

export default function handler(req, res) {
  // Log environment info
  console.log("🔧 Environment:", {
    nodeEnv: process.env.NODE_ENV,
    cwd: process.cwd(),
    platform: process.platform,
    timestamp: new Date().toISOString()
  });

  // Enable CORS for all origins
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  console.log("📊 Request:", {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        console.error("❌ Error: Image URL is empty");
        return res.status(400).json({
          success: false,
          message: "Image URL cannot be empty",
        });
      }

      const imageUrlTrimmed = imageUrl.trim();
      console.log("🔍 Searching for image URL:", imageUrlTrimmed);

      // Try to read CSV files - try multiple paths
      let sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      let sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");
      
      console.log("📁 Looking for CSV files at:", process.cwd());
      console.log("📄 Test CSV path:", sampleTestPath);
      console.log("📄 Price CSV path:", sampleTestOutPath);

      // Check if files exist
      const testFileExists = fs.existsSync(sampleTestPath);
      const priceFileExists = fs.existsSync(sampleTestOutPath);
      
      console.log("✅ Test CSV exists:", testFileExists);
      console.log("✅ Price CSV exists:", priceFileExists);

      const testRows = readCSVWithLimit(sampleTestPath, 1000);
      const priceRows = readCSVWithLimit(sampleTestOutPath, 1000);

      console.log("📊 Loaded test rows:", testRows.length);
      console.log("💰 Loaded price rows:", priceRows.length);

      if (testRows.length === 0) {
        console.error("❌ Error: No test data loaded from CSV");
        return res.status(500).json({
          success: false,
          message: "Failed to load product database. CSV files not found or empty.",
        });
      }

      if (priceRows.length === 0) {
        console.error("❌ Error: No price data loaded from CSV");
        return res.status(500).json({
          success: false,
          message: "Failed to load price data. CSV files not found or empty.",
        });
      }

      // Find matching product
      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === imageUrlTrimmed
      );

      console.log("🔎 Exact match found:", !!matchedProduct);

      // Fallback: Partial match
      if (!matchedProduct) {
        matchedProduct = testRows.find(
          (row) =>
            row.image_link &&
            row.image_link.toLowerCase().includes(imageUrlTrimmed.toLowerCase())
        );
        console.log("🔎 Partial match found:", !!matchedProduct);
      }

      if (!matchedProduct) {
        console.error("❌ Error: No product found matching image URL");
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      const sampleId = matchedProduct.sample_id;
      const description =
        matchedProduct.catalog_content || "No description available";

      console.log("✅ Matched product ID:", sampleId);
      
      // Convert sample_id to string for matching
      const priceRow = priceRows.find((row) => row.sample_id.toString() === sampleId.toString());
      
      console.log("💰 Price row found:", !!priceRow);
      if (priceRow) {
        console.log("💰 Price:", priceRow.price);
      }

      const price = priceRow ? parseFloat(priceRow.price) : null;

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        source: "url-match",
        message: "Product found successfully",
      });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      console.error("📍 Stack trace:", error.stack);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  }

  if (req.method === "GET") {
    try {
      const { url } = req.query;

      if (!url) {
        console.error("❌ Error: URL query parameter is missing");
        return res.status(400).json({
          success: false,
          message: "Missing 'url' query parameter",
        });
      }

      const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");

      console.log("🔍 GET Request: Searching for image URL:", url);
      console.log("✅ Test CSV exists:", fs.existsSync(sampleTestPath));
      console.log("✅ Price CSV exists:", fs.existsSync(sampleTestOutPath));

      const testRows = readCSVWithLimit(sampleTestPath, 1000);
      const priceRows = readCSVWithLimit(sampleTestOutPath, 1000);

      console.log("📊 Loaded test rows:", testRows.length);
      console.log("💰 Loaded price rows:", priceRows.length);

      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === url.trim()
      );

      if (!matchedProduct) {
        matchedProduct = testRows.find(
          (row) =>
            row.image_link &&
            row.image_link.toLowerCase().includes(url.toLowerCase())
        );
      }

      if (!matchedProduct) {
        console.error("❌ Error: No product found matching image URL");
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      const sampleId = matchedProduct.sample_id;
      const description =
        matchedProduct.catalog_content || "No description available";

      const priceRow = priceRows.find((row) => row.sample_id.toString() === sampleId.toString());
      const price = priceRow ? parseFloat(priceRow.price) : null;

      console.log("✅ Product found - ID:", sampleId, "Price:", price);

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        message: "Product found successfully",
      });
    } catch (error) {
      console.error("❌ Server Error:", error.message);
      console.error("📍 Stack trace:", error.stack);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}

// Health check endpoint - useful for debugging
export async function healthCheck(req, res) {
  console.log("💚 Health check requested");
  
  const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
  const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");
  
  return res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    cwd: process.cwd(),
    files: {
      testCsv: {
        path: sampleTestPath,
        exists: fs.existsSync(sampleTestPath),
        size: fs.existsSync(sampleTestPath) ? fs.statSync(sampleTestPath).size : 0
      },
      priceCsv: {
        path: sampleTestOutPath,
        exists: fs.existsSync(sampleTestOutPath),
        size: fs.existsSync(sampleTestOutPath) ? fs.statSync(sampleTestOutPath).size : 0
      }
    }
  });
}
