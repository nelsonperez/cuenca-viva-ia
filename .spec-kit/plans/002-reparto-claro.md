# Plan 002 — Reparto del agua: qué significa el porcentaje

**Estado**: Terminado · **Rama**: `feat/reparto-claro` (sale de `feat/bienvenida`) · **Specs afectadas**: `tablero.md` (requerimiento 10) · **ADRs**: ninguno

## Objetivo

Que el estudiante entienda que cada slider es la parte de lo que necesita el sector que decide entregarle, y no un porcentaje del río. Surgió al usar el juego: el "100 %" a secas no se entendía.

## Diagnóstico del punto de partida

- La tarjeta dice "Cuánto de su necesidad recibe cada sector este año" y cada fila muestra "Necesita 60 UE" junto a "100%".
- La vista previa ya trae `delivered` y `demand` por sector (`YearResult`). No hace falta ninguna cuenta nueva.

## Verificación constitucional

| Artículo | Cómo lo cumple este plan | Estado |
|---|---|---|
| 1.2 / 7.4 | Requerimiento 10 agregado a `tablero.md` antes del código | Cumple |
| 4.3 / 4.5 | Las UE salen de `preview.delivered` y `preview.demand`; el componente no calcula | Cumple |
| 5.8 | Números con el pipe `fmt` | Cumple |
| 6.1 / 6.2 | Pruebas en rojo primero, citando `[tablero#10]` | Cumple |
| 2.7 | Sin dependencias nuevas | Cumple |

## Fases

### Fase 1 — Pruebas y cambio (TDD)

- [x] 1.1 Pruebas en `allocation.spec.ts`: el subtítulo explica el 100 %; cada fila dice "Recibe X de Y UE"; al bajar la agricultura al 50 % dice "Recibe 30 de 60 UE"; en la sequía extrema con todo al 100 % el recorte se ve ("Recibe 57 de 60 UE").
- [x] 1.2 Cambiar el subtítulo y la línea de cada sector en `allocation.html`.
- [x] 1.3 Alinear el texto de la tarjeta 2 de "Cómo se juega". Quedó como "La barra llena es todo lo que necesita": la prueba de bienvenida#16 no permite números en las tarjetas.

### Fase 2 — Verificación

- [x] 2.1 `npm test` (146 pruebas), `npm run typecheck`, `npm run lint` y `npm run build` (213,8 kB), sin errores.
- [x] 2.2 Captura a 1280 y 375 px del reparto, con un sector bajado y con recorte: [baseline/reparto](../baseline/reparto/). En la sequía extrema con todo al 100 %, la agricultura dice "Recibe 57 de 60 UE". Sin scroll horizontal ni errores en la consola.
- [x] 2.3 Actualizar el criterio 10 en `tablero.md` y este plan.

## Fuera de alcance

- Cambiar cómo funciona el reparto o el motor.
