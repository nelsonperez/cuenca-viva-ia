# Cuenca Viva IA

Juego web educativo para estudiantes secundarios: administrar durante cinco años el agua de una cuenca entre agricultura, ciudad y minería, invertir en tecnologías de ahorro, atravesar sequías y comparar dos estrategias. Un tutor de IA explica las consecuencias de cada decisión.

Propuesta para el Desafío 2 de la hackatón Hackeando la Minería (Ciclo Pilares San Juan, 2026).

## Estado

Primera versión jugable: motor de simulación, tutor por reglas (sin IA) y tablero con comparación de dos partidas. Falta el tutor con IA y su evaluación automática.

El proyecto se trabaja con specs: cada pieza tiene su documento en `specs/` con requerimientos y criterios de aceptación. La constitución, los planes y las decisiones de arquitectura están en `.spec-kit/` (ver `.spec-kit/README.md`).

En curso: migración del frontend de React a Angular ([plan 000](.spec-kit/plans/000-migracion-react-angular.md)).

## Límites del modelo

- Es un modelo **educativo**. No predice el comportamiento de ninguna cuenca real ni sirve para decidir sobre el recurso.
- Todas las cantidades están en unidades educativas. Los parámetros son provisionales y no están calibrados con datos reales.
- La revisión científica y pedagógica está pendiente.

## Cómo está armado

- `src/engine/`: motor de simulación. Funciones puras, sin dependencias, que corren en el navegador.
  - `step(estado, decisión)` calcula un año y devuelve el estado nuevo, los valores intermedios y las reglas que se activaron.
  - El único depósito es el acuífero. El agua del río que no se reparte sigue por el cauce y una parte lo recarga.
  - Tres tecnologías de ahorro (riego por goteo, reparar fugas, recirculación minera) que se compran con créditos y quedan instaladas.
  - Cada año informa el estrés hídrico real y el que habría sin tecnologías.
  - El motor calcula; el tutor solo interpreta ese resultado.
- `src/tutor/`: tutor por reglas. Explica cada año y avisa la consecuencia de la decisión en borrador.
  - `facts(resultado)` es la lista de datos que el tutor puede mencionar.
  - `ungroundedNumbers(texto, datos)` detecta números que no salen del motor.
- `src/game/`: estado de la partida (reducer), vista previa y partidas terminadas.
- `src/app/`: aplicación Angular (componentes standalone, Signals, Tailwind). El tablero se está migrando desde React (plan 000); la última versión React está en la etiqueta `react-final`.

## Comandos

```bash
npm install
npm test          # pruebas (Jest) con cobertura
npm run typecheck
npm run lint
npm start         # servidor de desarrollo en http://localhost:4200
npm run build     # build de producción en dist/
```

## Qué verifican las pruebas

- Balance de agua en cada año: lo que entra es igual a lo que queda más lo consumido más lo que sale de la cuenca.
- El acuífero nunca es negativo ni supera su capacidad, con 200 partidas aleatorias.
- Tres estrategias de referencia dan los resultados documentados en el diseño del modelo.
- Las tecnologías bajan el estrés hídrico bajo la misma cobertura.
- El riego por goteo también reduce lo que el riego devuelve al acuífero.
- El tutor por reglas no escribe ningún número que el motor no haya producido, con 200 partidas aleatorias.
- El estado de la partida: vista previa, compras, avance de año y reinicio.
