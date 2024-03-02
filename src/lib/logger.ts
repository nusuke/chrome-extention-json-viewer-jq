export const logger = {
  debug: (...text: unknown[]) => {
    DEBUG && console.log(text);
  },
};
