# Línea de base de la versión React

Evidencia tomada el 2026-10-14 sobre la etiqueta `react-final` (`6046163`) para el plan 000. Sirve para comprobar que la versión Angular conserva el comportamiento y el aspecto.

## Verificaciones

| Comando | Resultado |
|---|---|
| `npm test` (Vitest 4.1) | 3 archivos, **37 pruebas** en verde. Detalle en [tests-list.txt](tests-list.txt) |
| `npm run typecheck` | Sin errores |
| `npm run lint` | Sin errores |
| `npm run build` (Vite 8) | JS **244,21 kB** (76,13 kB gzip) · CSS 11,84 kB (3,17 kB gzip) · HTML 0,94 kB. Detalle en [build.txt](build.txt) |

Pruebas por archivo (fases 1 y 2 del plan: la misma cantidad tiene que pasar con Jest):

| Archivo | Pruebas |
|---|---|
| `src/engine/engine.test.ts` | 19 |
| `src/tutor/explain.test.ts` | 12 |
| `src/game/game.test.ts` | 6 |

## Capturas

Tomadas con Playwright sobre `npm run preview`, con ventana de 1280 × 900 salvo indicación.

| Archivo | Qué muestra | Criterios del tablero |
|---|---|---|
| [01-anio-1.png](01-anio-1.png) | Año 1, cobertura completa, sin compras | #1 |
| [02-anio-2-sequia.png](02-anio-2-sequia.png) | Año 2 (sequía) con la explicación del año 1 y el aviso del tutor | #1, #2, #5 |
| [03-resumen-1-partida.png](03-resumen-1-partida.png) | Resumen de la primera partida | #6 |
| [04-anio-1-con-tecnologia.png](04-anio-1-con-tecnologia.png) | Segunda partida: "Reparar fugas" marcada y agricultura al 80 % | #2, #3, #4 |
| [05-resumen-2-partidas.png](05-resumen-2-partidas.png) | Comparación de las dos partidas | #6, #7 |
| [06-anio-1-375px.png](06-anio-1-375px.png) | Año 1 con 375 px de ancho, sin scroll horizontal | #8 |

Partidas usadas, para repetirlas en Angular:

1. **Partida 1:** todo al 100 %, sin compras, cinco veces "Simular año". Acuífero final: 20,5 UE.
2. **Partida 2:** "Jugar de nuevo"; en el año 1 comprar "Reparar fugas" y bajar agricultura a 80 %; cinco veces "Simular año". Acuífero final: 68,2 UE.

En el año 1, "Riego por goteo" (4 créditos) y "Recirculación minera" (3) aparecen bloqueadas porque hay 2 créditos (criterio #4).

## Comparación con la versión Angular (plan 000, fase 6)

Mismas partidas y mismos tamaños de ventana, sobre `ng serve` en `feat/angular`. Capturas en [angular/](angular/).

| | React (`react-final`) | Angular |
|---|---|---|
| Acuífero final, partida 1 | 20,5 UE | 20,5 UE |
| Acuífero final, partida 2 | 68,2 UE | 68,2 UE |
| Scroll horizontal a 375 px | No | No |
| Errores en la consola | — | Ninguno |
| Bundle inicial | 256 kB (79 kB gzip) | 177 kB (51 kB transferidos) |
| Pruebas | 37 (Vitest) | 95 (Jest) |

Diferencias visuales: algunos bloques miden 2–3 px más de alto por el `line-height` base de Tailwind. Colores, tipografías, textos y distribución son los mismos.
