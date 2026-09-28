/* ──────────────────────────────────────────────────────────────────────────
   pages/seminario.js  ·  Script propio de seminario.html
   Inscripción: el costo se deriva del tipo de participante y se limpia
   el formulario al confirmar. Sin jQuery ni Zepto.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const COSTOS = { estudiante: 50, profesional: 90 };

  global.Web07.use("pagina:seminario", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      const selectTipo = dom.porId("tipoParticipante");
      const spanCosto = dom.porId("costoInscripcionValor");
      const form = dom.porId("formularioInscripcion");
      if (!selectTipo || !spanCosto || !form) return;

      selectTipo.addEventListener("change", function () {
        const costo = COSTOS[this.value] ?? "";
        spanCosto.textContent = costo !== "" ? "Bs. " + costo : "";
      });

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombre = dom.valor("nombre");
        const tipo = selectTipo.value;
        const costo = spanCosto.textContent;

        if (tipo === "elija") {
          alerts.aviso("Atención", "Seleccione un tipo de participante.");
          return;
        }

        const datos = `Nombre: ${nombre}\nTipo: ${tipo}\nCosto: ${costo}`;

        /* Reset form */
        dom.porId("nombre").value = "";
        selectTipo.value = "elija";
        spanCosto.textContent = "";

        alerts.ok("¡Inscripción Exitosa!", datos.replace(/\n/g, "<br>"));
      });
    },
  });
})(window);
