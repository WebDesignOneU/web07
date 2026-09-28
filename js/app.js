/* ──────────────────────────────────────────────────────────────────────────
   app.js  ·  Web07 (Tecnologías Web I)
   ═══════════════════════════════════════════════════════════════
   CENTRALIZADOR DE JAVASCRIPT · punto de entrada único
   ═══════════════════════════════════════════════════════════════
   Cada página del sitio enlaza SÓLO este archivo:

     <script src="js/app.js" data-page="calculadora"></script>

   app.js lee el atributo data-page y arma la lista de archivos:

      1  core/utils.js        utilidades puras (sin DOM)
      2  core/dom.js          helpers de DOM + atajos globales
      3  core/alerts.js       SweetAlert2 con la paleta del sitio
      4  core/http.js         fetch, retry, timeout, AbortController
      5  core/model.js        Producto + ProductService
      6  blocks/<…>.js        bloques declarados para esa página
      7  pages/<data-page>.js el script propio de la página

   Nada se ejecuta al cargarse: cada archivo registra su módulo con
   Web07.use(nombre, api) y su init() corre al final, cuando el DOM ya
   está listo y respetando el orden de carga (núcleo → bloques → página).

   El proyecto se abre con file://, así que NO se usan ES Modules
   (el navegador los bloquea): la carga es secuencial con scripts
   clásicos. Ver js/README.md para el contrato completo.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const BASE = "js/";

  /* núcleo: siempre se carga, en este orden */
  const NUCLEO = [
    "core/utils.js",
    "core/dom.js",
    "core/alerts.js",
    "core/http.js",
    "core/model.js",
  ];

  /* bloques del showcase (reutilizables por cualquier página) */
  const BLOQUES = {
    showcase: [
      "calculadoras",
      "formularios",
      "datos-json",
      "red",
      "sweetalert",
      "dom-layout",
      "modelo",
      "red-productos",
      "procesamiento",
      "resiliencia",
    ],
  };

  const Web07 = {
    version: "2.0.0",
    pagina: null,
    mods: {},
    cola: [],

    /* registra un módulo; si trae init(), se encola para el arranque */
    use(nombre, api) {
      this.mods[nombre] = api;
      if (typeof api.init === "function") this.cola.push(api);
      return api;
    },

    /* carga un archivo clásico y resuelve cuando terminó (o falla) */
    cargar(ruta) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = BASE + ruta;
        s.async = false;
        s.onload = resolve;
        s.onerror = () => reject(new Error("no se pudo cargar " + BASE + ruta));
        document.head.appendChild(s);
      });
    },

    /* ejecuta los init() en orden de carga, aislando errores */
    arrancar() {
      this.cola.forEach((mod) => {
        try {
          mod.init();
        } catch (e) {
          console.error("[Web07] falló init:", e);
        }
      });
      document.documentElement.dataset.web07 = "ok";
      return this;
    },
  };

  global.Web07 = Web07;

  const tag =
    document.currentScript || document.querySelector("script[data-page]");
  const pagina = (tag && tag.dataset.page) || "";
  Web07.pagina = pagina;

  if (!pagina) console.warn("[Web07] falta data-page en el <script> de app.js");

  const tareas = NUCLEO.concat(
    (BLOQUES[pagina] || []).map((b) => "blocks/" + b + ".js"),
    pagina ? ["pages/" + pagina + ".js"] : [],
  );

  const cuandoDomEsteListo = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  };

  tareas
    .reduce((p, ruta) => p.then(() => Web07.cargar(ruta)), Promise.resolve())
    .then(() => cuandoDomEsteListo(() => Web07.arrancar()))
    .catch((e) => console.error("[Web07] " + e.message, e));
})(window);
