# Spec: Bienvenida, misión y primer año guiado

**Estado**: Aprobada (en implementación) · **Plan**: [001](../.spec-kit/plans/001-bienvenida-y-mision.md)

## Objetivo

Que un estudiante que abre el juego por primera vez entienda qué tiene que hacer y para qué, sin que nadie se lo explique. El juego lo recibe con una misión, le muestra cómo se juega, lo acompaña durante el primer año y al final le reconoce lo que logró con medallas.

## Contexto

- Hoy el juego abre directo en el tablero. Ahí aparecen mapa, acuífero, tres controles de reparto, tecnologías y tutor, todo a la vez y sin un objetivo explícito.
- El tutor pasa a tener nombre y personaje: **Hidro**, con el ícono de robot que ya tiene. Su lógica (`explainYear`, `advise`) no cambia.
- Las medallas se calculan con el resumen de partida que ya produce el motor (`GameSummary`). Sus umbrales son parámetros educativos provisionales, igual que el resto del modelo.
- Cambia el criterio 1 del tablero (ver la enmienda pendiente en `tablero.md`).
- Se implementa en Angular después de la paridad del plan 000.
- Código: `src/game/medals.ts`, `src/app/features/welcome/`, `src/app/features/guide/`. Pruebas: `*.spec.ts` junto a cada archivo.

## Requerimientos

### Bienvenida

1. **WHEN** se abre la página **THEN** se ve la bienvenida con:
   - el nombre del juego y una frase que explica el rol del estudiante, con la cantidad de años tomada del escenario;
   - la misión, con las tres medallas;
   - Hidro saludando;
   - los botones "Nueva partida" y "Cómo se juega";
   - el cartel de datos simulados y la nota legal.
2. **WHEN** el estudiante aprieta "Nueva partida" **THEN** se ve el tablero en el año 1 y empieza la guía del primer año.

### Cómo se juega

3. **WHEN** el estudiante aprieta "Cómo se juega" **THEN** se muestran cinco tarjetas en orden: el río trae el agua, repartila, cuidá el acuífero, invertí en tecnología, simulá y aprendé. Cada una lleva el mismo ícono que ese elemento tiene en el tablero.
4. **WHEN** el estudiante está en las tarjetas **THEN** puede avanzar y retroceder con botones o con las flechas del teclado, ve en qué tarjeta está y puede saltearlas o empezar la partida desde cualquiera.

### Primer año guiado

5. **WHEN** empieza la primera partida **THEN** Hidro señala, de a una, cinco zonas del tablero: río, reparto, estrés y acuífero, tecnologías y botón "Simular año". En cada una explica qué es en una o dos frases.
6. **WHEN** la guía pide una acción (mover un control de reparto, simular el año) **THEN** avanza solo cuando el estudiante la hace. En los demás pasos avanza con "Entendido".
7. **WHEN** el estudiante aprieta "Saltear guía" o Esc **THEN** la guía se cierra y el tablero queda jugable.
8. **WHEN** la guía está activa **THEN** el tablero sigue funcionando y el foco va al control señalado, así se puede seguir solo con el teclado.
9. **WHEN** se juega una partida después de "Jugar de nuevo" **THEN** la guía no se repite.

### Misión y medallas

10. **WHEN** termina la partida **THEN** el resumen muestra, antes de las tablas, cuántas medallas se ganaron y cuáles. Las que faltan aparecen en gris, con una frase de Hidro sobre qué decisión las habría sumado.
11. **WHEN** se calcula la medalla "Acuífero a salvo" **THEN** se gana si el acuífero final es al menos el umbral `aquiferSafe` (fracción del acuífero inicial).
12. **WHEN** se calcula la medalla "Nadie sin agua" **THEN** se gana si la peor cobertura de cualquier sector en cualquier año es al menos el umbral `noOneWithout`.
13. **WHEN** se calcula la medalla "Cuenca en calma" **THEN** se gana si el estrés hídrico medio es menor que el umbral `calmBasin`.
14. **WHEN** se está jugando **THEN** el encabezado muestra la misión con las tres medallas y, para cada una, si con la decisión en borrador va "en camino" o "en riesgo".
15. **WHEN** el estudiante aprieta "Volver al inicio" en el resumen **THEN** se ve la bienvenida. Las partidas terminadas se conservan para la comparación.

### Reglas generales

16. **WHEN** la bienvenida, las tarjetas, la guía o el resumen muestran un número **THEN** el número sale del escenario, de los parámetros o del motor, y pasa la verificación `ungroundedNumbers`.

## Diseño

- `medals(summary, params)` es una función pura en `src/game/medals.ts`. Devuelve las tres medallas con su estado; no calcula nada que el motor no haya producido.
- Los umbrales viven en `src/engine/params.ts` como `GOALS`, provisionales. Se calibran con las estrategias de referencia de `engine.test.ts`:
  - "todo sin tecnología" gana 0 o 1 medalla;
  - "prudente" (acuífero final 98,4 UE y peor cobertura 85 %) gana al menos 2;
  - ganar las 3 requiere combinar reparto prudente con tecnología.
- La pantalla visible se guarda en el estado de la aplicación (`welcome`, `howTo`, `playing`), no en el dominio. El resumen se sigue mostrando cuando el motor indica que la partida terminó.
- Los pasos de la guía son datos: zona señalada, texto armado con la vista previa y condición de avance.
- Valores calibrados (provisionales como el resto del modelo): `aquiferSafe = 0,9`, `noOneWithout = 0,8`, `calmBasin = 1,2`. Con ellos:

  | Estrategia | Acuífero final / inicial | Peor cobertura | Estrés medio | Medallas |
  |---|---|---|---|---|
  | Todo, sin tecnología | 0,21 | 0,95 | 1,46 | 1 |
  | Todo, con tecnología | 0,74 | 1 | 1,15 | 2 |
  | Prudente, sin tecnología | 0,50 | 0,85 | 1,31 | 1 |
  | Prudente, con tecnología | 0,98 | 0,85 | 1,03 | 3 |

- Un valor exactamente en el umbral cuenta (con tolerancia de punto flotante): elegir 80 % para un sector da "Nadie sin agua".
- La franja de misión usa `medalsSoFar(historia, vista previa)`: las medallas que se ganarían si la partida terminara con el año en borrador.

## Tareas

- [x] Calibrar los umbrales y fijar los valores en esta spec
- [x] `medals()` con pruebas
- [ ] Bienvenida y tarjetas de "Cómo se juega"
- [ ] Guía del primer año
- [ ] Medallas en el resumen y franja de misión en el tablero
- [ ] Prueba con estudiantes: ¿entienden qué hacer sin ayuda?
- [ ] Revisión pedagógica de los textos de Hidro

## Criterios de Aceptación

| # | Criterio | Estado |
|---|---|---|
| 1–2 | Bienvenida y "Nueva partida" | Pendiente |
| 3–4 | Tarjetas de "Cómo se juega", con teclado | Pendiente |
| 5–9 | Guía del primer año: avance, salteo, teclado, no se repite | Pendiente |
| 10 | Medallas en el resumen | Pendiente |
| 11–13 | Condición de cada medalla | Cumplido (prueba) |
| 14 | Franja de misión en el tablero | Pendiente |
| 15 | Volver al inicio conservando las partidas | Pendiente |
| 16 | Ningún número sin respaldo | Pendiente |
| — | Umbrales calibrados con las estrategias de referencia | Cumplido (prueba) |
| — | Un estudiante juega sin explicación previa | Pendiente |
