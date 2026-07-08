
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
    'index.csr.html': {size: 30182, hash: 'a4c1f225929b0013cf8953d8b7eace5ab2c80b526c5aa49f12ac6fe4654b1e78', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17635, hash: '7fbb83798c50575d0843a7f09df93c4a5258bea88006d5cb02cd71812cd381f0', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-ZIEPGAOD.css': {size: 24684, hash: 'IjSAtRI0Az4', text: () => import('./assets-chunks/styles-ZIEPGAOD_css.mjs').then(m => m.default)}
  },
};
