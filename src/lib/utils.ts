export function cn(...inputs: Array<string | false | null | undefined | Record<string, boolean>>) {
  return inputs
    .flatMap((input) => {
      if (!input) {
        return [];
      }
      if (typeof input === "string") {
        return input.split(" ").filter(Boolean);
      }
      return Object.entries(input)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key);
    })
    .join(" ");
}
