/* ──────────────────────────────────────────────────────────────────────────
   pages/pokeclient.js  ·  Script propio de pokeclient.html
   Pokédex mejorada contra la PokéAPI con historial, navegación y más detalles.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const API = "https://pokeapi.co/api/v2/pokemon/";
  const SPECIES_API = "https://pokeapi.co/api/v2/pokemon-species/";

  global.Web07.use("pagina:pokeclient", {
    init() {
      const { dom, http, alerts } = global.Web07.mods;

      let pokemonActual = null;
      let historial = [];
      let indiceHistorial = -1;

      const buscar = async (nombre) => {
        const query = (nombre || dom.valor("pokemon")).toLowerCase().trim();
        if (!query) return;

        try {
          dom.texto("mensaje", "Cargando...");
          const data = await http.pedirJSON(API + query);
          await mostrar(data);
          dom.texto("mensaje", "");
          agregarAlHistorial(data.name);
        } catch (error) {
          dom.texto("mensaje", "Pokémon no encontrado: " + error.message);
        }
      };

      const mostrar = async (data) => {
        pokemonActual = data;
        const speciesData = await http.pedirJSON(SPECIES_API + data.id).catch(() => null);
        const flavorText = speciesData?.flavor_text_entries?.find(e => e.language.name === "es" || e.language.name === "en")?.flavor_text
          ?.replace(/\n/g, " ")
          .replace(/\f/g, " ") || "Sin descripción disponible.";

        const tipos = data.types.map(t => t.type.name).join(", ");
        const habilidades = data.abilities.map(a => a.ability.name + (a.is_hidden ? " (oculta)" : "")).join(", ");
        const stats = data.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(" | ");

        dom.html(
          "resultado",
          `<h2>${capitalizar(data.name)} <span class="id">#${data.id.toString().padStart(3, "0")}</span></h2>
           <img src="${data.sprites.front_default || data.sprites.front_shiny}" alt="${data.name}" />
           <p class="desc">${flavorText}</p>
           <div class="stats-grid">
             <div class="stat-item"><strong>Tipos:</strong> ${tipos}</div>
             <div class="stat-item"><strong>Altura:</strong> ${data.height / 10} m</div>
             <div class="stat-item"><strong>Peso:</strong> ${data.weight / 10} kg</div>
             <div class="stat-item"><strong>Habilidades:</strong> ${habilidades}</div>
             <div class="stat-item full"><strong>Stats:</strong> ${stats}</div>
           </div>`,
        );
      };

      const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);

      const agregarAlHistorial = (nombre) => {
        if (historial.includes(nombre)) return;
        historial.push(nombre);
        if (historial.length > 10) historial.shift();
        renderHistorial();
      };

      const renderHistorial = () => {
        if (historial.length === 0) {
          dom.html("historial", "");
          return;
        }
        dom.html(
          "historial",
          `<h4>Historial reciente</h4>
           <div class="historial-lista">
             ${historial.slice().reverse().map(n => `<button class="hist-btn" data-nombre="${n}">${capitalizar(n)}</button>`).join("")}
           </div>`
        );
        dom.todos(".hist-btn").forEach(btn => {
          btn.addEventListener("click", () => buscar(btn.dataset.nombre));
        });
      };

      const navegar = (direccion) => {
        if (!pokemonActual) return;
        const nuevoId = pokemonActual.id + direccion;
        if (nuevoId < 1 || nuevoId > 1025) return;
        buscar(nuevoId);
      };

      const limpiar = () => {
        dom.valor("pokemon", "");
        dom.html("resultado", "");
        dom.texto("mensaje", "");
        pokemonActual = null;
      };

      // Event listeners
      dom.porId("buscar").addEventListener("click", () => buscar());
      dom.porId("pokemon").addEventListener("keydown", (e) => {
        if (e.key === "Enter") buscar();
      });
      dom.porId("btn-ant").addEventListener("click", () => navegar(-1));
      dom.porId("btn-sig").addEventListener("click", () => navegar(1));
      dom.porId("btn-limpiar").addEventListener("click", limpiar);

      // Autocompletado simple con pokémon populares
      const populares = ["pikachu", "charizard", "bulbasaur", "squirtle", "eevee", "gengar", "lucario", "mewtwo", "rayquaza", "arceus"];
      dom.porId("pokemon").addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        if (val.length < 2) {
          dom.html("sugerencias", "");
          return;
        }
        const coinciden = populares.filter(p => p.startsWith(val));
        if (coinciden.length === 0) {
          dom.html("sugerencias", "");
          return;
        }
        dom.html("sugerencias", coinciden.map(p => `<button class="sug-btn" data-nombre="${p}">${capitalizar(p)}</button>`).join(""));
        dom.todos(".sug-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            dom.valor("pokemon", btn.dataset.nombre);
            dom.html("sugerencias", "");
            buscar();
          });
        });
      });

      // Cerrar sugerencias al hacer clic fuera
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".search-area")) dom.html("sugerencias", "");
      });
    },
  });
})(window);