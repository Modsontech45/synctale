const USD_PER_COIN = 1 / 78; // 1 USD = 78 coins
const PLATFORM_CUT_PERCENT = 60;
const CREATOR_PERCENT = 40;

export function coinsToUSD(coins: number): number {
  return +(coins * USD_PER_COIN).toFixed(2);
}

export function platformCutUSD(coins: number): number {
  return +((coinsToUSD(coins) * PLATFORM_CUT_PERCENT) / 100).toFixed(2);
}

export function creatorNetUSD(coins: number): number {
  return +((coinsToUSD(coins) * CREATOR_PERCENT) / 100).toFixed(2);
}

export function usdToCoins(usd: number): number {
  return Math.round(usd / USD_PER_COIN);
}