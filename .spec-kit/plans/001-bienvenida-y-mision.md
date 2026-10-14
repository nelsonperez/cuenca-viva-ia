# Plan 001 — Bienvenida, misión y primer año guiado

**Estado**: En curso (fases 1 y 2 terminadas) · **Rama**: `feat/bienvenida` · **Specs afectadas**: `bienvenida-y-mision.md` (nueva), `tablero.md` (criterio 1) · **ADRs**: 005

## Objetivo

Implementar la spec [bienvenida-y-mision.md](../../specs/bienvenida-y-mision.md): una pantalla de bienvenida con misión, cinco tarjetas de "Cómo se juega", el primer año guiado por Hidro y medallas al final, sin cambiar el motor ni la lógica del tutor.

## Diagnóstico del punto de partida

Al empezar este plan ya existen, por el plan 000:
- `GameStore` y `TutorService` con Signals;
- los componentes del tablero y del resumen en Angular;
- `shared/icon` y el pipe `fmt`;
- los tokens de Tailwind.

| Pieza | Situación | Qué se hace |
|---|---|---|
| `GameSummary` (`src/engine/types.ts`) | Ya trae `finalGround`, `worstCoverage` y `meanStress` | Se reutiliza para las medallas |
| `params.ts` | Tiene los parámetros del modelo | Se agrega `GOALS` con los umbrales |
| `reduce` con `'restart'` (`src/game/game.ts`) | Conserva las partidas terminadas | Se reutiliza para "Jugar de nuevo" |
| `ungroundedNumbers` (`src/tutor/explain.ts`) | Verifica los números del tutor | Se reutiliza para los textos de Hidro, la guía y las medallas |
| `TutorIcon` / `shared/icon` | Ícono de robot | Pasa a ser la cara de Hidro |

## Verificación constitucional

| Artículo | Cómo lo cumple este plan | Estado |
|---|---|---|
| 1.2 / 7.4 | Spec nueva aprobada; la enmienda de tablero#1 queda registrada en `tablero.md` y se aplica al cerrar el plan | Cumple |
| 1.3 | La bienvenida muestra el cartel de datos simulados y la nota legal | Cumple |
| 2.7 | No se agregan dependencias; las animaciones son CSS | Cumple |
| 3 | Todo se hace en Angular | Cumple |
| 4.1 / 4.5 | `medals()` es pura y está en el dominio; ningún componente calcula medallas ni cuentas | Cumple |
| 4.2 | `GameStore` suma `screen` y `guideStep` como estado de la aplicación, sin reglas de negocio | Cumple |
| 5.3 / 5.10 | `screen`, `guideStep` y `medals` como `signal`/`computed` | Cumple |
| 5.8 / 7.6 | Números con `fmt` y verificados con `ungroundedNumbers` (bienvenida#16) | Cumple |
| 6.1 / 6.2 | Cada fase empieza por pruebas que citan `[bienvenida#N]` | Cumple |
| 6.6 | Tarjetas y guía navegables con teclado, `aria-live` y sin trampa de foco | Cumple |
| 6.7 | Se verifica el presupuesto del bundle al cerrar | Cumple |

## Fases

### Fase 1 — Medallas en el dominio (TDD)

- [x] 1.1 Pruebas en rojo para `medals(summary, params)` en `src/game/medals.spec.ts`: casos en el límite de cada umbral (bienvenida#11–13).
- [x] 1.2 `GOALS` en `src/engine/params.ts`, con los valores iniciales de la spec, y `medals()` en `src/game/medals.ts`.
- [x] 1.3 Prueba de calibración con las tres estrategias de referencia de `engine.spec.ts`: "todo sin tecnología" gana como mucho 1 medalla y "prudente" al menos 2. Ajustar los umbrales hasta que pase y anotar los valores finales en la spec.
- [x] 1.4 Prueba de propiedad: en 200 partidas aleatorias, cada medalla coincide con su condición sobre `summary`.

**Criterio de salida:** bienvenida#11–13 "Cumplido (prueba)" y cobertura del dominio ≥ 95 %. **Cumplido:** los valores iniciales ya cumplían la calibración y quedaron como definitivos. Se agregó `medalsSoFar()` para la franja de misión (bienvenida#14) y `medals.ts` tiene 100 % de cobertura.

### Fase 2 — Estado de pantallas y guía en `GameStore` (TDD)

- [x] 2.1 `screen = signal<'welcome' | 'howTo' | 'playing'>('welcome')`, con las intenciones `start()`, `showHowTo()` y `backToStart()`.
- [x] 2.2 `guideStep = signal<number | null>`: arranca en el paso 0 con el primer `start()`; avanza con `next()`, con `setCoverage` en el paso 2 y con `simulate` en el paso 5; se cierra con `skipGuide()`; no se activa después de `restart`.
- [x] 2.3 `medals = computed(...)` sobre la última partida terminada, y `missionStatus = computed(...)` sobre la vista previa para la franja del tablero (bienvenida#14).
- [x] 2.4 Pruebas del recorrido completo: bienvenida → partida guiada → resumen → jugar de nuevo (sin guía) → volver al inicio (las partidas se conservan).

**Criterio de salida:** bienvenida#2, #6, #7, #9 y #15 cubiertos en el store, con cobertura ≥ 90 %. **Cumplido:**
- Los pasos de la guía (zona y acción que los hace avanzar) viven en `core/guide.ts`; los textos de Hidro quedan para la UI.
- Simular antes del último paso cierra la guía, porque el jugador ya está jugando por su cuenta.
- "Nueva partida" con una partida terminada la reinicia y conserva las anteriores.
- `mission` usa `medalsSoFar` sobre la vista previa.
- 10 pruebas nuevas en `game.store.flow.spec.ts`.

### Fase 3 — Pantallas (TDD, un componente por vez)

| # | Componente | Criterios |
|---|---|---|
| 3.1 | `shared/hidro-bubble` (ícono + nombre + globo con `aria-live`) | — |
| 3.2 | `shared/medal` (ganada / en gris / en camino / en riesgo) | bienvenida#10, #14 |
| 3.3 | `features/welcome/welcome` (ilustración oeste → este, misión, botones) | bienvenida#1, #2 |
| 3.4 | `features/welcome/how-to-play` (5 tarjetas, flechas, puntos, saltear) | bienvenida#3, #4 |
| 3.5 | `features/guide/steps.ts` (datos de los pasos) + `features/guide/guide-overlay` | bienvenida#5–8 |
| 3.6 | Extender `features/summary/summary` con medallas y "Volver al inicio" | bienvenida#10, #15 |
| 3.7 | Franja de misión en `features/board/header` | bienvenida#14 |
| 3.8 | `app`: `@switch` sobre `screen()` y resumen cuando `preview()` es `null` | bienvenida#1, #2 |

Reglas de esta fase:
- Los textos de Hidro, de las tarjetas y de la guía se prueban con `ungroundedNumbers` contra los datos de la vista previa, los parámetros y el escenario (bienvenida#16).
- La guía marca la zona señalada con una clase y un atributo `data-guide`, sin mover el tablero. El oscurecimiento es puramente visual: el tablero sigue respondiendo.
- El panel "Tutor" del tablero pasa a llamarse "Hidro".

**Criterio de salida:** bienvenida#1–16 con pruebas que los citan.

### Fase 4 — Verificación y cierre

- [ ] 4.1 `npm test` con cobertura dentro de los umbrales, `npm run lint` y `npm run build` dentro del presupuesto.
- [ ] 4.2 Playwright: abrir la página, recorrer "Cómo se juega" solo con el teclado, comenzar, seguir la guía y jugar las dos partidas de la línea de base. Anotar las medallas que gana cada una.
- [ ] 4.3 Capturas a 1280 px y a 375 px de la bienvenida, una tarjeta, un paso de la guía y el resumen con medallas.
- [ ] 4.4 Aplicar la enmienda de tablero#1 en `tablero.md` y actualizar las tablas de criterios de las dos specs.
- [ ] 4.5 Actualizar el README y el índice de `.spec-kit/`.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Umbrales demasiado fáciles o imposibles | Calibración con las estrategias de referencia (1.3) y prueba con estudiantes |
| La guía tapa el tablero en 375 px | El globo se ubica arriba o abajo de la zona según el espacio; captura obligatoria en 375 px |
| La guía bloquea el teclado | Sin trampa de foco; Esc la cierra; prueba de teclado en 4.2 |
| Textos de Hidro con números inventados | `ungroundedNumbers` en las pruebas de 3.x |
| El estudiante saltea todo y sigue sin entender | La franja de misión queda visible todo el juego y "Cómo se juega" se puede abrir desde la bienvenida |

## Fuera de alcance

- Tutor con IA.
- Guardar progreso o medallas entre visitas (no hay cuentas; Art. 1.4).
- Sonidos, rankings o puntajes entre estudiantes.
