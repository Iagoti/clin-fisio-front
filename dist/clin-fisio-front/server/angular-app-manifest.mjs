
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
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/pacientes"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/pacientes/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/pacientes/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/agendamentos"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/agendamentos/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/agendamentos/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/perfil"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/acesso-negado"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/usuarios"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/usuarios/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/usuarios/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/roles"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/roles/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/roles/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-receber"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-receber/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-receber/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-pagar"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-pagar/novo"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/contas-pagar/*"
  },
  {
    "renderMode": 1,
    "preload": [
      "chunk-7P7BYHHX.js"
    ],
    "route": "/dashboard/financeiro/categorias-despesa"
  },
  {
    "renderMode": 0,
    "redirectTo": "/dashboard",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 1244, hash: '440bc796eed3565dd4265e1d0fa983a22505e92a9eed1839e2645109ba2bc315', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1784, hash: 'f4e40a809bd49672b1fb824b8e5acb9a3aad86539ca21ca43e4d4ad8dea21a66', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)}
  },
};
