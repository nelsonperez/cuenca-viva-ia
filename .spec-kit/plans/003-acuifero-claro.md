# Plan 003 — Acuífero: qué significa el 50 %

**Estado**: Terminado · **Rama**: `feat/reparto-claro` (mismo PR que el plan 002, #3) · **Specs afectadas**: `tablero.md` (requerimiento 11) · **ADRs**: ninguno

## Objetivo

Que el estudiante entienda que el acuífero arranca a la mitad de lo que puede guardar, y que lea sin esfuerzo la proyección al cierre del año. Surgió al usar el juego: "¿de arranque ya está en 50 %?".

## Diagnóstico del punto de partida

- El tanque muestra "50%" sin decir de qué; solo la etiqueta para lectores de pantalla aclara "de su capacidad".
- El número grande va centrado en el tanque y la línea punteada de la proyección suele pasar por encima (en el año 1 queda en 54,5 %).
- El bombeo en cero se escribe "−0".
- `groundMax` (200) y `groundInitial` (100) están en `params.ts`; no hace falta ninguna cuenta del motor.

## Verificación constitucional

| Artículo | Cómo lo cumple este plan | Estado |
|---|---|---|
| 1.2 / 7.4 | Requerimiento 11 agregado a `tablero.md` antes del código | Cumple |
| 4.3 | Solo decisiones de presentación: dónde va el número y qué signo lleva | Cumple |
| 5.8 / 7.6 | Números con el pipe `fmt`, tomados de la vista previa y de `params` | Cumple |
| 6.1 / 6.2 | Pruebas en rojo primero, citando `[tablero#11]` | Cumple |

## Fases

### Fase 1 — Pruebas y cambio (TDD)

- [x] 1.1 Pruebas en `aquifer.spec.ts`:
  - el nivel dice "100 de 200 UE" y "50 % de su capacidad";
  - el bombeo en cero dice "0", no "−0";
  - el porcentaje del tanque va arriba cuando la proyección queda abajo, y al revés, con un acuífero inicial alto provisto por `PARAMS`.
- [x] 1.2 `render()` de pruebas acepta providers, para probar con otros parámetros.
- [x] 1.3 Cambiar `aquifer.html` y `aquifer.ts`:
  - el nivel se lee "100 de 200 UE · 50 % de su capacidad";
  - el porcentaje del tanque va arriba si la proyección queda por debajo del 65 %, y abajo si no;
  - recarga, bombeo y cambio usan `signed()`, que escribe "0" sin signo.

  La prueba vieja de tablero#1 que buscaba "100 UE" pasó a buscar "100 de 200 UE".

### Fase 2 — Verificación

- [x] 2.1 `npm test` (150 pruebas), `npm run typecheck`, `npm run lint` y `npm run build` (213,5 kB), sin errores.
- [x] 2.2 Captura a 1280 y 375 px: [baseline/reparto](../baseline/reparto/), capturas 04 a 06. Con todo a 0 %, la proyección llega a 130 UE y el porcentaje baja. Sin scroll horizontal ni errores en la consola.
- [x] 2.3 Actualizar el criterio 11 en `tablero.md` y este plan.

## Fuera de alcance

- Cambiar la capacidad o el nivel inicial del acuífero: son parámetros del modelo y esperan la revisión científica.
