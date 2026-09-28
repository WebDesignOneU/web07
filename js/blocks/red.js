/* ──────────────────────────────────────────────────────────────────────────
   blocks/red.js  ·  Showcase BLOQUE 4 · FETCH / APIs
   Consumo de APIs reales (PokéAPI y JSONPlaceholder) con estado de
   carga, manejo de error y validación de response.ok.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const API_POKE = "https://pokeapi.co/api/v2/pokemon/";
  const API_JSON = "https://jsonplaceholder.typicode.com/users/1";

  global.Web07.use("bloque:red", {
    init() {
      const { alerts, dom, http } = global.Web07.mods;

      /* 1 · Pokédex: búsqueda por nombre + spinner */
      const cargar = async () => {
        const nombre = dom.valor("poke-input").trim().toLowerCase();
        if (!nombre) {
          alerts.aviso("Atención", "Ingresa el nombre de un Pokémon");
          return;
        }
        const spinner = dom.porId("poke-loading");
        const resultado = dom.porId("poke-result");

        resultado.classList.add("hidden");
        spinner.style.display = "block";
        try {
          const data = await http.pedirJSON(API_POKE + nombre);
          dom.porId("poke-img").src = data.sprites.front_default;
          dom.porId("poke-img").alt = data.name;
          dom.porId("poke-name").textContent = data.name;
          dom.porId("poke-stats").innerHTML =
            `Altura: ${data.height / 10}m · Peso: ${data.weight / 10}kg<br>` +
            data.types
              .map((t) => `<span class="poke-badge">${t.type.name}</span>`)
              .join(" ");
          resultado.classList.remove("hidden");
        } catch (e) {
          alerts.error("❌ Error", `"${nombre}" no encontrado`, "#ff6b9d");
        } finally {
          spinner.style.display = "none";
        }
      };

      dom.alClic("#btn-poke", cargar);
      dom.porId("poke-input").addEventListener("keydown", (e) => {
        if (e.key === "Enter") cargar();
      });

      /* 2 · fetch simple a un endpoint de usuarios */
      dom.alClic("#btn-fetch-demo", async () => {
        try {
          const u = await http.pedirJSON(API_JSON);
          alerts.info(
            "👤 " + u.name,
            `<b>Email:</b> ${u.email}<br><b>Ciudad:</b> ${u.address.city}<br>` +
              `<b>Empresa:</b> ${u.company.name}`,
            "#4facfe",
          );
        } catch (e) {
          alerts.error("Error", e.message);
        }
      });
    },
  });
})(window);
