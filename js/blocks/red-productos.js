/* ──────────────────────────────────────────────────────────────────────────
   blocks/red-productos.js  ·  Showcase BLOQUE 7.2 · CAPA DE RED
   Un endpoint, tres estados observables de la Promise (pending / ok /
   err) y la traducción del JSON plano a instancias de Producto.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("bloque:red-productos", {
    init() {
      const { ProductService } = global.Web07.mods.model;
      const { alerts, dom, utils } = global.Web07.mods;

      /* los 3 nodos del diagrama de la Promise */
      const setEstado = (estado) => {
        const mapa = {
          pending: ["pt-pending", "on-pending"],
          ok: ["pt-ok", "on-ok"],
          err: ["pt-err", "on-err"],
        };
        ["pt-pending", "pt-ok", "pt-err"].forEach((id) => {
          dom.porId(id).className = "pt-node";
        });
        const destino = mapa[estado];
        if (destino) dom.porId(destino[0]).className = "pt-node " + destino[1];
      };

      dom.alClic("#btn-red", async () => {
        const url = dom.valor("net-endpoint");
        const vista = dom.porId("net-preview");
        const btn = dom.porId("btn-red");

        btn.disabled = true;
        setEstado("pending");
        vista.innerHTML = `<span style="opacity:.7">// fetch("${utils.esc(url)}") → Promise { state: "pending" } …</span>`;

        const t0 = performance.now();
        try {
          const productos = await new ProductService(url).getProducts();
          const ms = Math.round(performance.now() - t0);

          setEstado("ok");
          vista.innerHTML =
            `<b>fulfilled</b> · ${ms} ms · ${productos.length} instancias de Producto<br>` +
            productos
              .slice(0, 5)
              .map(
                (p) =>
                  `▸ <b>${utils.esc(p.nombre)}</b> ` +
                  `<span style="opacity:.55">${p.precio.toFixed(2)} · ${utils.esc(p.categoria)}</span>`,
              )
              .join("<br>") +
            (productos.length > 5
              ? `<br><span style="opacity:.55">… y ${productos.length - 5} más</span>`
              : "");

          alerts.ok(
            "✅ Capa de red OK",
            `<b>${utils.esc(url)}</b><br><br>La Promise se cumplió en <b>${ms} ms</b> y el JSON ` +
              `plano se convirtió en <b>${productos.length} objetos Producto</b>.<br>` +
              `Ningún dato quedó como objeto suelto: todo pasa por el modelo.`,
            "#00e5b8",
          );
        } catch (e) {
          setEstado("err");
          vista.innerHTML =
            `<span style="color:#ff6b9d">rejected → ${utils.esc(e.message)}</span><br>` +
            `<span style="opacity:.7">// recordatorio: fetch() se cumple igual en un 404; ` +
            `el throw lo hace response.ok</span>`;
          alerts.error(
            "❌ Promise rechazada",
            `<b>${utils.esc(url)}</b><br><br><code>${utils.esc(e.message)}</code><br><br>` +
              `El <code>catch</code> capturó el fallo: la app no se rompe.`,
            "#ff6b9d",
          );
        } finally {
          btn.disabled = false;
        }
      });
    },
  });
})(window);
