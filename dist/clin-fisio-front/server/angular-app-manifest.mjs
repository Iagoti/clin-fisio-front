
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
      "chunk-YZWE3SXD.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-YZWE3SXD.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-YZWE3SXD.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-YZWE3SXD.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-YZWE3SXD.js"
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
    'index.csr.html': {size: 1142, hash: 'fcd57599ffee42cfbdd457ab2e2e7882e25a525245b512b3d048305c12418499', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1682, hash: '735ff7a2706ffbedd169d34b562ee25e12b89c9996e0a261324bd8d2da921e0d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
