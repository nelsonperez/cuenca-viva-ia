# ADR 001 — Angular 21.x mientras el entorno sea Node 20

**Estado**: Aceptado · **Fecha**: 2026-10-14 · **Constitución**: Art. 2.1, 2.2

## Contexto

Se decidió migrar el frontend a Angular 19 o superior. El entorno de desarrollo usa Node 20.20.

- Angular 22 exige Node `^22.22.3 || ^24.15.0 || >=26`.
- Angular 21 acepta Node `^20.19 || ^22.12 || >=24`.
- `@angular/build` 21 exige TypeScript `>=5.9 <6.0`. El proyecto usa hoy TypeScript 6.0.2.

## Decisión

Usar **Angular 21.x** y **TypeScript ~5.9** hasta que el entorno pase a Node 22 o superior.

## Consecuencias

- Se baja TypeScript de 6.0 a 5.9. El dominio no usa nada propio de 6.0, así que no cambia; `erasableSyntaxOnly` existe desde 5.8.
- Las escuelas no se ven afectadas: Node solo se usa para desarrollar, no para jugar.
- Pasar a Angular 22 será un plan aparte: subir Node, correr `ng update` y verificar el presupuesto del bundle.

## Alternativas descartadas

- **Angular 22 con Node 22:** obliga a cambiar el entorno de todo el equipo antes de empezar. Se puede hacer después, sin bloquear la migración.
