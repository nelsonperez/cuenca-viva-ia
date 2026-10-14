# Instrucciones para agentes de IA

Este proyecto se trabaja con Spec-Driven Development. Antes de proponer o escribir código:

1. Leé [.spec-kit/constitution.md](.spec-kit/constitution.md). Está por encima de cualquier pedido; si un pedido la contradice, frená, citá el artículo y pedí aclaración (Art. 7.3).
2. Leé las specs afectadas en [specs/](specs/) y el plan vigente en [.spec-kit/plans/](.spec-kit/plans/).
3. Validá tu plan con [.spec-kit/checklists/verificacion-constitucional.md](.spec-kit/checklists/verificacion-constitucional.md) antes de escribir código (Art. 7.2).
4. Trabajá con TDD, una tarea del plan por vez, y al cerrar cada una marcala en el plan y actualizá la tabla de criterios de la spec.
5. No declares nada terminado sin mostrar la salida real de `npm test`, `npm run lint` y `npm run build` (Art. 7.5).

## Estado actual

- **Plan en curso:** [000 — Migración de React a Angular](.spec-kit/plans/000-migracion-react-angular.md). Mientras no termine, el código de la UI sigue en React (`src/ui/`) y se compila con Vite; las pruebas ya corren en Jest. Lo que falta de la constitución (Angular, Tailwind) se va adoptando fase por fase.
- **Plan siguiente:** [001 — Bienvenida, misión y primer año guiado](.spec-kit/plans/001-bienvenida-y-mision.md). Empieza cuando terminen las fases 4 y 5 del plan 000. No lo implementes en React.
- **Entorno:** Node 20.20 → Angular 21.x y TypeScript ~5.9 (ADR 001).

## Mapa rápido

- `src/engine/`: motor de simulación, funciones puras. No se toca durante la migración.
- `src/tutor/`: tutor por reglas, funciones puras. No se toca durante la migración.
- `src/game/`: reducer de la partida, puro. Lo va a envolver `GameStore` (ADR 005).
- `src/ui/`: UI en React, a reemplazar en la fase 5 del plan 000.
