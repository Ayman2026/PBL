import path from "path";

// Use environment variables for data paths, fallback to relative paths
const DATA_DIR_PBL = process.env.DATA_DIR_PBL || "./02_Primary_PBL_Data/csv_exports";
const DATA_DIR_GRANT = process.env.DATA_DIR_GRANT || "./03_Grant_Reporting_Evidence";

export const DATA_PATHS = {
  pblJuly: path.join(process.cwd(), DATA_DIR_PBL, "PBL_School_Response_Data_July_2025.csv"),
  pblAugust: path.join(process.cwd(), DATA_DIR_PBL, "PBL_School_Response_Data_August_2025.csv"),
  pblSeptember: path.join(process.cwd(), DATA_DIR_PBL, "PBL_School_Response_Data_September_2025.csv"),
  grantFinance: path.join(process.cwd(), DATA_DIR_GRANT, "csv", "01_Grant_Profile_and_Finance.csv"),
  grantPerformance: path.join(process.cwd(), DATA_DIR_GRANT, "csv", "02_Grant_Performance_and_Report_Material.csv"),
  evidenceIndex: path.join(process.cwd(), DATA_DIR_GRANT, "csv", "03_Evidence_and_Media_Index.csv"),
  evidenceImages: path.join(process.cwd(), DATA_DIR_GRANT),
} as const;
