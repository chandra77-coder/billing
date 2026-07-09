# Dukaan Bill

A mobile-first billing and invoicing web application designed for small shops (*dukaan* in Hindi).

## Features

- **Dashboard** — View key business stats at a glance (total sales, pending bills, low stock alerts)
- **Item Management** — Browse and manage items with stock tracking
- **Cart & Billing** — Add items to cart, adjust quantities, and generate invoices
- **Customer Management** — Select customers for bills and track payment status (paid/due/overdue)
- **Reports** — Visual bar charts and summary reports
- **Invoice Printing** — Print-ready A4 and A5 invoice templates
- **Settings** — Toggle and configuration options

## Project Structure

| File | Description |
|------|-------------|
| `styles.css` | Complete CSS stylesheet with responsive mobile-first design |

## Technologies

- HTML5
- CSS3 (with CSS variables for theming)
- Mobile-first responsive design

## Design Tokens

The stylesheet uses CSS custom properties for consistent theming:

| Variable | Value | Purpose |
|----------|-------|---------|
| `--primary` | `#1a237e` | Primary brand color (deep indigo) |
| `--accent` | `#ff6f00` | Accent color (amber) |
| `--success` | `#2e7d32` | Success state (green) |
| `--danger` | `#c62828` | Error/danger state (red) |
| `--warning` | `#ef6c00` | Warning state (orange) |

## Usage

1. Link `styles.css` in your HTML file
2. Use the provided CSS class names (e.g., `.btn-primary`, `.card`, `.badge-paid`)
3. Refer to the stylesheet comments for section organization

## License

Open source — use freely.
