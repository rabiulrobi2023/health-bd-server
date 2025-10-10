export const getRandomNumByDate = (): string => {
  const now = new Date();
  return now.toISOString().replace(/\D/g, "").slice(0, 17);
};
