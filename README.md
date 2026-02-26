# 🏥 SIMS Hospital — Hospital Management System

**SIMS Hospital, Vadapalani, Chennai** — Full-stack HMS  
React frontend · Node.js + Express backend · MongoDB Atlas database · **$0.00 / month**

---

## 🔐 Login Credentials

### 👨‍⚕️ Doctor Login (individual passwords — dropdown selector)
| Doctor | Specialization | Password |
|--------|---------------|----------|
| Dr. Arjun Mehta | Cardiology & Cardiac Surgery | `ArjunMehta@2024` |
| Dr. Priya Raghavan | Neurology & Neurosurgery | `PriyaR@2024` |
| Dr. Suresh Nair | Orthopaedics & Joint Replacement | `SureshN@2024` |
| Dr. Kavitha Iyer | Obstetrics & Gynaecology | `KavithaI@2024` |
| Dr. Ramesh Babu | General Medicine | `RameshB@2024` |
| Dr. Anitha Krishnan | Pediatrics & Neonatology | `AnithaK@2024` |
| Dr. Venkat Subramanian | Gastroenterology & Hepatology | `VenkatS@2024` |
| Dr. Deepa Mohan | Oncology & Cancer Care | `DeepaM@2024` |
| Dr. Karthik Rajan | Nephrology & Urology | `KarthikR@2024` |
| Dr. Swathi Reddy | Endocrinology & Diabetology | `SwathiR@2024` |

### 🏢 Department Login
| Role | Username | Password |
|------|----------|----------|
| Reception | `reception` | `Recept@2024#Secure` |
| Laboratory | `lab` | `LabTest@2024#Secure` |
| Pharmacy | `pharmacy` | `Pharma@2024#Secure` |
| Billing | `billing` | `Billing@2024#Secure` |
| Admin | `admin` | `Admin@2024#Secure` |

> **To add/change doctors:** Edit the `DOCTORS` array in `index.html` (around line 633).  
> **To add/change departments:** Edit the `DEPT_USERS` object in the same section.

---

## 📁 Files
| File | Purpose |
|------|---------|
| `index.html` | Full React frontend — SIMS branded, all 6 modules |
| `server.js` | Backend — all API routes + MongoDB |
| `package.json` | Node.js dependencies |
| `.env.example` | Template for `.env` |
| `.gitignore` | Keeps `.env` off GitHub |

---

## 🔑 Key Features
- **Multi-doctor authentication** — each doctor selects their name from a dropdown and enters their individual password (no shared "doctor" login)
- **Reported By** — every encounter, prescription and lab order is tagged with the logged-in doctor's name automatically
- **IPD / OPD** — patient registration with admit/discharge and ward/bed tracking
- **Insurance fields** — provider + policy number at registration
- **Vitals capture** — BP, Pulse, Temp, SpO2, Weight, Height per encounter
- **Lab urgency levels** — ROUTINE / URGENT / STAT
- **Payment modes** — Cash, Card, UPI, Insurance with discount support
- **24 SIMS specializations** matching real SIMS Hospital departments
- **Keep-alive ping** — server pinged every 10 min to prevent Render sleep

---

## 🚀 Deploy for Free

### Step 1 — MongoDB Atlas
1. https://cloud.mongodb.com → Create free M0 cluster
2. Create DB user, allow `0.0.0.0/0` IP, copy connection string
3. Set database name to `sims_hms`

### Step 2 — GitHub
1. Create repo `sims-hms` → Upload all files
2. ⚠️ Do NOT upload `.env`

### Step 3 — Render
1. https://render.com → Web Service → connect repo
2. Build: `npm install` · Start: `node server.js` · Plan: Free
3. Add env var: `MONGODB_URI` = your Atlas connection string
4. Deploy → copy your Render URL (e.g. `https://sims-hms-xxxx.onrender.com`)

### Step 4 — Update API URL
In `index.html`, find: `https://YOUR-RENDER-APP.onrender.com/api`  
Replace with your actual Render URL → commit to GitHub

### Step 5 — GitHub Pages
Settings → Pages → Deploy from branch (main) → root  
Live at: `https://yourusername.github.io/sims-hms/`

---

## 🔌 API Endpoints
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check (keep-alive) |
| GET | `/api/specializations` | SIMS specialization list |
| GET/POST | `/api/doctors` | Doctors list / register |
| GET/POST | `/api/patients` | Patients list / register |
| GET/POST | `/api/encounters` | Encounters / create |
| GET/POST | `/api/labtests` | Lab tests / bulk order |
| PUT | `/api/labtests/:id/result` | Submit lab result |
| GET/POST | `/api/prescriptions` | Prescriptions / create |
| PUT | `/api/prescriptions/:id/issue` | Dispense medicines + bill |
| GET | `/api/bills` | All bills |
| PUT | `/api/bills/:id/pay` | Mark payment with mode/discount |
| GET | `/api/stats` | Admin dashboard stats |
| GET | `/api/activitylog` | Recent activity log |

---

📞 SIMS Hospital Emergency: **+91 44 2000 2020** · Appointments: **+91 44 2000 2001**  
No.1, Jawaharlal Nehru Salai, Vadapalani, Chennai – 600 026

*Built on AISH (AI Integrated Smart Health) framework · February 2026 · $0.00/month*
