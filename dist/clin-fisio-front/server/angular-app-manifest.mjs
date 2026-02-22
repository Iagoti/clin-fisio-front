
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-EUNK6EKI.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-EUNK6EKI.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-EUNK6EKI.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 2,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 29825, hash: '08483b534581a5eb25d23a43ec1ca7b69b5fdc963ef0e6a88b3a27f7a165b060', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17278, hash: 'a87676d6b8ed662315fd3b99fc98cc93a10c60dcf2e10c3b0d905c788537e186', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/usuarios/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_usuarios_index_html.mjs').then(m => m.default)},
    'dashboard/perfil/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_perfil_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 110168, hash: '20ae379142bf1cb044564fe21bd41601664a5b1504c4af3a58a061bf3869fa6a', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-RUSU4HQW.css': {size: 23705, hash: '8kQW/hK6Q0w', text: () => import('./assets-chunks/styles-RUSU4HQW_css.mjs').then(m => m.default)}
  },
};
