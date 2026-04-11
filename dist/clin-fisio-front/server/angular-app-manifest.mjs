
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
    "renderMode": 1,
    "preload": [
      "chunk-N25GR5FC.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-N25GR5FC.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-N25GR5FC.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-N25GR5FC.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-N25GR5FC.js"
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
    'index.csr.html': {size: 1244, hash: '1d43e4225f945c199065f1a94ab4b0b0d37bd6313213e0bdf1e633cf4552dd58', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1784, hash: '73f5f89b1dd5f693d427ed2a47522dbf1c9119e2fa34e4fb7cc3793e63e10f08', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
