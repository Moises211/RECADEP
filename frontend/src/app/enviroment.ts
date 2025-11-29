export const environment = {
  production: process.env['NODE_ENV'] === 'production',  
  springRender: process.env['RENDER_BACKEND_URL'] 
    ? `${process.env['RENDER_BACKEND_URL']}/api` // Si se inyecta, usa esa URL + /api
    : 'https://recadep-zox1.onrender.com/api', // Fallback por defecto
  springLocal: 'http://localhost:8080/api',
  springDocker: 'http://spring-backend:8080/api',
  springHostBridge: 'http://host.docker.internal:8080/api'  
};
