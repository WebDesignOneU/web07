/* ──────────────────────────────────────────────────────────────────────────
   blocks/procesamiento.js  ·  Showcase BLOQUE 7.3 · PROCESAMIENTO
   Una tubería declarativa: filter → map → sort → reduce. Cada etapa
   escribe su resultado en pantalla y puede resaltarse una por una.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("bloque:procesamiento", {
    init() {
      const { datosDemo: DATOS } = global.Web07.mods.model;
      const { alerts, dom, utils } = global.Web07.mods;

      /* 1 · filter: selecciona, no muta el original */
      /* 2 · map: agrega precioFinal con el descuento aplicado */
      /* 3 · sort: de mayor a menor por precioFinal */
      /* 4 · reduce: suma total */
      const ejecutar = () => {
        const cat = dom.valor("pipe-cat");
        const desc = dom.int("pipe-desc", 0, 100, 0);
        const factor = 1 - desc / 100;

        const filtrados = DATOS.filter(
          (p) => cat === "Todas" || p.categoria === cat,
        );
        const mapeados = filtrados.map((p) => ({
          ...p,
          precioFinal: Math.round(p.precio * factor * 100) / 100,
        }));
        const ordenados = [...mapeados].sort(
          (a, b) => b.precioFinal - a.precioFinal,
        );
        const total = ordenados.reduce((t, p) => t + p.precioFinal, 0);

        dom.html("po-filter", `<b>${filtrados.length}</b> de ${DATOS.length}`);
        dom.html(
          "po-map",
          `<table class="mini-table"><thead><tr><th>Producto</th><th>Precio</th>` +
            `<th>precioFinal</th></tr></thead><tbody>` +
            mapeados
              .map(
                (p) =>
                  `<tr><td>${utils.esc(p.nombre)}</td><td>${p.precio.toFixed(2)}</td>` +
                  `<td>${p.precioFinal.toFixed(2)}</td></tr>`,
              )
              .join("") +
            `</tbody></table>`,
        );
        dom.html(
          "po-sort",
          ordenados.length
            ? `1.º <b>${utils.esc(ordenados[0].nombre)}</b>`
            : "∅",
        );
        dom.texto("po-total", total.toFixed(2));
      };

      ["pipe-cat", "pipe-desc"].forEach((id) =>
        dom.porId(id).addEventListener("input", ejecutar),
      );

      /* ejecuta la tubería animando cada etapa */
      dom.alClic("#btn-pipe", async () => {
        const btn = dom.porId("btn-pipe");
        const etapas = ["ps-filter", "ps-map", "ps-sort", "ps-reduce"];

        btn.disabled = true;
        etapas.forEach((id) => dom.porId(id).classList.remove("run", "done"));
        ejecutar();

        for (const id of etapas) {
          dom.porId(id).classList.add("run");
          await global.Web07.mods.utils.esperar(430);
          dom.porId(id).classList.remove("run");
          dom.porId(id).classList.add("done");
        }
        btn.disabled = false;
      });

      /* la misma tubería escrita como código */
      dom.alClic("#btn-pipe-raw", () => {
        const cat = dom.valor("pipe-cat");
        const desc = dom.int("pipe-desc", 0, 100, 0);
        const mapa = [
          `<span class="cm">// 1 · filter — selecciona, no muta</span>`,
          `productos.<span class="fn">filter</span>(p =&gt; p.categoria === <span class="str">'${utils.esc(cat)}'</span>)`,
          `  .<span class="fn">map</span>(p =&gt; ({ ...p, precioFinal: p.precio * <span class="num">${(1 - desc / 100).toFixed(2)}</span> }))`,
          `  .<span class="fn">sort</span>((a, b) =&gt; b.precioFinal - a.precioFinal)`,
          `  .<span class="fn">reduce</span>((t, p) =&gt; t + p.precioFinal, <span class="num">0</span>);`,
          ``,
          `<span class="cm">// resultado: ${dom.leer("po-total")}</span>`,
        ].join("\n");

        alerts.ok(
          "🧾 La cadena completa",
          `<pre style="text-align:left;font-family:'Fira Code',monospace;font-size:.78rem;` +
            `line-height:1.7;color:#cdd6f4;background:#080a12;padding:14px;border-radius:8px;margin:0">` +
            `${mapa}</pre>`,
          "#7c6fff",
        );
      });

      /* estado inicial de la demo */
      ejecutar();
    },
  });
})(window);
