/* ──────────────────────────────────────────────────────────────────────────
   core/alerts.js  ·  Núcleo 3/5 · ALERTAS
   Envoltura de SweetAlert2 con la paleta del sitio, para que ninguna
   página escriba el color a mano ni se rompa si el CDN no carga.
   Se consume así:  const { alerts } = Web07.mods;
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const COLORES = {
    success: "#00e5b8",
    error: "#ff6b9d",
    warning: "#f5a623",
    info: "#4facfe",
    question: "#7c6fff",
  };

  /* crea un atajo: alerts.ok(titulo, html) / .error(…) / .aviso(…) / .info(…) */
  const atajo = (icono) => (titulo, contenido, color) => {
    if (!api.listo()) {
      console.warn("[Web07] SweetAlert2 no está cargado:", titulo, contenido);
      return Promise.resolve();
    }
    return global.Swal.fire({
      title: titulo,
      html: contenido,
      icon: icono,
      confirmButtonColor: color || COLORES[icono],
    });
  };

  const api = {
    listo() {
      return typeof global.Swal !== "undefined";
    },

    ok: atajo("success"),
    error: atajo("error"),
    aviso: atajo("warning"),
    info: atajo("info"),

    /* devuelve true/false según si el usuario confirmó */
    async confirmar(opciones) {
      const r = await global.Swal.fire(
        Object.assign(
          {
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: COLORES.question,
            cancelButtonColor: COLORES.error,
          },
          opciones,
        ),
      );
      return r.isConfirmed;
    },

    /* pide un dato y devuelve el string, o null si canceló */
    async preguntar(opciones) {
      const r = await global.Swal.fire(
        Object.assign(
          {
            input: "text",
            showCancelButton: true,
            confirmButtonColor: COLORES.success,
          },
          opciones,
        ),
      );
      return r.value || null;
    },

    cerrar() {
      if (api.listo()) global.Swal.close();
    },

    init() {
      if (!api.listo()) {
        console.warn(
          "[Web07] SweetAlert2 no está disponible: las alertas serán silenciosas",
        );
      }
    },
  };

  global.Web07.use("alerts", api);
})(window);
