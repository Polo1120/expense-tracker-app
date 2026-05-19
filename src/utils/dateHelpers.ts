export const getDateRange = (frequency: 'month' | 'fortnight'): { firstDay: Date; lastDay: Date } => {
  const now = new Date();
  let firstDay: Date;
  let lastDay: Date;

  if (frequency === 'month') {
    firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  } else {
    // fortnight
    const dayOfMonth = now.getDate();
    if (dayOfMonth <= 15) {
      firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      lastDay = new Date(now.getFullYear(), now.getMonth(), 15);
    } else {
      firstDay = new Date(now.getFullYear(), now.getMonth(), 16);
      lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }
  }

  return { firstDay, lastDay };
};
