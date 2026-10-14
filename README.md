# Cuenca Viva IA

Juego web educativo para estudiantes secundarios: administrar durante cinco años el agua de una cuenca entre agricultura, ciudad y minería, invertir en tecnologías de ahorro, atravesar sequías y comparar dos estrategias. Un tutor de IA explica las consecuencias de cada decisión.

Propuesta para el Desafío 2 de la hackatón Hackeando la Minería (Ciclo Pilares San Juan, 2026).

## Estado

En construcción. Hoy existe el motor de simulación con sus pruebas; faltan la interfaz y el tutor.

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

## Comandos

```bash
npm install
npm test          # pruebas del motor
npm run typecheck
npm run dev
```

## Qué verifican las pruebas

- Balance de agua en cada año: lo que entra es igual a lo que queda más lo consumido más lo que sale de la cuenca.
- El acuífero nunca es negativo ni supera su capacidad, con 200 partidas aleatorias.
- Tres estrategias de referencia dan los resultados documentados en el diseño del modelo.
- Las tecnologías bajan el estrés hídrico bajo la misma cobertura.
- El riego por goteo también reduce lo que el riego devuelve al acuífero.
