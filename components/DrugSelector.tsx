import React from 'react';

interface DrugSelectorProps {
  supportedDrugs: string[];
  onChange: (selectedDrugs: string[]) => void;
  selectedDrugs: string[];
}

export const DrugSelector: React.FC<DrugSelectorProps> = ({ supportedDrugs, onChange, selectedDrugs }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value && !selectedDrugs.includes(value)) {
      onChange([...selectedDrugs, value]);
      // Reset select to default
      e.target.value = "";
    }
  };

  const removeDrug = (drug: string) => {
    onChange(selectedDrugs.filter((d) => d !== drug));
  };

  return (
    <div className="w-full">
      <label htmlFor="drug-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Select Drug(s) to Analyze
      </label>
      <div className="space-y-3">
        <select
          id="drug-select"
          onChange={handleChange}
          className="block w-full rounded-md border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm focus:border-cyan-500 focus:ring-cyan-500 sm:text-sm p-2.5"
          defaultValue=""
        >
          <option value="" disabled>-- Add a Medication --</option>
          {supportedDrugs.filter(d => !selectedDrugs.includes(d)).map((drug) => (
            <option key={drug} value={drug}>
              {drug}
            </option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {selectedDrugs.map(drug => (
            <span key={drug} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
              {drug}
              <button type="button" onClick={() => removeDrug(drug)} className="ml-2 inline-flex items-center p-0.5 rounded-full text-cyan-400 hover:bg-cyan-200 hover:text-cyan-500 focus:outline-none">
                <span className="sr-only">Remove {drug}</span>
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 10 5.707 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
            </span>
          ))}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select standard medications to see potential interactions.
        </p>
      </div>
    </div>
  );
};
