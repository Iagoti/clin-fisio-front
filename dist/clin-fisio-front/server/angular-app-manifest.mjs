
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
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
      "chunk-IJHVVOB3.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-IJHVVOB3.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 2,
    "preload": [
      "chunk-IJHVVOB3.js"
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
    'index.csr.html': {size: 989, hash: '84d757026ac745efc7a6bc9960c9aac9bba9f6113907f33a6af17d422562ad13', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1529, hash: 'd25b86f46be64a24f1dbdd859cf59c6958bc56069a9e84159b9410d43f2498d7', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'dashboard/usuarios/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_usuarios_index_html.mjs').then(m => m.default)},
    'dashboard/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_index_html.mjs').then(m => m.default)},
    'dashboard/perfil/index.html': {size: 240, hash: 'db096474d521163c4f5fb7d700305222bcea1012b38583442ad232da75e59192', text: () => import('./assets-chunks/dashboard_perfil_index_html.mjs').then(m => m.default)},
    'login/index.html': {size: 74424, hash: 'ae5164ca8ec4328e2ba83b1a087b0ecd546729b0eb6964967ba1e9131dff4daa', text: () => import('./assets-chunks/login_index_html.mjs').then(m => m.default)}
  },
};
