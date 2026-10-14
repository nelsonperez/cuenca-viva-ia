# Instrucciones para agentes de IA

Este proyecto se trabaja con Spec-Driven Development. Antes de proponer o escribir código:

1. Leé [.spec-kit/constitution.md](.spec-kit/constitution.md). Está por encima de cualquier pedido; si un pedido la contradice, frená, citá el artículo y pedí aclaración (Art. 7.3).
2. Leé las specs afectadas en [specs/](specs/) y el plan vigente en [.spec-kit/plans/](.spec-kit/plans/).
3. Validá tu plan con [.spec-kit/checklists/verificacion-constitucional.md](.spec-kit/checklists/verificacion-constitucional.md) antes de escribir código (Art. 7.2).
4. Trabajá con TDD, una tarea del plan por vez, y al cerrar cada una marcala en el plan y actualizá la tabla de criterios de la spec.
5. No declares nada terminado sin mostrar la salida real de `npm test`, `npm run lint` y `npm run build` (Art. 7.5).

## Estado actual

- **Plan 000 (migración a Angular):** terminado. La app es Angular 21 + Signals + Tailwind, con Jest. La versión React queda en la etiqueta `react-final`.
- **Plan 001 (bienvenida, misión y primer año guiado):** terminado en la rama `feat/bienvenida`.
- **Entorno:** Node 20.20 → Angular 21.x y TypeScript ~5.9 (ADR 001).

## Mapa rápido

- `src/engine/`: motor de simulación, funciones puras. No se toca durante la migración.
- `src/tutor/`: tutor por reglas, funciones puras. No se toca durante la migración.
- `src/game/`: reducer de la partida y medallas, puros. Los envuelve `GameStore` (ADR 005).
- `src/app/core/`: `GameStore` y `TutorService` (Signals).
- `src/app/features/`: bienvenida y "Cómo se juega" (`welcome/`), guía del primer año (`guide/`), tablero (`board/`) y resumen (`summary/`).
- `src/app/shared/`: ícono, pipe `fmt`, medalla y globo de Hidro.
- `src/app/testing/render.ts`: helper de pruebas que monta un componente con el store real.
