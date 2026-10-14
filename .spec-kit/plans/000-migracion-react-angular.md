# Plan 000 — Migración de React a Angular

**Estado**: En curso (fases 0, 1 y 2 terminadas) · **Rama**: `feat/angular` · **Specs afectadas**: `motor-simulacion.md`, `tutor-reglas.md`, `tablero.md` · **ADRs**: 001–005

## Objetivo

Reemplazar la capa de UI en React por Angular (Standalone + Signals + Tailwind) sin cambiar el comportamiento descrito en las tres specs. Al terminar, todo criterio de aceptación marcado "Cumplido" o "Verificado" sigue así, con la misma evidencia o mejor.

## Diagnóstico del punto de partida

| Módulo | Ubicación | ¿Depende de React? | Estrategia |
|---|---|---|---|
| Motor de simulación | `src/engine/` | No (funciones puras) | **Conservar.** Solo cambia el runner de pruebas. |
| Tutor por reglas | `src/tutor/` | No (funciones puras) | **Conservar.** Solo cambia el runner de pruebas. |
| Estado de la partida | `src/game/` | No (`reduce`, `preview`, `newGame`) | **Conservar** y envolver en un servicio con Signals. |
| Tablero y resumen | `src/ui/`, `src/App.tsx`, `src/main.tsx` | Sí | **Reescribir** en Angular. |
| Estilos | `src/index.css` (~1000 líneas) | No | Pasar a tokens de Tailwind con paridad visual. |
| Toolchain | Vite + `@vitejs/plugin-react`, Vitest, TS 6.0 | Sí | Reemplazar por Angular CLI 21, Jest y TS 5.9. |

**Orden de migración: motor → tutor → tablero.** Cada módulo depende del anterior (el tutor interpreta `YearResult` del motor y el tablero consume a los dos). Por eso se asegura la base antes de construir encima, y solo el último paso toca código que realmente cambia.

## Verificación constitucional

| Artículo | Cómo lo cumple este plan | Estado |
|---|---|---|
| 2.1 / 2.2 | Angular 21.x y TypeScript ~5.9, compatibles con Node 20.20 del entorno (ADR 001) | Cumple |
| 2.3 | Angular CLI `@angular/build:application`, sin Analog (ADR 002) | Cumple |
| 2.4 | Tailwind v4 con PostCSS; tokens extraídos de `src/index.css` (ADR 004) | Cumple |
| 2.5 / 6.1 | Jest + `jest-preset-angular` (ADR 003); cada fase de UI empieza por pruebas en rojo | Cumple |
| 3 | La fase 3 elimina React, JSX/TSX y el plugin `react` de oxlint | Cumple |
| 4 | El dominio queda intacto y sin imports de Angular; servicios y componentes encima (ADR 005) | Cumple |
| 5 | Componentes standalone, OnPush, zoneless, `input()`/`output()`, `@if`/`@for`, pipe `fmt` | Cumple |
| 6.3 / 6.4 | Umbrales de cobertura en `jest.config.js`; las pruebas de 200 partidas aleatorias se conservan | Cumple |
| 7.2 | Este cuadro | Cumple |

## Fases

### Fase 0 — Línea de base (sin cambiar código)

- [x] 0.1 Descartar el cambio accidental sin commitear en `src/ui/Board.tsx` (texto ` in` antes del primer `import`).
- [x] 0.2 Crear la etiqueta `react-final` sobre `6046163` y la rama `feat/angular`.
- [x] 0.3 Registrar la línea de base en [.spec-kit/baseline/](../baseline/README.md) (37 pruebas: motor 19, tutor 12, partida 6; JS 244 kB): cantidad de pruebas que pasan (`npm test`), tamaño del bundle (`npm run build`) y capturas del tablero (año 1, año con sequía, resumen con dos partidas, ancho de 375 px).
- [x] 0.4 Crear `.spec-kit/` con constitución, plan, ADRs, plantillas y checklist, y `AGENTS.md`.

**Salida:** evidencia guardada contra la cual comparar la paridad.

### Fase 1 — Motor de simulación: cambio de runner

- [x] 1.1 Instalar Jest 30, con `jest.config.js` y umbrales de cobertura (Art. 6.3). **Cambio respecto de lo previsto:** `jest-preset-angular` exige tener Angular instalado, así que hasta la fase 3 se usa `ts-jest`, que es la base de ese preset. Se usa `@jest/globals` con imports explícitos en lugar de `@types/jest`.
- [x] 1.2 Renombrar `engine.test.ts` → `engine.spec.ts` y reemplazar los imports de `vitest` por `@jest/globals`. **No se cambió ninguna aserción.**
- [x] 1.3 Verificar que pasa la misma cantidad de pruebas que en la línea de base: pasan 19 de 19, incluidas las de balance y límites con 200 partidas aleatorias. La cobertura de ramas daba 86 % (< 90 %, Art. 6.3), así que se agregaron 4 pruebas de casos límite: río seco con y sin pedido, sector con necesidad 0 y `summarize([])`. Total: 23 pruebas, 100 % de líneas y de ramas.
- [x] 1.4 Agregar una prueba de arquitectura, `src/domain-boundaries.spec.ts`, que falla si el dominio importa `@angular`, `rxjs`, `react` o usa globales del DOM (Art. 4.1). Se escribió con TDD: primero se vieron fallar las pruebas del detector.
- [x] 1.5 Actualizar `motor-simulacion.md`: la línea "Pruebas" pasa a `engine.spec.ts`. Los requerimientos no cambian.

Durante la transición, `npm test` corre `vitest run` (solo `*.test.ts`, con `test.include` en `vite.config.ts`) y después `jest --coverage`. `tsconfig.spec.json` revisa los tipos de los `*.spec.ts`.

**Criterio de salida:** criterios 1 a 12 del motor siguen "Cumplido (prueba)" y la cobertura del motor es ≥ 95 %. **Cumplido:** 23 pruebas en verde y 100 % de líneas y ramas en `src/engine/`.

### Fase 2 — Tutor por reglas y estado de partida: cambio de runner

- [x] 2.1 `explain.test.ts` → `explain.spec.ts` y `game.test.ts` → `game.spec.ts`, solo con el cambio de imports. Pasan 12 de 12 y 6 de 6, igual que en la línea de base.
- [x] 2.2 Verificar la prueba de "ningún número sin respaldo" en 200 partidas aleatorias (req. 8 del tutor): pasa.
- [x] 2.3 Extender la prueba de arquitectura de 1.4 a `src/tutor/` y `src/game/`, con umbrales de cobertura para las dos carpetas.
- [x] 2.4 Quitar Vitest de las dependencias y de `vite.config.ts`. `npm test` pasa a ser `jest --coverage`.

**Cambio respecto de lo previsto:** la cobertura de ramas del tutor daba 81 % (< 90 %, Art. 6.3). Se agregaron 5 pruebas de casos límite sin tocar las existentes: desmarcar una compra en borrador, un año en que el acuífero no cambia, `deliveredSharePercent` sin pedido, `ungroundedNumbers` con datos infinitos o sin números, y `fmt` con −0. Total del dominio: 55 pruebas, 100 % de líneas y de ramas.

**Criterio de salida:** criterios 1 a 8 del tutor siguen "Cumplido (prueba)" y las pruebas del reducer pasan sin cambios. **Cumplido.**

### Fase 3 — Toolchain Angular (la UI queda vacía temporalmente)

- [ ] 3.1 Quitar `react`, `react-dom`, `@types/react*`, `@vitejs/plugin-react`, `vite.config.ts`, `src/main.tsx`, `src/App.tsx`, `src/ui/` y el plugin `react` de `.oxlintrc.json`. El código React queda en la etiqueta `react-final` como referencia.
- [ ] 3.2 Instalar Angular 21.x (`core`, `common`, `compiler`, `platform-browser`), `@angular/build`, `@angular/cli` y `@angular/compiler-cli`, y bajar TypeScript a `~5.9`. Instalar `jest-preset-angular` y `jsdom`, y pasar `jest.config.js` a ese preset.
- [ ] 3.3 Crear `angular.json`, `tsconfig.json`, `tsconfig.app.json` y `tsconfig.spec.json` según la configuración que genera `ng new` (strict, `strictTemplates`), con presupuesto de bundle (Art. 6.7).
- [ ] 3.4 Crear `src/main.ts` y `src/app/app.config.ts` con `provideZonelessChangeDetection()` y `provideBrowserGlobalErrorListeners()`, sin router (una sola pantalla).
- [ ] 3.5 Mover `index.html` a `src/index.html`, conservando `lang="es"`, la meta descripción y Google Fonts (Barlow).
- [ ] 3.6 Instalar Tailwind v4 (`tailwindcss`, `@tailwindcss/postcss`, `.postcssrc.json`) y declarar en `@theme` los tokens de `src/index.css`.
- [ ] 3.7 Scripts: `start` (`ng serve`), `build` (`ng build`), `test` (`jest`), `test:coverage`, `lint` (`oxlint`) y `typecheck` (`tsc -p tsconfig.app.json --noEmit` + spec).

**Criterio de salida:** `npm run build` genera una app vacía, y `npm test` y `npm run lint` pasan.

### Fase 4 — Servicios con Signals (TDD)

Para cada servicio: primero las pruebas en rojo, después la implementación.

- [ ] 4.1 `GameStore` (`src/app/core/game.store.ts`):
  - `private readonly state = signal<Game>(newGame(params))`
  - `readonly game = state.asReadonly()`
  - `readonly preview = computed(() => preview(state(), params, scenario))`
  - `readonly creditsLeft`, `readonly isLastYear`, `readonly currentYear` como `computed`
  - `dispatch(action: Action)` → `state.update(g => reduce(g, action, params, scenario))`
  - Pruebas: `[tablero#2]` cambiar la cobertura recalcula la vista previa; `[tablero#3]`/`[tablero#4]` comprar respeta los créditos; `[tablero#5]` simular avanza el año; `[tablero#6]`/`[tablero#7]` reiniciar conserva las dos últimas partidas.
- [ ] 4.2 `TutorService` (`src/app/core/tutor.service.ts`): `advice = computed(() => advise(preview))` y `lastYear = computed(() => explainYear(...))`. Prueba: ningún texto expuesto contiene números sin respaldo (`ungroundedNumbers`).
- [ ] 4.3 `DEFAULT_PARAMS` y `DEFAULT_SCENARIO` se proveen con `InjectionToken`, para poder usar escenarios de prueba.
- [ ] 4.4 Actualizar `tablero.md`, sección **Diseño**: "El estado vive en `GameStore` (Signals), que delega en el reducer puro de `src/game/`". Los requerimientos no cambian.

**Criterio de salida:** cobertura de `src/app/core` ≥ 90 % y ninguna cuenta del motor reimplementada.

### Fase 5 — Tablero en Angular (TDD, un componente por vez)

Orden: de las hojas hacia la raíz. Cada componente sigue esta secuencia: prueba con TestBed que cita el criterio → componente standalone OnPush → estilos Tailwind → comparación con la captura de la fase 0.

| # | Componente | Reemplaza | Criterios |
|---|---|---|---|
| 5.1 | `shared/icon` (un componente con `name` input) | `ui/icons.tsx` | — |
| 5.2 | `shared/fmt.pipe` (envuelve `fmt()`) | uso de `fmt` en JSX | Art. 5.8 |
| 5.3 | `features/board/header` | encabezado de `App.tsx` | tablero#1 |
| 5.4 | `features/board/basin-map` | `BasinMap` | tablero#1, #2 |
| 5.5 | `features/board/aquifer` | `Aquifer` | tablero#1, #2 |
| 5.6 | `features/board/allocation` | `Allocation` | tablero#2, #9 |
| 5.7 | `features/board/technologies` | `Technologies` | tablero#3, #4 |
| 5.8 | `features/board/tutor-panel` | pie de `Board` | tablero#5, tutor#1–7 |
| 5.9 | `features/board/board` (composición + botón "Simular año") | `Board` | tablero#5 |
| 5.10 | `features/summary/summary` | `Summary` | tablero#6, #7 |
| 5.11 | `app` (raíz: tablero o resumen con `@if`) | `App.tsx` | tablero#1–7 |

Reglas de esta fase:
- Los sliders usan `input[type=range]` nativo con `label` asociado. La variable CSS `--fill` se enlaza con `[style.--fill]`.
- Los componentes leen `GameStore`/`TutorService` con `inject()` y llaman a `store.dispatch(...)`. Ninguno recibe `dispatch` como input.
- Los textos y la clase de cada banda de estrés salen de `labels.ts` y de un mapeo en la plantilla. No se escriben cuentas.

**Criterio de salida:** partida completa de 5 años jugable y paridad visual con las capturas de la fase 0.

### Fase 6 — Verificación de paridad y cierre

- [ ] 6.1 `npm test` con cobertura dentro de los umbrales, `npm run lint` y `npm run build` dentro del presupuesto.
- [ ] 6.2 Prueba manual en el navegador: tablero#1 a #8 (incluido el ancho de 375 px), comparada con las capturas.
- [ ] 6.3 Prueba solo con teclado de una partida completa (tablero#9). Si pasa, el criterio pasa de "sin prueba completa" a "Verificado".
- [ ] 6.4 Buscar restos de React en el repo: `grep -rE "react|jsx|tsx|useState|useReducer" src package.json` no devuelve nada.
- [ ] 6.5 Actualizar `README.md` (stack, comandos, estructura) y la línea "Código:" de cada spec.
- [ ] 6.6 PR de `feat/angular` → `main` con la tabla de criterios antes y después.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Node 20 bloquea Angular 22 | Fijar 21.x; subir a Node 22 en un plan aparte (ADR 001) |
| Jest no es el runner por defecto de Angular 21 (lo es Vitest) | Jest se configura fuera de `ng test` con `jest-preset-angular` (ADR 003) |
| Pérdida de paridad visual al pasar 1000 líneas de CSS a Tailwind | Tokens primero (fase 3.6) y comparación por componente con capturas |
| Formato de números distinto entre la UI y el tutor | Pipe `fmt` único (Art. 5.8) |
| Reescribir sin querer lógica del reducer en el servicio | Prueba de arquitectura y revisión: el servicio solo llama a `reduce`/`preview` |

## Fuera de alcance

- Tutor con IA y su evaluación automática.
- Cambios de reglas o parámetros del motor (revisión científica pendiente).
- Router, PWA o modo sin conexión.
