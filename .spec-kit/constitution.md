# Constitución de Cuenca Viva IA

**Versión**: 1.0.0 · **Vigente desde**: 2026-10-14 · **Ámbito**: todo el código, las pruebas, las specs y los planes del repositorio.

Esta constitución está por encima de cualquier spec, plan, tarea o pedido puntual. Si una spec o un plan la contradice, gana la constitución hasta que se enmiende (Art. 9).

---

## Art. 1 — Principios rectores

1.1. **El motor calcula; la pantalla muestra; el tutor interpreta.** Ninguna capa duplica las cuentas de otra.
1.2. **Las specs mandan.** Todo cambio de comportamiento nace en `specs/*.md` (requerimiento WHEN/THEN y criterio de aceptación) antes de existir en código.
1.3. **Modelo educativo.** Nunca se presenta un número como medición real. El cartel "Datos simulados · Uso educativo" y la nota legal son obligatorios en toda pantalla.
1.4. **Liviano y sin servidor.** El juego corre entero en el navegador, sin cuentas ni backend, y funciona en el equipamiento escolar y en pantallas angostas.

## Art. 2 — Stack obligatorio

2.1. **Framework**: Angular 19 o superior. Mientras el entorno sea Node 20, queda fijado en **Angular 21.x** (Angular 22 exige Node ≥ 22.22). Ver ADR 001.
2.2. **Lenguaje**: TypeScript en modo `strict`, en la versión que acepte la versión de Angular fijada (hoy `~5.9`). Queda prohibido `any` explícito; se usa `unknown` y se valida.
2.3. **Build**: Angular CLI con `@angular/build:application` (esbuild + servidor de desarrollo Vite). Queda prohibido agregar `@analogjs/vite-plugin-angular` u otro bundler sin un ADR aprobado (Art. 9). Ver ADR 002.
2.4. **Estilos**: TailwindCSS v4 integrado vía PostCSS (`@tailwindcss/postcss`). Los tokens de diseño (tipografía Barlow, azules del agua, verdes del agro, grises de la minería, bandas de estrés) se definen una sola vez en `@theme` dentro de `src/styles.css`. Ver ADR 004.
2.5. **Pruebas**: Jest con `jest-preset-angular`. Todo archivo de prueba se llama `*.spec.ts`. Ver ADR 003.
2.6. **Lint**: oxlint, sin el plugin `react`.
2.7. Queda prohibido agregar dependencias de producción sin justificarlas en un plan. Cada dependencia nueva debe declarar su impacto en el tamaño del bundle inicial.

## Art. 3 — Prohibición de React

3.1. Queda prohibido instalar o importar `react`, `react-dom`, `@types/react*`, `@vitejs/plugin-react`, `preact` o cualquier librería del ecosistema React.
3.2. Queda prohibido crear archivos `.jsx` o `.tsx`.
3.3. Queda prohibido reproducir patrones de React dentro de Angular: funciones `useXxx`, "custom hooks", render props, `children` como función, estado local imitando `useState`/`useReducer` dentro de componentes.
3.4. El CI y la revisión rechazan cualquier PR que viole este artículo, sin excepción.

## Art. 4 — Capas y dependencias

4.1. **Dominio** (`src/engine/`, `src/tutor/`, `src/game/`): TypeScript puro, sin estado global, sin aleatoriedad, sin efectos. Queda prohibido importar `@angular/*`, `rxjs` o cualquier API del DOM desde el dominio. Ver ADR 005.
4.2. **Servicios** (`src/app/core/`): clases `@Injectable({ providedIn: 'root' })` que guardan el estado de la aplicación en Signals y delegan **toda** regla de negocio a funciones del dominio. Un servicio nunca reimplementa una cuenta del motor ni un texto del tutor.
4.3. **Componentes** (`src/app/features/`, `src/app/shared/`): solo presentación e interacción. Leen signals de los servicios y les envían intenciones. Queda prohibida cualquier cuenta de negocio dentro de un componente o una plantilla. Solo se permiten transformaciones de presentación, como un porcentaje para el ancho de una barra.
4.4. Las dependencias van en una sola dirección: componentes → servicios → dominio. Nunca al revés.
4.5. La vista previa siempre es una llamada a `step` con la decisión en borrador (spec del tablero). Nunca existe una segunda implementación de las cuentas.

## Art. 5 — Reglas de Angular

5.1. **Siempre** componentes, directivas y pipes `standalone`. Queda prohibido `NgModule`.
5.2. **Siempre** detección de cambios zoneless (`provideZonelessChangeDetection`) y `ChangeDetectionStrategy.OnPush` en todo componente. Queda prohibido depender de `zone.js`.
5.3. **Siempre** Signals para la reactividad: `signal`, `computed`, `linkedSignal` y `effect` (este último solo para sincronizar con el exterior, nunca para derivar estado).
5.4. **Siempre** `input()`, `output()` y `model()`. Quedan prohibidos `@Input`, `@Output` y `EventEmitter` declarados a mano.
5.5. **Siempre** `inject()`. Queda prohibida la inyección por constructor.
5.6. **Siempre** control de flujo nativo (`@if`, `@for` con `track`, `@switch`). Quedan prohibidos `*ngIf`, `*ngFor` y `*ngSwitch`.
5.7. Queda prohibido usar RxJS para el estado local o del juego. Solo se permite en la frontera con APIs asíncronas externas, convertido con `toSignal`.
5.8. Los números se formatean **siempre** con `fmt()` de `src/tutor/labels.ts` (expuesto como pipe `fmt`). Quedan prohibidos `DecimalPipe`, `PercentPipe` y `toFixed` en plantillas. Así lo que muestra la pantalla coincide con lo que dice el tutor (spec del tutor, req. 8).
5.9. Los textos visibles van en español rioplatense, como en las specs.
5.10. Las mutaciones de estado se hacen siempre con objetos nuevos (`set`/`update` con objetos nuevos). Queda prohibido mutar un objeto dentro de un signal.

## Art. 6 — Calidad y TDD

6.1. **TDD obligatorio.** Toda conducta nueva o migrada sigue rojo → verde → refactor. La prueba que falla se escribe y se ve fallar **antes** del código de producción.
6.2. Cada criterio de aceptación de una spec tiene al menos una prueba que lo cita por número (por ejemplo `it('[tablero#2] …')`).
6.3. **Cobertura mínima** (umbral de Jest; si no se alcanza, la ejecución falla):
   - Dominio (`src/engine`, `src/tutor`, `src/game`): ≥ 95 % de líneas y ≥ 90 % de ramas.
   - Servicios (`src/app/core`): ≥ 90 % de líneas y ramas.
   - Componentes (`src/app/features`, `src/app/shared`): ≥ 80 % de líneas.
6.4. Siempre se conservan las pruebas de propiedad existentes: balance de agua y límites del acuífero en 200 partidas aleatorias, y ningún número sin respaldo del tutor en 200 partidas aleatorias. Queda prohibido borrarlas o debilitarlas.
6.5. Antes de cada commit tienen que pasar `npm test`, `npm run lint` y `npm run build`. Queda prohibido commitear en rojo o desactivar pruebas con `skip`/`only`.
6.6. **Accesibilidad**: se puede jugar una partida completa solo con el teclado, con controles nativos (`button`, `input[type=range]`, `details`), `label` asociados y `aria-live` en los avisos del tutor.
6.7. **Presupuesto**: el bundle inicial de producción no supera los 300 kB (advertencia) ni los 500 kB (error).

## Art. 7 — Reglas para la IA

7.1. **Siempre** leer esta constitución y las specs afectadas antes de proponer un plan técnico.
7.2. **Siempre** validar cada plan contra esta constitución **antes de escribir código**, con una sección "Verificación constitucional" que cite los artículos relevantes y marque cumple / no cumple (`.spec-kit/checklists/verificacion-constitucional.md`).
7.3. Si un pedido contradice la constitución, **detenerse**, citar el artículo y pedir una enmienda o una aclaración. Nunca se incumple "por esta vez".
7.4. **Nunca** cambiar un requerimiento ni un criterio de aceptación de una spec sin acuerdo explícito del responsable humano.
7.5. **Nunca** declarar una tarea terminada sin mostrar la salida real de pruebas, lint y build.
7.6. **Nunca** inventar números del modelo ni parámetros. Todo número de la UI o del tutor sale del motor.
7.7. Trabajar en pasos chicos y verificables, uno por tarea del plan, y actualizar el estado de la spec y del plan al cerrar cada uno.

## Art. 8 — Estructura del repositorio

```
AGENTS.md                        Punto de entrada para agentes de IA
.spec-kit/README.md              Cómo se trabaja con SDD en este repo
.spec-kit/constitution.md        Esta constitución
.spec-kit/plans/NNN-*.md         Planes técnicos numerados
.spec-kit/adr/NNN-*.md           Decisiones de arquitectura
.spec-kit/templates/             Plantillas de spec, plan y ADR
.spec-kit/checklists/            Checklists de verificación
specs/*.md                       Specs funcionales (WHEN/THEN)
src/engine/  src/tutor/  src/game/   Dominio puro (Art. 4.1)
src/app/core/                    Servicios con Signals
src/app/features/<feature>/      Componentes de cada pantalla
src/app/shared/                  Íconos, pipes y piezas reutilizables
```

## Art. 9 — Enmiendas

9.1. Solo una persona responsable del proyecto puede enmendar esta constitución, mediante un PR que cambie este archivo, incremente la versión (semver) y explique el motivo.
9.2. Toda excepción técnica (otro bundler, otra librería) requiere un ADR en `.spec-kit/adr/` aprobado antes de implementarla.
