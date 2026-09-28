/* ──────────────────────────────────────────────────────────────────────────
   blocks/sweetalert.js  ·  Showcase BLOQUE 5 · SWEETALERT2
   Catálogo de los cuatro iconos, auto-cierre con barra de progreso,
   diálogo de confirmación y diálogo con input validado.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  global.Web07.use("bloque:sweetalert", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      /* 1 · los cuatro iconos */
      dom.alClic("#swal-success", () =>
        alerts.ok("¡Operación Exitosa!", "Todo salió perfecto.", "#00e5b8"),
      );
      dom.alClic("#swal-error", () =>
        alerts.error(
          "Ocurrió un Error",
          "No fue posible completar la operación.",
          "#ff6b9d",
        ),
      );
      dom.alClic("#swal-warning", () =>
        alerts.aviso(
          "¡Atención!",
          "Esta acción puede tener consecuencias.",
          "#f5a623",
        ),
      );

      /* 2 · auto-cierre en 3 s con timer visible */
      dom.alClic("#swal-timer", () => {
        if (!alerts.listo()) return;
        global.Swal.fire({
          title: "⏱️ Auto-cierre en 3s",
          text: "Esta alerta se cerrará sola.",
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          icon: "info",
        });
      });

      /* 3 · confirmación: devuelve true/false, no hay que leer el resultado */
      dom.alClic("#swal-confirm", async () => {
        const confirmado = await alerts.confirmar({
          title: "¿Estás seguro?",
          text: "Esta acción no se puede deshacer.",
          confirmButtonText: "Sí, continuar",
          cancelButtonText: "Cancelar",
        });
        if (confirmado) {
          alerts.ok("¡Confirmado!", "Acción ejecutada.");
        } else {
          alerts.info("Cancelado", "No se realizó ninguna acción.");
        }
      });

      /* 4 · input con validación: devuelve el texto o null */
      dom.alClic("#swal-input", async () => {
        const nombre = await alerts.preguntar({
          title: "¿Cómo te llamas?",
          inputPlaceholder: "Escribe tu nombre...",
          inputValidator: (v) => !v && "Por favor escribe tu nombre",
        });
        if (nombre) {
          alerts.ok(
            `¡Hola, ${nombre}!`,
            "Bienvenido al showcase 🎉",
            "#00e5b8",
          );
        }
      });
    },
  });
})(window);
