
import React from 'react';
import type { ReportData, RiskCategory } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Download, Copy, AlertCircle, CheckCircle, BarChart2, FlaskConical, Stethoscope, BookOpen } from 'lucide-react';
import { formatReportForExport } from '../utils/exportUtils';

interface ResultsDashboardProps {
  data: ReportData;
}

const riskStyles: { [key in RiskCategory]: { bg: string; text: string; border: string; icon: React.ReactNode } } = {
  Safe: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', border: 'border-green-500', icon: <CheckCircle className="h-5 w-5" /> },
  'Adjust Dosage': { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-500', icon: <AlertCircle className="h-5 w-5" /> },
  Toxic: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', border: 'border-red-500', icon: <AlertCircle className="h-5 w-5" /> },
  Ineffective: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-500', icon: <AlertCircle className="h-5 w-5" /> },
  Unknown: { bg: 'bg-slate-100 dark:bg-slate-700', text: 'text-slate-800 dark:text-slate-300', border: 'border-slate-500', icon: <AlertCircle className="h-5 w-5" /> },
};


const InfoItem: React.FC<{ label: string; value: React.ReactNode; className?: string }> = ({ label, value, className }) => (
  <div className={`py-2 ${className}`}>
    <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 dark:text-white sm:mt-0 sm:col-span-2">{value}</dd>
  </div>
);

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ data }) => {
  const [viewMode, setViewMode] = React.useState<'patient' | 'doctor'>('patient');

  const downloadJson = () => {
    const finalOutput = formatReportForExport(data);
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(finalOutput, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `PharmaGuard_Report_${data.patientId}_${new Date().getTime()}.json`;
    link.click();
  };

  const copyToClipboard = () => {
    const finalOutput = formatReportForExport(data);
    navigator.clipboard.writeText(JSON.stringify(finalOutput, null, 2));
    alert('Report copied to clipboard!');
  };

  // Overall Risk Style
  const overallRiskStyles = {
    Low: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-green-500',
    Medium: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 border-yellow-500',
    High: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 border-red-500'
  };

  const riskClass = overallRiskStyles[data.overallRisk] || overallRiskStyles.Low;

  return (
    <div className="space-y-8">
      {/* View Mode Toggle */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Analysis Results</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Patient ID: {data.patientId}</p>
        </div>
        <div className="bg-slate-100 dark:bg-slate-700 p-1 rounded-lg inline-flex">
          <button
            onClick={() => setViewMode('patient')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'patient'
              ? 'bg-white dark:bg-slate-600 text-cyan-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            Patient View
          </button>
          <button
            onClick={() => setViewMode('doctor')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'doctor'
              ? 'bg-white dark:bg-slate-600 text-cyan-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
          >
            Doctor View
          </button>
        </div>
      </div>

      {/* --- SECTION 1: COMBINED FINAL RESULT --- */}
      <Card className="overflow-hidden border-2 border-slate-200 dark:border-slate-700">
        <div className={`p-6 border-b-4 ${riskClass}`}>
          <div className="flex items-center gap-4">
            {data.overallRisk === 'High' ? <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" /> :
              data.overallRisk === 'Medium' ? <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" /> :
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />}
            <div>
              <h3 className="text-2xl font-bold">Overall Risk Status: {data.overallRisk}</h3>
              <p className="font-medium opacity-90">{data.summaryText}</p>
            </div>
          </div>
        </div>

        {/* INTERACTION ALERTS (Global) */}
        {data.interactionAlerts && data.interactionAlerts.length > 0 ? (
          <div className="p-6 bg-slate-50 dark:bg-slate-800/50 space-y-4">
            <h4 className="font-semibold text-lg flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-purple-500" /> Interaction Alerts
            </h4>
            {data.interactionAlerts.map((alert, idx) => (
              <div key={idx} className={`p-4 rounded-lg border-l-4 ${alert.severity === 'High' ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-900 dark:text-red-200' :
                alert.severity === 'Moderate' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-900 dark:text-yellow-200' :
                  'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-900 dark:text-blue-200'
                }`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold flex items-center gap-2">
                      {alert.type} Interaction
                      <span className="text-xs px-2 py-0.5 rounded-full border border-current opacity-70 uppercase tracking-wider">{alert.severity}</span>
                    </h4>
                    <p className="font-semibold mt-1">{alert.description}</p>
                    {viewMode === 'doctor' && (
                      <p className="text-sm mt-2 opacity-90"><span className="font-semibold">Mechanism:</span> {alert.mechanism}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <p className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" /> No drug-drug or lifestyle interactions detected.
            </p>
          </div>
        )}
      </Card>

      {/* --- SECTION 2: INDIVIDUAL DRUG REPORTS --- */}
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white pt-4 border-t border-slate-200 dark:border-slate-700">Individual Drug Reports</h3>

      <div className="grid grid-cols-1 gap-8">
        {data.results.map((result, index) => {
          const currentRisk = riskStyles[result.riskAssessment.category];
          return (
            <Card key={index} className="overflow-hidden shadow-md">
              <div className={`p-4 border-l-8 ${currentRisk.border} bg-white dark:bg-slate-800`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${currentRisk.bg} ${currentRisk.text}`}>{currentRisk.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{result.drugName}</h3>
                      <p className={`font-semibold ${currentRisk.text}`}>{result.riskAssessment.category}</p>
                    </div>
                  </div>
                  {viewMode === 'doctor' && (
                    <div className="text-right text-sm text-slate-500 dark:text-slate-400">
                      <div className="inline-flex items-center gap-2 mb-1">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                          Evidence Level: {result.evidenceLevel}
                        </span>
                      </div>
                      <p>Confidence: {(result.riskAssessment.confidenceScore * 100).toFixed(0)}%</p>
                      <p>Gene: {result.pharmacogenomicProfile.gene}</p>
                    </div>
                  )}
                </div>
              </div>

              <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Clinical Recs */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <Stethoscope className="h-4 w-4 text-cyan-500" /> Clinical Recommendation
                  </h4>
                  <p className="text-sm italic text-slate-600 dark:text-slate-400">{result.clinicalRecommendation.summary}</p>
                  {viewMode === 'doctor' && (
                    <div className="space-y-3 text-sm mt-2 border-t border-slate-100 dark:border-slate-700 pt-2">
                      <InfoItem label="Dosage" value={result.clinicalRecommendation.dosageAdjustment} />
                      <InfoItem label="Therapy" value={result.clinicalRecommendation.alternativeTherapy} />

                      {/* Suggested Monitoring */}
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-md border border-blue-100 dark:border-blue-800">
                        <p className="font-semibold text-blue-800 dark:text-blue-300 text-xs uppercase tracking-wide mb-1">Suggested Monitoring</p>
                        <p className="text-blue-900 dark:text-blue-100">{result.suggestedMonitoring}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* AI / Genetics */}
                <div className="space-y-4">
                  <h4 className="font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                    <FlaskConical className="h-4 w-4 text-purple-500" /> Analysis
                  </h4>
                  {viewMode === 'patient' ? (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{result.llmExplanation.summary}</p>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <InfoItem label="Diplotype" value={result.pharmacogenomicProfile.diplotype} />
                        <InfoItem label="Mechanism" value={result.llmExplanation.biologicalMechanism} />
                      </div>

                      {/* Phenotype Probabilities Chart */}
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-500 uppercase">Phenotype Probability</p>
                        <div className="space-y-1.5">
                          {result.phenotypeProbabilities.map((p, i) => (
                            <div key={i} className="flex items-center text-xs gap-2">
                              <span className="w-8 text-right font-mono text-slate-400">{p.probability}%</span>
                              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${p.probability > 0 ? 'bg-purple-500' : 'bg-transparent'}`}
                                  style={{ width: `${p.probability}%` }}
                                />
                              </div>
                              <span className="w-10 text-slate-500 truncate">{p.phenotype.split(' ')[0]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* References Footer */}
                {viewMode === 'doctor' && (
                  <div className="lg:col-span-2 pt-4 border-t border-slate-100 dark:border-slate-700 text-xs text-slate-400">
                    <p className="font-semibold mb-1">References:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      {result.references.map((ref, i) => <li key={i}>{ref}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Button onClick={copyToClipboard} variant="outline"><Copy className="mr-2 h-4 w-4" /> Copy JSON</Button>
        <Button onClick={downloadJson}><Download className="mr-2 h-4 w-4" /> Download Report</Button>
      </div>
    </div>
  );
};
