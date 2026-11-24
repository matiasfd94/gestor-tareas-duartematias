module.exports = ({ config }) => {
  const variant = process.env.APP_VARIANT || 'profesor';
  const isDevelopment = variant === 'development' || variant === 'profesor-development';

  return {
    ...config,
    name: isDevelopment ? 'Matías Tareas DEV' : 'Matías Tareas',
    scheme: isDevelopment ? 'gestortareasprofedev' : 'gestortareasprofe',
    userInterfaceStyle: 'dark',
    android: {
      ...config.android,
      package: isDevelopment
        ? 'com.matiasfd94.gestortareas.profesor.dev'
        : 'com.matiasfd94.gestortareas.profesor',
    },
    extra: { ...config.extra, integration: 'api-profesor-publica' },
  };
};
