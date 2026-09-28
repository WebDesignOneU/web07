/* ──────────────────────────────────────────────────────────────────────────
   blocks/resiliencia.js  ·  Showcase BLOQUE 7.4 · RESILIENCIA
   Reintentos con backoff exponencial, timeout real con AbortController y
   bitácora en vivo. El transporte puede ser la red real o uno simulado
   que falla a propósito, para ver el comportamiento sin depender del
   servidor ni del estado de la conexión.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const API_REAL = "https://fakestoreapi.com/products?limit=6";

  global.Web07.use("bloque:sresiliencia", {
    init() {
      const { datosDemo: DATOS } = global.Web07.mods.model;
      const { alerts, dom, http, utils } = global.Web07.mods;

      let t0 = 0;
      const bitacora = dom.porId("res-log");

      /* una línea de bitácora con el tiempo transcurrido */
      const fila = (clase, icono, mensaje, extra) => {
        bitacora.insertAdjacentHTML(
          "beforeend",
          `<div class="log-row ${clase}">` +
            `<span class="log-t">+${Math.round(performance.now() - t0)}ms</span>` +
            `<span>${icono}</span><span class="log-m">${mensaje}</span>${extra || ""}</div>`,
        );
        bitacora.scrollTop = bitacora.scrollHeight;
      };

      /* traduce los eventos de http.conReintentos a la bitácora */
      const registrar = (ev) => {
        const et = `${ev.intento}/${ev.total}`;

        if (ev.tipo === "inicio") {
          fila(
            "l-info",
            "▶",
            `intento ${et} · timeout ${ev.timeout} ms · ` +
              `<span style="opacity:.6">AbortController armed</span>`,
          );
        }
        if (ev.tipo === "ok") {
          fila("l-ok", "✔", `intento ${et} respondió en ${ev.ms} ms`);
        }
        if (ev.tipo === "error") {
          fila(
            "l-error",
            "✖",
            `intento ${et} falló tras ${ev.ms} ms — ${utils.esc(ev.error.message)}` +
              (ev.ultimo ? ' <span style="opacity:.75">(último)</span>' : ""),
          );
        }
        if (ev.tipo === "espera") {
          fila(
            "l-wait",
            "⏳",
            `backoff exponencial: ${ev.ms} ms antes de reintentar`,
            `<span class="log-wait-bar" style="animation-duration:${ev.ms}ms"></span>`,
          );
        }
      };

      dom.alClic("#btn-resiliencia", async () => {
        const modo = dom.valor("res-modo");
        const reintentos = dom.int("res-reintentos", 1, 5, 3);
        const timeout = dom.int("res-timeout", 200, 30000, 3000);
        const fallos = dom.int("res-fallos", 0, 5, 1);
        const latencia = dom.int("res-latencia", 0, 30000, 700);
        const btn = dom.porId("btn-resiliencia");

        bitacora.innerHTML = "";
        t0 = performance.now();
        btn.disabled = true;

        let usados = 0;
        const opciones =
          modo === "real"
            ? {}
            : {
                transporte: (signal, intento) =>
                  http.transporteSimulado({
                    signal,
                    intento,
                    fallos,
                    latencia,
                    caido: modo === "caido",
                    datos: DATOS,
                  }),
              };
        const url = modo === "real" ? API_REAL : "sim://api/productos";

        try {
          const data = await http.conReintentos(
            url,
            opciones,
            reintentos,
            timeout,
            (ev) => {
              if (ev.tipo === "inicio") usados = ev.intento;
              registrar(ev);
            },
          );

          const ms = Math.round(performance.now() - t0);
          const n = data.productos ? data.productos.length : data.length;
          fila(
            "l-final",
            "🛡️",
            `resiliencia: éxito en el intento ${usados}/${reintentos} · ${ms} ms · ${n} registros`,
          );
          alerts.ok(
            "🛡️ Operación recuperada",
            `La app no se cayó: el servidor falló y el cliente <b>reintentó con espera creciente</b>.<br><br>` +
              `Éxito en el <b>intento ${usados}</b> de ${reintentos} · <b>${ms} ms</b> en total.`,
            "#00e5b8",
          );
        } catch (e) {
          fila("l-final", "💀", `fallo definitivo: ${utils.esc(e.message)}`);
          alerts.error(
            "💀 Fallo definitivo",
            `<code>${utils.esc(e.message)}</code><br><br>` +
              `Se agotaron los <b>${reintentos}</b> reintentos. Ahora sí corresponde propagar ` +
              `el error a la capa de UI.`,
            "#ff6b9d",
          );
        } finally {
          btn.disabled = false;
        }
      });

      dom.alClic("#btn-reset-log", () => {
        bitacora.innerHTML = "";
      });
    },
  });
})(window);
