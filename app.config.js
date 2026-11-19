module.exports = ({ config }) => {
  const isDevelopment = process.env.APP_VARIANT === 'development';

  return {
    ...config,
    name: isDevelopment
      ? 'Gestor Duarte DEV'
      : config.name,
    scheme: isDevelopment
      ? 'gestortareasduartedev'
      : config.scheme,
    android: {
      ...config.android,
      package: isDevelopment
        ? 'com.matiasfd94.gestortareas.dev'
        : config.android.package,
    },
  };
};