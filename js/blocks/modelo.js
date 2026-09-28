/* ──────────────────────────────────────────────────────────────────────────
   blocks/modelo.js  ·  Showcase BLOQUE 7.1 · MODELO
   Classes con campo privado real (#precio), getter/setter con invariante,
   método encadenable y un inspector que muestra qué es público y qué no.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const ROSA = "#ff6b9d";
  const MORADO = "#7c6fff";
  const AMARILLO = "#f5a623";

  global.Web07.use("bloque:modelo", {
    init() {
      const { Producto } = global.Web07.mods.model;
      const { alerts, dom, utils } = global.Web07.mods;

      let instancia = null;
      let idSeq = 0;

      /* inspector: la fila #precio está oculta a propósito, como en el objeto real */
      const pintar = (p) => {
        dom.html(
          "mod-inspect",
          ["id", "nombre", "categoria"]
            .map(
              (k) =>
                `<div class="obj-row"><span class="obj-k">${k}</span>` +
                `<span class="obj-v">${utils.esc(p[k])}</span></div>`,
            )
            .join("") +
            `<div class="obj-row obj-name"><span class="obj-k">precio</span>` +
            `<span class="obj-v">${p.precio.toFixed(2)} <span style="opacity:.55">← getter público</span></span></div>` +
            `<div class="obj-row obj-private"><span class="obj-k">#precio</span>` +
            `<span class="obj-v">🔒 inaccesible fuera de la clase</span></div>` +
            `<div class="obj-row obj-methods"><span class="obj-k">toJSON()</span>` +
            `<span class="obj-v">${utils.esc(JSON.stringify(p.toJSON()))}</span></div>`,
        );
      };

      /* cada acción necesita una instancia previa */
      const sinInstancia = () =>
        alerts.aviso(
          "Atención",
          "Primero instancia un producto con «Instanciar»",
        );

      /* 1 · crear */
      dom.alClic("#btn-modelo", () => {
        const nombre = dom.valor("mod-nombre").trim();
        if (!nombre) {
          alerts.aviso("Atención", "Escribe el nombre del producto");
          return;
        }
        try {
          instancia = new Producto(++idSeq, nombre, dom.valor("mod-precio"));
          pintar(instancia);
        } catch (e) {
          alerts.error("⚠️ " + e.name, utils.esc(e.message), ROSA);
        }
      });

      /* 2 · método que devuelve this (encadenable) */
      dom.alClic("#btn-descuento", () => {
        if (!instancia) return sinInstancia();
        try {
          instancia.aplicarDescuento(dom.valor("mod-pct"));
          pintar(instancia);
        } catch (e) {
          alerts.error("⚠️ " + e.name, utils.esc(e.message), ROSA);
        }
      });

      /* 3 · el prefijo # no es convención: el motor lo bloquea */
      dom.alClic("#btn-privado", () => {
        if (!instancia) return sinInstancia();
        let fallo;
        try {
          new Function("p", "return p.#precio")(instancia);
          fallo = "acceso permitido";
        } catch (e) {
          fallo = `${e.name}: ${e.message}`;
        }
        alerts.info(
          "🔒 Campo privado <code>#precio</code>",
          `<b>producto.precio</b> → ${instancia.precio.toFixed(2)} ` +
            `<span style="opacity:.6">(getter público)</span><br>` +
            `<b>producto.#precio</b> → <code style="color:#ff6b9d">${utils.esc(fallo)}</code><br><br>` +
            `El prefijo <code>#</code> no es una convención de nombre: es <b>privacidad real</b>, ` +
            `impuesta por el motor antes de ejecutar el código.`,
          MORADO,
        );
      });

      /* 4 · el setter protege la invariante y lanza RangeError */
      dom.alClic("#btn-negativo", () => {
        if (!instancia) return sinInstancia();
        const antes = instancia.precio;
        try {
          instancia.precio = -100;
        } catch (e) {
          alerts.aviso(
            "🛡️ Invariante protegida",
            `La asignación <code>precio = -100</code> lanzó <b>${e.name}</b>:<br>` +
              `<code>${utils.esc(e.message)}</code><br><br>` +
              `Precio antes: <b>${antes.toFixed(2)}</b> · después: <b>${instancia.precio.toFixed(2)}</b><br>` +
              `<span style="opacity:.7">El modelo no es una bolsa de datos: también es la regla que lo protege.</span>`,
            AMARILLO,
          );
        }
      });

      /* estado inicial de la demo */
      instancia = new Producto(++idSeq, "Laptop Lenovo", 5000);
      pintar(instancia);
    },
  });
})(window);
