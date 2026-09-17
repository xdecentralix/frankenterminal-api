import { Address, formatUnits, getAddress } from 'viem';

/** Equity tokens use 0 decimals; hostile tokens can report anything. viem rejects negatives. */
export function clampDecimals(decimals: number, fallback = 0): number {
	if (!Number.isFinite(decimals)) return fallback;
	return Math.max(0, Math.min(255, Math.trunc(decimals)));
}

export function formatTokenUnits(value: bigint | string | number, decimals: number): string {
	try {
		return formatUnits(BigInt(value), clampDecimals(decimals));
	} catch {
		return '0';
	}
}

export function tokenAmountNumber(value: bigint | string | number, decimals: number): number {
	const n = Number(formatTokenUnits(value, decimals));
	return Number.isFinite(n) ? n : 0;
}

export function liqPriceDecimals(collateralDecimals: number): number {
	return clampDecimals(36 - clampDecimals(collateralDecimals));
}

export function formatLiqPriceUnits(price: bigint | string | number, collateralDecimals: number): string {
	try {
		return formatUnits(BigInt(price), liqPriceDecimals(collateralDecimals));
	} catch {
		return '0';
	}
}

export function liqPriceNumber(price: bigint | string | number, collateralDecimals: number): number {
	const n = Number(formatLiqPriceUnits(price, collateralDecimals));
	return Number.isFinite(n) ? n : 0;
}

export const formatCurrency = (value: string | number, minimumFractionDigits = 0, maximumFractionDigits = 2) => {
	const amount = typeof value === 'string' ? parseFloat(value) : value;

	if (amount === null || !!isNaN(amount)) return null;

	if (amount < 0.01 && amount > 0 && maximumFractionDigits) {
		return '< 0.01';
	}

	const formatter = new Intl.NumberFormat('en-US', {
		maximumFractionDigits,
		minimumFractionDigits,
	});

	return formatter.format(amount).split(',').join(`'`);
};

export function formatFloat(value: bigint, digits: number = 18) {
	return parseInt(value.toString()) / 10 ** digits;
}

export function normalizeAddress(addr: string): Address {
	return addr.toLowerCase() as Address;
}

export const shortenString = (str: string) => {
	return str.substring(0, 6) + '...' + str.substring(str.length - 4);
};

export const shortenStringAdjust = (str: string, length: number) => {
	if (str.length <= 2 * length) return str;
	return str.substring(0, length) + ' ... ' + str.substring(str.length - length);
};

export const shortenAddress = (address: Address): string => {
	try {
		const formattedAddress = getAddress(address);
		return shortenString(formattedAddress);
	} catch {
		throw new TypeError("Invalid input, address can't be parsed");
	}
};

export function timestampToSeconds(ms: number | string) {
	return String(Math.floor(Number(ms) / 1000));
}

export function timestampStartOfDay(ms: number | string) {
	return String(Number(ms) - (Number(ms) % 86_400_000));
}

// Escape Telegram MarkdownV1 special characters in user-supplied strings
export function escapeMd(text: string): string {
	return String(text).replace(/[\\*_`[]/g, '\\$&');
}
