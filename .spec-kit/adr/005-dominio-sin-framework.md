# ADR 005 — El dominio queda sin framework; Signals solo en servicios

**Estado**: Aceptado · **Fecha**: 2026-10-14 · **Constitución**: Art. 1.1, 4, 5.3

## Contexto

`src/engine/`, `src/tutor/` y `src/game/` son TypeScript puro: no importan React y están cubiertos por pruebas de propiedad (balance de agua y números con respaldo en 200 partidas aleatorias). La spec del motor exige funciones puras, sin estado global y sin aleatoriedad. La constitución pide servicios inyectables con Signals para la lógica de la aplicación.

## Decisión

- El dominio **no se reescribe** y queda prohibido que importe Angular, RxJS o el DOM.
- La aplicación tiene dos servicios que envuelven al dominio:
  - `GameStore`: guarda el `Game` en un `signal`, expone `preview` como `computed(() => preview(...))` y aplica cada intención con `state.update(g => reduce(g, action, ...))`.
  - `TutorService`: expone `advise()` y `explainYear()` como `computed`.
- Los parámetros y el escenario se proveen con `InjectionToken` para poder probar con otros escenarios.

## Consecuencias

- Las pruebas actuales del dominio siguen siendo la red de seguridad de toda la migración.
- El dominio se puede reutilizar sin Angular (por ejemplo, en el evaluador del tutor con IA).
- `reduce` ya devuelve objetos nuevos, así que funciona sin cambios con la igualdad por referencia de los signals.
- Una prueba de arquitectura verifica que el dominio no importe nada del framework.

## Alternativas descartadas

- **Mover las reglas del reducer a métodos del servicio:** duplicaría una lógica ya probada y la acoplaría a Angular.
- **NgRx Signal Store:** agrega una dependencia para un estado que ya resuelve un reducer puro de 50 líneas.
