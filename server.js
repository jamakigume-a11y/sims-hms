require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── CORS preflight fix ────────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(cors());
app.use(express.json());

// ─── MongoDB Connection ────────────────────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas — SIMS HMS'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── SIMS HOSPITAL SPECIALIZATIONS ────────────────────────────────────────────
const SIMS_SPECIALIZATIONS = [
  'Cardiology & Cardiac Surgery',
  'Neurology & Neurosurgery',
  'Nephrology & Urology',
  'Gastroenterology & Hepatology',
  'Orthopaedics & Joint Replacement',
  'Oncology & Cancer Care',
  'Pulmonology & Respiratory Medicine',
  'Endocrinology & Diabetology',
  'Rheumatology & Immunology',
  'Plastic Surgery & Aesthetics',
  'General Medicine',
  'General Surgery',
  'Pediatrics & Neonatology',
  'Obstetrics & Gynaecology',
  'Ophthalmology',
  'ENT (Ear, Nose & Throat)',
  'Dermatology',
  'Psychiatry & Psychology',
  'Radiology & Imaging',
  'Anaesthesiology & Critical Care',
  'Emergency Medicine',
  'Organ Transplant',
  'Physiotherapy & Rehabilitation',
  'Dietetics & Nutrition'
];

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  qualification: { type: String, default: '' },
  department: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, default: '', trim: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  bloodGroup: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  chiefComplaint: { type: String, required: true },
  assignedDoctorId: { type: String, default: '' },
  insuranceProvider: { type: String, default: '' },
  insurancePolicyNo: { type: String, default: '' },
  isIPD: { type: Boolean, default: false },
  wardBed: { type: String, default: '' },
  admittedAt: { type: Date, default: null },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

const encounterSchema = new mongoose.Schema({
  encounterId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  doctorName: { type: String, required: true },
  specialization: { type: String, default: '' },
  diagnosis: { type: String, required: true },
  icdCode: { type: String, default: '' },
  notes: { type: String, default: '' },
  vitals: {
    bp: { type: String, default: '' },
    pulse: { type: String, default: '' },
    temp: { type: String, default: '' },
    spo2: { type: String, default: '' },
    weight: { type: String, default: '' },
    height: { type: String, default: '' }
  },
  followUpDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const labTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  encounterId: { type: String, required: true, index: true },
  patientId: { type: String, required: true },
  patientName: { type: String, default: '' },
  testName: { type: String, required: true },
  testCategory: { type: String, default: 'General' },
  urgency: { type: String, enum: ['ROUTINE', 'URGENT', 'STAT'], default: 'ROUTINE' },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED'], default: 'PENDING', index: true },
  result: { type: String, default: null },
  referenceRange: { type: String, default: '' },
  remarks: { type: String, default: '' },
  orderedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, unique: true },
  encounterId: { type: String, required: true, index: true },
  patientId: { type: String, required: true },
  patientName: { type: String, default: '' },
  doctorName: { type: String, default: '' },
  medicines: [{
    medicineName: String,
    dosage: String,
    frequency: String,
    duration: String,
    route: { type: String, default: 'Oral' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 50 },
    instructions: { type: String, default: '' }
  }],
  status: { type: String, enum: ['PENDING', 'ISSUED'], default: 'PENDING' },
  issuedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const billSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  patientName: { type: String, default: '' },
  prescriptionId: { type: String, default: null },
  type: { type: String, enum: ['REGISTRATION', 'PHARMACY', 'LABORATORY', 'RADIOLOGY', 'PROCEDURE', 'IPD'], required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  netAmount: { type: Number },
  paymentMode: { type: String, enum: ['CASH', 'CARD', 'UPI', 'INSURANCE', 'PENDING'], default: 'PENDING' },
  paymentStatus: { type: String, enum: ['PAID', 'PENDING', 'PARTIAL'], default: 'PENDING' },
  gst: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String, required: true },
  module: { type: String, default: 'general' },
  userId: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Encounter = mongoose.model('Encounter', encounterSchema);
const LabTest = mongoose.model('LabTest', labTestSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const Bill = mongoose.model('Bill', billSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// ─── HELPER ───────────────────────────────────────────────────────────────────
async function logActivity(action, description, module = 'general') {
  try {
    await ActivityLog.create({ action, description, module });
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hospital: 'SIMS Hospital Chennai',
    message: 'SIMS HMS Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/specializations', (req, res) => {
  res.json(SIMS_SPECIALIZATIONS);
});

// ─── DOCTOR ROUTES ────────────────────────────────────────────────────────────
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find().sort({ registeredAt: -1 });
    res.json(doctors);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: e.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialization, phone, email, qualification, department } = req.body;
    if (!name || !specialization) return res.status(400).json({ error: 'Name and specialization are required' });
    const doctorId = 'SIMS-DOC' + Date.now();
    const doctor = await Doctor.create({ doctorId, name, specialization, phone, email, qualification, department });
    await logActivity('Doctor Registered', `Dr. ${name} (${specialization}) registered`, 'admin');
    res.status(201).json(doctor);
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: e.message });
    res.status(500).json({ error: 'Failed to register doctor', details: e.message });
  }
});

// ─── PATIENT ROUTES ───────────────────────────────────────────────────────────
app.get('/api/patients', async (req, res) => {
  try {
    const patients = await Patient.find().sort({ registeredAt: -1 });
    res.json(patients);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch patients', details: e.message });
  }
});

app.get('/api/patients/:id', async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.json(patient);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch patient', details: e.message });
  }
});

app.post('/api/patients', async (req, res) => {
  try {
    const {
      firstName, lastName, age, gender, phone, address,
      bloodGroup, emergencyContact, chiefComplaint, assignedDoctorId,
      insuranceProvider, insurancePolicyNo, isIPD, wardBed
    } = req.body;

    if (!firstName || !age || !gender || !chiefComplaint) {
      return res.status(400).json({ error: 'First name, age, gender, and chief complaint are required' });
    }
    if (!assignedDoctorId) {
      return res.status(400).json({ error: 'Please assign a doctor to the patient' });
    }

    const patientId = 'SIMS-PAT' + Date.now();
    const patient = await Patient.create({
      patientId, firstName, lastName, age, gender, phone, address,
      bloodGroup, emergencyContact, chiefComplaint, assignedDoctorId,
      insuranceProvider, insurancePolicyNo, isIPD: isIPD || false,
      wardBed: wardBed || '', admittedAt: isIPD ? new Date() : null
    });

    // Auto-create registration bill (SIMS consultation: ₹800 OPD, ₹1500 IPD)
    const consultFee = isIPD ? 1500 : 800;
    const billId = 'SIMS-BILL' + Date.now();
    const bill = await Bill.create({
      billId,
      patientId,
      patientName: `${firstName} ${lastName || ''}`.trim(),
      type: 'REGISTRATION',
      items: [{ name: isIPD ? 'IPD Admission Fee' : 'OPD Consultation Fee', quantity: 1, price: consultFee, total: consultFee }],
      totalAmount: consultFee,
      netAmount: consultFee,
      paymentStatus: 'PENDING'
    });

    await logActivity('Patient Registered', `${patientId} - ${firstName} ${lastName || ''} → Dr. ${assignedDoctorId}`, 'reception');
    res.status(201).json({ patient, bill });
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: e.message });
    res.status(500).json({ error: 'Failed to register patient', details: e.message });
  }
});

// ─── ENCOUNTER ROUTES ─────────────────────────────────────────────────────────
app.get('/api/encounters', async (req, res) => {
  try {
    const encounters = await Encounter.find().sort({ createdAt: -1 });
    res.json(encounters);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch encounters', details: e.message });
  }
});

app.get('/api/encounters/patient/:patientId', async (req, res) => {
  try {
    const encounters = await Encounter.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(encounters);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch encounters', details: e.message });
  }
});

app.post('/api/encounters', async (req, res) => {
  try {
    const { patientId, doctorName, specialization, diagnosis, icdCode, notes, vitals, followUpDate } = req.body;
    if (!patientId || !doctorName || !diagnosis) {
      return res.status(400).json({ error: 'Patient ID, doctor name, and diagnosis are required' });
    }
    const encounterId = 'SIMS-ENC' + Date.now();
    const encounter = await Encounter.create({
      encounterId, patientId, doctorName, specialization: specialization || '',
      diagnosis, icdCode: icdCode || '', notes: notes || '',
      vitals: vitals || {}, followUpDate: followUpDate || null
    });
    await logActivity('Encounter Created', `${encounterId} by Dr. ${doctorName} for ${patientId}`, 'doctor');
    res.status(201).json(encounter);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create encounter', details: e.message });
  }
});

// ─── LAB TEST ROUTES ──────────────────────────────────────────────────────────
app.get('/api/labtests', async (req, res) => {
  try {
    const { status, urgency } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (urgency) filter.urgency = urgency;
    const tests = await LabTest.find(filter).sort({ orderedAt: -1 });
    res.json(tests);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch lab tests', details: e.message });
  }
});

app.get('/api/labtests/encounter/:encounterId', async (req, res) => {
  try {
    const tests = await LabTest.find({ encounterId: req.params.encounterId }).sort({ orderedAt: -1 });
    res.json(tests);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch lab tests', details: e.message });
  }
});

app.post('/api/labtests/bulk', async (req, res) => {
  try {
    const { encounterId, patientId, patientName, tests } = req.body;
    if (!encounterId || !patientId || !tests || !Array.isArray(tests)) {
      return res.status(400).json({ error: 'encounterId, patientId, and tests array are required' });
    }
    const created = [];
    for (const test of tests) {
      const testId = 'SIMS-LAB' + Date.now() + Math.random().toString(36).substr(2, 4).toUpperCase();
      const labTest = await LabTest.create({
        testId, encounterId, patientId,
        patientName: patientName || '',
        testName: test.testName,
        testCategory: test.testCategory || 'General',
        urgency: test.urgency || 'ROUTINE',
        referenceRange: test.referenceRange || ''
      });
      created.push(labTest);
    }
    await logActivity('Lab Tests Ordered', `${tests.length} test(s) for ${patientId} (Encounter: ${encounterId})`, 'lab');
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to order lab tests', details: e.message });
  }
});

app.put('/api/labtests/:testId/result', async (req, res) => {
  try {
    const { result, remarks, referenceRange } = req.body;
    if (!result || !result.trim()) return res.status(400).json({ error: 'Result is required' });
    const test = await LabTest.findOneAndUpdate(
      { testId: req.params.testId },
      { result, remarks: remarks || '', referenceRange: referenceRange || '', status: 'COMPLETED', completedAt: new Date() },
      { new: true }
    );
    if (!test) return res.status(404).json({ error: 'Lab test not found' });
    await logActivity('Lab Result Submitted', `${test.testName} for patient ${test.patientId} — Result entered`, 'lab');
    res.json(test);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update test result', details: e.message });
  }
});

// ─── PRESCRIPTION ROUTES ──────────────────────────────────────────────────────
app.get('/api/prescriptions', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const prescriptions = await Prescription.find(filter).sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch prescriptions', details: e.message });
  }
});

app.post('/api/prescriptions', async (req, res) => {
  try {
    const { encounterId, patientId, patientName, doctorName, medicines } = req.body;
    if (!encounterId || !patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: 'encounterId, patientId, and medicines are required' });
    }
    const prescriptionId = 'SIMS-RX' + Date.now();
    const prescription = await Prescription.create({
      prescriptionId, encounterId, patientId,
      patientName: patientName || '',
      doctorName: doctorName || '',
      medicines
    });
    await logActivity('Prescription Created', `${prescriptionId} — ${medicines.length} medicine(s) for ${patientId}`, 'doctor');
    res.status(201).json(prescription);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create prescription', details: e.message });
  }
});

app.put('/api/prescriptions/:prescriptionId/issue', async (req, res) => {
  try {
    const { medicines } = req.body;
    const prescription = await Prescription.findOne({ prescriptionId: req.params.prescriptionId });
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    if (prescription.status === 'ISSUED') return res.status(400).json({ error: 'Prescription already issued' });

    const billId = 'SIMS-BILL' + Date.now();
    const items = medicines.map(med => ({
      name: med.medicineName,
      quantity: med.quantity,
      price: med.price || 50,
      total: (med.price || 50) * med.quantity
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);

    const bill = await Bill.create({
      billId,
      patientId: prescription.patientId,
      patientName: prescription.patientName,
      prescriptionId: prescription.prescriptionId,
      type: 'PHARMACY',
      items,
      totalAmount,
      netAmount: totalAmount,
      paymentStatus: 'PENDING'
    });

    prescription.status = 'ISSUED';
    prescription.issuedAt = new Date();
    await prescription.save();

    await logActivity('Medicines Dispensed', `Rx ${prescription.prescriptionId} issued — ₹${totalAmount}`, 'pharmacy');
    res.json({ prescription, bill });
  } catch (e) {
    res.status(500).json({ error: 'Failed to issue medicines', details: e.message });
  }
});

// ─── BILLING ROUTES ───────────────────────────────────────────────────────────
app.get('/api/bills', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json(bills);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bills', details: e.message });
  }
});

app.get('/api/bills/patient/:patientId', async (req, res) => {
  try {
    const bills = await Bill.find({ patientId: req.params.patientId }).sort({ createdAt: -1 });
    res.json(bills);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bills', details: e.message });
  }
});

app.put('/api/bills/:billId/pay', async (req, res) => {
  try {
    const { paymentMode, discount } = req.body;
    const bill = await Bill.findOne({ billId: req.params.billId });
    if (!bill) return res.status(404).json({ error: 'Bill not found' });
    bill.paymentMode = paymentMode || 'CASH';
    bill.paymentStatus = 'PAID';
    bill.discount = discount || 0;
    bill.netAmount = bill.totalAmount - (discount || 0);
    await bill.save();
    await logActivity('Payment Received', `Bill ${bill.billId} — ₹${bill.netAmount} via ${bill.paymentMode}`, 'billing');
    res.json(bill);
  } catch (e) {
    res.status(500).json({ error: 'Failed to process payment', details: e.message });
  }
});

// ─── ADMIN / STATS ─────────────────────────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalPatients, totalEncounters, totalTests,
      pendingTests, completedTests,
      totalPrescriptions, pendingPrescriptions, issuedPrescriptions,
      totalBills, bills, recentActivity, totalDoctors, ipdPatients
    ] = await Promise.all([
      Patient.countDocuments(),
      Encounter.countDocuments(),
      LabTest.countDocuments(),
      LabTest.countDocuments({ status: 'PENDING' }),
      LabTest.countDocuments({ status: 'COMPLETED' }),
      Prescription.countDocuments(),
      Prescription.countDocuments({ status: 'PENDING' }),
      Prescription.countDocuments({ status: 'ISSUED' }),
      Bill.countDocuments(),
      Bill.find({ paymentStatus: 'PAID' }),
      ActivityLog.find().sort({ timestamp: -1 }).limit(20),
      Doctor.countDocuments(),
      Patient.countDocuments({ isIPD: true })
    ]);

    const totalRevenue = bills.reduce((sum, b) => sum + (b.netAmount || b.totalAmount), 0);

    res.json({
      totalPatients, totalEncounters, totalTests,
      pendingTests, completedTests,
      totalPrescriptions, pendingPrescriptions, issuedPrescriptions,
      totalBills, totalRevenue, totalDoctors, ipdPatients,
      recentActivity
    });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch stats', details: e.message });
  }
});

app.get('/api/activitylog', async (req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch activity log', details: e.message });
  }
});

// ─── 404 & ERROR ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🏥 SIMS Hospital HMS Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
