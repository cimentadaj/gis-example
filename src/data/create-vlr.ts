// Types for Create VLR flow

export type SdgDataRow = {
  id: string;
  sdgGoal: string;
  indicatorName: string;
  district: string;
  year: number;
  value: number;
  target: number;
  progressPercent: number;
  dataSource: string;
  confidence: "High" | "Medium" | "Low";
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type InsightSection = {
  id: string;
  title: string;
  chartType: "bar" | "line" | "area" | "pie";
  chartData: Array<Record<string, string | number>>;
  narrative: string;
  narrativeRefined?: string;
};

// Hardcoded SDG unified data - shuffled with 15 Central District rows
export const sdgUnifiedData: SdgDataRow[] = [
  {
    id: "1",
    sdgGoal: "SDG 4",
    indicatorName: "Primary school enrollment rate",
    district: "Central District",
    year: 2024,
    value: 94.2,
    target: 100,
    progressPercent: 94,
    dataSource: "Ministry of Education",
    confidence: "High",
  },
  {
    id: "2",
    sdgGoal: "SDG 5",
    indicatorName: "Women in leadership positions",
    district: "Metro Area",
    year: 2024,
    value: 34.2,
    target: 50,
    progressPercent: 68,
    dataSource: "Municipal HR Database",
    confidence: "Medium",
  },
  {
    id: "3",
    sdgGoal: "SDG 4",
    indicatorName: "Secondary school completion rate",
    district: "Northern Zone",
    year: 2024,
    value: 78.5,
    target: 95,
    progressPercent: 83,
    dataSource: "Education Census 2024",
    confidence: "High",
  },
  {
    id: "4",
    sdgGoal: "SDG 9",
    indicatorName: "Broadband internet coverage",
    district: "Central District",
    year: 2024,
    value: 96.3,
    target: 100,
    progressPercent: 96,
    dataSource: "Telecom Authority",
    confidence: "High",
  },
  {
    id: "5",
    sdgGoal: "SDG 8",
    indicatorName: "Youth unemployment rate",
    district: "Eastern Borough",
    year: 2024,
    value: 12.8,
    target: 8,
    progressPercent: 63,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "6",
    sdgGoal: "SDG 11",
    indicatorName: "Public transport accessibility",
    district: "Central District",
    year: 2024,
    value: 72.1,
    target: 90,
    progressPercent: 80,
    dataSource: "Urban Mobility Survey",
    confidence: "Medium",
  },
  {
    id: "7",
    sdgGoal: "SDG 13",
    indicatorName: "CO2 emissions per capita (tons)",
    district: "Industrial Zone",
    year: 2024,
    value: 5.8,
    target: 4.0,
    progressPercent: 69,
    dataSource: "Environmental Agency",
    confidence: "High",
  },
  {
    id: "8",
    sdgGoal: "SDG 5",
    indicatorName: "Gender parity index (primary)",
    district: "Central District",
    year: 2024,
    value: 0.98,
    target: 1.0,
    progressPercent: 98,
    dataSource: "UN Women Report",
    confidence: "High",
  },
  {
    id: "9",
    sdgGoal: "SDG 9",
    indicatorName: "Broadband internet coverage",
    district: "Western District",
    year: 2024,
    value: 87.3,
    target: 100,
    progressPercent: 87,
    dataSource: "Telecom Authority",
    confidence: "High",
  },
  {
    id: "10",
    sdgGoal: "SDG 4",
    indicatorName: "Secondary school completion rate",
    district: "Central District",
    year: 2024,
    value: 88.5,
    target: 95,
    progressPercent: 93,
    dataSource: "Education Census 2024",
    confidence: "High",
  },
  {
    id: "11",
    sdgGoal: "SDG 11",
    indicatorName: "Affordable housing units",
    district: "Southern Region",
    year: 2024,
    value: 4200,
    target: 8000,
    progressPercent: 53,
    dataSource: "Housing Authority",
    confidence: "High",
  },
  {
    id: "12",
    sdgGoal: "SDG 8",
    indicatorName: "Youth unemployment rate",
    district: "Central District",
    year: 2024,
    value: 8.2,
    target: 6,
    progressPercent: 73,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "13",
    sdgGoal: "SDG 13",
    indicatorName: "Renewable energy share (%)",
    district: "Metro Area",
    year: 2024,
    value: 42.5,
    target: 60,
    progressPercent: 71,
    dataSource: "Energy Ministry",
    confidence: "High",
  },
  {
    id: "14",
    sdgGoal: "SDG 5",
    indicatorName: "Women in leadership positions",
    district: "Central District",
    year: 2024,
    value: 42.1,
    target: 50,
    progressPercent: 84,
    dataSource: "Municipal HR Database",
    confidence: "High",
  },
  {
    id: "15",
    sdgGoal: "SDG 4",
    indicatorName: "Adult literacy rate",
    district: "Rural District",
    year: 2024,
    value: 89.1,
    target: 98,
    progressPercent: 91,
    dataSource: "Census Bureau",
    confidence: "Medium",
  },
  {
    id: "16",
    sdgGoal: "SDG 11",
    indicatorName: "Affordable housing units",
    district: "Central District",
    year: 2024,
    value: 5200,
    target: 8000,
    progressPercent: 65,
    dataSource: "Housing Authority",
    confidence: "High",
  },
  {
    id: "17",
    sdgGoal: "SDG 8",
    indicatorName: "Formal employment rate",
    district: "Northern Zone",
    year: 2024,
    value: 68.4,
    target: 85,
    progressPercent: 80,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "18",
    sdgGoal: "SDG 13",
    indicatorName: "CO2 emissions per capita (tons)",
    district: "Central District",
    year: 2024,
    value: 4.2,
    target: 3.5,
    progressPercent: 83,
    dataSource: "Environmental Agency",
    confidence: "High",
  },
  {
    id: "19",
    sdgGoal: "SDG 9",
    indicatorName: "R&D expenditure (% of GDP)",
    district: "Tech Park",
    year: 2024,
    value: 2.1,
    target: 3.0,
    progressPercent: 70,
    dataSource: "Innovation Ministry",
    confidence: "Medium",
  },
  {
    id: "20",
    sdgGoal: "SDG 13",
    indicatorName: "Renewable energy share (%)",
    district: "Central District",
    year: 2024,
    value: 52.5,
    target: 60,
    progressPercent: 88,
    dataSource: "Energy Ministry",
    confidence: "High",
  },
  {
    id: "21",
    sdgGoal: "SDG 5",
    indicatorName: "Female workforce participation",
    district: "Metro Area",
    year: 2024,
    value: 58.7,
    target: 70,
    progressPercent: 84,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "22",
    sdgGoal: "SDG 4",
    indicatorName: "Adult literacy rate",
    district: "Central District",
    year: 2024,
    value: 97.8,
    target: 99,
    progressPercent: 99,
    dataSource: "Census Bureau",
    confidence: "High",
  },
  {
    id: "23",
    sdgGoal: "SDG 11",
    indicatorName: "Green space per capita (m2)",
    district: "Eastern Borough",
    year: 2024,
    value: 12.4,
    target: 25,
    progressPercent: 50,
    dataSource: "Urban Planning Dept",
    confidence: "High",
  },
  {
    id: "24",
    sdgGoal: "SDG 8",
    indicatorName: "Formal employment rate",
    district: "Central District",
    year: 2024,
    value: 78.4,
    target: 85,
    progressPercent: 92,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "25",
    sdgGoal: "SDG 9",
    indicatorName: "R&D expenditure (% of GDP)",
    district: "Central District",
    year: 2024,
    value: 2.8,
    target: 3.5,
    progressPercent: 80,
    dataSource: "Innovation Ministry",
    confidence: "Medium",
  },
  {
    id: "26",
    sdgGoal: "SDG 5",
    indicatorName: "Gender parity index (primary)",
    district: "Southern Region",
    year: 2024,
    value: 0.92,
    target: 1.0,
    progressPercent: 92,
    dataSource: "UN Women Report",
    confidence: "High",
  },
  {
    id: "27",
    sdgGoal: "SDG 11",
    indicatorName: "Green space per capita (m2)",
    district: "Central District",
    year: 2024,
    value: 18.5,
    target: 25,
    progressPercent: 74,
    dataSource: "Urban Planning Dept",
    confidence: "High",
  },
  {
    id: "28",
    sdgGoal: "SDG 4",
    indicatorName: "Primary school enrollment rate",
    district: "Western District",
    year: 2024,
    value: 91.2,
    target: 100,
    progressPercent: 91,
    dataSource: "Ministry of Education",
    confidence: "High",
  },
  {
    id: "29",
    sdgGoal: "SDG 5",
    indicatorName: "Female workforce participation",
    district: "Central District",
    year: 2024,
    value: 64.2,
    target: 70,
    progressPercent: 92,
    dataSource: "Labor Statistics Bureau",
    confidence: "High",
  },
  {
    id: "30",
    sdgGoal: "SDG 8",
    indicatorName: "Youth unemployment rate",
    district: "Rural District",
    year: 2024,
    value: 15.2,
    target: 8,
    progressPercent: 53,
    dataSource: "Labor Statistics Bureau",
    confidence: "Medium",
  },
  {
    id: "31",
    sdgGoal: "SDG 11",
    indicatorName: "Public transport accessibility",
    district: "Central District",
    year: 2024,
    value: 75.3,
    target: 90,
    progressPercent: 84,
    dataSource: "Urban Mobility Survey",
    confidence: "High",
  },
  {
    id: "32",
    sdgGoal: "SDG 13",
    indicatorName: "Renewable energy share (%)",
    district: "Industrial Zone",
    year: 2024,
    value: 28.4,
    target: 60,
    progressPercent: 47,
    dataSource: "Energy Ministry",
    confidence: "High",
  },
];

// Loading messages for each step
export const step1LoadingMessages = [
  "Reading uploaded files...",
  "Parsing CSV and Excel data...",
  "Cleaning and normalizing columns...",
  "Mapping indicators to SDG taxonomy...",
  "Validating data integrity...",
  "Unifying data sources...",
  "Preparing unified database view...",
];

export const step2LoadingMessages = [
  "Analyzing data patterns...",
  "Identifying key trends...",
  "Generating visualizations...",
  "Computing statistical summaries...",
  "Drafting narrative sections...",
  "Preparing insights for review...",
];

export const step3LoadingMessages = [
  "Compiling VLR sections...",
  "Integrating charts and tables...",
  "Formatting document structure...",
  "Applying SDG branding...",
  "Running final quality checks...",
  "Generating PDF document...",
];

// Insight sections with full VLR section names
export const insightSections: InsightSection[] = [
  {
    id: "education",
    title: "Educational Access and Learning Outcomes Across Districts",
    chartType: "bar",
    chartData: [
      { district: "Central", enrollment: 94, completion: 87, literacy: 96 },
      { district: "Northern", enrollment: 89, completion: 79, literacy: 91 },
      { district: "Eastern", enrollment: 91, completion: 82, literacy: 93 },
      { district: "Western", enrollment: 88, completion: 76, literacy: 89 },
      { district: "Southern", enrollment: 85, completion: 72, literacy: 86 },
    ],
    narrative: `The analysis of educational indicators across the five main districts reveals significant progress toward SDG 4 targets, with an overall enrollment rate of 89.4% across all districts. The Central District leads performance metrics with a 94% primary enrollment rate and 87% secondary completion rate, demonstrating the effectiveness of targeted educational investments made over the past three years.

However, disparities persist between urban and peripheral areas. The Southern Region shows a 9-percentage-point gap in enrollment compared to Central District, highlighting the need for infrastructure improvements and teacher deployment strategies in underserved areas. Dropout rates remain elevated in the Eastern Borough, particularly among adolescent girls, suggesting the need for gender-sensitive interventions.

Key recommendations include: (1) Expanding school feeding programs in low-enrollment districts, (2) Implementing mobile learning units for remote communities, and (3) Strengthening vocational training pathways to improve completion rates. The data suggests that with sustained investment, the city can achieve universal primary education by 2028.`,
    narrativeRefined: `REFINED: Educational indicators show strong progress with 89.4% average enrollment across districts. Central District leads at 94% enrollment, while Southern Region lags by 9 percentage points, requiring targeted interventions. Priority actions: expand school feeding programs, deploy mobile learning units, and strengthen vocational pathways. Universal primary education is achievable by 2028 with sustained investment.`,
  },
  {
    id: "gender",
    title: "Gender Parity Comparison and Evolution Over Time",
    chartType: "line",
    chartData: [
      { year: "2019", parity: 0.89, workforce: 48, leadership: 22 },
      { year: "2020", parity: 0.91, workforce: 50, leadership: 25 },
      { year: "2021", parity: 0.93, workforce: 52, leadership: 28 },
      { year: "2022", parity: 0.95, workforce: 54, leadership: 31 },
      { year: "2023", parity: 0.97, workforce: 56, leadership: 33 },
      { year: "2024", parity: 0.98, workforce: 59, leadership: 34 },
    ],
    narrative: `Gender parity indicators demonstrate consistent improvement over the six-year period from 2019 to 2024, with the Gender Parity Index in education rising from 0.89 to 0.98, approaching the target of 1.0. This represents one of the most successful areas of SDG implementation in our city, reflecting the impact of policy interventions including scholarships for girls, menstrual hygiene programs, and safe transportation initiatives.

Female workforce participation has increased by 11 percentage points, from 48% to 59%, driven by expanded childcare facilities and flexible work policies introduced in 2021. Women in leadership positions have grown from 22% to 34%, though this remains below the 50% target established in the city's Gender Action Plan.

Critical challenges remain in economic empowerment, where the gender wage gap persists at 18% across comparable positions. The informal sector shows even greater disparities, with women earning 25% less than male counterparts. Addressing these gaps requires: (1) Pay transparency legislation, (2) Expanded access to business financing for women entrepreneurs, and (3) Strengthened enforcement of equal opportunity employment policies.`,
    narrativeRefined: `Gender parity near target (0.98 GPI). Workforce participation +11pts to 59%. Leadership representation at 34% (target: 50%). Wage gap persists at 18%. Action required: pay transparency and women's financing access.`,
  },
  {
    id: "climate",
    title: "Climate Resilience and Environmental Sustainability Progress",
    chartType: "area",
    chartData: [
      { quarter: "Q1 2023", emissions: 6.2, renewable: 35, greenSpace: 12 },
      { quarter: "Q2 2023", emissions: 6.0, renewable: 37, greenSpace: 13 },
      { quarter: "Q3 2023", emissions: 5.9, renewable: 39, greenSpace: 13 },
      { quarter: "Q4 2023", emissions: 5.8, renewable: 40, greenSpace: 14 },
      { quarter: "Q1 2024", emissions: 5.7, renewable: 41, greenSpace: 14 },
      { quarter: "Q2 2024", emissions: 5.6, renewable: 43, greenSpace: 15 },
    ],
    narrative: `Climate action indicators show measurable progress, with per capita CO2 emissions declining from 6.2 to 5.6 tons over the past 18 months, a 10% reduction. The renewable energy share in the municipal grid has increased from 35% to 43%, supported by the installation of 12 MW of solar capacity on public buildings and the expansion of the district heating network.

The city's green space per capita has improved from 12 to 15 square meters, moving closer to the WHO-recommended 25 square meters target. Urban forestry initiatives have planted over 50,000 trees since 2022, with a focus on heat-vulnerable neighborhoods in the Industrial Zone and Eastern Borough.

Climate vulnerability remains concentrated in low-income areas, where flood risk affects 23% of households compared to 8% citywide. The Climate Adaptation Fund has allocated $45 million for flood mitigation infrastructure, but implementation has been delayed by procurement challenges. Accelerating these projects is critical to achieving the 2030 resilience targets.

Key actions for the next reporting period: (1) Complete the green corridor network connecting major parks, (2) Implement building energy efficiency standards for new construction, and (3) Expand the electric vehicle charging infrastructure to 500 public stations.`,
    narrativeRefined: `REFINED: Climate metrics improving steadily: CO2 emissions down 10% to 5.6 tons per capita, renewable energy up to 43%, and green space increased to 15 m2 per capita. 50,000 trees planted since 2022. Key concern: flood risk affects 23% of low-income households. Priority: complete green corridors, implement building efficiency standards, and expand EV charging to 500 stations.`,
  },
  {
    id: "infrastructure",
    title: "Infrastructure Development and Public Services Investment",
    chartType: "pie",
    chartData: [
      { category: "Transportation", allocation: 35, color: "#0ea5e9" },
      { category: "Housing", allocation: 25, color: "#a855f7" },
      { category: "Digital", allocation: 20, color: "#22c55e" },
      { category: "Utilities", allocation: 15, color: "#f59e0b" },
      { category: "Public Spaces", allocation: 5, color: "#ef4444" },
    ],
    narrative: `Infrastructure investment for the current fiscal year totals $2.3 billion, allocated across five priority areas aligned with SDG 9 and SDG 11 targets. Transportation receives the largest share at 35% ($805 million), funding the metro expansion project, bus rapid transit corridors, and pedestrian infrastructure improvements in the city center.

Housing development commands 25% of the budget ($575 million), supporting the construction of 4,200 affordable housing units and the rehabilitation of 1,800 existing units in aging public housing complexes. The digital infrastructure allocation of 20% ($460 million) is expanding fiber optic coverage to 95% of households and deploying 5G networks across commercial districts.

Utility infrastructure, including water and sanitation upgrades, receives 15% ($345 million), with a focus on replacing aging water mains in the Northern Zone where losses exceed 30%. Public spaces and parks development receives 5% ($115 million), funding the renovation of 12 neighborhood parks and the creation of 3 new pocket parks in high-density areas.

Project completion rates have improved to 78% compared to 65% in the previous year, reflecting enhanced project management capacity. However, cost overruns averaging 12% remain a concern, particularly in large transportation projects.`,
    narrativeRefined: `REFINED: Total infrastructure investment: $2.3B across five areas. Transportation (35%, $805M): metro expansion and BRT corridors. Housing (25%, $575M): 4,200 new affordable units. Digital (20%, $460M): 95% fiber coverage. Utilities (15%, $345M): water main replacement. Public spaces (5%, $115M): 12 park renovations. Project completion improved to 78%, though 12% cost overruns persist.`,
  },
  {
    id: "economic",
    title: "Economic Growth and Employment Distribution Analysis",
    chartType: "bar",
    chartData: [
      { sector: "Services", employment: 42, growth: 3.2 },
      { sector: "Manufacturing", employment: 18, growth: 1.8 },
      { sector: "Technology", employment: 15, growth: 8.5 },
      { sector: "Construction", employment: 12, growth: 4.1 },
      { sector: "Retail", employment: 8, growth: 2.3 },
      { sector: "Agriculture", employment: 5, growth: 0.5 },
    ],
    narrative: `The city's economic structure continues to shift toward services and technology sectors, which together now account for 57% of total employment. The technology sector shows the highest growth rate at 8.5% annually, driven by the Tech Park development and startup ecosystem support programs that have attracted 45 new companies in the past year.

The services sector remains the largest employer at 42% of the workforce, with healthcare and education subsectors showing particularly strong hiring. Manufacturing employment has stabilized at 18% after years of decline, supported by advanced manufacturing incentives and reshoring initiatives that have brought 2,300 jobs back to the city.

Youth unemployment remains elevated at 12.8%, nearly double the overall unemployment rate of 6.4%. The mismatch between educational outcomes and labor market needs is evident, with 35% of employers reporting difficulty filling technical positions. The Skills Bridge program, launched in 2023, has trained 8,500 young people in high-demand skills, but scale-up is needed.

The informal economy, estimated at 22% of total economic activity, presents both challenges and opportunities. Formalization initiatives have registered 12,000 informal workers in the past year, providing access to social protection and banking services. Continued efforts to reduce barriers to formal employment are essential for achieving inclusive growth targets.`,
    narrativeRefined: `REFINED: Economy shifting to services (42%) and tech (15%, growing 8.5% annually). 45 new tech companies attracted; manufacturing stable at 18% with 2,300 reshored jobs. Youth unemployment high at 12.8% vs 6.4% overall, with 35% of employers facing technical hiring gaps. Skills Bridge trained 8,500 youth; 12,000 informal workers formalized. Priority: scale training programs and reduce formalization barriers.`,
  },
];

// Chat responses for Step 1 (data review)
export const step1ChatResponses: Record<string, string> = {
  default:
    "Got it, I'll make that adjustment to the unified data. The changes will be reflected in the VLR analysis.",
  remove:
    "Understood, I'm removing that column from the unified view. This will simplify the data presentation in the final report.",
  adjust:
    "Noted, I'll adjust those values accordingly. The updated figures will be used in subsequent calculations.",
  column:
    "I've updated the column configuration. The data table now reflects your preferences.",
  filter:
    "Filter applied successfully. The data view now shows only the relevant records.",
};

// Chat responses for Step 2 (insights review) - per section
export const step2ChatResponses: Record<string, Record<number, string>> = {
  education: {
    0: "Understood. I'll exclude the education section from the final VLR report. The remaining four sections will be included in the generated document.",
    1: "Got it, I'll refine the narrative to be more concise while preserving the key findings and recommendations.",
    2: "I've noted your feedback on the education analysis. Would you like me to adjust the chart visualization as well?",
  },
  gender: {
    0: "I'll flag the gender section for revision. Would you like to provide specific guidance on what should be changed?",
    1: "Refining the gender parity narrative now. I'll focus on the most impactful statistics and actionable recommendations.",
    2: "Noted. The gender analysis will be updated to reflect your input before final report generation.",
  },
  climate: {
    0: "Climate section noted for adjustment. The environmental metrics will be presented with your recommended changes.",
    1: "I'll revise the climate narrative to emphasize the progress made while acknowledging the remaining challenges.",
    2: "Feedback recorded. The climate resilience section will be updated accordingly.",
  },
  infrastructure: {
    0: "Infrastructure section flagged. I'll review the budget allocation data and update the pie chart if needed.",
    1: "Refining the infrastructure narrative to better highlight project completion rates and investment priorities.",
    2: "Your input on infrastructure development has been noted for the final report.",
  },
  economic: {
    0: "Economic analysis section noted. I'll ensure the employment data accurately reflects the latest available figures.",
    1: "Updating the economic growth narrative to provide clearer sector-by-sector insights.",
    2: "Feedback incorporated. The economic section will reflect your recommendations.",
  },
};

// VLR final metadata
export const vlrFinalMetadata = {
  filename: "VLR_Report_2025.pdf",
  fileSize: "12.4 MB",
  sections: 5,
  charts: 8,
  pages: 47,
  generatedAt: "December 11, 2025",
};
