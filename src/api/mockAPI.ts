import type { Coin, CoinDetail, ChartData } from "../types/crypto";

const POPULAR_COINS = [
  "bitcoin",
  "ethereum",
  "tether",
  "usd-coin",
  "binancecoin",
  "ripple",
  "solana",
  "cardano",
  "dogecoin",
  "shiba-inu",
  "polkadot",
  "tron",
  "avalanche-2",
  "chainlink",
  "matic-network",
  "litecoin",
  "polygon",
  "wrapped-bitcoin",
  "uniswap",
  "ethereum-classic",
];

const COIN_NAMES = {
  bitcoin: "Bitcoin",
  ethereum: "Ethereum",
  tether: "Tether",
  "usd-coin": "USD Coin",
  binancecoin: "BNB",
  ripple: "XRP",
  solana: "Solana",
  cardano: "Cardano",
  dogecoin: "Dogecoin",
  "shiba-inu": "Shiba Inu",
  polkadot: "Polkadot",
  tron: "TRON",
  "avalanche-2": "Avalanche",
  chainlink: "Chainlink",
  "matic-network": "Polygon",
  litecoin: "Litecoin",
  polygon: "Polygon",
  "wrapped-bitcoin": "Wrapped Bitcoin",
  uniswap: "Uniswap",
  "ethereum-classic": "Ethereum Classic",
};

const COIN_SYMBOLS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  tether: "USDT",
  "usd-coin": "USDC",
  binancecoin: "BNB",
  ripple: "XRP",
  solana: "SOL",
  cardano: "ADA",
  dogecoin: "DOGE",
  "shiba-inu": "SHIB",
  polkadot: "DOT",
  tron: "TRX",
  "avalanche-2": "AVAX",
  chainlink: "LINK",
  "matic-network": "MATIC",
  litecoin: "LTC",
  polygon: "MATIC",
  "wrapped-bitcoin": "WBTC",
  uniswap: "UNI",
  "ethereum-classic": "ETC",
};

// Utility functions for generating random data
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(randomBetween(min, max));
};

const randomPercentage = (min: number = -50, max: number = 50): number => {
  return randomBetween(min, max);
};

const randomPrice = (basePrice: number, volatility: number = 0.1): number => {
  const change = randomBetween(-volatility, volatility);
  return basePrice * (1 + change);
};

const generateRandomDate = (daysAgo: number = 365): string => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomDate = new Date(
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime())
  );
  return randomDate.toISOString();
};

const generateCoinImage = (coinId: string): string => {
  // Use proper CoinGecko image URLs with correct coin IDs
  const imageMap: { [key: string]: string } = {
    bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ethereum: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    tether: "https://assets.coingecko.com/coins/images/325/large/Tether.png",
    "usd-coin": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
    binancecoin: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png",
    ripple: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    dogecoin: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    "shiba-inu": "https://assets.coingecko.com/coins/images/11939/large/shiba.png",
    polkadot: "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    tron: "https://assets.coingecko.com/coins/images/1094/large/tron-logo.png",
    "avalanche-2": "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
    chainlink: "https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png",
    "matic-network": "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    litecoin: "https://assets.coingecko.com/coins/images/2/large/litecoin.png",
    polygon: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
    "wrapped-bitcoin": "https://assets.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png",
    uniswap: "https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png",
    "ethereum-classic": "https://assets.coingecko.com/coins/images/453/large/ethereum-classic-logo.png",
  };
  
  return imageMap[coinId] || `https://assets.coingecko.com/coins/images/1/large/bitcoin.png`;
};

const generateMockCoin = (id: string, rank: number): Coin => {
  const symbol =
    COIN_SYMBOLS[id as keyof typeof COIN_SYMBOLS] || id.toUpperCase();
  const name = COIN_NAMES[id as keyof typeof COIN_NAMES] || id;

  // Generate base prices with some realistic ranges
  const basePrices = {
    bitcoin: 45000,
    ethereum: 2500,
    tether: 1,
    "usd-coin": 1,
    binancecoin: 300,
    ripple: 0.5,
    solana: 100,
    cardano: 0.4,
    dogecoin: 0.08,
    "shiba-inu": 0.000015,
  };

  const basePrice =
    basePrices[id as keyof typeof basePrices] || randomBetween(0.01, 1000);
  const currentPrice = randomPrice(basePrice, 0.15);

  const marketCap = currentPrice * randomBetween(10000000, 1000000000);
  const volume = marketCap * randomBetween(0.01, 0.3);
  const circulatingSupply = marketCap / currentPrice;

  const priceChange24h = randomBetween(-currentPrice * 0.2, currentPrice * 0.2);
  const priceChangePercentage24h = (priceChange24h / currentPrice) * 100;

  return {
    id,
    symbol,
    name,
    image: generateCoinImage(id),
    current_price: currentPrice,
    market_cap: marketCap,
    market_cap_rank: rank,
    fully_diluted_valuation: marketCap * randomBetween(1, 1.5),
    total_volume: volume,
    high_24h: currentPrice * randomBetween(1.01, 1.15),
    low_24h: currentPrice * randomBetween(0.85, 0.99),
    price_change_24h: priceChange24h,
    price_change_percentage_24h: priceChangePercentage24h,
    market_cap_change_24h: randomBetween(-marketCap * 0.1, marketCap * 0.1),
    market_cap_change_percentage_24h: randomPercentage(-10, 10),
    circulating_supply: circulatingSupply,
    total_supply: circulatingSupply * randomBetween(1, 2),
    max_supply: circulatingSupply * randomBetween(1, 5),
    ath: currentPrice * randomBetween(1.1, 10),
    ath_change_percentage: randomPercentage(-90, -10),
    ath_date: generateRandomDate(randomInt(30, 2000)),
    atl: currentPrice * randomBetween(0.01, 0.9),
    atl_change_percentage: randomPercentage(50, 10000),
    atl_date: generateRandomDate(randomInt(100, 3000)),
    roi:
      Math.random() > 0.5
        ? {
            times: randomBetween(0.1, 100),
            currency: "usd",
            percentage: randomPercentage(-50, 5000),
          }
        : null,
    last_updated: new Date().toISOString(),
  };
};

const generateMockCoinDetail = (coinId: string): CoinDetail => {
  const baseCoin = generateMockCoin(coinId, randomInt(1, 100));
  const name = COIN_NAMES[coinId as keyof typeof COIN_NAMES] || coinId;

  const descriptions = [
    `${name} is a decentralized cryptocurrency that operates on a peer-to-peer network. It enables secure, fast, and low-cost transactions globally.`,
    `${name} is a revolutionary blockchain platform that enables smart contracts and decentralized applications. It aims to create a new paradigm for digital finance.`,
    `${name} is a digital asset designed to maintain stability and provide utility in the growing cryptocurrency ecosystem. It offers innovative features for users and developers.`,
    `${name} is a next-generation blockchain protocol that focuses on scalability, security, and sustainability. It provides a foundation for the future of decentralized finance.`,
  ];

  return {
    id: baseCoin.id,
    symbol: baseCoin.symbol,
    name: baseCoin.name,
    market_cap_rank: baseCoin.market_cap_rank,
    last_updated: baseCoin.last_updated,
    image: {
      thumb: baseCoin.image,
      small: baseCoin.image,
      large: baseCoin.image,
    },
    description: {
      en: descriptions[randomInt(0, descriptions.length)],
    },
    links: {
      homepage: [`https://${coinId}.org`],
      blockchain_site: [`https://explorer.${coinId}.org`],
      official_forum_url: [`https://forum.${coinId}.org`],
      chat_url: [`https://t.me/${coinId}`],
      announcement_url: [
        `https://bitcointalk.org/index.php?topic=${randomInt(
          1000000,
          9999999
        )}`,
      ],
      twitter_screen_name: `${coinId}`,
      facebook_username: `${coinId}`,
      bitcointalk_thread_identifier: randomInt(1000000, 9999999),
      telegram_channel_identifier: `${coinId}`,
      subreddit_url: `https://www.reddit.com/r/${coinId}`,
      repos_url: {
        github: [`https://github.com/${coinId}/${coinId}`],
        bitbucket: [],
      },
    },
    market_data: {
      current_price: { usd: baseCoin.current_price },
      total_value_locked: { usd: randomBetween(1000000, 10000000000) },
      mcap_to_tvl_ratio: randomBetween(0.1, 10),
      fdv_to_tvl_ratio: randomBetween(0.1, 15),
      roi: baseCoin.roi,
      ath: { usd: baseCoin.ath },
      ath_change_percentage: { usd: baseCoin.ath_change_percentage },
      ath_date: { usd: baseCoin.ath_date },
      atl: { usd: baseCoin.atl },
      atl_change_percentage: { usd: baseCoin.atl_change_percentage },
      atl_date: { usd: baseCoin.atl_date },
      market_cap: { usd: baseCoin.market_cap },
      market_cap_rank: baseCoin.market_cap_rank,
      fully_diluted_valuation: { usd: baseCoin.fully_diluted_valuation },
      total_volume: { usd: baseCoin.total_volume },
      high_24h: { usd: baseCoin.high_24h },
      low_24h: { usd: baseCoin.low_24h },
      price_change_24h: baseCoin.price_change_24h,
      price_change_percentage_24h: baseCoin.price_change_percentage_24h,
      price_change_percentage_7d: randomPercentage(-30, 30),
      price_change_percentage_14d: randomPercentage(-40, 40),
      price_change_percentage_30d: randomPercentage(-50, 50),
      price_change_percentage_60d: randomPercentage(-60, 60),
      price_change_percentage_200d: randomPercentage(-80, 200),
      price_change_percentage_1y: randomPercentage(-90, 500),
      market_cap_change_24h: baseCoin.market_cap_change_24h,
      market_cap_change_percentage_24h:
        baseCoin.market_cap_change_percentage_24h,
      price_change_24h_in_currency: { usd: baseCoin.price_change_24h },
      price_change_percentage_1h_in_currency: {
        usd: randomPercentage(-10, 10),
      },
      price_change_percentage_24h_in_currency: {
        usd: baseCoin.price_change_percentage_24h,
      },
      price_change_percentage_7d_in_currency: {
        usd: randomPercentage(-30, 30),
      },
      price_change_percentage_14d_in_currency: {
        usd: randomPercentage(-40, 40),
      },
      price_change_percentage_30d_in_currency: {
        usd: randomPercentage(-50, 50),
      },
      price_change_percentage_60d_in_currency: {
        usd: randomPercentage(-60, 60),
      },
      price_change_percentage_200d_in_currency: {
        usd: randomPercentage(-80, 200),
      },
      price_change_percentage_1y_in_currency: {
        usd: randomPercentage(-90, 500),
      },
      market_cap_change_24h_in_currency: {
        usd: baseCoin.market_cap_change_24h,
      },
      market_cap_change_percentage_24h_in_currency: {
        usd: baseCoin.market_cap_change_percentage_24h,
      },
      total_supply: baseCoin.total_supply,
      max_supply: baseCoin.max_supply,
      circulating_supply: baseCoin.circulating_supply,
      last_updated: baseCoin.last_updated,
    },
  };
};

const generateMockChartData = (
  coinId: string,
  days: number = 30
): ChartData => {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const startTime = now - days * dayInMs;

  // Generate a realistic starting price based on coin
  const basePrices = {
    bitcoin: 45000,
    ethereum: 2500,
    tether: 1,
    "usd-coin": 1,
    binancecoin: 300,
    ripple: 0.5,
    solana: 100,
    cardano: 0.4,
    dogecoin: 0.08,
    "shiba-inu": 0.000015,
  };

  let currentPrice =
    basePrices[coinId as keyof typeof basePrices] || randomBetween(0.01, 1000);
  const baseMarketCap = currentPrice * randomBetween(10000000, 1000000000);
  let currentMarketCap = baseMarketCap;
  let currentVolume = baseMarketCap * randomBetween(0.01, 0.3);

  const prices: [number, number][] = [];
  const marketCaps: [number, number][] = [];
  const totalVolumes: [number, number][] = [];

  const dataPoints = Math.min(days, 365); // Generate up to 365 data points
  const timeStep = (now - startTime) / dataPoints;

  for (let i = 0; i <= dataPoints; i++) {
    const timestamp = startTime + i * timeStep;

    // Create some realistic price movement with trends and volatility
    const trend = Math.sin((i / dataPoints) * Math.PI * 2) * 0.02; // Long-term trend
    const randomWalk = (Math.random() - 0.5) * 0.08; // Random volatility
    const priceChange = trend + randomWalk;

    currentPrice = Math.max(currentPrice * (1 + priceChange), 0.000001);
    currentMarketCap = Math.max(
      currentMarketCap * (1 + priceChange * 0.8),
      1000
    );
    currentVolume = Math.max(
      currentVolume * (1 + (Math.random() - 0.5) * 0.5),
      1000
    );

    prices.push([timestamp, currentPrice]);
    marketCaps.push([timestamp, currentMarketCap]);
    totalVolumes.push([timestamp, currentVolume]);
  }

  return {
    prices,
    market_caps: marketCaps,
    total_volumes: totalVolumes,
  };
};

// Simulate network delay
const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Mock API functions
export const fetchMockCoins = async (
  _vsCurrency: string = "usd",
  order: string = "market_cap_desc"
): Promise<Coin[]> => {
  await simulateDelay(randomInt(200, 800));

  const coins = POPULAR_COINS.map((coinId, index) =>
    generateMockCoin(coinId, index + 1)
  );

  // Apply sorting
  switch (order) {
    case "market_cap_desc":
      coins.sort((a, b) => b.market_cap - a.market_cap);
      break;
    case "volume_desc":
      coins.sort((a, b) => b.total_volume - a.total_volume);
      break;
    case "price_desc":
      coins.sort((a, b) => b.current_price - a.current_price);
      break;
    case "price_asc":
      coins.sort((a, b) => a.current_price - b.current_price);
      break;
    case "name_asc":
      coins.sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return coins;
};

export const fetchMockCoinDetail = async (
  coinId: string
): Promise<CoinDetail> => {
  await simulateDelay(randomInt(300, 1000));
  return generateMockCoinDetail(coinId);
};

export const fetchMockChartData = async (
  coinId: string,
  _vsCurrency: string = "usd",
  days: number = 30,
  _interval: string = "daily"
): Promise<ChartData> => {
  await simulateDelay(randomInt(400, 1200));
  return generateMockChartData(coinId, days);
};
