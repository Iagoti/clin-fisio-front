
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/"
  },
  {
    "renderMode": 2,
    "route": "/login"
  },
  {
    "renderMode": 2,
    "redirectTo": "/login",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 31064, hash: 'eccc5398cee7516a843c8cd067a92d2cf3e0516b9ea6a8221be35ebe19a67b25', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 17125, hash: '0d8d37068c5944e5c48e7846a04bf4838c87aabb5be63715684e4930f7c08f01', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-TAEEON7B.css': {size: 26703, hash: 'LA3o/Jg2nmc', text: () => import('./assets-chunks/styles-TAEEON7B_css.mjs').then(m => m.default)}
  },
};
