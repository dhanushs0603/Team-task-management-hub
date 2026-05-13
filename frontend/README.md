# Team Task Management Hub - Frontend

A modern React-based frontend application for managing team tasks collaboratively. Built with TypeScript, Vite, and Zustand for state management.

## Features

- **Task Management**: Create, view, and manage team tasks
- **Search Functionality**: Filter tasks by title
- **Responsive UI**: Clean and intuitive user interface
- **Real-time Updates**: Integrated with backend API for live task synchronization
- **Form Validation**: Robust form handling with React Hook Form

## Tech Stack

- **React 19**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **Zustand**: Lightweight state management
- **Axios**: HTTP client for API calls
- **React Hook Form**: Form handling and validation
- **ESLint**: Code linting and formatting

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── api/               # API configuration (Axios)
│   ├── components/        # Reusable UI components
│   │   ├── taskform.tsx   # Task creation form
│   │   ├── tasklist.tsx   # Task list display
│   │   ├── taskcard.tsx   # Individual task card
│   │   └── searchbar.tsx  # Search input component
│   ├── page/              # Page components
│   │   └── dashboard.tsx  # Main dashboard page
│   ├── schema/            # Data schemas and types
│   ├── store/             # State management (Zustand)
│   ├── App.tsx            # Main app component
│   └── main.tsx           # App entry point
├── package.json           # Dependencies and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript configuration
└── eslint.config.js       # ESLint configuration
```

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Build

Build the application for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

### Linting

Run ESLint to check code quality:
```bash
npm run lint
```

## API Integration

The frontend communicates with a backend API for task management. Ensure the backend server is running and update the API base URL in `src/api/axios.ts` if necessary.

## Contributing

1. Follow the existing code style and TypeScript types
2. Run linting before committing
3. Test changes in development mode
4. Ensure compatibility with the backend API

## License

This project is part of the Team Task Management Hub system.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
