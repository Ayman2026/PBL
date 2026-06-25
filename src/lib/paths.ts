import path from "path";

// Use environment variables for data paths, fallback to public/data folder
// Support both absolute and relative paths
const DATA_DIR_PBL = process.env.DATA_DIR_PBL || "public/data/02_Primary_PBL_Data/csv_exports";
const DATA_DIR_GRANT = process.env.DATA_DIR_GRANT || "public/data/03_Grant_Reporting_Evidence";

// Helper to resolve path - if already absolute, use it; otherwise join with cwd
const resolvePath = (pathStr: string) => {
  return path.isAbsolute(pathStr) ? pathStr : path.join(process.cwd(), pathStr);
};

export const DATA_PATHS = {
  pblJuly: path.join(resolvePath(DATA_DIR_PBL), "PBL_School_Response_Data_July_2025.csv"),
  pblAugust: path.join(resolvePath(DATA_DIR_PBL), "PBL_School_Response_Data_August_2025.csv"),
  pblSeptember: path.join(resolvePath(DATA_DIR_PBL), "PBL_School_Response_Data_September_2025.csv"),
  grantFinance: path.join(resolvePath(DATA_DIR_GRANT), "csv", "01_Grant_Profile_and_Finance.csv"),
  grantPerformance: path.join(resolvePath(DATA_DIR_GRANT), "csv", "02_Grant_Performance_and_Report_Material.csv"),
  evidenceIndex: path.join(resolvePath(DATA_DIR_GRANT), "csv", "03_Evidence_and_Media_Index.csv"),
  evidenceImages: resolvePath(DATA_DIR_GRANT),
} as const;
