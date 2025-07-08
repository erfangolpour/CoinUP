# CoinUP 🚀

A modern, feature-rich cryptocurrency tracking application built with React, TypeScript, and Tailwind CSS. CoinUP provides real-time cryptocurrency data, interactive charts, and user authentication with favorites management.

## ✨ Features

### 🔍 **Cryptocurrency Tracking**

- Real-time cryptocurrency prices and market data
- Comprehensive coin details with market statistics
- Interactive price charts with multiple time periods (7D, 30D, 90D, 1Y)
- Search and filter functionality with debounced input
- Sort by price, market cap, 24h change, and more

### 👤 **User Authentication**

- Secure user registration and login system
- Persistent authentication state with local storage
- User profile management with account deletion
- Favorites system for tracking preferred cryptocurrencies

### 🎨 **Modern UI/UX**

- Clean, responsive design with Tailwind CSS
- Dark/Light theme toggle with smooth transitions
- Animated components using Framer Motion
- Skeleton loading states for better UX
- Toast notifications for user feedback
- Glass morphism effects and modern aesthetics

### 📱 **Responsive Design**

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interactions
- Adaptive layouts and typography

## 🛠️ Tech Stack

### **Frontend**

- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework

### **State Management**

- **Zustand** - Lightweight state management
- **Persistent storage** - Local storage integration

### **UI Components & Animation**

- **Framer Motion** - Smooth animations and transitions
- **Lucide React** - Beautiful icon library
- **Recharts** - Interactive charts and graphs
- **React Toastify** - Elegant notifications

### **API Integration**

- **Axios** - HTTP client for API requests
- **CoinGecko API** - Cryptocurrency data source
- **Caching system** - Optimized API response caching

### **Development Tools**

- **ESLint** - Code linting and quality
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd CoinUp
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

    ```env
    VITE_COINGECKO_API_KEY=your_coingecko_api_key_here
    ```

    > **Note**: The app includes a mock API fallback, so it will work without an API key for demonstration purposes.

4. **Start the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── api/                    # API integration
│   ├── API.ts             # CoinGecko API client
│   └── mockAPI.ts         # Mock API for development
├── components/            # React components
│   ├── common/           # Reusable UI components
│   ├── skeleton/         # Loading skeleton components
│   ├── AuthModal.tsx     # Authentication modal
│   ├── CoinCard.tsx      # Individual coin display
│   ├── CoinDetails.tsx   # Detailed coin view
│   ├── CoinList.tsx      # Coin listing page
│   ├── Header.tsx        # App header
│   ├── Layout.tsx        # App layout wrapper
│   ├── PriceChart.tsx    # Interactive price charts
│   └── UserMenu.tsx      # User menu component
├── config/               # Configuration files
│   └── env.ts           # Environment configuration
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts   # Debounced search input
│   ├── useFilteredCoins.ts # Coin filtering logic
│   └── useTheme.tsx     # Theme management
├── stores/              # Zustand stores
│   ├── useAuthStore.ts  # Authentication state
│   └── useCoinStore.ts  # Cryptocurrency data state
├── types/               # TypeScript type definitions
│   ├── auth.ts          # Authentication types
│   └── coin.ts          # Cryptocurrency types
├── utils/               # Utility functions
│   ├── cn.ts            # Class name utilities
│   └── formatters.ts    # Data formatting functions
├── App.tsx              # Main app component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## 🔧 Configuration

### Environment Variables

- `VITE_COINGECKO_API_KEY` - CoinGecko API key (optional, mock API available)

### Customization

- **Theme**: Modify theme colors in `src/index.css`
- **API Settings**: Update configuration in `src/config/env.ts`
- **Refresh Intervals**: Adjust auto-refresh timing in environment config

## 🎯 Key Features Deep Dive

### Authentication System

- **Registration**: Create new user accounts with email validation
- **Login**: Secure authentication with password verification
- **Persistence**: User sessions maintained across browser sessions
- **Favorites**: Save and manage favorite cryptocurrencies

### Cryptocurrency Data

- **Real-time Updates**: Auto-refresh every 5 seconds
- **Comprehensive Data**: Price, market cap, volume, 24h changes
- **Historical Charts**: Interactive price history visualization
- **Search & Filter**: Advanced filtering and sorting options

### Performance Optimizations

- **Caching**: Intelligent API response caching
- **Debounced Search**: Optimized search input handling
- **Memoization**: Optimized re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

GNU General Public License v3.0 - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [CoinGecko API](https://www.coingecko.com/api) for cryptocurrency data
- [Tailwind CSS](https://tailwindcss.com) for styling framework
- [Framer Motion](https://www.framer.com/motion/) for animations
- [Lucide](https://lucide.dev) for icons
- [Recharts](https://recharts.org/) for chart
- [Zustand](https://github.com/pmndrs/zustand) for state management
