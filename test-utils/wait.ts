export const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, ms);
  });
