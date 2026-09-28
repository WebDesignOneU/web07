# css/ · Hojas de estilo de Web07

Esta carpeta ya no tiene un archivo gigante: `styles.css` es el **punto de
entrada único** y el resto son capas que él importa en orden.

```
css/
├── styles.css        centralizador: @import de las 6 capas base
├── variables.css     capa 1 · tokens (:root) — sólo valores, sin reglas
├── base.css          capa 2 · reset + body + variantes de body
├── animations.css    capa 3 · @keyframes y reglas `animation`
├── layout.css        capa 4 · navbar, footer y estructuras
├── components.css    capa 5 · Bootstrap y componentes propios
├── legacy.css        capa 6 · <body class="legacy"> (los 33 ejercicios)
│
├── showcase.css        ─┐
├── calculadora.css     │ capas de página: se enlazan aparte
├── pokeclient.css     ─┘ y DESPUÉS de styles.css
│
└── flexbox.css        página autónoma (no usa styles.css)
```

## Cómo se usa

En el `<head>` de cualquier página:

```html
<link rel="stylesheet" href="css/styles.css" />
```

Y, si la página necesita su capa propia, una línea más:

```html
<link rel="stylesheet" href="css/styles.css" />
<link rel="stylesheet" href="css/showcase.css" />
```

**El orden importa.** La capa de página va después porque la cascada se
resuelve de arriba abajo: es lo que permite que `showcase.css` ajuste un
`grid` sin tocar `layout.css`.

## Orden de cascada (obligatorio)

1. `variables.css` — las custom properties. Se lee primero para que el
   resto de capas pueda usarlas.
2. `base.css` — reset, `body` y las variantes de body.
3. `animations.css` — todo lo que sólo anima.
4. `layout.css` — estructura: navbar, footer, cajas de página.
5. `components.css` — reescrituras de Bootstrap y componentes.
6. `legacy.css` — estilos de los 33 ejercicios (`ej01`…`ej33`), que
   declaran `<body class="legacy ejercicio">`.

Si dos reglas del mismo peso colisionan, gana la última. Por eso las
capas de página van enlazadas al final y no importadas desde
`styles.css`.

## Páginas con scope: `body.inicio` y `body.lab`

La portada y el visor de ejercicios **no tienen archivo propio**. Antes
eran `index.css`, `paginas.css` y `pruebas.css`; ahora viven en las
capas 2–5 con un selector de body delante, para que sus reglas no se
filtren a las otras páginas:

| Capa      | `body.inicio`                  | `body.lab`                        |
|-----------|--------------------------------|-----------------------------------|
| base      | —                              | `margin: 0`                       |
| animations| drift, float, fadeInUp        | —                                 |
| layout    | navbar, hero, grids, footer   | hero, sidebar, iframe             |
| components| botones, tarjetas, distintivos| barra de direcciones, sidebar     |

```html
<body class="inicio">   <!-- index.html      -->
<body class="lab">      <!-- ejercicios.html -->
```

Esta es la regla general: **si un estilo sólo pertenece a una página, se
scopea con su clase de body en lugar de crear un archivo nuevo.** Sólo
reciben capa propia las páginas que son un caso abierto y van a crecer
(`showcase`, `calculadora`, `pokeclient`).

## Los 33 ejercicios: `body.ejercicio`

Los ejercicios comparten una barra de contexto (`.ej-head`: número,
título y vuelta al visor) definida en `components.css` bajo
`body.ejercicio`, junto con los bordes de tabla que antes eran
`prueba16.css`…`prueba21.css`.

Vive en la capa compartida y no en una capa de página porque las 33
páginas lo consumen — igual que `legacy.css`.

> **Restricción:** esa barra no puede contener `<p>`, `<ul>`, `<form>` ni
> `<input>`. Varios ejercicios localizan esos elementos por posición
> (`querySelector("p")`, `document.forms[...]`, `querySelectorAll("ul")[1]`)
> y un elemento extra los rompería.

## `variables.css`

No escribas reglas ahí, sólo valores. Cambiar el color de todo el sitio
es editar `:root`:

```css
:root {
  --bg:            #f7f6f3;
  --surface:       #ffffff;
  --surface-alt:   #efeeea;
  --text:          #22232a;   /* > 10:1   texto normal           */
  --text-muted:    #54565e;   /* ≥ 4.7:1  secundario             */
  --accent:        #5b4fd6;
  --accent2:       #127a66;
  --accent3:       #b83f6b;
  --radius:        12px;
  /* … */
}
```

Cualquier capa puede consumir `var(--accent)`. Los degradados y las
sombras de marca también son tokens (`--grad-marca`, `--grad-titulo`,
`--grad-cifra`, `--shadow`…), así que los `background: linear-gradient(...)`
escritos a mano son una señal de que falta un token.

> **Contraste:** el tema es claro y cumple WCAG AA. Para texto pequeño
> sobre un tinte al 12 % del mismo acento usa los tokens `--accentN-texto`
> (tonos más profundos); no bajes de `--text-muted` ni inventes un tercer
> tono "tenue".

## Agregar una capa nueva

1. Crea `css/mi-capa.css` con un encabezado de comentario que diga a qué
   capa pertenece y qué reglas contiene.
2. Si es una **capa base** (afecta a todo el sitio), agrega su
   `@import` en `styles.css` en la posición correcta.
3. Si es una **capa de página**, enlázala en el HTML después de
   `styles.css`.
4. Antes de crear un archivo, comprueba si sus reglas caben en una capa
   existente con el scope de su clase de body.
5. Comprueba que no se rompió nada: los estilos de las capas anteriores
   que dependían de `specificity` ahora reciben tus reglas al final.

## `file://` y `@import`

El proyecto se abre con doble clic (`file://`). En ese contexto:

- `@import` **sí funciona** (Chrome y Edge lo resuelven desde disco).
- Los `@import` deben ir **antes de cualquier regla** en el archivo.
- `@import` añade una petición extra por capa: son 6, es aceptable, y a
  cambio el HTML de las 47 páginas queda limpio y consistente.

## Trampa: `*/` dentro de un comentario

En CSS un comentario se cierra con la secuencia `*/`. Escribir esa
secuencia *dentro* de un comentario —por ejemplo al documentar una
enumeración de nombres de archivo— lo cierra antes de tiempo y el resto
del texto se interpreta como CSS:

```css
/* mal: cierra aquí ───────────────
   efectos para pagina*/prueba*
   ────────────────────────────── */
.parrafo { color: lightgray; }        /* ¡regla inválida, no se aplica! */
```

Pasó de verdad: `.parrafo` estuvo meses en el sitio sin aplicarse por
esto. **Nunca pongas esa secuencia en un comentario de CSS**; describe
el caso con palabras ("página o prueba", "los archivos de ejercicios").

## Convenciones

- 2 espacios de indentación, un espacio alrededor de `:` y `{`.
- Selectores de clase kebab-case: `.w7-nav`, `.result-box`.
- Colores y medidas siempre vía `var(--…)` cuando existe el token.
- El HTML ya no lleva estilos incrustados; si un valor es de una sola
  página, va scopeado en la capa que le toca, no en una capa nueva.
- Un comentario de encabezado por archivo, con su número de capa.
