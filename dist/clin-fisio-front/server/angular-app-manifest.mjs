
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "redirectTo": "/dashboard",
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/login"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/pacientes"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/pacientes/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/pacientes/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-AIJ4P262.js"
    ],
    "route": "/dashboard/usuarios/*"
  },
  {
    "renderMode": 0,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 30182, hash: 'a8023ae66915a5723d6bf319379be859e752083310335bad289e940175016b89', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17635, hash: '35d66e79ed6483d61b0c5f377d6258a2c1962b8ada91b47541defedf804d0fca', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ZIEPGAOD.css': {size: 24684, hash: 'IjSAtRI0Az4', text: () => import('./assets-chunks/styles-ZIEPGAOD_css.mjs').then(m => m.default)}
  },
};
