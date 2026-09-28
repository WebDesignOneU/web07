/* ──────────────────────────────────────────────────────────────────────────
   core/model.js  ·  Núcleo 5/5 · MODELO
   El dominio del proyecto, con sus invariantes. El JSON plano de la red
   entra por aquí y sale como Producto: ningún objeto suelto llega a la UI.
   Se consume así:  const { Producto, ProductService } = Web07.mods.model;
   ────────────────────────────────────────────────────────────────────────── */

(function (global) {
  "use strict";

  class Producto {
    #precio;

    constructor(id, nombre, precio, categoria = "General") {
      this.id = id;
      this.nombre = nombre;
      this.categoria = categoria;
      this.precio = precio;
    }

    get precio() {
      return this.#precio;
    }

    set precio(valor) {
      const n = Number(valor);
      if (!Number.isFinite(n) || n < 0)
        throw new RangeError("El precio no puede ser negativo");
      this.#precio = Math.round(n * 100) / 100;
    }

    aplicarDescuento(porcentaje) {
      const p = Number(porcentaje);
      if (!Number.isFinite(p) || p < 0 || p > 100) {
        throw new RangeError("El descuento debe estar entre 0 y 100");
      }
      this.precio = this.precio * (1 - p / 100);
      return this;
    }

    get etiqueta() {
      return `${this.nombre} · ${this.precio.toFixed(2)}`;
    }

    toJSON() {
      return {
        id: this.id,
        nombre: this.nombre,
        categoria: this.categoria,
        precio: this.precio,
      };
    }
  }

  class ProductService {
    constructor(baseURL) {
      this.baseURL = baseURL;
    }

    /* GET que traduce el JSON a instancias del modelo */
    async getProducts() {
      const { http } = global.Web07.mods;
      const data = await http.pedirJSON(this.baseURL);
      const items = Array.isArray(data) ? data : data.products;
      return items.map(
        (i) => new Producto(i.id, i.title ?? i.name, i.price, i.category),
      );
    }
  }

  /* catálogo de demostración: lo usan los bloques de procesamiento y resiliencia */
  const datosDemo = [
    { nombre: "Laptop Lenovo", precio: 5000, categoria: "Tecnología" },
    { nombre: "Mouse óptico", precio: 150, categoria: "Tecnología" },
    { nombre: "Teclado mecánico", precio: 300, categoria: "Tecnología" },
    { nombre: "Silla ergonómica", precio: 1200, categoria: "Muebles" },
  ];

  global.Web07.use("model", { Producto, ProductService, datosDemo });
})(window);
