// Object.assign(global, require("jest-chrome"));
Object.assign(global, { chrome: { runtime: { sendMessage: () => {} } } });
