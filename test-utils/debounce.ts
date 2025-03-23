export function debounce(wait: number, func: any) {
  let timeout: number;

  return function (...args: any[]) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}
