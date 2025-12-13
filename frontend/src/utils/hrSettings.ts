// HR Settings utility functions
export interface SalarySettings {
  basicSalaryPercentage: number;
  hraPercentage: number;
  pfDeductionPercentage: number;
  professionalTaxAmount: number;
  otherAllowancesPercentage: number;
  updatedAt: string;
  updatedBy: string;
}

// Default settings
const DEFAULT_SETTINGS: SalarySettings = {
  basicSalaryPercentage: 40,
  hraPercentage: 50, // 50% of basic salary
  pfDeductionPercentage: 12,
  professionalTaxAmount: 2400,
  otherAllowancesPercentage: 0,
  updatedAt: new Date().toISOString(),
  updatedBy: 'System'
};

// Get HR settings from localStorage (in real app, this would be an API call)
export const getHRSettings = (): SalarySettings => {
  try {
    const savedSettings = localStorage.getItem('hrSalarySettings');
    if (savedSettings) {
      return JSON.parse(savedSettings);
    }
  } catch (error) {
    console.error('Error loading HR settings:', error);
  }
  return DEFAULT_SETTINGS;
};

// Calculate salary components based on annual CTC and HR settings
export const calculateSalaryComponents = (annualCTC: number, settings?: SalarySettings) => {
  const hrSettings = settings || getHRSettings();

  const basicSalary = Math.round(annualCTC * (hrSettings.basicSalaryPercentage / 100));
  const hra = Math.round(basicSalary * (hrSettings.hraPercentage / 100));
  const pfDeduction = Math.round(basicSalary * (hrSettings.pfDeductionPercentage / 100));
  const professionalTax = hrSettings.professionalTaxAmount;
  const otherAllowances = Math.max(0, annualCTC - basicSalary - hra - pfDeduction - professionalTax);

  return {
    basicSalary: basicSalary.toString(),
    hra: hra.toString(),
    pfDeduction: pfDeduction.toString(),
    professionalTax: professionalTax.toString(),
    otherAllowances: otherAllowances.toString()
  };
};

// Save HR settings to localStorage (in real app, this would be an API call)
export const saveHRSettings = async (settings: SalarySettings): Promise<boolean> => {
  try {
    localStorage.setItem('hrSalarySettings', JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving HR settings:', error);
    return false;
  }
};