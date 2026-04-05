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
  // Enable CORS
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

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: "Image URL cannot be empty",
        });
      }

      const imageUrlTrimmed = imageUrl.trim();

      // Try to read CSV files
      const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");

      const testRows = readCSVWithLimit(sampleTestPath, 1000);
      const priceRows = readCSVWithLimit(sampleTestOutPath, 1000);

      // Find matching product
      let matchedProduct = testRows.find(
        (row) => row.image_link && row.image_link.trim() === imageUrlTrimmed
      );

      // Fallback: Partial match
      if (!matchedProduct) {
        matchedProduct = testRows.find(
          (row) =>
            row.image_link &&
            row.image_link.toLowerCase().includes(imageUrlTrimmed.toLowerCase())
        );
      }

      if (!matchedProduct) {
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      const sampleId = matchedProduct.sample_id;
      const description =
        matchedProduct.catalog_content || "No description available";

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
    } catch (error) {
      console.error("Error:", error.message);
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
        return res.status(400).json({
          success: false,
          message: "Missing 'url' query parameter",
        });
      }

      const sampleTestPath = path.join(process.cwd(), "sample_test.csv");
      const sampleTestOutPath = path.join(process.cwd(), "sample_test_out.csv");

      const testRows = readCSVWithLimit(sampleTestPath, 1000);
      const priceRows = readCSVWithLimit(sampleTestOutPath, 1000);

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
        return res.status(404).json({
          success: false,
          found: false,
          message: "No product found with this image URL",
        });
      }

      const sampleId = matchedProduct.sample_id;
      const description =
        matchedProduct.catalog_content || "No description available";

      const priceRow = priceRows.find((row) => row.sample_id === sampleId);
      const price = priceRow ? parseFloat(priceRow.price) : null;

      return res.json({
        success: true,
        found: true,
        description: description,
        price: price,
        message: "Product found successfully",
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Server error: " + error.message,
      });
    }
  }

  res.status(405).json({ message: "Method not allowed" });
}
