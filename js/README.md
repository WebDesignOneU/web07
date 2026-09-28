# js/ · JavaScript de Web07

Cada página enlaza **un solo** archivo: `js/app.js`. Él lee el atributo
`data-page`, decide qué módulos cargar y los carga en orden. No hay
`<script>` por cada archivo de la página.

```
js/
├── app.js              centralizador: lee data-page y carga todo
│
├── core/               núcleo compartido por TODO el sitio (siempre se carga)
│   ├── utils.js        funciones puras: esc, num, int, limite, dinero, esperar
│   ├── dom.js          selectores y campos + atajos globales del HTML
│   ├── alerts.js       SweetAlert2 con la paleta del sitio
│   ├── http.js         pedirJSON, conReintentos, transporteSimulado
│   └── model.js        Producto, ProductService, datosDemo
│
├── blocks/             demos reutilizables (cualquier página puede pedirlas)
│   ├── calculadoras.js     Showcase bloque 1 · aritmética
│   ├── formularios.js      Showcase bloque 2 · login e inscripción
│   ├── datos-json.js       Showcase bloque 3 · render y selects encadenados
│   ├── red.js              Showcase bloque 4 · PokéAPI y JSONPlaceholder
│   ├── sweetalert.js       Showcase bloque 5 · catálogo de alertas
│   ├── dom-layout.js       Showcase bloque 6 · nodos, tablas, lista
│   ├── modelo.js           Showcase bloque 7.1 · campo privado e invariantes
│   ├── red-productos.js    Showcase bloque 7.2 · capa de red
│   ├── procesamiento.js    Showcase bloque 7.3 · filter·map·sort·reduce
│   └── resiliencia.js       Showcase bloque 7.4 · retry, timeout, backoff
│
└── pages/              un archivo por página que tiene lógica propia
    ├── index.js · calculadora.js · auth.js · seminario.js
    ├── demojson.js · pokeclient.js · swalconbs.js
    └── showcase.js
```

> El archivo se llama como la página: `calculadora.html` →
> `pages/calculadora.js`.
>
> Antes había un `pages/pagina4.js` (el antiguo `js/mijs.js`). Se eliminó
> al unificar los ejercicios: duplicaba el script del propio ej04.

## Uso desde el HTML

```html
<script src="js/app.js" data-page="calculadora"></script>
```

`app.js` arma esta lista y la carga **en este orden**:

1. los 5 archivos de `core/`
2. los bloques que la página declare (ver `BLOQUES` en `app.js`)
3. `pages/<data-page>.js`

## El contrato de un módulo

Un módulo **no se ejecuta al cargarse**: se registra y su `init()` corre
después, cuando el DOM ya está listo y en orden de carga.

```js
(function (global) {
  'use strict';

  global.Web07.use('bloque:mi-demo', {
    init() {
      const { alerts, dom, utils } = global.Web07.mods;

      dom.alClic('#btn-mi-demo', () => {
        alerts.ok('Hola', utils.esc('desde un bloque'));
      });
    },
  });
})(window);
```

- `Web07.use('nombre', api)` registra el módulo. Si `api.init` existe, se
  encola para el arranque.
- `Web07.mods` es la forma de declarar dependencias: se leen al inicio
  del `init()`, nunca antes.
- Un `init()` que lanza una excepción no detiene a los demás: se reporta
  en consola con `[Web07] falló init:`.

## `core/` es para todo el sitio

Si un archivo sirve en más de una página, es núcleo. `core/` no debe
saber nada de `#btn-calculadora` ni de `.book-item`: sólo recibe ids y
selectores como argumentos.

| Módulo     | Qué resuelve                                                        |
|------------|---------------------------------------------------------------------|
| `utils`    | `esc` (XSS), `num`, `int` acotado, `limite`, `dinero`, `esperar`    |
| `dom`      | `$`, `$$`, `porId`, `valor`, `num`, `int`, `texto`, `leer`, `alClic` |
| `alerts`   | `ok`, `error`, `aviso`, `info`, `confirmar`, `preguntar`             |
| `http`     | `pedirJSON`, `conReintentos`, `transporteSimulado`                   |
| `model`    | `Producto` (con `#precio` privado), `ProductService`, `datosDemo`    |

## `onclick` inline: la excepción

Cuatro botones del showcase y del bloque DOM usan atributos `onclick`
escritos en el HTML, que resuelven nombres globales:

- `window.toggleCode` → lo expone `core/dom.js`
- `window.selectCell` → lo expone `blocks/dom-layout.js`

Todo lo demás usa `addEventListener`. Los atributos inline son una
herencia de las páginas de ejercicios, no el estilo del proyecto.

## Por qué scripts clásicos y no ES Modules

El sitio se abre con `file://`. En ese contexto el navegador **bloquea**
los módulos ES:

```
Access to script at 'file:///…/app.js' from origin 'null' has been
blocked by CORS policy: Cross origin requests are only supported for
protocol schemes: http, data, chrome…
```

Un `type="module"` no arranca bajo `file://`. Por eso `app.js` inyecta
los `<script>` clásicos uno por uno con `async = false` y espera el
`onload` de cada uno. Con un servidor HTTP (`npx serve`, `python -m
http.server`) esto mismo podría ser `import`, y sería lo natural.

## Agregar una página

1. Crea `pages/mi-pagina.js` con el módulo y su `init()`.
2. En el HTML, quita el `<script>` viejo y pon
   `<script src="js/app.js" data-page="mi-pagina"></script>`.

## Agregar un bloque

1. Crea `blocks/mi-bloque.js` con `Web07.use('bloque:mi-bloque', {…})`.
2. Agrégalo a la lista de esa página dentro de `BLOQUES` en `app.js`.

El orden importa: los bloques se inicializan en el orden de la lista, así
que uno puede depender de las APIs de otro que esté antes.

## Páginas que todavía llevan `<script>` inline

los 25 ejercicios (`ej01.html` … `ej25.html`), más `flexbox.html`
**no** usan
`app.js`: son ejercicios de clase con su JS incrustado y así se
entregaron. Migrarlos es opcional y no afecta al resto.

Los ejercicios son la excepción consciente a la arquitectura de este
README: su código *es* la lección, así que cada uno se basta solo. Por eso
la barra de contexto que comparten (`body.ejercicio`) no puede contener
`<p>`, `<ul>`, `<form>` ni `<input>` — varios ejercicios localizan esos
elementos por posición y un elemento extra los rompería.
