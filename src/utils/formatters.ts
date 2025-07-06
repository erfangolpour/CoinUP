// Cache for number formatters to avoid recreation
const formatters = new Map<string, Intl.NumberFormat>();

const getFormatter = (
	locale: string = "en-US",
	options?: Intl.NumberFormatOptions,
) => {
	const key = `${locale}-${JSON.stringify(options)}`;
	if (!formatters.has(key)) {
		formatters.set(key, new Intl.NumberFormat(locale, options));
	}
	return formatters.get(key)!;
};

export const formatNumber = (
	value: number,
	prefix: string = "",
	suffix: string = "",
	decimals: number = 2,
	simplified: boolean = true,
) => {
	if (isNaN(value) || !isFinite(value)) return "N/A";

	if (simplified) {
		// Handle large numbers
		if (Math.abs(value) >= 1e12) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value / 1e12)}T${suffix}`;
		}
		if (Math.abs(value) >= 1e9) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value / 1e9)}B${suffix}`;
		}
		if (Math.abs(value) >= 1e6) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value / 1e6)}M${suffix}`;
		}
		if (Math.abs(value) >= 1e3) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value / 1e3)}K${suffix}`;
		}

		// Handle very small numbers
		if (value > 0 && value < 1e-9) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value * 1e12)}p${suffix}`;
		}
		if (value > 0 && value < 1e-6) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value * 1e9)}n${suffix}`;
		}
		if (value > 0 && value < 1e-3) {
			const formatter = getFormatter("en-US", {
				minimumFractionDigits: decimals,
				maximumFractionDigits: decimals,
			});
			return `${prefix}${formatter.format(value * 1e6)}µ${suffix}`;
		}
	}

	const formatter = getFormatter("en-US", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	});
	return `${prefix}${formatter.format(value)}${suffix}`;
};

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};
