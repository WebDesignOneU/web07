/* ──────────────────────────────────────────────────────────────────────────
   pages/pokeclient.js  ·  Script propio de pokeclient.html
   Pokédex mínimo contra la PokéAPI, con estado de carga y error visible.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const API = "https://pokeapi.co/api/v2/pokemon/";

  global.Web07.use("pagina:pokeclient", {
    init() {
      const { dom, http } = global.Web07.mods;

      const buscar = async () => {
        const nombre = dom.valor("pokemon").toLowerCase();
        try {
          dom.texto("mensaje", "Cargando...");
          const data = await http.pedirJSON(API + nombre);
          mostrar(data);
          dom.texto("mensaje", "");
        } catch (error) {
          dom.texto("mensaje", "Pokemon no encontrado: " + error.message);
        }
      };

      const mostrar = (data) => {
        dom.html(
          "resultado",
          `<h2>${data.name}</h2>
           <img src="${data.sprites.front_default}" alt="${data.name}">
           <p>Altura: ${data.height}</p>
           <p>Peso: ${data.weight}</p>
           <p>Tipo: ${data.types[0].type.name}</p>`,
        );
      };

      const boton = dom.porId("buscar");
      if (!boton) return;

      boton.addEventListener("click", buscar);
      dom.porId("pokemon").addEventListener("keydown", (event) => {
        if (event.key === "Enter") buscar();
      });
    },
  });
})(window);
