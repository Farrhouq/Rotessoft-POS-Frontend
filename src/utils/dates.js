export const formatDateLabels = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${month}-${day}-${year}`; // return 'dd-mm-yyyy'
};

// dates code
// Function to format the date as mm-dd-yyyy
export function formatDate(date) {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}-${dd}-${yyyy}`;
}

// Function to subtract days from a given date
export function subtractDays(dateString, days) {
  if (!dateString) dateString = formatDate(new Date());
  const [mm, dd, yyyy] = dateString.split("-").map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  date.setDate(date.getDate() - days);
  return formatDate(date);
}

// Fill up missing dates until the array has 7 dates
export function fillBackwardDates(arr, targetLength = 7) {
  while (arr.length < targetLength) {
    // Take the first date and subtract 1 day
    const previousDate = subtractDays(arr[0], 1);
    arr.unshift(previousDate); // Add the new date to the start of the array
  }
  return arr;
}
