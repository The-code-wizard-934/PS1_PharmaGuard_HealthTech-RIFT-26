
export type RiskCategory = 'Safe' | 'Adjust Dosage' | 'Toxic' | 'Ineffective' | 'Unknown';

export type MetabolizerStatus = 'Poor Metabolizer (PM)' | 'Intermediate Metabolizer (IM)' | 'Normal Metabolizer (NM)' | 'Rapid Metabolizer (RM)' | 'Ultra-Rapid Metabolizer (URM)';

export type UserRole = 'patient' | 'doctor';

export type LifestyleFactor = 'smoker' | 'alcohol' | 'grapefruit' | 'coffee';

export interface InteractionAlert {
  type: 'Drug-Drug' | 'Drug-Lifestyle';
  severity: 'High' | 'Moderate' | 'Low';
  description: string;
  mechanism: string;
}



export interface VariantInfo {
  rsid: string;
  allele: string;
}

export interface RiskAssessment {
  category: RiskCategory;
  confidenceScore: number;
  severity: 'Low' | 'Medium' | 'High';
}

export interface PharmacogenomicProfile {
  gene: string;
  diplotype: string;
  phenotype: MetabolizerStatus;
  variants: VariantInfo[];
}

export interface ClinicalRecommendation {
  summary: string;
  dosageAdjustment: string;
  alternativeTherapy: string;
  cpicGuideline: string;
}

export interface LLMExplanation {
  summary: string;
  biologicalMechanism: string;
  variantInterpretation: string;
  riskInterpretation: string;
}

export interface QualityMetrics {
  vcfParsingSuccess: boolean;
  predictionAccuracy: number;
}

export interface DrugAnalysisResult {
  drugName: string;
  riskAssessment: RiskAssessment;
  pharmacogenomicProfile: PharmacogenomicProfile;
  clinicalRecommendation: ClinicalRecommendation;
  llmExplanation: LLMExplanation;
  // Enhanced Doctor Metrics
  phenotypeProbabilities: { phenotype: string; probability: number }[];
  evidenceLevel: '1A' | '1B' | '2A' | '2B' | '3' | '4';
  suggestedMonitoring: string;
  references: string[];
}

export interface ReportData {
  patientId: string;
  // Summary/Combined Data
  overallRisk: 'Low' | 'Medium' | 'High';
  summaryText: string;
  interactionAlerts?: InteractionAlert[];

  // Individual Results
  results: DrugAnalysisResult[];

  qualityMetrics: QualityMetrics;
}
