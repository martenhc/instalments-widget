export async function waitForElement(
  elementGetter: () => HTMLElement | null | undefined
) {
  return new Promise<HTMLElement>(function (resolve) {
    const interval = setInterval(function () {
      const element = elementGetter();
      if (element) {
        clearInterval(interval);
        resolve(element);
      }
    });
  });
}
