
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
    "renderMode": 0,
    "preload": [
      "chunk-T2CHSJLC.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-T2CHSJLC.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-T2CHSJLC.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-T2CHSJLC.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 0,
    "preload": [
      "chunk-T2CHSJLC.js"
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
    'index.csr.html': {size: 30029, hash: 'd247dc33a629160f7127d26f5a9eba5fb86f2714e704fc16af8cfa05256f2e06', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17482, hash: 'fd74a0af55deeef83ce5110f4db58b323ba6ec043662eb1020390b1decc840ad', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-OGIP7P5G.css': {size: 24306, hash: '6NzQZb8QII8', text: () => import('./assets-chunks/styles-OGIP7P5G_css.mjs').then(m => m.default)}
  },
};
