
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: false,
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
    "renderMode": 0,
    "preload": [
      "chunk-CVTQO3VL.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CVTQO3VL.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CVTQO3VL.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CVTQO3VL.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-CVTQO3VL.js"
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
    'index.csr.html': {size: 1142, hash: '999c32eb0b618551136b692790b7938749d2d137354610032759bc459909b7f2', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1682, hash: '4e5951c711db193822b16e34cefc070fe5b88d02507fc440d2e246614cc96a7d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
