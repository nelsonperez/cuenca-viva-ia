# Spec-Driven Development en Cuenca Viva IA

Este directorio guarda la gobernanza del proyecto. Las specs funcionales viven en `specs/`; acá están las reglas para escribirlas, planificarlas e implementarlas.

## Jerarquía

1. **Constitución** (`constitution.md`): reglas no negociables. Gana sobre todo lo demás.
2. **ADRs** (`adr/`): decisiones de arquitectura y su porqué. Una excepción a la constitución solo existe si hay un ADR aceptado.
3. **Specs** (`../specs/*.md`): qué tiene que hacer el sistema, en requerimientos WHEN/THEN y criterios de aceptación.
4. **Planes** (`plans/`): cómo se implementa una o varias specs, en fases y tareas verificables.
5. **Código y pruebas**: implementan el plan. Cada prueba cita el criterio que verifica (`[tablero#2]`).

## Flujo de trabajo

```
spec (qué) → plan (cómo) → verificación constitucional → pruebas en rojo → código → verde → refactor → actualizar spec y plan
```

1. **Spec.** Un cambio de comportamiento empieza agregando o editando un requerimiento en `specs/`, con `templates/spec.md`.
2. **Plan.** Se escribe `plans/NNN-nombre.md` con `templates/plan.md`. Los números son correlativos y no se reutilizan.
3. **Verificación constitucional.** El plan completa su cuadro de verificación con `checklists/verificacion-constitucional.md`. Si algún artículo no se cumple, se corrige el plan o se propone un ADR.
4. **Implementación con TDD.** Una tarea del plan por vez: prueba que falla → código mínimo → refactor.
5. **Cierre.** Se marcan las tareas del plan, se actualiza la tabla de criterios de la spec y se adjunta la salida de `npm test`, `npm run lint` y `npm run build` en el PR.

## Estados

- **Spec**: Borrador → Aprobada → Implementada.
- **Plan**: Propuesto → En curso → Terminado (o Descartado, con motivo).
- **ADR**: Propuesto → Aceptado → Reemplazado por NNN (o Rechazado).

## Índice

| Tipo | Archivo | Estado |
|---|---|---|
| Constitución | [constitution.md](constitution.md) | v1.0.0 |
| Plan 000 | [plans/000-migracion-react-angular.md](plans/000-migracion-react-angular.md) | Terminado ([#1](https://github.com/nelsonperez/cuenca-viva-ia/pull/1)) |
| Plan 001 | [plans/001-bienvenida-y-mision.md](plans/001-bienvenida-y-mision.md) | En curso (fases 1 y 2 terminadas) |
| Línea de base | [baseline/README.md](baseline/README.md) | Versión React, 2026-10-14 |
| ADR 001 | [adr/001-angular-21-node-20.md](adr/001-angular-21-node-20.md) | Aceptado |
| ADR 002 | [adr/002-build-angular-cli.md](adr/002-build-angular-cli.md) | Aceptado |
| ADR 003 | [adr/003-jest-como-runner.md](adr/003-jest-como-runner.md) | Aceptado |
| ADR 004 | [adr/004-tailwind-v4.md](adr/004-tailwind-v4.md) | Aceptado |
| ADR 005 | [adr/005-dominio-sin-framework.md](adr/005-dominio-sin-framework.md) | Aceptado |
