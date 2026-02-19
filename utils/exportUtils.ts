import { ReportData } from '../types';

export const formatReportForExport = (data: ReportData) => {
    const timestamp = new Date().toISOString();

    const formattedReports = data.results.map(result => ({
        patient_id: data.patientId,
        drug: result.drugName,
        timestamp: timestamp,
        risk_assessment: {
            risk_label: result.riskAssessment.category,
            confidence_score: result.riskAssessment.confidenceScore,
            severity: result.riskAssessment.severity.toLowerCase()
        },
        pharmacogenomic_profile: {
            primary_gene: result.pharmacogenomicProfile.gene,
            diplotype: result.pharmacogenomicProfile.diplotype,
            phenotype: result.pharmacogenomicProfile.phenotype,
            detected_variants: result.pharmacogenomicProfile.variants
        },
        clinical_recommendation: {
            summary: result.clinicalRecommendation.summary,
            dosage_adjustment: result.clinicalRecommendation.dosageAdjustment,
            alternative_therapy: result.clinicalRecommendation.alternativeTherapy,
            cpic_guideline: result.clinicalRecommendation.cpicGuideline,
            evidence_level: result.evidenceLevel,
            suggested_monitoring: result.suggestedMonitoring,
            references: result.references
        },
        llm_generated_explanation: {
            summary: result.llmExplanation.summary,
            biological_mechanism: result.llmExplanation.biologicalMechanism,
            variant_interpretation: result.llmExplanation.variantInterpretation,
            risk_interpretation: result.llmExplanation.riskInterpretation
        },
        quality_metrics: {
            vcf_parsing_success: data.qualityMetrics.vcfParsingSuccess,
            prediction_accuracy: data.qualityMetrics.predictionAccuracy
        }
    }));

    // If single drug, return object. If multiple, return array.
    return formattedReports.length === 1 ? formattedReports[0] : formattedReports;
};
