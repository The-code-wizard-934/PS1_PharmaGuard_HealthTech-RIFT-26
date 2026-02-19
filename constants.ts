
export const SUPPORTED_DRUGS: string[] = [
  'Codeine',
  'Warfarin',
  'Clopidogrel',
  'Simvastatin',
  'Azathioprine',
  'Fluorouracil',
];

export const GENE_DRUG_MAP: { [key: string]: string } = {
  Codeine: 'CYP2D6',
  Warfarin: 'CYP2C9',
  Clopidogrel: 'CYP2C19',
  Simvastatin: 'SLCO1B1',
  Azathioprine: 'TPMT',
  Fluorouracil: 'DPYD',
};
