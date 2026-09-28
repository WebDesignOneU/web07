/* ──────────────────────────────────────────────────────────────────────────
   blocks/calculadoras.js  ·  Showcase BLOQUE 1 · ARITMÉTICA
   Tres demos: calculadora de dos operandos, operaciones por radio y
   tabla de múltiplos. Sin estado global: todo vive en el init().
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const MORADO = "#7c6fff";

  global.Web07.use("bloque:calculadoras", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      /* 1 · calculadora de dos operandos */
      const operaciones = {
        sumar: { title: "➕ Suma", texto: (a, b) => `${a} + ${b} = ${a + b}` },
        restar: {
          title: "➖ Resta",
          texto: (a, b) => `${a} - ${b} = ${a - b}`,
        },
        mult: {
          title: "✖ Multiplicación",
          texto: (a, b) => `${a} × ${b} = ${a * b}`,
        },
        div: {
          title: "➗ División",
          texto: (a, b) => `${a} ÷ ${b} = ${(a / b).toFixed(4)}`,
        },
      };

      const calcular = (op) => {
        const a = dom.num("calc-a");
        const b = dom.num("calc-b");
        if (isNaN(a) || isNaN(b)) {
          alerts.aviso("Atención", "Ingresa dos números");
          return;
        }
        if (op === "div" && b === 0) {
          alerts.error("🚫 División por cero", "El divisor no puede ser 0");
          return;
        }
        const opcion = operaciones[op];
        alerts.ok(opcion.title, opcion.texto(a, b), MORADO);
      };

      Object.keys(operaciones).forEach((op) => {
        dom.alClic(`#btn-${op}`, () => calcular(op));
      });

      /* 2 · operaciones elegidas con radio buttons */
      dom.alClic("#btn-operar", () => {
        const a = dom.num("radio-a");
        const b = dom.num("radio-b");
        const sel = dom.$('input[name="op"]:checked');
        if (!sel) {
          alerts.aviso("Atención", "Selecciona una operación");
          return;
        }
        if (isNaN(a) || isNaN(b)) {
          alerts.aviso("Atención", "Ingresa dos números");
          return;
        }
        const resultados = {
          1: a + b,
          2: a - b,
          3: a * b,
          4: b !== 0 ? a / b : "∞",
        };
        const nombres = {
          1: "Suma",
          2: "Resta",
          3: "Multiplicación",
          4: "División",
        };
        alerts.ok(nombres[sel.value], String(resultados[sel.value]), MORADO);
      });

      /* 3 · múltiplos del 1 al 10 */
      dom.alClic("#btn-multiplos", () => {
        const n = parseInt(dom.valor("mult-num"), 10);
        if (isNaN(n)) {
          alerts.error("Error", "Ingresa un número entero");
          return;
        }
        const multiplos = Array.from({ length: 10 }, (_, i) => n * (i + 1));
        alerts.ok(
          `📊 Múltiplos de ${n}`,
          `<div class="sh-s5">${multiplos
            .map((v) => `<span class="sh-s6">${v}</span>`)
            .join("")}</div>`,
          MORADO,
        );
      });
    },
  });
})(window);
