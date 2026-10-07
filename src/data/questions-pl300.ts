// PL-300 question bank (39 items), written once (Rule 8).
// Source of truth: "Study guide for Exam PL-300: Microsoft Power BI Data Analyst", Microsoft Learn,
// skills measured as of 2026-04-20 (fetched 2026-10-07). Each question names the official skill line it
// tests and links a Microsoft Learn page on that topic (all links returned HTTP 200 on 2026-10-07) (Rule 5).
// Questions are original. Domain mix follows the blueprint midpoints: prepare, model, visualize 27.5% each,
// manage and secure 17.5%.

import type { Question } from "./questions";

const L = "https://learn.microsoft.com/en-us/";
const DOC = {
  directquery: { label: "Import vs DirectQuery", url: L + "power-bi/connect-data/desktop-directquery-about" },
  directlake: { label: "Direct Lake overview", url: L + "fabric/fundamentals/direct-lake-overview" },
  parameters: { label: "Power Query parameters", url: L + "power-query/power-query-query-parameters" },
  profiling: { label: "Power Query data profiling tools", url: L + "power-query/data-profiling-tools" },
  errors: { label: "Dealing with errors in Power Query", url: L + "power-query/dealing-with-errors" },
  unpivot: { label: "Unpivot columns", url: L + "power-query/unpivot-column" },
  append: { label: "Append queries", url: L + "power-query/append-queries" },
  merge: { label: "Merge queries overview", url: L + "power-query/merge-queries-overview" },
  folding: { label: "Query folding basics", url: L + "power-query/query-folding-basics" },
  star: { label: "Star schema and Power BI", url: L + "power-bi/guidance/star-schema" },
  bidi: { label: "Bidirectional relationship guidance", url: L + "power-bi/guidance/relationships-bidirectional-filtering" },
  datetable: { label: "Date tables", url: L + "power-bi/guidance/model-date-tables" },
  calccols: { label: "Calculated columns", url: L + "power-bi/transform-model/desktop-calculated-columns" },
  calculate: { label: "CALCULATE function (DAX)", url: L + "dax/calculate-function-dax" },
  timeintel: { label: "Time intelligence functions (DAX)", url: L + "dax/time-intelligence-functions-dax" },
  calcgroups: { label: "Calculation groups", url: L + "power-bi/transform-model/calculation-groups" },
  perf: { label: "Performance Analyzer", url: L + "power-bi/create-reports/desktop-performance-analyzer" },
  reduce: { label: "Data reduction techniques for Import modeling", url: L + "power-bi/guidance/import-modeling-data-reduction" },
  condfmt: { label: "Conditional formatting", url: L + "power-bi/create-reports/desktop-conditional-table-formatting" },
  slicers: { label: "Slicers (sync across pages)", url: L + "power-bi/visuals/power-bi-visualization-slicers" },
  paginated: { label: "Paginated reports in Power BI", url: L + "power-bi/paginated-reports/paginated-reports-report-builder-power-bi" },
  drillthrough: { label: "Drillthrough", url: L + "power-bi/create-reports/desktop-drillthrough" },
  bookmarks: { label: "Bookmarks", url: L + "power-bi/create-reports/desktop-bookmarks" },
  tooltips: { label: "Report page tooltips", url: L + "power-bi/create-reports/desktop-tooltips" },
  interactions: { label: "Visual interactions", url: L + "power-bi/create-reports/service-reports-visual-interactions" },
  access: { label: "Accessibility in reports", url: L + "power-bi/create-reports/desktop-accessibility-creating-reports" },
  anomaly: { label: "Anomaly detection", url: L + "power-bi/visuals/power-bi-visualization-anomaly-detection" },
  analytics: { label: "Analytics pane", url: L + "power-bi/transform-model/desktop-analytics-pane" },
  gateway: { label: "On-premises data gateway", url: L + "power-bi/connect-data/service-gateway-onprem" },
  roles: { label: "Roles in workspaces", url: L + "power-bi/collaborate-share/service-roles-new-workspaces" },
  rls: { label: "Row-level security", url: L + "fabric/security/service-admin-row-level-security" },
  labels: { label: "Sensitivity labels in Power BI", url: L + "power-bi/enterprise/service-security-sensitivity-label-overview" },
  endorse: { label: "Endorse content", url: L + "power-bi/collaborate-share/service-endorse-content" },
  apps: { label: "Create and distribute apps", url: L + "power-bi/collaborate-share/service-create-distribute-apps" },
};

type Doc = (typeof DOC)[keyof typeof DOC];

function p(
  id: string,
  domainId: "prepare" | "model" | "visualize" | "manage",
  skill: string,
  doc: Doc,
  prompt: string,
  choices: string[],
  answer: number | number[],
  explanation: string,
): Question {
  return {
    id: `pl300-${id}`,
    topicId: "pl300",
    domainId,
    skill,
    prompt,
    choices,
    answer: Array.isArray(answer) ? answer : [answer],
    explanation,
    source: { label: `PL-300 Study Guide (as of 2026-04-20): ${skill} · ${doc.label}`, url: doc.url },
  };
}

export const PL300_QUESTIONS: Question[] = [
  // ======== Prepare the data (11) ========
  p("prep-1", "prepare", "Choose between DirectLake, DirectQuery, and Import", DOC.directquery,
    "A 200 MB sales dataset from an on-premises SQL Server only changes overnight. Analysts want the fastest possible visuals. Which storage mode fits best?",
    ["DirectQuery", "Import", "A live connection with no model", "Direct Lake"], 1,
    "Import loads data into the model's in-memory engine, giving the fastest visuals, and suits data that is small enough and refreshed on a schedule. DirectQuery sends queries to the source each time, and Direct Lake applies to Fabric lakehouse or warehouse data."),

  p("prep-2", "prepare", "Choose between DirectLake, DirectQuery, and Import", DOC.directquery,
    "Source data is far too large to import, and report users need results that reflect source changes almost immediately. Which mode should you choose?",
    ["Import with hourly refresh", "DirectQuery", "Import with incremental refresh", "A static Excel export"], 1,
    "DirectQuery leaves the data in the source and queries it at report time, so it handles very large data and near real-time needs, at the cost of slower visuals and source load."),

  p("prep-3", "prepare", "Choose between DirectLake, DirectQuery, and Import", DOC.directlake,
    "Your data lives as Delta tables in a Microsoft Fabric lakehouse. You want Import-like speed without copying the data into a separate import cache on a refresh schedule. Which mode fits?",
    ["Direct Lake", "DirectQuery to a SQL endpoint only", "Import", "Composite model with Excel"], 0,
    "Direct Lake reads Delta/Parquet data from OneLake into memory on demand, aiming for Import-like performance without a full data copy refresh."),

  p("prep-4", "prepare", "Create and modify parameters", DOC.parameters,
    "You must point the same set of queries at a development SQL server and later a production server without editing the M code by hand. What should you create?",
    ["A calculated table", "A parameter for the server name, used in the source step", "A second copy of every query", "A DAX measure that holds the server name"], 1,
    "Power Query parameters let you change values such as server or file path in one place, and reference them in queries."),

  p("prep-5", "prepare", "Evaluate data, including data statistics and column properties", DOC.profiling,
    "By default Power Query's column profiling looks at only the first 1,000 rows. How do you profile the whole dataset?",
    [
      "Increase the number of rows loaded in the model.",
      "Change the profiling option in the status bar to \"Column profiling based on entire data set\".",
      "Sort the column before profiling.",
      "Convert the column to text.",
    ], 1,
    "Data profiling defaults to the top 1,000 rows. The status bar lets you switch column profiling to the entire dataset when you need accurate distribution and quality figures."),

  p("prep-6", "prepare", "Resolve data import errors", DOC.errors,
    "Converting a column to Whole Number produces error values in some rows. You must keep every row and treat the bad values as missing. What should you do?",
    ["Remove errors", "Replace errors with null", "Delete the column", "Change the data type back to Any"], 1,
    "Remove Errors deletes the affected rows. Replace Errors keeps the rows and substitutes a value such as null."),

  p("prep-7", "prepare", "Pivot, unpivot, and transpose data", DOC.unpivot,
    "A source table has one column per month (Jan to Dec). You need one row per customer per month, with Month and Amount columns. Which transformation?",
    ["Pivot the Month column", "Transpose the table", "Unpivot the month columns", "Group by customer"], 2,
    "Unpivoting converts column headers into attribute-value rows, the correct shape for analysis. Selecting the identifier columns and choosing Unpivot Other Columns keeps it robust if months are added."),

  p("prep-8", "prepare", "Merge and append queries", DOC.append,
    "You have two queries, Sales_North and Sales_South, with identical columns. You want a single table containing all rows from both. Which operation?",
    ["Merge queries", "Append queries", "Group by", "Pivot columns"], 1,
    "Append stacks rows from tables with similar columns. Merge adds columns from another table by matching key columns."),

  p("prep-9", "prepare", "Merge and append queries", DOC.merge,
    "Sales has a ProductID column, and Products has ProductID and Category. You need the category in the Sales query, keeping every sales row. Which approach?",
    ["Append Products to Sales", "Merge Sales with Products on ProductID using a left outer join, then expand Category", "Unpivot Products", "Duplicate Sales and rename a column"], 1,
    "A merge on ProductID with a left outer join keeps all Sales rows and brings in matching Category values."),

  p("prep-10", "prepare", "Configure data loading for queries", DOC.folding,
    "A transformation step in Power Query \"breaks query folding\". What does that mean?",
    [
      "The query will fail to load.",
      "Steps from that point on are processed by Power BI's engine instead of being pushed to the source, which can slow refresh.",
      "The query is automatically converted to DirectQuery.",
      "Power Query removes the step.",
    ], 1,
    "Query folding pushes steps back to the source as a single native query. Once a step cannot fold, later steps run locally, which can reduce refresh performance."),

  p("prep-11", "prepare", "Create fact tables and dimension tables", DOC.star,
    "Your model has one wide table that repeats customer, product and date details on every sales row. Filters behave inconsistently and the model is large. What is the best-practice redesign?",
    ["Add more calculated columns", "Split it into a fact table and related dimension tables (a star schema)", "Switch every relationship to bidirectional", "Convert the table to DirectQuery"], 1,
    "A star schema keeps measurable events in a fact table and descriptive attributes in dimension tables, which improves filtering, clarity and performance."),

  // ======== Model the data (11) ========
  p("model-1", "model", "Define a relationship's cardinality and cross-filter direction", DOC.star,
    "Customers has a unique CustomerID. Sales has many rows per CustomerID. What relationship should you create between them?",
    ["Many-to-many", "One-to-one", "One-to-many from Customers to Sales", "Many-to-one from Customers to Sales with no filtering"], 2,
    "A unique key on the dimension side and repeated values in the fact table is a one-to-many relationship, with filters flowing from the dimension to the fact."),

  p("model-2", "model", "Define a relationship's cardinality and cross-filter direction", DOC.bidi,
    "What is the recommended cross-filter direction for most relationships in a star schema?",
    ["Both, on every relationship", "Single, from the dimension table to the fact table", "Single, from the fact table to the dimension table", "None"], 1,
    "Single-direction filtering from dimension to fact is the default and recommended choice. Bidirectional filtering can create ambiguity and hurt performance, so use it only when needed."),

  p("model-3", "model", "Implement role-playing dimensions", DOC.star,
    "Sales has OrderDate and ShipDate, and both relate to the same Date table. How can you model this and report by either date?",
    [
      "Make both relationships active; Power BI will pick the right one.",
      "Keep one active relationship and one inactive; use USERELATIONSHIP in measures that need the inactive one.",
      "Delete the ShipDate column.",
      "Merge OrderDate and ShipDate into one column.",
    ], 1,
    "Only one relationship between two tables can be active. A role-playing dimension is handled with an inactive relationship activated by USERELATIONSHIP, or with a separate copy of the date table."),

  p("model-4", "model", "Create a common date table", DOC.datetable,
    "You want time-intelligence functions to work correctly. Which statement about the date table is true?",
    [
      "It can skip weekends if they are not used.",
      "It needs a date column with unique values covering a contiguous range of days, and should be marked as the date table.",
      "It must be created in the data source, not in the model.",
      "It must contain only the dates that appear in the fact table.",
    ], 1,
    "A proper date table has unique, contiguous dates covering the full range of the data, and is marked as the date table so time intelligence works as expected."),

  p("model-5", "model", "Identify use cases for calculated columns and calculated tables", DOC.calccols,
    "Which statement correctly contrasts a calculated column with a measure?",
    [
      "A measure is stored per row; a calculated column is computed at query time.",
      "A calculated column is computed at refresh and stored in the model; a measure is evaluated at query time in the current filter context.",
      "They are identical but use different syntax.",
      "A calculated column responds to slicers; a measure does not.",
    ], 1,
    "Calculated columns are evaluated during refresh and stored, increasing model size. Measures are calculated on demand in the filter context of the visual, so they respond to slicers."),

  p("model-6", "model", "Use the CALCULATE function", DOC.calculate,
    "Which measure returns total sales amount for products whose Color is Red?",
    [
      "Red Sales = CALCULATE(SUM(Sales[Amount]), Product[Color] = \"Red\")",
      "Red Sales = SUM(Sales[Amount]) WHERE Product[Color] = \"Red\"",
      "Red Sales = SUMX(Product, \"Red\")",
      "Red Sales = FILTER(Sales, Product[Color] = \"Red\")",
    ], 0,
    "CALCULATE evaluates an expression in a modified filter context, here adding a filter on Color. FILTER alone returns a table, not a value, and the other options are not valid DAX measures."),

  p("model-7", "model", "Implement time intelligence measures", DOC.timeintel,
    "Which DAX function calculates a year-to-date total of an expression against a date column?",
    ["SAMEPERIODLASTYEAR", "TOTALYTD", "DATESMTD", "EOMONTH"], 1,
    "TOTALYTD evaluates an expression for the year-to-date period. SAMEPERIODLASTYEAR returns the same period a year earlier, and DATESMTD is month-to-date."),

  p("model-8", "model", "Implement time intelligence measures", DOC.timeintel,
    "You need sales for the same period in the previous year, to compare against the current selection. Which function returns those dates?",
    ["SAMEPERIODLASTYEAR", "DATESYTD", "TOTALQTD", "ENDOFMONTH"], 0,
    "SAMEPERIODLASTYEAR returns the dates shifted back one year, typically used inside CALCULATE for prior-year comparisons."),

  p("model-9", "model", "Create semi-additive measures", DOC.timeintel,
    "Inventory quantity is recorded daily. When a visual shows a month, it must show the last day's balance, not the sum of all days. What should you do?",
    [
      "Use SUM and format as a percentage.",
      "Use CALCULATE with LASTDATE on the date column to take the closing balance.",
      "Use COUNT instead of SUM.",
      "Turn the column into a calculated table.",
    ], 1,
    "Balances such as stock levels are semi-additive: they add across products but not over time. A measure that picks the last date (for example CALCULATE with LASTDATE) returns the closing balance."),

  p("model-10", "model", "Create calculation groups", DOC.calcgroups,
    "You have 15 base measures and need YTD and prior-year versions of each, which would mean dozens of near-duplicate measures. What reduces this?",
    ["A calculated table of measure names", "A calculation group with calculation items for the time variations", "Bidirectional relationships", "Quick measures only"], 1,
    "Calculation groups apply reusable calculation items (such as YTD or prior year) to any measure, avoiding a proliferation of similar measures."),

  p("model-11", "model", "Improve performance by identifying and removing unnecessary rows and columns", DOC.reduce,
    "An Import model is large and slow. Which action most directly reduces model size?",
    [
      "Add more calculated columns.",
      "Remove columns and rows that reports never use before loading.",
      "Switch every relationship to bidirectional.",
      "Increase the report page size.",
    ], 1,
    "Removing unneeded columns and rows, and reducing granularity, are core Import-model optimisation steps because model size drives memory use and speed."),

  // ======== Visualize and analyze the data (10) ========
  p("viz-1", "visualize", "Apply conditional formatting", DOC.condfmt,
    "In a table, you want the Margin cells shaded red when the value is below 10%. Which feature should you use?",
    ["A slicer", "Conditional formatting using rules on the background color", "A drillthrough page", "A bookmark"], 1,
    "Conditional formatting changes the colour of cells based on rules or values, such as red when margin is under 10%."),

  p("viz-2", "visualize", "Configure sync slicers", DOC.slicers,
    "A Region slicer on page 1 should also filter visuals on pages 2 and 3. What should you configure?",
    ["Three separate slicers set by hand", "The Sync slicers pane for the slicer", "A bookmark per page", "A calculated column for region"], 1,
    "The Sync slicers pane lets a slicer's selection apply across chosen report pages."),

  p("viz-3", "visualize", "Choose when to use a paginated report", DOC.paginated,
    "Finance needs pixel-perfect, multi-page invoices that print or export cleanly to PDF. Which report type fits?",
    ["A standard interactive Power BI report page", "A paginated report", "A dashboard", "A bookmark navigator"], 1,
    "Paginated reports are designed for fixed-layout, print-ready output such as invoices and statements, and flow across multiple pages."),

  p("viz-4", "visualize", "Configure drillthrough navigation, including pages, filters, and buttons", DOC.drillthrough,
    "Users should be able to right-click a product in any visual and jump to a Product Details page filtered to that product. What do you set up?",
    ["A tooltip page", "A drillthrough page with the product field as its drillthrough filter", "A sync slicer", "A new relationship"], 1,
    "A drillthrough page with a drillthrough field lets users navigate from a data point to a page filtered to that item."),

  p("viz-5", "visualize", "Configure bookmarks", DOC.bookmarks,
    "You want a button that switches a page between a chart view and a table view. Which combination does this?",
    ["Bookmarks plus buttons, with the Selection pane controlling which visuals show", "Drillthrough plus sorting", "Quick measures", "Row-level security"], 0,
    "Bookmarks capture a page state (including visual visibility), and buttons can be linked to them to let users toggle views."),

  p("viz-6", "visualize", "Create custom tooltips", DOC.tooltips,
    "When users hover over a bar, they should see a small custom page with a mini chart. What do you create?",
    ["A report page set up as a tooltip page", "A drillthrough button", "A new bookmark", "A calculated table"], 0,
    "A report page configured as a tooltip page appears when hovering over a visual that uses it."),

  p("viz-7", "visualize", "Edit and configure interactions between visuals", DOC.interactions,
    "Clicking a bar chart should filter the table but must not change a KPI card. What do you use?",
    ["Sync slicers", "Edit interactions, setting the card to None", "A bookmark", "Row-level security"], 1,
    "Edit interactions controls whether selecting one visual filters, highlights or does not affect each other visual."),

  p("viz-8", "visualize", "Design and configure Power BI reports for accessibility", DOC.access,
    "Select TWO actions that make a report more accessible to screen-reader users.",
    ["Add alt text to visuals.", "Set a logical tab order for visuals.", "Use more colours to make it vivid.", "Place all visuals on one overlapping layer."], [0, 1],
    "Alt text gives screen readers a description, and tab order controls keyboard navigation. Adding colours or overlapping visuals does not help and can hurt accessibility."),

  p("viz-9", "visualize", "Detect outliers and anomalies", DOC.anomaly,
    "You want Power BI to flag unexpected spikes and dips on a line chart over time. Which feature?",
    ["Forecasting", "Find anomalies in the Analytics pane", "A reference line", "Grouping"], 1,
    "Anomaly detection on a line chart highlights unexpected values and can show possible explanations."),

  p("viz-10", "visualize", "Use reference lines, error bars, and forecasting", DOC.analytics,
    "You want to extend a line chart into future months with a confidence band. Where do you add this?",
    ["Format pane > Title", "Analytics pane > Forecast", "Modeling tab > New table", "View tab > Themes"], 1,
    "The Analytics pane adds features such as forecasts, constant lines and error bars to supported visuals."),

  // ======== Manage and secure Power BI (7) ========
  p("manage-1", "manage", "Identify when a gateway is required", DOC.gateway,
    "A semantic model imports data from an on-premises SQL Server. You want scheduled refresh in the Power BI service. What is needed?",
    ["Nothing; the service can reach on-premises servers directly", "An on-premises data gateway", "A paginated report", "A sensitivity label"], 1,
    "The Power BI service needs an on-premises data gateway to refresh data from sources it cannot reach directly."),

  p("manage-2", "manage", "Assign workspace roles", DOC.roles,
    "A colleague should view and interact with reports in a workspace but never edit or publish content. Which role?",
    ["Admin", "Member", "Contributor", "Viewer"], 3,
    "Viewer is read-only for content in the workspace. Contributor, Member and Admin can all edit or publish."),

  p("manage-3", "manage", "Implement row-level security roles", DOC.rls,
    "Regional managers must see only their region's rows. Where do you define the RLS role and filter, and where do you add members?",
    [
      "Define roles in Power BI Desktop; assign members to roles in the Power BI service.",
      "Define roles in the service only; Desktop cannot create them.",
      "Define roles in Excel.",
      "Assign members in Desktop; define roles in the service.",
    ], 0,
    "RLS roles and their DAX table filters are created in Power BI Desktop. Members or groups are then assigned to roles in the service."),

  p("manage-4", "manage", "Configure row-level security group membership", DOC.rls,
    "A workspace Contributor tests RLS and sees all data. Why?",
    [
      "RLS is broken.",
      "RLS applies to viewers; users with edit permissions on the workspace are not restricted by it.",
      "Contributors are always members of every RLS role.",
      "RLS only works in Direct Lake.",
    ], 1,
    "RLS restricts users with Viewer access. Users with edit rights (Admin, Member, Contributor) can see all data, so test with a viewer account or the View as feature."),

  p("manage-5", "manage", "Apply sensitivity labels", DOC.labels,
    "Your company wants content classified as Confidential and protection to follow data when exported. What do you apply?",
    ["Row-level security", "Sensitivity labels", "Data alerts", "Bookmarks"], 1,
    "Sensitivity labels from Microsoft Purview classify and protect content, and can carry protection with exported data."),

  p("manage-6", "manage", "Promote or certify Power BI content", DOC.endorse,
    "Which endorsement signals content meets organisational quality standards and can only be applied by authorised reviewers?",
    ["Promoted", "Certified", "Shared", "Featured"], 1,
    "Certified content is endorsed by designated reviewers; Promoted can be set by content owners who have write permission."),

  p("manage-7", "manage", "Configure and update an app", DOC.apps,
    "You want to give a large audience a curated set of reports without granting access to the whole workspace. What do you publish?",
    ["A Power BI app", "A paginated report", "A gateway", "A calculation group"], 0,
    "A Power BI app packages selected workspace content for distribution to many users without workspace access."),
];
