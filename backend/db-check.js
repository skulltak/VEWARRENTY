const mongoose = require('mongoose');

function normalizeStoreName(name) {
  if (!name) return "";
  let clean = name.trim().toUpperCase();
  if (clean.includes("BHAWAL") || clean.includes("BHAVAL")) {
    return "Bhawal Appliance";
  }
  if (clean.includes("SHABRI") || clean.includes("SHABARI")) {
    return "Shabri Electronic";
  }
  if (clean.includes("AKSHAR")) {
    return "Akshar Digital";
  }
  if (clean.includes("CELL CITY")) {
    return "Cell City";
  }
  if (clean.includes("RAM RATAN")) {
    return "Ram Ratan";
  }
  if (clean.includes("MECHRANA")) {
    return "Mechrana LLP";
  }
  if (clean.includes("E-TECH") || clean.includes("E- TECH") || clean.includes("ETECH")) {
    return "E-Tech Electronic";
  }
  if (clean.includes("R A S") || clean.includes("RAS COMPUTER")) {
    return "R A S Computer";
  }
  return name;
}

async function check() {
  await mongoose.connect('mongodb://localhost:27017/vewarrenty');
  const collection = mongoose.connection.collection('salesrecords');
  const docs = await collection.find({}).toArray();
  
  const groups = {};
  docs.forEach(doc => {
    const norm = normalizeStoreName(doc.storeName);
    if (!norm) return;
    if (!groups[norm]) {
      groups[norm] = {
        count: 0,
        activation: 0,
        doneActivation: 0,
        bill: 0,
        payments: new Set(),
        mais: new Set()
      };
    }
    groups[norm].count++;
    groups[norm].activation += doc.activationValue || 0;
    groups[norm].bill += doc.billValue || 0;
    groups[norm].payments.add(doc.payment);
    groups[norm].mais.add(doc.maiYesNo);
    if (String(doc.payment).trim().toUpperCase() === "DONE") {
      groups[norm].doneActivation += doc.activationValue || 0;
    }
  });

  console.log("Normalized Groups:");
  Object.keys(groups).forEach(key => {
    const g = groups[key];
    console.log(`Store: "${key}"`);
    console.log(`  Count: ${g.count}`);
    console.log(`  Billed Amount (Activation): ${g.activation}`);
    console.log(`  Done Activation: ${g.doneActivation}`);
    console.log(`  Pending Activation: ${g.activation - g.doneActivation}`);
    console.log(`  Payments: ${JSON.stringify([...g.payments])}`);
    console.log(`  Mais: ${JSON.stringify([...g.mais])}`);
  });

  await mongoose.disconnect();
}

check().catch(console.error);
