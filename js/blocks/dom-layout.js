/* ──────────────────────────────────────────────────────────────────────────
   blocks/dom-layout.js  ·  Showcase BLOQUE 6 · DOM & LAYOUT
   Creación de nodos, recorrido de tablas (filas, columnas y total),
   resaltado temporal de celdas y lista dinámica.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  /* resaltado temporal de una celda del flexbox */
  function seleccionarCelda(el) {
    el.style.background =
      "linear-gradient(135deg, rgba(124,111,255,.65), rgba(0,229,184,.45))";
    el.style.color = "#fff";
    setTimeout(() => {
      el.style.background = "";
      el.style.color = "";
    }, 900);
  }

  global.Web07.use("bloque:dom-layout", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      /* 1 · párrafo generado + barra de progreso */
      let veces = 1;
      const salida = dom.porId("dom-output");
      const barra = dom.porId("dom-bar");

      dom.alClic("#btn-dom", () => {
        const p = document.createElement("p");
        p.textContent = `✏️ Este párrafo es nuevo. Es el cambio # ${veces++}`;
        p.style.animation = "fadeInUp .3s ease";
        salida.replaceChildren(p);
        salida.classList.add("highlight");
        setTimeout(() => salida.classList.remove("highlight"), 600);
        barra.style.width = Math.min(veces * 10, 100) + "%";
      });

      /* 2 · recorrido de la tabla */
      const sumarTodo = () => {
        let s = 0;
        dom.$$("#tabla-nums td").forEach((td) => (s += Number(td.textContent)));
        return s;
      };

      dom.alClic("#btn-suma-todo", () =>
        alerts.info(
          "∑ Suma Total",
          `Total de todas las celdas: ${sumarTodo()}`,
          "#66d260",
        ),
      );

      dom.alClic("#btn-suma-col", () => {
        let s = 0;
        dom.$$("#tabla-nums tr").forEach((tr) => {
          const td = tr.querySelectorAll("td")[1];
          if (td) s += Number(td.textContent);
        });
        alerts.info("∑ Columna C2", `Suma de C2: ${s}`, "#66d260");
      });

      dom.alClic("#btn-suma-fila", () => {
        let s = 0;
        const fila = dom.$$("#tabla-nums tr")[1];
        if (fila)
          fila
            .querySelectorAll("td")
            .forEach((td) => (s += Number(td.textContent)));
        alerts.info("∑ Fila 1", `Suma de la fila 1: ${s}`, "#66d260");
      });

      /* 3 · lista dinámica con botón de quitar */
      const input = dom.porId("list-input");
      const lista = dom.porId("dynamic-list");

      dom.alClic("#btn-add-item", () => {
        const texto = input.value.trim();
        if (!texto) return;
        const li = document.createElement("li");
        li.className = "list-item";
        li.innerHTML =
          `<span>• ${texto}</span>` +
          `<button class="list-item-remove" onclick="this.parentElement.remove()">✕</button>`;
        lista.appendChild(li);
        input.value = "";
        input.focus();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") dom.porId("btn-add-item").click();
      });

      /* el HTML lo invoca con onclick="selectCell(this)" */
      global.selectCell = seleccionarCelda;
    },
  });
})(window);
