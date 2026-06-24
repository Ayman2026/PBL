import path from "path";

const ROOT = path.join(process.cwd(), "..");

export const DATA_PATHS = {
  pblJuly: path.join(ROOT, "02_Primary_PBL_Data", "csv_exports", "PBL_School_Response_Data_July_2025.csv"),
  pblAugust: path.join(ROOT, "02_Primary_PBL_Data", "csv_exports", "PBL_School_Response_Data_August_2025.csv"),
  pblSeptember: path.join(ROOT, "02_Primary_PBL_Data", "csv_exports", "PBL_School_Response_Data_September_2025.csv"),
  grantFinance: path.join(ROOT, "03_Grant_Reporting_Evidence", "csv", "01_Grant_Profile_and_Finance.csv"),
  grantPerformance: path.join(ROOT, "03_Grant_Reporting_Evidence", "csv", "02_Grant_Performance_and_Report_Material.csv"),
  evidenceIndex: path.join(ROOT, "03_Grant_Reporting_Evidence", "csv", "03_Evidence_and_Media_Index.csv"),
  evidenceImages: path.join(ROOT, "03_Grant_Reporting_Evidence"),
} as const;
