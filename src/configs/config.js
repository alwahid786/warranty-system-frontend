const config = Object.freeze({
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  LOGO_URL_WITH_BACKGROUND: import.meta.env.VITE_LOGO_URL_WITH_BACKGROUND,
  LOGO_URL_WITHOUT_BACKGROUND: import.meta.env.VITE_LOGO_URL_WITHOUT_BACKGROUND,
});

const getEnv = (key) => {
  const value = config[key];
  if (!value) throw new Error(`Config ${key} not found`);
  return value;
};

export default getEnv;
