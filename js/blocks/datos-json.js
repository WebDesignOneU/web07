/* ──────────────────────────────────────────────────────────────────────────
   blocks/datos-json.js  ·  Showcase BLOQUE 3 · DATOS JSON
   Render de una colección de objetos y un par de selects encadenados
   (departamento → lugar) construidos con createElement.
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  const LIBROS = [
    {
      titulo: "El Gran Gatsby",
      autor: "F. Scott Fitzgerald",
      anio: 1925,
      emoji: "📕",
    },
    { titulo: "1984", autor: "George Orwell", anio: 1949, emoji: "📗" },
    {
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      anio: 1967,
      emoji: "📘",
    },
  ];

  const LUGARES = {
    1: [
      "Yungas",
      "Copacabana",
      "Tiahuanaco",
      "El Lago sagrado",
      "San Buena Ventura",
    ],
    2: [
      "Salar de Uyuni",
      "La casa de la Moneda",
      "Cerro Rico",
      "Lagunas Colorada",
    ],
    3: [
      "Misiones Jesuitas",
      "El pantanal",
      "Samaipata",
      "Puerto Busch",
      "El Mutun",
    ],
  };

  global.Web07.use("bloque:datos-json", {
    init() {
      const { alerts, dom } = global.Web07.mods;

      /* 1 · tarjetas de libros */
      const contenedor = dom.porId("libros-container");
      LIBROS.forEach((libro) => {
        const ficha = document.createElement("div");
        ficha.className = "book-item";
        ficha.innerHTML =
          `<div class="book-cover">${libro.emoji}</div><div>` +
          `<div class="book-title">${libro.titulo}</div>` +
          `<div class="book-meta">✍️ ${libro.autor} · 📅 ${libro.anio}</div></div>`;
        ficha.addEventListener("click", () => {
          alerts.info(
            libro.titulo,
            `<b>Autor:</b> ${libro.autor}<br><b>Año:</b> ${libro.anio}`,
            "#f5a623",
          );
        });
        contenedor.appendChild(ficha);
      });

      /* 2 · tour: el segundo select se arma según el departamento */
      const deptoSel = dom.porId("depto-sel");
      const lugarSel = dom.porId("lugar-sel");
      const resultado = dom.porId("tour-result");
      const btnTour = dom.porId("btn-tour");
      const vacio = () => {
        resultado.textContent = "Selecciona un lugar";
        resultado.className = "result-box empty";
      };

      deptoSel.addEventListener("change", () => {
        const d = deptoSel.value;
        lugarSel.innerHTML = '<option value="">-- Elige un lugar --</option>';

        if (d && LUGARES[d]) {
          LUGARES[d].forEach((l) => {
            const opcion = document.createElement("option");
            opcion.value = l;
            opcion.textContent = l;
            lugarSel.appendChild(opcion);
          });
          lugarSel.disabled = false;
          btnTour.disabled = true;
          vacio();
        } else {
          lugarSel.disabled = true;
          btnTour.disabled = true;
        }
      });

      lugarSel.addEventListener("change", () => {
        if (lugarSel.value) {
          resultado.textContent = `📍 Destino: ${lugarSel.value}`;
          resultado.className = "result-box";
          btnTour.disabled = false;
        } else {
          btnTour.disabled = true;
        }
      });

      btnTour.addEventListener("click", () => {
        const depto = deptoSel.options[deptoSel.selectedIndex].text;
        alerts.ok(
          "🗺️ ¡Tour Confirmado!",
          `<b>Departamento:</b> ${depto}<br><b>Destino:</b> ${lugarSel.value}`,
          "#f5a623",
        );
      });
    },
  });
})(window);
