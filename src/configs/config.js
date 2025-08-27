const config = Object.freeze({
  SERVER_URL: "http://localhost:5001",
});

const getEnv = (key) => {
  const value = config[key];
  if (!value) throw new Error(`Config ${key} not found`);
  return value;
};

export default getEnv;