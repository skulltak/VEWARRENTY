const mongoose = require('mongoose');

const SalesRecordSchema = new mongoose.Schema({
  storeName: { type: String, default: '' },
  brand: { type: String, default: '' },
  product: { type: String, default: '' },
  serialNo: { type: String, default: '' },
  billValue: { type: Number, default: 0 },
  billDate: { type: String, default: '' },
  customerName: { type: String, default: '' },
  customerContact: { type: String, default: '' },
  customerEmail: { type: String, default: '' },
  brandWarranty: { type: String, default: '' },
  extendedWarranty: { type: String, default: '' },
  activationValue: { type: Number, default: 0 },
  billNo: { type: String, default: '' },
  orderId: { type: String, default: '' },
  maiYesNo: { type: String, default: '' },
  payment: { type: String, default: '' },
  dateReceived: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SalesRecord', SalesRecordSchema);
