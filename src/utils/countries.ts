export const COUNTRIES = [
  "Global (All)", "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", 
  "Austria", "Bangladesh", "Belgium", "Brazil", "Canada", "China", 
  "Colombia", "Denmark", "Egypt", "Finland", "France", "Germany", 
  "Greece", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", 
  "Italy", "Japan", "Kenya", "Malaysia", "Mexico", "Netherlands", 
  "New Zealand", "Nigeria", "Norway", "Pakistan", "Philippines", 
  "Poland", "Portugal", "Russia", "Saudi Arabia", "Singapore", 
  "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", 
  "Switzerland", "Thailand", "Turkey", "UK", "USA", "Vietnam"
];

export const COUNTRY_THEMES: Record<string, { bg: string, text: string }> = {
  "USA": { bg: "from-blue-900/30 to-red-900/30", text: "text-red-700" },
  "UK": { bg: "from-blue-800/30 to-red-800/30", text: "text-blue-800" },
  "India": { bg: "from-orange-500/30 via-white/40 to-green-600/30", text: "text-orange-700" },
  "Canada": { bg: "from-red-600/30 to-slate-900/40", text: "text-red-700" },
  "Australia": { bg: "from-blue-800/30 to-yellow-600/30", text: "text-green-800" },
  "Japan": { bg: "from-rose-500/30 to-slate-100/50", text: "text-rose-700" },
  "Germany": { bg: "from-neutral-900/30 via-red-900/30 to-yellow-600/30", text: "text-yellow-700" },
  "France": { bg: "from-blue-800/30 via-slate-100/40 to-red-600/30", text: "text-blue-700" },
  "China": { bg: "from-red-700/30 to-yellow-500/30", text: "text-red-700" },
  "Brazil": { bg: "from-green-600/30 to-yellow-500/30", text: "text-green-700" },
  "South Africa": { bg: "from-green-600/30 via-yellow-500/30 to-red-600/30", text: "text-green-700" },
  "South Korea": { bg: "from-slate-100/50 via-red-600/30 to-blue-600/30", text: "text-blue-700" },
  "Italy": { bg: "from-green-600/30 via-white/40 to-red-600/30", text: "text-green-700" },
  "Global (All)": { bg: "from-indigo-900/10 to-blue-900/10", text: "text-blue-600" },
};

export const getThemeForCountry = (country: string) => {
  if (country === 'All') return COUNTRY_THEMES["Global (All)"];
  if (COUNTRY_THEMES[country]) return COUNTRY_THEMES[country];
  return { bg: "from-slate-300/30 to-slate-100/30", text: "text-indigo-600" };
}
