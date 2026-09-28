/* ──────────────────────────────────────────────────────────────────────────
   core/http.js  ·  Núcleo 4/5 · RED
   Una sola puerta de salida hacia la red: GET con validación, reintentos
   con backoff exponencial, timeout real con AbortController y un
   transporte simulado para demostrar fallos sin depender del servidor.
   Se consume así:  const { http } = Web07.mods;
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("http", {
    /* GET + validación de response.ok + parseo a JSON */
    async pedirJSON(url, opciones) {
      const res = await fetch(url, opciones || {});
      if (!res.ok) {
        throw new Error(
          `HTTP ${res.status}: ${res.statusText || "sin respuesta"}`,
        );
      }
      return res.json();
    },

    /* GET tolerante a fallos: reintenta, espera y se rinde con un error claro.
       alIntentar recibe { tipo: 'inicio'|'ok'|'error'|'espera', intento, total, … } */
    async conReintentos(url, opciones, reintentos, timeout, alIntentar) {
      const config = opciones || {};
      const intentos = reintentos || 3;
      const limite = timeout || 3000;
      const avisar = alIntentar || (() => {});
      let ultimoError;

      for (let intento = 1; intento <= intentos; intento++) {
        const controller = new AbortController();
        const t0 = performance.now();
        const timer = setTimeout(() => controller.abort(), limite);
        avisar({ tipo: "inicio", intento, total: intentos, timeout: limite });

        try {
          const res = config.transporte
            ? await config.transporte(controller.signal, intento, config)
            : await fetch(url, { signal: controller.signal });
          clearTimeout(timer);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          avisar({
            tipo: "ok",
            intento,
            total: intentos,
            ms: Math.round(performance.now() - t0),
          });
          return data;
        } catch (error) {
          clearTimeout(timer);
          const ultimo = intento === intentos;
          ultimoError = error;
          avisar({
            tipo: "error",
            intento,
            total: intentos,
            ms: Math.round(performance.now() - t0),
            error,
            ultimo,
          });
          if (ultimo) break;
          const espera = 2 ** intento * 500;
          avisar({ tipo: "espera", intento, total: intentos, ms: espera });
          await new Promise((r) => setTimeout(r, espera));
        }
      }
      throw new Error(
        `falló tras ${intentos} intentos · causa: ${ultimoError.message}`,
      );
    },

    /* servidor falso: falla los primeros `fallos` intentos o siempre si `caido`.
       Respeta el AbortSignal para poder demostrar el timeout. */
    transporteSimulado(config) {
      const { signal, intento, fallos, latencia, caido, datos } = config;
      return new Promise((resolve, reject) => {
        const alAbortar = () => {
          clearTimeout(t);
          reject(
            new DOMException(
              "La operación se canceló: timeout agotado",
              "AbortError",
            ),
          );
        };
        const t = setTimeout(() => {
          signal.removeEventListener("abort", alAbortar);
          if (caido || intento <= fallos) {
            reject(
              new Error(
                caido
                  ? "HTTP 503 Service Unavailable"
                  : `HTTP 503 Service Unavailable (falla prevista ${intento}/${fallos})`,
              ),
            );
          } else {
            resolve({
              ok: true,
              status: 200,
              json: async () => ({
                servidor: "simulado",
                intento,
                productos: (datos || []).map((p, i) => ({
                  id: i + 1,
                  title: p.nombre,
                  price: p.precio,
                  category: p.categoria,
                })),
              }),
            });
          }
        }, latencia);
        if (signal.aborted) alAbortar();
        else signal.addEventListener("abort", alAbortar, { once: true });
      });
    },
  });
})(window);
