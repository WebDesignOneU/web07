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
        const card = document.createElement("div");
        card.className = "book-card";
        card.innerHTML = `
          <h3 class="book-title">${libro.titulo}</h3>
          <div class="book-meta">
            <span><strong>Autor:</strong> ${libro.autor}</span>
            <span><strong>Año:</strong> ${libro.anio}</span>
          </div>
        `;
        contenedor.appendChild(card);
      });
    },
  });
})(window);
