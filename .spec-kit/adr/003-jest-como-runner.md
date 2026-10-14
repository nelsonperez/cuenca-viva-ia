# ADR 003 — Jest como runner de pruebas

**Estado**: Aceptado · **Fecha**: 2026-10-14 · **Constitución**: Art. 2.5, 6

## Contexto

Las pruebas del dominio (motor, tutor y estado de partida) están escritas en Vitest. Angular 21 trae Vitest como runner por defecto (`ng test` con `@angular/build:unit-test`). El equipo pidió estandarizar en Jest.

## Decisión

Usar **Jest** con **`jest-preset-angular`**, invocado directamente (`npm test` → `jest`) y no mediante `ng test`. Los umbrales de cobertura del Art. 6.3 se declaran en `jest.config.js` (JavaScript para no sumar `ts-node`; el proyecto es `"type": "module"`).

## Consecuencias

- Las pruebas del dominio se migran cambiando solo los imports (`vitest` → `@jest/globals`) y el nombre de archivo (`*.test.ts` → `*.spec.ts`). Ninguna aserción cambia (plan 000, fases 1 y 2).
- El runner queda fuera del CLI: `ng update` no lo actualiza, y `jest-preset-angular` tiene que publicar una versión compatible antes de cada actualización de Angular.
- Jest corre en Node con jsdom y transforma TypeScript; es algo más lento que Vitest en este tamaño de proyecto.

## Alternativas consideradas

- **Vitest con `ng test`:** es lo que trae Angular 21 por defecto, ya está en uso y elimina las fases 1 y 2 del plan 000. No se eligió por el pedido explícito del equipo. Si se quiere revisar la decisión, alcanza con un ADR que reemplace a este y una enmienda del Art. 2.5.
