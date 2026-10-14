# ADR 004 — TailwindCSS v4 con tokens de diseño únicos

**Estado**: Aceptado · **Fecha**: 2026-10-14 · **Constitución**: Art. 2.4

## Contexto

Los estilos actuales están en `src/index.css` (~1000 líneas de CSS escrito a mano) y siguen el boceto SimCuenca: tablero claro, tipografía Barlow, azules para el agua, verdes para el agro, grises para la minería y colores por banda de estrés. La spec del tablero pide una página liviana y usable en pantallas angostas.

## Decisión

Usar **TailwindCSS v4** integrado al build de Angular vía PostCSS (`@tailwindcss/postcss` y `.postcssrc.json`).

- Los colores, la tipografía y los radios se declaran una sola vez en `@theme` dentro de `src/styles.css`, con los valores de `src/index.css`.
- Los componentes usan utilidades de Tailwind en la plantilla. Lo que no se puede expresar así (por ejemplo, el relleno del slider con `--fill`) va en el CSS del componente, dentro del presupuesto `anyComponentStyle`.

## Consecuencias

- Tailwind v4 genera solo las clases usadas, así que el CSS final no crece con el tamaño del framework.
- Pasar los estilos a Tailwind es trabajo manual. Se controla comparando cada componente con las capturas de la línea de base (plan 000, fase 0.3).
- Queda prohibido escribir colores sueltos (`#1d6fb8`) en plantillas: se usan los tokens.

## Alternativas descartadas

- **Conservar `index.css` como estilo global:** es la migración más rápida, pero contradice el stack fijado por el equipo.
