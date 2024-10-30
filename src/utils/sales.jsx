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

export function filterSales(sales, range_1, range_2 = range_1) {
  if (range_2 < range_1) {
    throw new Error("range_2 must be greater than or equal to range_1");
  }

  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  // Set date boundaries
  startDate.setDate(today.getDate() - range_2);
  startDate.setHours(0, 0, 0, 0); // Start of the day
  endDate.setDate(today.getDate() - range_1);
  endDate.setHours(23, 59, 59, 999); // End of the day

  return sales.filter((sale) => {
    const saleDate = new Date(sale.created_at);
    return saleDate >= startDate && saleDate <= endDate;
  });
}
