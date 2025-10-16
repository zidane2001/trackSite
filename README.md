# Shipping Management System

A full-stack shipping management application with React frontend and Node.js/Express backend with SQLite database.

## Features

- **Locations Management**: Add, edit, delete shipping locations
- **Zones Management**: Organize locations into shipping zones
- **Shipping Rates**: Configure flat or weight-based shipping rates
- **Pickup Rates**: Set pickup rates by zone
- **Shipment Management**: Create and track shipments with weight calculations
- **CSV Import/Export**: Import and export data via CSV files

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Node.js with Express
- SQLite database
- CORS enabled for cross-origin requests

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shipping-management
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend will run on http://localhost:3001

5. **Start the frontend (in a new terminal)**
   ```bash
   npm run dev
   ```
   The frontend will run on http://localhost:5173 (or next available port)

## API Endpoints

### Locations
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Zones
- `GET /api/zones` - Get all zones
- `POST /api/zones` - Create zone
- `PUT /api/zones/:id` - Update zone
- `DELETE /api/zones/:id` - Delete zone

### Shipping Rates
- `GET /api/shipping-rates` - Get all shipping rates
- `POST /api/shipping-rates` - Create shipping rate
- `PUT /api/shipping-rates/:id` - Update shipping rate
- `DELETE /api/shipping-rates/:id` - Delete shipping rate

### Pickup Rates
- `GET /api/pickup-rates` - Get all pickup rates
- `POST /api/pickup-rates` - Create pickup rate
- `PUT /api/pickup-rates/:id` - Update pickup rate
- `DELETE /api/pickup-rates/:id` - Delete pickup rate

### Shipments
- `GET /api/shipments?status=processing` - Get shipments (optional status filter)
- `POST /api/shipments` - Create shipment
- `PUT /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment

## Database Schema

The application uses SQLite with the following tables:
- `locations` - Shipping locations
- `zones` - Shipping zones grouping locations
- `shipping_rates` - Shipping rate configurations
- `pickup_rates` - Pickup rate configurations
- `shipments` - Shipment records
- `users` - User accounts (for future use)

## Deployment

### Backend Deployment
The backend can be deployed to any Node.js hosting service:

1. **Build for production**
   ```bash
   cd backend
   npm install --production
   ```

2. **Environment variables**
   Set `PORT` environment variable for the port (defaults to 3001)

3. **Database**
   The SQLite database file (`database.db`) will be created automatically on first run

### Frontend Deployment
The frontend can be deployed to any static hosting service:

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder**
   Upload the contents of the `dist` folder to your hosting service

3. **Configure API URL**
   Update the `API_BASE_URL` in `src/utils/api.ts` to point to your deployed backend

## Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server (same as start for now)

### Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── rates/
│   │   │   ├── LocationsManagement.tsx
│   │   │   ├── ZonesManagement.tsx
│   │   │   ├── ShippingRatesManagement.tsx
│   │   │   └── PickupRatesManagement.tsx
│   │   ├── shipments/
│   │   │   ├── ShipmentManagement.tsx
│   │   │   └── AddressAutocomplete.tsx
│   │   └── ui/
│   ├── pages/
│   ├── utils/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   ├── csv.ts
│   │   └── weight.ts
│   └── ...
├── backend/
│   ├── server.js
│   ├── package.json
│   └── database.db (created automatically)
├── package.json
├── vite.config.ts
└── README.md
```

## Features Overview

### Weight Calculations
The system supports volumetric weight calculations for accurate shipping costs. Use the built-in calculator in the Shipping Rates section.

### CSV Operations
All management sections support CSV import/export for bulk operations.

### Responsive Design
The application is fully responsive and works on desktop and mobile devices.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.
