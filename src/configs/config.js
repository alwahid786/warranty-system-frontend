const config = Object.freeze({
  SERVER_URL: import.meta.env.VITE_SERVER_URL,
  STRIPE_PUBLISH_KEY: import.meta.env.VITE_STRIPE_PUBLISH_KEY,
  STRIPE_SECRET_KEY: import.meta.env.VITE_STRIPE_SECRET_KEY,
});

const getEnv = (key) => {
  const value = config[key];
  if (!value) throw new Error(`Config ${key} not found`);
  return value;
};

export default getEnv;
