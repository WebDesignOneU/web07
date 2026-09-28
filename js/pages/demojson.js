/* ──────────────────────────────────────────────────────────────────────────
   pages/demojson.js  ·  Script propio de demojson.html
   Datos en formato JSON renderizados con createElement.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const librosJSON = [
    { titulo: "El Gran Gatsby", autor: "F. Scott Fitzgerald", anio: 1925 },
    { titulo: "1984", autor: "George Orwell", anio: 1949 },
    {
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      anio: 1967,
    },
  ];

  global.Web07.use("pagina:demojson", {
    init() {
      const { dom } = global.Web07.mods;

      const contenedor = dom.porId("libros");
      if (!contenedor) return;

      librosJSON.forEach((libro) => {
        const elemento = document.createElement("div");
        elemento.innerHTML =
          "<h2>" +
          libro.titulo +
          "</h2>" +
          "<p>Autor: " +
          libro.autor +
          "</p>" +
          "<p>Año: " +
          libro.anio +
          "</p>";
        contenedor.appendChild(elemento);
      });
    },
  });
})(window);
