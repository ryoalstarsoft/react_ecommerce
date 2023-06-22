export const countFilters = filters => {
  return Object.entries(filters).reduce((acc, [key, value]) => value && Array.isArray(value) ? acc + value.length : acc, 0)
}

export const getPercentSale = (original, current) => `${(current / original) * 100}%`
