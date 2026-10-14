# ADR 002 — Build con Angular CLI (`@angular/build`), sin Analog

**Estado**: Aceptado · **Fecha**: 2026-10-14 · **Constitución**: Art. 2.3

## Contexto

El proyecto usaba Vite con `@vitejs/plugin-react`. Para Angular había dos caminos:

1. `@analogjs/vite-plugin-angular` dentro de un `vite.config.ts` propio.
2. El builder oficial `@angular/build:application`, que compila con esbuild y sirve en desarrollo con Vite.

## Decisión

Usar el **builder oficial del Angular CLI** (`ng build` / `ng serve`), configurado en `angular.json`.

## Consecuencias

- Se mantiene la velocidad de Vite en desarrollo sin depender de un plugin externo.
- `ng update` puede migrar el proyecto automáticamente en las próximas versiones.
- Se pierde la libertad de agregar plugins de Vite arbitrarios. Hoy no hace falta ninguno.
- Se eliminan `vite.config.ts` y `tsconfig.node.json`.

## Alternativas descartadas

- **Analog:** agrega una dependencia de terceros que tiene que seguir el ritmo de cada versión de Angular, y no ofrece nada que este proyecto necesite (no hay SSR ni rutas por archivos).
