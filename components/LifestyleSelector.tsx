import React from 'react';
import { LifestyleFactor } from '../types';
import { Wine, Cigarette, Coffee, Citrus } from 'lucide-react';

interface LifestyleSelectorProps {
    selectedFactors: LifestyleFactor[];
    onChange: (factors: LifestyleFactor[]) => void;
}

const factors: { id: LifestyleFactor; label: string; icon: React.ReactNode }[] = [
    { id: 'smoker', label: 'Smoker (Tobacco)', icon: <Cigarette className="w-5 h-5" /> },
    { id: 'alcohol', label: 'Alcohol Consumer', icon: <Wine className="w-5 h-5" /> },
    { id: 'grapefruit', label: 'Grapefruit Consumption', icon: <Citrus className="w-5 h-5" /> },
    { id: 'coffee', label: 'Heavy Coffee Drinker', icon: <Coffee className="w-5 h-5" /> },
];

export const LifestyleSelector: React.FC<LifestyleSelectorProps> = ({ selectedFactors, onChange }) => {
    const toggleFactor = (factor: LifestyleFactor) => {
        if (selectedFactors.includes(factor)) {
            onChange(selectedFactors.filter((f) => f !== factor));
        } else {
            onChange([...selectedFactors, factor]);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {factors.map((factor) => (
                <button
                    key={factor.id}
                    onClick={() => toggleFactor(factor.id)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${selectedFactors.includes(factor.id)
                            ? 'bg-cyan-50 dark:bg-cyan-900/30 border-cyan-500 text-cyan-700 dark:text-cyan-300'
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-300'
                        }`}
                >
                    {factor.icon}
                    <span className="font-medium text-sm">{factor.label}</span>
                </button>
            ))}
        </div>
    );
};
