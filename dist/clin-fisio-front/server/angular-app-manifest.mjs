
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
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/pacientes"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/pacientes/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/pacientes/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-OXHNESQG.js"
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
    'index.csr.html': {size: 30182, hash: 'a75558bcf82d8993969098f8b91aaf5d38574c03f85bb4de61eae32ae97a2863', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17635, hash: '4fe7fa1fb5b6cd469a8999581af21adbbe98d8ede2083a0564d29e5550de3e44', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ZIEPGAOD.css': {size: 24684, hash: 'IjSAtRI0Az4', text: () => import('./assets-chunks/styles-ZIEPGAOD_css.mjs').then(m => m.default)}
  },
};
