# DealFlow Pro - M&A/PE Deal Modeling Application

A modern, professional React application for M&A and Private Equity deal modeling with AI-powered assistance.

## Features

- **Deal Pipeline Dashboard** - Track and manage active transactions
- **Financial Model Builder** - Generate Excel models with 6 comprehensive tabs
- **GPT-4 Integration** - AI assistant for model modifications and insights
- **Deal Templates** - Pre-built templates for LBO, M&A, Growth, and Restructuring deals
- **Professional UI** - Modern SaaS design with smooth animations

## Tech Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- ExcelJS for Excel file generation
- OpenAI API for GPT-4 integration
- Vite for fast development

## Setup Instructions

1. Clone the repository and navigate to the project:
```bash
cd ma-pe-modeler
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Add your OpenAI API key to the `.env` file:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Usage

1. **Dashboard** - View your deal pipeline and key metrics
2. **New Deal** - Click "New Deal" to create a new transaction
3. **Model Builder** - Adjust assumptions and generate Excel models
4. **AI Assistant** - Use the chat interface to get insights and modify models

## Excel Model Structure

Generated models include:
- **Assumptions** - All deal and financial assumptions
- **Debt Schedule** - Detailed debt paydown schedule
- **Revenue Model** - Revenue projections with growth rates
- **P&L Statement** - Full profit & loss projections
- **Cash Flow** - Unlevered and levered free cash flow
- **Returns Analysis** - IRR, MOIC, and exit valuation

## Notes

- The AI chat feature provides fallback responses if the OpenAI API is not configured
- Excel files are generated client-side for data security
- All financial calculations follow standard PE/LBO modeling conventions