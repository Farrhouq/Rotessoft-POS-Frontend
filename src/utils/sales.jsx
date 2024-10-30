export function mergeAndSortSales(sales1, sales2) {
  // Merge both arrays
  const combinedSales = [...sales1, ...sales2];

  // Remove duplicates based on created_at, treating times up to the second as the same
  const uniqueSales = combinedSales.filter((sale, index, self) => {
    return (
      index ===
      self.findIndex((s) => {
        // Compare only up to the second by truncating the timestamp string
        const saleDate = sale.created_at.slice(0, 19); // e.g., '2024-10-29T08:38:49'
        const sDate = s.created_at.slice(0, 19); // e.g., '2024-10-29T08:38:49'
        return saleDate === sDate;
      })
    );
  });

  // Sort by date (earliest first)
  uniqueSales.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  return uniqueSales;
}
