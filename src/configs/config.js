import logowithBg from "../assets/logos/logo-with-bg.png";
import logoWithoutBg from "../assets/logos/logo-without-bg.png";

const config = Object.freeze({
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  STRIPE_PUBLISH_KEY: import.meta.env.VITE_STRIPE_PUBLISH_KEY,
  LOGO_URL_WITHOUT_BACKGROUND: logoWithoutBg,
  LOGO_URL_WITH_BACKGROUND: logowithBg,
});

const getEnv = (key) => {
  const value = config[key];
  if (!value) throw new Error(`Config ${key} not found`);
  return value;
};

export default getEnv;