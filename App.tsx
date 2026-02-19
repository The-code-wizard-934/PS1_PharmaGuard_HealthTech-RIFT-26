
import React, { useState, useCallback } from 'react';
import { VcfUpload } from './components/VcfUpload';
import { DrugSelector } from './components/DrugSelector';
import { ResultsDashboard } from './components/ResultsDashboard';
import { Spinner } from './components/ui/Spinner';
import { generateMedicalExplanation } from './services/geminiService';
import { SUPPORTED_DRUGS, GENE_DRUG_MAP } from './constants';
import { LifestyleSelector } from './components/LifestyleSelector';
import type { ReportData, RiskCategory, MetabolizerStatus, LifestyleFactor, InteractionAlert } from './types';
import { AlertTriangle, BotMessageSquare, Dna, Download, Pill, ShieldCheck } from 'lucide-react';

// ... other imports ...

const App: React.FC = () => {
  const [vcfFile, setVcfFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<ReportData | null>(null);

  const handleFileChange = useCallback((file: File | null) => {
    setVcfFile(file);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleDrugChange = useCallback((drugs: string[]) => {
    setSelectedDrugs(drugs);
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleLifestyleChange = useCallback((factors: LifestyleFactor[]) => {
    setLifestyleFactors(factors);
    setAnalysisResult(null); // Reset results on change
  }, []);

  const runAnalysis = async () => {
    if (!vcfFile || selectedDrugs.length === 0) {
      setError('Please upload a VCF file and select at least one drug.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // --- INTERACTION LOGIC (MOCKED) ---
      const interactionAlerts: InteractionAlert[] = [];

      // DDI: Fluoxetine inhibits CYP2D6, affecting Codeine
      if (selectedDrugs.includes('Fluoxetine') && selectedDrugs.includes('Codeine')) {
        interactionAlerts.push({
          type: 'Drug-Drug',
          severity: 'High',
          description: 'Fluoxetine inhibits the metabolism of Codeine.',
          mechanism: 'Fluoxetine is a strong CYP2D6 inhibitor. Codeine requires CYP2D6 to be converted to its active form (morphine). This combination may lead to reduced efficacy of Codeine (Phenoconversion to Poor Metabolizer status).'
        });
      }

      // Lifestyle: Smoking induces CYP1A2, affecting Clozapine
      if (lifestyleFactors.includes('smoker') && (selectedDrugs.includes('Clozapine') || selectedDrugs.includes('Olanzapine') || selectedDrugs.includes('Warfarin'))) {
        interactionAlerts.push({
          type: 'Drug-Lifestyle',
          severity: 'Moderate',
          description: 'Smoking can lower blood levels of this medication.',
          mechanism: 'Polycyclic aromatic hydrocarbons in tobacco smoke induce CYP1A2 enzymes, potentially increasing the metabolism of this drug and reducing its therapeutic effect.'
        });
      }

      // Grapefruit inhibits CYP3A4
      if (lifestyleFactors.includes('grapefruit') && (selectedDrugs.includes('Simvastatin') || selectedDrugs.includes('Atorvastatin'))) {
        interactionAlerts.push({
          type: 'Drug-Lifestyle',
          severity: 'High',
          description: 'Grapefruit consumption can dangerously increase drug levels.',
          mechanism: 'Grapefruit juice compounds inhibit CYP3A4 intestinal metabolism, leading to significantly higher blood concentrations of the drug and increased risk of toxicity (e.g., rhabdomyolysis).'
        });
      }

      // --- INDIVIDUAL DRUG ANALYSIS (MOCKED) ---
      const results = await Promise.all(selectedDrugs.map(async (drug) => {
        const gene = GENE_DRUG_MAP[drug] || 'UNKNOWN_GENE';
        const riskCategories: RiskCategory[] = ['Safe', 'Adjust Dosage', 'Toxic', 'Ineffective'];
        const metabolizerStatuses: MetabolizerStatus[] = ['Poor Metabolizer (PM)', 'Intermediate Metabolizer (IM)', 'Normal Metabolizer (NM)', 'Rapid Metabolizer (RM)', 'Ultra-Rapid Metabolizer (URM)'];

        const mockRisk = riskCategories[Math.floor(Math.random() * riskCategories.length)];
        const mockMetabolizer = metabolizerStatuses[Math.floor(Math.random() * metabolizerStatuses.length)];
        const mockDiplotype = `*${Math.floor(Math.random() * 4) + 1}/*${Math.floor(Math.random() * 4) + 1}`;

        const { recommendation, explanation } = await generateMedicalExplanation(drug, gene, mockMetabolizer, mockRisk);

        // Enhanced Doctor Metrics Generation
        const evidenceLevel = ['1A', '1B', '2A', '2B', '3', '4'][Math.floor(Math.random() * 6)] as '1A' | '1B' | '2A' | '2B' | '3' | '4';

        const phenotypeProbabilities = [
          { phenotype: 'Poor Metabolizer (PM)', probability: 0 },
          { phenotype: 'Intermediate Metabolizer (IM)', probability: 0 },
          { phenotype: 'Normal Metabolizer (NM)', probability: 0 },
          { phenotype: 'Rapid Metabolizer (RM)', probability: 0 },
          { phenotype: 'Ultra-Rapid Metabolizer (URM)', probability: 0 }
        ];

        // Simulate probability distribution peaking at the selected mockMetabolizer
        const targetIndex = metabolizerStatuses.indexOf(mockMetabolizer);
        let remainingProb = 100;
        phenotypeProbabilities[targetIndex].probability = Math.floor(Math.random() * (95 - 80) + 80); // 80-95%
        remainingProb -= phenotypeProbabilities[targetIndex].probability;

        // Distribute remaining probability to neighbors
        if (targetIndex > 0) phenotypeProbabilities[targetIndex - 1].probability = Math.floor(remainingProb * 0.7);
        if (targetIndex < 4) phenotypeProbabilities[targetIndex + 1].probability = remainingProb - (phenotypeProbabilities[targetIndex - 1]?.probability || 0);

        return {
          drugName: drug,
          riskAssessment: {
            category: mockRisk,
            confidenceScore: Math.random() * (0.98 - 0.85) + 0.85,
            severity: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)] as 'Low' | 'Medium' | 'High',
          },
          pharmacogenomicProfile: {
            gene: gene,
            diplotype: mockDiplotype,
            phenotype: mockMetabolizer,
            variants: [{ rsid: `rs${Math.floor(Math.random() * 100000)}`, allele: `*${Math.floor(Math.random() * 4) + 1}` }],
          },
          clinicalRecommendation: recommendation,
          llmExplanation: explanation,
          // New Fields
          phenotypeProbabilities,
          evidenceLevel,
          suggestedMonitoring: `Monitor for adverse effects. Check plasma concentration if strictly indicated. Reference range: 10-50 ng/mL.`,
          references: [
            `CPIC Guideline for ${drug} and ${gene}`,
            `PharmGKB Clinical Annotation (${gene}:${drug})`,
            `PubMed ID: ${Math.floor(Math.random() * 8000000) + 20000000}`
          ]
        };
      }));

      // Determine Overall Risk
      const hasHighSeverity = interactionAlerts.some(a => a.severity === 'High') || results.some(r => r.riskAssessment.category === 'Toxic');
      const hasModerateSeverity = interactionAlerts.some(a => a.severity === 'Moderate') || results.some(r => r.riskAssessment.category === 'Adjust Dosage' || r.riskAssessment.category === 'Ineffective');

      const overallRisk = hasHighSeverity ? 'High' : hasModerateSeverity ? 'Medium' : 'Low';
      const summaryText = hasHighSeverity
        ? "Critical issues detected. Please review drug interactions and genetic risks immediately."
        : hasModerateSeverity
          ? "Some adjustments or monitoring may be required based on your profile."
          : "No major pharmacogenomic risks detected for this regimen.";

      const finalReport: ReportData = {
        patientId: vcfFile.name.replace('.vcf', ''),
        overallRisk,
        summaryText,
        results,
        interactionAlerts,
        qualityMetrics: {
          vcfParsingSuccess: true,
          predictionAccuracy: Math.random() * (0.99 - 0.95) + 0.95,
        },
      };

      setAnalysisResult(finalReport);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during analysis.';
      setError(`Analysis Failed: ${errorMessage}. Please check your API key and try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <header className="bg-white dark:bg-slate-950/70 backdrop-blur-md shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="h-8 w-8 text-cyan-500" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pharma<span className="text-cyan-500">Guard</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">Pharmacogenomic Risk Prediction</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Upload a VCF file and select a drug to analyze potential adverse reactions based on genetic markers.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-xl shadow-lg p-6 md:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Dna className="text-cyan-500" /> VCF File Upload</h3>
                <VcfUpload onFileChange={handleFileChange} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2"><Pill className="text-cyan-500" /> Drug Selection</h3>
                <DrugSelector supportedDrugs={SUPPORTED_DRUGS} onChange={handleDrugChange} selectedDrugs={selectedDrugs} />
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold flex items-center gap-2">Lifestyle Factors (Phenoconversion)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Select any factors that apply to you. These can alter your genetic metabolism.</p>
              <LifestyleSelector selectedFactors={lifestyleFactors} onChange={handleLifestyleChange} />
            </div>

            <div>
              <button
                onClick={runAnalysis}
                disabled={isLoading || !vcfFile || selectedDrugs.length === 0}
                className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 dark:disabled:bg-slate-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
              >
                {isLoading ? <Spinner /> : <BotMessageSquare className="h-5 w-5" />}
                <span>{isLoading ? 'Analyzing...' : 'Run AI-Powered Analysis'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-8 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 rounded-md" role="alert">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-3" />
                <div>
                  <p className="font-bold">Error</p>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          )}

          {analysisResult && !isLoading && (
            <div className="mt-8">
              <h3 className="text-2xl font-bold mb-4 text-center">Analysis Complete</h3>
              <ResultsDashboard data={analysisResult} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} PharmaGuard. For informational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
