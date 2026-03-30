# PharmaGuard: Pharmacogenomic Risk Prediction 🛡️💊

**PharmaGuard** is a state-of-the-art AI-powered platform designed to predict medication risks based on a patient's genetic profile (VCF files). It helps doctors and patients identify potential adverse drug reactions, dosage adjustments, and alternative therapies using advanced genomic analysis and Google's Gemini AI.

---

## � Project Links

- **Live Demo:** [https://pharma-guard-health-tech-rift-26-yi.vercel.app/](https://pharma-guard-health-tech-rift-26-yi.vercel.app/)
- **Video Demo:** [Video](https://drive.google.com/file/d/17rGT5WTuADTOlZDypNvzCb4mDfmch68z/view?usp=sharing) 🎥

---

## 🏗️ Architecture Overview

PharmaGuard is built as a highly responsive Single Page Application (SPA) with a focus on edge-side AI processing and secure data handling.

### Data Flow Journey:
1. **Data Ingestion:** User uploads a `.vcf` file containing genomic variants.
2. **Metadata Extraction:** The app parses the VCF (e.g., patient ID, specific rsIDs).
3. **Context Enrichment:** User selects drugs and lifestyle factors (e.g., smoking, diet) to account for **Phenoconversion**.
4. **AI Processing:** Data is sent to the `geminiService` which communicates with **Gemini 1.5 Flash**.
5. **Insights Generation:** AI returns structured JSON containing clinical recommendations, biological mechanisms, and evidence levels.
6. **Result Visualization:** The `ResultsDashboard` renders interactive charts, risk meters, and doctor-friendly metrics.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 19, Vite, TypeScript
- **Styling & UI:** Tailwind CSS, Lucide React (for premium iconography)
- **AI Engine:** Google Gemini AI SDK (`@google/genai`)
- **Deployment:** Vercel (CI/CD integrated with GitHub)
- **State Management:** React Hooks (useState, useCallback) for efficient re-renders.

---

## 📚 API & Services Documentation

### `geminiService.ts`
The core engine of the application. It utilizes structured output schemas to ensure medical accuracy.

#### `generateMedicalExplanation(drug, gene, phenotype, risk)`
- **Purpose:** Generates a detailed clinical report.
- **Input:**
  - `drug`: String (e.g., 'Codeine')
  - `gene`: String (e.g., 'CYP2D6')
  - `phenotype`: Metabolizer status
  - `risk`: Predicted risk category
- **Output:** Returns a JSON object with `recommendation` (CPIC-aligned) and `explanation` (biological mechanism).

---

## 📦 Installation Instructions

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps
1. **Clone the Repo:**
   ```bash
   git clone https://github.com/Nitinaasingh1212/PharmaGuard_HealthTech-RIFT-26.git
   cd PharmaGuard_HealthTech-RIFT-26
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Environment Setup:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_google_ai_studio_api_key
   ```
4. **Run Development Server:**
   ```bash
   npm run dev
   ```
5. **Build for Production:**
   ```bash
   npm run build
   ```

---

## 💡 Usage Examples

### Scenario: Predicting Codeine Toxicity
1. User uploads a VCF file showing a **CYP2D6 Ultra-Rapid Metabolizer** status.
2. User selects **Codeine** as the medication.
3. PharmaGuard detects the high risk of respiratory depression.
4. AI Recommendation: *"Avoid Codeine; use a non-opioid analgesic like Celecoxib due to rapid conversion to morphine."*

---

## 📄 License & Disclaimer

Built for **RIFT 2026 Hackathon**.  
*Disclaimer: This application is for educational/hackathon purposes only and should not be used for actual medical diagnosis or treatment decisions without consulting a certified healthcare professional.*
