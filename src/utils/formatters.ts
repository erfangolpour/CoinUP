export const formatNumber = (
  value: number,
  prefix: string = "",
  suffix: string = "",
  decimals: number = 2,
  simplified: boolean = true
) => {
  if (isNaN(value) || !isFinite(value)) return "N/A";
  if (simplified) {
    // Handle large numbers
    if (value >= 1e12)
      return `${prefix}${(value / 1e12).toFixed(decimals)}T${suffix}`;
    if (value >= 1e9)
      return `${prefix}${(value / 1e9).toFixed(decimals)}B${suffix}`;
    if (value >= 1e6)
      return `${prefix}${(value / 1e6).toFixed(decimals)}M${suffix}`;
    if (value >= 1e3)
      return `${prefix}${(value / 1e3).toFixed(decimals)}K${suffix}`;

    // Handle very small numbers
    if (value > 0 && value < 1e-9)
      return `${prefix}${(value * 1e12).toFixed(decimals)}p${suffix}`;
    if (value > 0 && value < 1e-6)
      return `${prefix}${(value * 1e9).toFixed(decimals)}n${suffix}`;
    if (value > 0 && value < 1e-3)
      return `${prefix}${(value * 1e6).toFixed(decimals)}µ${suffix}`;
  }
  return `${prefix}${value.toFixed(decimals)}${suffix}`;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
