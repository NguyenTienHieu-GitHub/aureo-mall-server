const ngrok = require("@ngrok/ngrok");

const startNgrok = async () => {
  try {
    const listener = await ngrok.connect({
      authtoken: process.env.NGROK_AUTH_TOKEN,
      addr: process.env.SERVER_PORT || 8080,
      region: process.env.NGROK_REGION || "ap",
      subdomain: process.env.NGROK_SUBDOMAIN,
    });

    const url = listener.url();
    console.log(`Ngrok is running at: ${url}`);
    return url;
  } catch (error) {
    console.error("Failed to start ngrok:", error);
  }
};

module.exports = { startNgrok };
