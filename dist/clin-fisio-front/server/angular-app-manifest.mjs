
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
    'index.csr.html': {size: 1142, hash: 'ceea68d804449c3221d327e6413cc2eb4380edb728a715b9596c62131d391abc', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1682, hash: 'f139e7a24ca809002b13ce2f5d25ffbb13ed26f321d37b54a925871b7374088e', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
