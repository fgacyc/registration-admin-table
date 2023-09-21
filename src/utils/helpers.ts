export const countOccurrences = (data: string[]): Record<string, number> => {
  const counts: Record<string, number> = {};

  for (const value of data) {
    if (counts.hasOwnProperty(value)) {
      counts[value]++;
    } else {
      counts[value] = 1;
    }
  }

  return counts;
};

export const createData = (data: Record<string, number>) => {
  const labels = Object.keys(data);
  const values = Object.values(data);

  return {
    labels: labels,
    datasets: [
      {
        data: values,
      },
    ],
  };
};
