require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── LESSON 1: CORS preflight fix — handles OPTIONS before anything else ──────
// Without this, GitHub Pages → Render gives ERR_CONNECTION_CLOSED
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
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ─── SCHEMAS ──────────────────────────────────────────────────────────────────

const doctorSchema = new mongoose.Schema({
  doctorId: { type: String, required: true, unique: true },
  name: { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  qualification: { type: String, default: '' },
  passwordHash: { type: String, required: true },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Staff accounts schema (reception, lab, pharmacy, billing, admin)
const staffSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['reception', 'lab', 'pharmacy', 'billing', 'admin'] },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  patientId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, default: '', trim: true },
  age: { type: Number, required: true, min: 0, max: 150 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  chiefComplaint: { type: String, required: true },
  assignedDoctorId: { type: String, default: '' },
  registeredAt: { type: Date, default: Date.now }
}, { timestamps: true });

const encounterSchema = new mongoose.Schema({
  encounterId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  doctorName: { type: String, required: true },
  diagnosis: { type: String, required: true },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const labTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  encounterId: { type: String, required: true, index: true },
  patientId: { type: String, required: true },
  testName: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'COMPLETED'], default: 'PENDING', index: true },
  result: { type: String, default: null },
  orderedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
}, { timestamps: true });

const prescriptionSchema = new mongoose.Schema({
  prescriptionId: { type: String, required: true, unique: true },
  encounterId: { type: String, required: true, index: true },
  patientId: { type: String, required: true },
  medicines: [{
    medicineName: String,
    dosage: String,
    duration: String,
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 50 }
  }],
  status: { type: String, enum: ['PENDING', 'ISSUED'], default: 'PENDING' },
  issuedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const billSchema = new mongoose.Schema({
  billId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true, index: true },
  prescriptionId: { type: String, default: null },
  type: { type: String, enum: ['REGISTRATION', 'PHARMACY'], required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const activityLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  description: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
const Staff = mongoose.model('Staff', staffSchema);
const Patient = mongoose.model('Patient', patientSchema);
const Encounter = mongoose.model('Encounter', encounterSchema);
const LabTest = mongoose.model('LabTest', labTestSchema);
const Prescription = mongoose.model('Prescription', prescriptionSchema);
const Bill = mongoose.model('Bill', billSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

// ─── HELPER ───────────────────────────────────────────────────────────────────
async function logActivity(action, description) {
  try {
    await ActivityLog.create({ action, description });
  } catch (e) {
    console.error('Activity log error:', e.message);
  }
}

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'HMS Backend is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// ─── AUTH ROUTES ─────────────────────────────────────────────────────────────

// Staff login (reception, lab, pharmacy, billing, admin)
app.post('/api/auth/staff-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const staff = await Staff.findOne({ username: username.trim() });
    if (!staff) return res.status(401).json({ error: 'Invalid username or password' });
    const match = await bcrypt.compare(password.trim(), staff.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });
    res.json({ success: true, user: { username: staff.username, role: staff.role, name: staff.name } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed', details: e.message });
  }
});

// Doctor login
app.post('/api/auth/doctor-login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const doctor = await Doctor.findOne({ doctorId: username.trim() });
    if (!doctor) return res.status(401).json({ error: 'Invalid doctor ID or password' });
    const match = await bcrypt.compare(password.trim(), doctor.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid doctor ID or password' });
    res.json({ success: true, user: { username: doctor.doctorId, role: 'doctor', name: doctor.name, specialization: doctor.specialization } });
  } catch (e) {
    res.status(500).json({ error: 'Login failed', details: e.message });
  }
});

// Setup initial staff accounts (run once — admin protected by env secret)
app.post('/api/auth/setup-staff', async (req, res) => {
  try {
    const { setupSecret, accounts } = req.body;
    if (setupSecret !== process.env.SETUP_SECRET) return res.status(403).json({ error: 'Forbidden' });
    const results = [];
    for (const acc of accounts) {
      const passwordHash = await bcrypt.hash(acc.password, 10);
      const existing = await Staff.findOne({ username: acc.username });
      if (existing) {
        existing.passwordHash = passwordHash;
        existing.name = acc.name;
        existing.role = acc.role;
        await existing.save();
        results.push({ username: acc.username, action: 'updated' });
      } else {
        await Staff.create({ username: acc.username, passwordHash, role: acc.role, name: acc.name });
        results.push({ username: acc.username, action: 'created' });
      }
    }
    res.json({ success: true, results });
  } catch (e) {
    res.status(500).json({ error: 'Setup failed', details: e.message });
  }
});

// Change staff password
app.post('/api/auth/change-password', async (req, res) => {
  try {
    const { username, oldPassword, newPassword } = req.body;
    const staff = await Staff.findOne({ username });
    if (!staff) return res.status(404).json({ error: 'User not found' });
    const match = await bcrypt.compare(oldPassword, staff.passwordHash);
    if (!match) return res.status(401).json({ error: 'Current password incorrect' });
    staff.passwordHash = await bcrypt.hash(newPassword, 10);
    await staff.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (e) {
    res.status(500).json({ error: 'Failed to change password', details: e.message });
  }
});

// ─── DOCTOR ROUTES ────────────────────────────────────────────────────────────

app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, { passwordHash: 0 }).sort({ registeredAt: -1 });
    res.json(doctors);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch doctors', details: e.message });
  }
});

app.post('/api/doctors', async (req, res) => {
  try {
    const { name, specialization, phone, email, qualification, password } = req.body;
    if (!name || !specialization) return res.status(400).json({ error: 'Name and specialization are required' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const doctorId = 'DOC' + Date.now();
    const passwordHash = await bcrypt.hash(password, 10);
    const doctor = await Doctor.create({ doctorId, name, specialization, phone, email, qualification, passwordHash });
    await logActivity('Doctor Registered', `Doctor ${doctorId} - ${name} (${specialization})`);
    console.log(`✅ Doctor registered: ${name}`);
    const { passwordHash: _, ...doctorData } = doctor.toObject();
    res.status(201).json({ ...doctorData, loginId: doctorId });
  } catch (e) {
    if (e.name === 'ValidationError') return res.status(400).json({ error: 'Validation failed', details: e.message });
    res.status(500).json({ error: 'Failed to register doctor', details: e.message });
  }
});

app.put('/api/doctors/:doctorId', async (req, res) => {
  try {
    const { name, specialization, phone, email, qualification } = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { doctorId: req.params.doctorId },
      { name, specialization, phone, email, qualification },
      { new: true, select: '-passwordHash' }
    );
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    await logActivity('Doctor Updated', `Doctor ${doctor.doctorId} - ${doctor.name} updated`);
    res.json(doctor);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update doctor', details: e.message });
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
    const { firstName, lastName, age, gender, phone, address, chiefComplaint, assignedDoctorId } = req.body;
    if (!firstName || !age || !gender || !chiefComplaint) {
      return res.status(400).json({ error: 'First name, age, gender, and chief complaint are required' });
    }
    if (!assignedDoctorId) {
      return res.status(400).json({ error: 'Please assign a doctor to the patient' });
    }

    const patientId = 'PAT' + Date.now();

    // Create patient
    const patient = await Patient.create({ patientId, firstName, lastName, age, gender, phone, address, chiefComplaint, assignedDoctorId });

    // Auto-create registration bill
    const billId = 'BILL' + Date.now();
    const bill = await Bill.create({
      billId,
      patientId,
      type: 'REGISTRATION',
      items: [{ name: 'Consultation Fee', quantity: 1, price: 500, total: 500 }],
      totalAmount: 500
    });

    await logActivity('Patient Registered', `Patient ${patientId} - ${firstName} ${lastName || ''}`);
    console.log(`✅ Patient registered: ${firstName} ${lastName || ''}`);
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
    const { patientId, doctorName, diagnosis, notes } = req.body;
    if (!patientId || !doctorName || !diagnosis) {
      return res.status(400).json({ error: 'Patient ID, doctor name, and diagnosis are required' });
    }
    const encounterId = 'ENC' + Date.now();
    const encounter = await Encounter.create({ encounterId, patientId, doctorName, diagnosis, notes: notes || '' });
    await logActivity('Encounter Created', `Encounter ${encounterId} by ${doctorName} for patient ${patientId}`);
    console.log(`✅ Encounter created: ${encounterId}`);
    res.status(201).json(encounter);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create encounter', details: e.message });
  }
});

// ─── LAB TEST ROUTES ──────────────────────────────────────────────────────────

app.get('/api/labtests', async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
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
    const { encounterId, patientId, tests } = req.body;
    if (!encounterId || !patientId || !tests || !Array.isArray(tests)) {
      return res.status(400).json({ error: 'encounterId, patientId, and tests array are required' });
    }
    const created = [];
    for (const test of tests) {
      const testId = 'TEST' + Date.now() + Math.random().toString(36).substr(2, 5);
      const labTest = await LabTest.create({ testId, encounterId, patientId, testName: test.testName });
      created.push(labTest);
    }
    await logActivity('Lab Tests Ordered', `${tests.length} tests ordered for encounter ${encounterId}`);
    res.status(201).json(created);
  } catch (e) {
    res.status(500).json({ error: 'Failed to order lab tests', details: e.message });
  }
});

app.put('/api/labtests/:testId/result', async (req, res) => {
  try {
    const { result } = req.body;
    if (!result || !result.trim()) return res.status(400).json({ error: 'Result is required' });
    const test = await LabTest.findOneAndUpdate(
      { testId: req.params.testId },
      { result, status: 'COMPLETED', completedAt: new Date() },
      { new: true }
    );
    if (!test) return res.status(404).json({ error: 'Lab test not found' });
    await logActivity('Lab Test Completed', `Test ${test.testId} (${test.testName}) completed for patient ${test.patientId}`);
    console.log(`✅ Lab test completed: ${test.testName}`);
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
    const { encounterId, patientId, medicines } = req.body;
    if (!encounterId || !patientId || !medicines || medicines.length === 0) {
      return res.status(400).json({ error: 'encounterId, patientId, and medicines are required' });
    }
    const prescriptionId = 'PRESC' + Date.now();
    const prescription = await Prescription.create({ prescriptionId, encounterId, patientId, medicines });
    await logActivity('Prescription Created', `Prescription ${prescriptionId} for encounter ${encounterId} with ${medicines.length} medicines`);
    console.log(`✅ Prescription created: ${prescriptionId}`);
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

    // Build pharmacy bill
    const billId = 'BILL' + Date.now();
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
      prescriptionId: prescription.prescriptionId,
      type: 'PHARMACY',
      items,
      totalAmount
    });

    // Mark prescription as issued
    prescription.status = 'ISSUED';
    prescription.issuedAt = new Date();
    await prescription.save();

    await logActivity('Medicines Issued', `Prescription ${prescription.prescriptionId} issued — Bill ₹${totalAmount}`);
    console.log(`✅ Medicines issued: ${prescription.prescriptionId}`);
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

// ─── ADMIN / STATS ROUTES ─────────────────────────────────────────────────────

app.get('/api/stats', async (req, res) => {
  try {
    const [
      totalPatients, totalEncounters, totalTests,
      pendingTests, completedTests,
      totalPrescriptions, pendingPrescriptions, issuedPrescriptions,
      totalBills, bills, recentActivity
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
      Bill.find(),
      ActivityLog.find().sort({ timestamp: -1 }).limit(15)
    ]);

    const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      totalPatients, totalEncounters, totalTests,
      pendingTests, completedTests,
      totalPrescriptions, pendingPrescriptions, issuedPrescriptions,
      totalBills, totalRevenue,
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

// ─── 404 & ERROR HANDLERS ─────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.path} not found` }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🏥 HMS Backend running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
