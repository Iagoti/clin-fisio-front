
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
    'index.csr.html': {size: 30182, hash: '621628fedf3af0ac685e549fef3351d784d42e814fbf996ce91afda5583b9ede', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17635, hash: '60fd2b4bb267d22d217d3c51dca8baea8b5ee685a5d164615b0fdbc12d01863c', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ZIEPGAOD.css': {size: 24684, hash: 'IjSAtRI0Az4', text: () => import('./assets-chunks/styles-ZIEPGAOD_css.mjs').then(m => m.default)}
  },
};
