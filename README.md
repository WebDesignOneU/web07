# ⚡ Web07 — Tecnologías Web I

Colección de ejercicios y demos de **HTML, CSS, Bootstrap y JavaScript
(vanilla)**. No hay build, ni dependencias instalables, ni framework: se
abre `index.html` y funciona.

```
36 HTML · 11 CSS · 24 JS
```

## Cómo abrirlo

Doble clic en `index.html`. Todo está pensado para `file://` y funciona
así, con una excepción importante:

> **Los ES Modules están bloqueados en `file://`.** El navegador los
> rechaza por CORS, así que el proyecto usa scripts clásicos. Si en
> algún momento se sirve por HTTP (`npx serve`, `python -m http.server`),
> `js/app.js` podría pasar a `import` sin cambiar nada más.

Bootstrap 4.5.2 y SweetAlert2 11 vienen de un CDN, así que hace falta
conexión la primera vez que se cargan.

## Estructura

```
web07/
├── index.html              portada
├── ejercicios.html         visor de los 25 ejercicios → ej01…ej25
├── showcase.html          Showcase: 7 bloques de demo reutilizables
│
├── calculadora.html · formulario.html · demojson.html
├── pokeclient.html · swalconbs.html · seminario.html
├── flexbox.html           página autónoma de flexbox
├── bootstapemb.html
│
├── ej01.html … ej27.html   los 25 ejercicios, uno por archivo
│
├── css/                   estilos (ver css/README.md)
│   ├── styles.css          centralizador: @import de las 6 capas base
│   ├── variables.css       1 · tokens (:root)
│   ├── base.css            2 · reset + body
│   ├── animations.css      3 · @keyframes
│   ├── layout.css          4 · navbar, footer, estructuras
│   ├── components.css      5 · componentes y overrides de Bootstrap
│   ├── legacy.css          6 · <body class="legacy"> (los 25 ejercicios)
│   ├── showcase.css · calculadora.css · pokeclient.css   capas de página
│   └── flexbox.css          página autónoma, no usa styles.css
│
├── js/                    lógica (ver js/README.md)
│   ├── app.js              centralizador: lee data-page y carga módulos
│   ├── core/               5 módulos compartidos por todo el sitio
│   ├── blocks/             10 demos reutilizables
│   └── pages/              8 módulos, uno por página
│
├── fonts/                 DS-Digi (4 variantes .TTF)
├── img/
└── README.md
```

## los 25 ejercicios

`ejercicios.html` es el único visor: sidebar agrupado por tema, contador
`NN / 25`, botones *Anterior* / *Siguiente*, navegación con las flechas
del teclado y enlace directo por hash.

```
ejercicios.html#ej12        abre el ejercicio 12
```

Cada ficha vuelve al visor con su propio número, de modo que se puede
mandar una URL concreta sin perder el hilo.

| # | Título | Antes era |
|---|--------|-----------|
| **HTML y Bootstrap** | | |
| `ej01` | Mi HTML5 | `pagina1` |
| **JavaScript básico** | | |
| `ej02` | Párrafos y selectores | `pagina2`+`pagina3`+`pagina4` |
| `ej03` | Formulario y envío | `pagina5` |
| `ej04` | Suma con diálogos | `pagina6`+`pagina7`+`pagina8` |
| `ej05` | Formulario validado | `pagina9` |
| `ej06` | Tipos de campo | `pagina10` |
| `ej07` | Matriz 3x3 | `pagina11` |
| `ej08` | Primer JS: saludo | `prueba` |
| **Intro al DOM** | | |
| `ej09` | Párrafos: agregar, modificar y quitar | `prueba1`+`prueba3`+`prueba4` |
| `ej10` | Insertar aleatorios | `prueba2` |
| **Operaciones** | | |
| `ej11` | Operaciones con radio | `prueba5` |
| `ej12` | Operaciones validadas | `prueba6` |
| **Controles** | | |
| `ej13` | Radio con doble clic | `prueba7` |
| `ej14` | Editar campos | `prueba8` |
| `ej15` | Formularios dinámicos | `prueba9` |
| `ej16` | Universidades | `prueba10` |
| `ej17` | Opciones JS | `prueba11` |
| **Selects dinámicos** | | |
| `ej18` | Tours de Bolivia | `prueba12` |
| **Checks y radios** | | |
| `ej19` | Checks: resumen, limpiar y radios | `prueba13`+`prueba14`+`prueba15` |
| **Tablas dinámicas** | | |
| `ej20` | Sumas de tabla | `prueba16` |
| `ej21` | Tabla con colspan | `prueba17` |
| `ej22` | Menú de opciones | `prueba18` |
| `ej23` | Tabla dinámica | `prueba19` |
| `ej24` | Matriz dinámica | `prueba20` |
| **Proyecto final** | | |
| `ej25` | Encuesta JS | `prueba21` |

Los 25 comparten la misma cabecera: `<!doctype html>`, `lang="es"`,
charset, viewport, fuentes, Bootstrap antes de `styles.css` y
`<body class="legacy ejercicio" data-ejercicio="NN">` con una barra de
contexto (`.ej-head`) que da el número, el título y el vuelta al visor.

> **La barra `.ej-head` no puede contener `<p>`, `<ul>`, `<form>` ni
> `<input>`.** Varios ejercicios localizan esos elementos por posición
> (`querySelector("p")`, `document.forms[0]`,
> `querySelectorAll("ul")[1]`) y un elemento extra los rompería. Es la
> única restricción real que impone la homogeneización.

### Qué cambió y qué no

- **El cuerpo de cada ejercicio es idéntico al original**, byte a byte
  salvo la indentación. Se comprobó automáticamente en los 25 (salvo los
  cuatro unificados: `ej02`, `ej04`, `ej09` y `ej19` concentran ahora cada
  grupo).
- Los scripts de `<head>` y `<body>` se conservan en el mismo orden;
  SweetAlert2 se añade sólo donde ya se usaba.
- Se eliminaron los CSS por página (`index`, `paginas`, `pruebas`,
  `prueba16`…`prueba21`) y se absorbieron en las capas compartidas.
- El ejercicio que antes era `ej04` (antes `pagina4`) no cargaba
  `js/app.js`: su módulo `js/pages/pagina4.js` hacía exactamente lo mismo
  que el script del ejercicio y se ejecutaba dos veces. Se borró el módulo
  y hoy su código vive dentro de `ej02`.
- Los visores `paginas.html` y `pruebas.html` se sustituyeron por
  `ejercicios.html`.

## Cómo está organizado el CSS

Cada página enlaza **un solo** archivo, `css/styles.css`, que importa las
6 capas base en orden de cascada:

```
variables → base → animations → layout → components → legacy
```

Un estilo que sólo pertenece a una página se scopea con la clase de su
`body` (`body.inicio`, `body.lab`, `body.ejercicio`) en lugar de crear un
archivo nuevo. Sólo tienen capa propia las páginas que van a crecer:
`showcase`, `calculadora` y `pokeclient`. `flexbox.css` es autónoma.

Detalle completo, con la lista de tokens y las reglas de cada capa, en
[`css/README.md`](css/README.md).

## Cómo está organizado el JS

Las páginas que no son ejercicios cargan un único script que decide qué
módulos cargar:

```html
<script src="js/app.js" data-page="calculadora"></script>
```

```
app.js  →  core/ (5)  →  blocks/ (10)  →  pages/<data-page>.js
```

Los módulos se registran con `Web07.use()` y su `init()` corre cuando el
DOM ya está listo, en orden. Un `init()` que falla no detiene a los demás.
Detalle completo en [`js/README.md`](js/README.md).

los 25 ejercicios **no** usan `app.js`: su código *es* la lección, así
que cada uno se basta solo, tal como se entregaron.

## Convenciones

- UTF-8 sin BOM. En PowerShell 5.1, escribir texto con acentos rompe el
  archivo salvo que se lea y se escriba con `-Encoding UTF8`; mejor un
  script de Node.
- 2 espacios de indentación. Las líneas del HTML no pasan de 93
  columnas.
- Scripts clásicos, nunca `type="module"` (ver más arriba).
- Los tokens de color y tamaño van por `var(--…)` cuando existen.
- Al tocar CSS, comprobar los estilos computados: en una arquitectura
  por capas el orden manda más que la especificidad.
- El proyecto no tiene configuración de build ni de formateador. Si se
  añade una, hay que respetar el formato ya escrito a mano.

## Notas

- `ej06` y `showcase` emiten un error de recurso en consola por un
  `src=""` en un `<input type="image">` y en un `<img>`. Es contenido
  original de los ejercicios, no un fallo del proyecto.
- `ej21` (antes `prueba17`) abre un `alert` al cargar. Es parte del
  ejercicio; en pruebas automatizadas hay que interceptarlo.
- Antes existían `paginas.html`, `pruebas.html` y los 33 archivos
  `pagina*.html` / `prueba*.html`. Se unificaron en `ejercicios.html` +
  `ej01…ej25`.
