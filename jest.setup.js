Object.assign(global, {
  chrome: {
    runtime: { sendMessage: () => {}, onMessage: { addListener: () => {} } },
  },
});
