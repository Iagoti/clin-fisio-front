
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
      "chunk-PPEDL2X5.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PPEDL2X5.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-PPEDL2X5.js"
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
    'index.csr.html': {size: 29825, hash: 'bb3fd0615515f30fe14f6e003b5799016230fda5de6d135d4cad88b5bc19b240', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17278, hash: 'b9e3d08f4c19e0cd1792dfbbd4a9db2bf36ea837e60a0f2bfe769cbda43d0143', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'dashboard/usuarios/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_usuarios_index_html.mjs').then(m => m.default)},
    'dashboard/perfil/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_perfil_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 110168, hash: 'ad4608185e23b1b4e056a254141ba7dc9dd878f307348656c1841b736a1726a6', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)},
    'styles-RUSU4HQW.css': {size: 23705, hash: '8kQW/hK6Q0w', text: () => import('./assets-chunks/styles-RUSU4HQW_css.mjs').then(m => m.default)}
  },
};
