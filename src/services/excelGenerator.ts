import ExcelJS from 'exceljs';

export async function generateExcelModel(deal: any, inputs: any) {
  const workbook = new ExcelJS.Workbook();
  
  workbook.creator = 'DealFlow Pro';
  workbook.lastModifiedBy = 'DealFlow Pro';
  workbook.created = new Date();
  workbook.modified = new Date();

  createAssumptionsSheet(workbook, deal, inputs);
  createDebtSchedule(workbook, inputs);
  createRevenueModel(workbook, inputs);
  createPLStatement(workbook, inputs);
  createCashFlow(workbook, inputs);
  createReturnsAnalysis(workbook, deal, inputs);

  const filename = `${deal.name.replace(/\s+/g, '_')}_Model_${new Date().toISOString().split('T')[0]}.xlsx`;
  const buffer = await workbook.xlsx.writeBuffer();
  
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function createAssumptionsSheet(workbook: ExcelJS.Workbook, deal: any, inputs: any) {
  const sheet = workbook.addWorksheet('Assumptions');
  
  sheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  sheet.getCell('A1').value = 'DEAL ASSUMPTIONS';
  sheet.getCell('A1').font = { bold: true, size: 16 };
  
  sheet.getCell('A3').value = 'Deal Information';
  sheet.getCell('A3').font = { bold: true };
  sheet.getCell('A4').value = 'Project Name';
  sheet.getCell('B4').value = deal.name;
  sheet.getCell('A5').value = 'Company';
  sheet.getCell('B5').value = deal.company;
  sheet.getCell('A6').value = 'Deal Type';
  sheet.getCell('B6').value = deal.dealType.toUpperCase();
  sheet.getCell('A7').value = 'Deal Size ($M)';
  sheet.getCell('B7').value = parseFloat(deal.dealSize);
  sheet.getCell('B7').numFmt = '#,##0.0';
  
  sheet.getCell('A9').value = 'Revenue Assumptions';
  sheet.getCell('A9').font = { bold: true };
  sheet.getCell('A10').value = 'Base Year Revenue ($M)';
  sheet.getCell('B10').value = inputs.revenue.baseRevenue;
  sheet.getCell('B10').numFmt = '#,##0.0';
  sheet.getCell('A11').value = 'Annual Growth Rate';
  sheet.getCell('B11').value = inputs.revenue.growthRate;
  sheet.getCell('B11').numFmt = '0.0%';
  
  sheet.getCell('A13').value = 'Operating Assumptions';
  sheet.getCell('A13').font = { bold: true };
  sheet.getCell('A14').value = 'COGS (% of Revenue)';
  sheet.getCell('B14').value = inputs.costs.cogs;
  sheet.getCell('B14').numFmt = '0.0%';
  sheet.getCell('A15').value = 'OpEx (% of Revenue)';
  sheet.getCell('B15').value = inputs.costs.opex;
  sheet.getCell('B15').numFmt = '0.0%';
  sheet.getCell('A16').value = 'CapEx (% of Revenue)';
  sheet.getCell('B16').value = inputs.costs.capex;
  sheet.getCell('B16').numFmt = '0.0%';

  if (deal.dealType === 'lbo') {
    sheet.getCell('A18').value = 'Financing Assumptions';
    sheet.getCell('A18').font = { bold: true };
    sheet.getCell('A19').value = 'Debt Amount ($M)';
    sheet.getCell('B19').value = inputs.financing.debtAmount;
    sheet.getCell('B19').numFmt = '#,##0.0';
    sheet.getCell('A20').value = 'Interest Rate';
    sheet.getCell('B20').value = inputs.financing.interestRate;
    sheet.getCell('B20').numFmt = '0.0%';
    sheet.getCell('A21').value = 'Term (Years)';
    sheet.getCell('B21').value = inputs.financing.term;
  }

  sheet.getCell('A23').value = 'Exit Assumptions';
  sheet.getCell('A23').font = { bold: true };
  sheet.getCell('A24').value = 'Exit Multiple (x EBITDA)';
  sheet.getCell('B24').value = inputs.exit.exitMultiple;
  sheet.getCell('B24').numFmt = '#,##0.0';
  sheet.getCell('A25').value = 'Exit Year';
  sheet.getCell('B25').value = inputs.exit.exitYear;

  formatHeaders(sheet);
}

function createDebtSchedule(workbook: ExcelJS.Workbook, inputs: any) {
  const sheet = workbook.addWorksheet('Debt Schedule');
  
  sheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  sheet.getCell('A1').value = 'DEBT SCHEDULE';
  sheet.getCell('A1').font = { bold: true, size: 16 };

  const years = 7;
  sheet.getCell('A3').value = 'Year';
  for (let i = 0; i <= years; i++) {
    sheet.getCell(3, i + 2).value = i;
  }

  sheet.getCell('A4').value = 'Beginning Balance';
  sheet.getCell('A5').value = 'Interest Expense';
  sheet.getCell('A6').value = 'Principal Repayment';
  sheet.getCell('A7').value = 'Ending Balance';

  sheet.getCell('B4').value = inputs.financing.debtAmount;
  for (let i = 1; i <= years; i++) {
    const col = i + 2;
    const cell4 = sheet.getCell(4, col);
    const cell5 = sheet.getCell(5, col);
    const cell6 = sheet.getCell(6, col);
    const cell7 = sheet.getCell(7, col);
    
    cell4.value = { formula: `=${String.fromCharCode(64 + col - 1)}7` };
    cell5.value = { formula: `=${String.fromCharCode(64 + col)}4*$B$20` };
    cell6.value = inputs.financing.debtAmount / inputs.financing.term;
    cell7.value = { formula: `=${String.fromCharCode(64 + col)}4-${String.fromCharCode(64 + col)}6` };
  }

  formatHeaders(sheet);
  formatNumbers(sheet, 4, 7, 2, years + 2);
}

function createRevenueModel(workbook: ExcelJS.Workbook, inputs: any) {
  const sheet = workbook.addWorksheet('Revenue Model');
  
  sheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  sheet.getCell('A1').value = 'REVENUE MODEL';
  sheet.getCell('A1').font = { bold: true, size: 16 };

  const years = 5;
  sheet.getCell('A3').value = 'Year';
  for (let i = 1; i <= years; i++) {
    sheet.getCell(3, i + 1).value = i;
  }

  sheet.getCell('A4').value = 'Revenue ($M)';
  sheet.getCell('B4').value = inputs.revenue.baseRevenue;
  
  for (let i = 2; i <= years + 1; i++) {
    const cell = sheet.getCell(4, i);
    cell.value = { formula: `=${String.fromCharCode(64 + i - 1)}4*(1+$B$11)` };
  }

  sheet.getCell('A5').value = 'YoY Growth %';
  for (let i = 3; i <= years + 1; i++) {
    const cell = sheet.getCell(5, i);
    cell.value = { formula: `=(${String.fromCharCode(64 + i)}4/${String.fromCharCode(64 + i - 1)}4)-1` };
    cell.numFmt = '0.0%';
  }

  formatHeaders(sheet);
  formatNumbers(sheet, 4, 4, 2, years + 1);
}

function createPLStatement(workbook: ExcelJS.Workbook, _inputs: any) {
  const sheet = workbook.addWorksheet('P&L');
  
  sheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  sheet.getCell('A1').value = 'PROFIT & LOSS STATEMENT';
  sheet.getCell('A1').font = { bold: true, size: 16 };

  const years = 5;
  sheet.getCell('A3').value = 'Year';
  for (let i = 1; i <= years; i++) {
    sheet.getCell(3, i + 1).value = i;
  }

  const rows = [
    'Revenue',
    'COGS',
    'Gross Profit',
    'Operating Expenses',
    'EBITDA',
    'Interest Expense',
    'EBT',
    'Taxes (25%)',
    'Net Income',
  ];

  rows.forEach((label, index) => {
    sheet.getCell(index + 4, 1).value = label;
  });

  for (let col = 2; col <= years + 1; col++) {
    const colLetter = String.fromCharCode(64 + col);
    sheet.getCell(4, col).value = { formula: `='Revenue Model'!${colLetter}4` };
    sheet.getCell(5, col).value = { formula: `=-${colLetter}4*$B$14` };
    sheet.getCell(6, col).value = { formula: `=${colLetter}4+${colLetter}5` };
    sheet.getCell(7, col).value = { formula: `=-${colLetter}4*$B$15` };
    sheet.getCell(8, col).value = { formula: `=${colLetter}6+${colLetter}7` };
    sheet.getCell(9, col).value = { formula: `=-'Debt Schedule'!${colLetter}5` };
    sheet.getCell(10, col).value = { formula: `=${colLetter}8+${colLetter}9` };
    sheet.getCell(11, col).value = { formula: `=-${colLetter}10*0.25` };
    sheet.getCell(12, col).value = { formula: `=${colLetter}10+${colLetter}11` };
  }

  formatHeaders(sheet);
  formatNumbers(sheet, 4, 12, 2, years + 1);
}

function createCashFlow(workbook: ExcelJS.Workbook, _inputs: any) {
  const sheet = workbook.addWorksheet('Cash Flow');
  
  sheet.columns = [
    { width: 25 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 15 },
  ];

  sheet.getCell('A1').value = 'CASH FLOW STATEMENT';
  sheet.getCell('A1').font = { bold: true, size: 16 };

  const years = 5;
  sheet.getCell('A3').value = 'Year';
  for (let i = 1; i <= years; i++) {
    sheet.getCell(3, i + 1).value = i;
  }

  const rows = [
    'EBITDA',
    'Taxes',
    'CapEx',
    'Change in NWC',
    'Unlevered FCF',
    'Interest Expense',
    'Principal Repayment',
    'Levered FCF',
  ];

  rows.forEach((label, index) => {
    sheet.getCell(index + 4, 1).value = label;
  });

  for (let col = 2; col <= years + 1; col++) {
    const colLetter = String.fromCharCode(64 + col);
    sheet.getCell(4, col).value = { formula: `='P&L'!${colLetter}8` };
    sheet.getCell(5, col).value = { formula: `='P&L'!${colLetter}11` };
    sheet.getCell(6, col).value = { formula: `=-'Revenue Model'!${colLetter}4*$B$16` };
    sheet.getCell(7, col).value = 0;
    sheet.getCell(8, col).value = { formula: `=SUM(${colLetter}4:${colLetter}7)` };
    sheet.getCell(9, col).value = { formula: `='P&L'!${colLetter}9` };
    sheet.getCell(10, col).value = { formula: `=-'Debt Schedule'!${colLetter}6` };
    sheet.getCell(11, col).value = { formula: `=${colLetter}8+${colLetter}9+${colLetter}10` };
  }

  formatHeaders(sheet);
  formatNumbers(sheet, 4, 11, 2, years + 1);
}

function createReturnsAnalysis(workbook: ExcelJS.Workbook, deal: any, inputs: any) {
  const sheet = workbook.addWorksheet('Returns Analysis');
  
  sheet.columns = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
    { width: 20 },
  ];

  sheet.getCell('A1').value = 'RETURNS ANALYSIS';
  sheet.getCell('A1').font = { bold: true, size: 16 };

  sheet.getCell('A3').value = 'Exit Valuation';
  sheet.getCell('A3').font = { bold: true };
  
  sheet.getCell('A4').value = 'Exit Year EBITDA ($M)';
  sheet.getCell('B4').value = { formula: `='P&L'!${String.fromCharCode(65 + inputs.exit.exitYear)}8` };
  
  sheet.getCell('A5').value = 'Exit Multiple';
  sheet.getCell('B5').value = inputs.exit.exitMultiple;
  
  sheet.getCell('A6').value = 'Enterprise Value ($M)';
  sheet.getCell('B6').value = { formula: '=B4*B5' };
  
  sheet.getCell('A7').value = 'Less: Net Debt';
  sheet.getCell('B7').value = { formula: `=-'Debt Schedule'!${String.fromCharCode(65 + inputs.exit.exitYear + 1)}7` };
  
  sheet.getCell('A8').value = 'Equity Value ($M)';
  sheet.getCell('B8').value = { formula: '=B6+B7' };

  sheet.getCell('A10').value = 'Returns Calculation';
  sheet.getCell('A10').font = { bold: true };
  
  sheet.getCell('A11').value = 'Initial Equity Investment ($M)';
  sheet.getCell('B11').value = inputs.financing.equityAmount;
  
  sheet.getCell('A12').value = 'Exit Equity Value ($M)';
  sheet.getCell('B12').value = { formula: '=B8' };
  
  sheet.getCell('A13').value = 'MOIC';
  sheet.getCell('B13').value = { formula: '=B12/B11' };
  sheet.getCell('B13').numFmt = '0.00"x"';
  
  sheet.getCell('A14').value = 'IRR';
  sheet.getCell('B14').value = { formula: `=POWER(B13,1/${inputs.exit.exitYear})-1` };
  sheet.getCell('B14').numFmt = '0.0%';

  sheet.getCell('A16').value = 'Target vs Actual';
  sheet.getCell('A16').font = { bold: true };
  
  sheet.getCell('A17').value = 'Target IRR';
  sheet.getCell('B17').value = parseFloat(deal.targetIRR) / 100;
  sheet.getCell('B17').numFmt = '0.0%';
  
  sheet.getCell('A18').value = 'Projected IRR';
  sheet.getCell('B18').value = { formula: '=B14' };
  
  sheet.getCell('A19').value = 'Variance';
  sheet.getCell('B19').value = { formula: '=B18-B17' };
  sheet.getCell('B19').numFmt = '+0.0%;-0.0%';

  formatHeaders(sheet);
  formatNumbers(sheet, 4, 19, 2, 2);
}

function formatHeaders(sheet: ExcelJS.Worksheet) {
  sheet.eachRow((row, rowNumber) => {
    if (rowNumber === 3) {
      row.eachCell((cell) => {
        cell.font = { bold: true };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFE8E8E8' },
        };
      });
    }
  });
}

function formatNumbers(sheet: ExcelJS.Worksheet, startRow: number, endRow: number, startCol: number, endCol: number) {
  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const cell = sheet.getCell(row, col);
      if (!cell.numFmt) {
        cell.numFmt = '#,##0.0';
      }
    }
  }
}