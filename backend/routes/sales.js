const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const SalesRecord = require('../models/SalesRecord');

// Multer in-memory storage so we don't save raw files to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper: Parse a cell value to a number safely
const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  const cleaned = String(value).replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper: Get a column value case-insensitively
const getCol = (row, headers, targetName) => {
  const key = headers.find(
    (h) => String(h).trim().toLowerCase() === targetName.toLowerCase()
  );
  return key !== undefined ? row[key] ?? '' : '';
};

// POST /api/sales/upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded.' });

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      return res.status(400).json({ message: 'Only .csv, .xls, .xlsx files are supported.' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Convert to array of arrays to handle all headers
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    if (rawData.length < 2) {
      return res.status(400).json({ message: 'File contains no data rows.' });
    }

    const headers = rawData[0].map((h) => String(h).trim());
    const dataRows = rawData.slice(1);

    let lastStoreName = "";
    const records = dataRows
      .filter((row) => row.some((cell) => cell !== '')) // skip empty rows
      .map((row) => {
        // Build an object keyed by header
        const rowObj = {};
        headers.forEach((h, i) => { rowObj[h] = row[i] ?? ''; });

        let currentStoreName = String(getCol(rowObj, headers, 'STORE NAME')).trim();
        if (currentStoreName !== "") {
          lastStoreName = currentStoreName;
        } else if (lastStoreName !== "") {
          currentStoreName = lastStoreName;
        }

        return {
          storeName: currentStoreName,
          brand: String(getCol(rowObj, headers, 'BRAND')).trim(),
          product: String(getCol(rowObj, headers, 'PRODUCT')).trim(),
          serialNo: String(getCol(rowObj, headers, 'SERIAL NO')).trim(),
          billValue: parseNumber(getCol(rowObj, headers, 'BILL VALUE')),
          billDate: String(getCol(rowObj, headers, 'BILL DATE')).trim(),
          customerName: String(getCol(rowObj, headers, 'CUSTOMER NAME')).trim(),
          customerContact: String(getCol(rowObj, headers, 'CUSTOMER CONTACT')).trim(),
          customerEmail: String(getCol(rowObj, headers, 'CUSTOMER EMAIL ID')).trim(),
          brandWarranty: String(getCol(rowObj, headers, 'BRAND WARRANTY')).trim(),
          extendedWarranty: String(getCol(rowObj, headers, 'EXTENDED WARRANTY')).trim(),
          activationValue: parseNumber(getCol(rowObj, headers, 'ACTIVATION VALUE')),
          billNo: String(getCol(rowObj, headers, 'BILL NO')).trim(),
          orderId: String(getCol(rowObj, headers, 'Order id')).trim(),
          maiYesNo: String(getCol(rowObj, headers, 'mai yes/ no')).trim(),
          payment: String(getCol(rowObj, headers, 'Payment')).trim(),
          dateReceived: String(getCol(rowObj, headers, 'Date received')).trim(),
        };
      });

    await SalesRecord.insertMany(records);

    res.json({ message: `${records.length} records uploaded successfully.`, count: records.length });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Error processing file.', error: error.message });
  }
});

// GET /api/sales/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const records = await SalesRecord.find().sort({ uploadedAt: -1 }).lean();

    const overallRevenue = records.reduce((sum, r) => sum + (r.activationValue || 0), 0);
    const storeShare = overallRevenue * 0.45;
    const vecareShare = overallRevenue * 0.55;

    res.json({
      kpis: { overallRevenue, storeShare, vecareShare },
      records,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Error fetching dashboard data.', error: error.message });
  }
});

// DELETE /api/sales/clear  (optional: clear all records)
router.delete('/clear', async (req, res) => {
  try {
    await SalesRecord.deleteMany({});
    res.json({ message: 'All records cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing records.', error: error.message });
  }
});

module.exports = router;
