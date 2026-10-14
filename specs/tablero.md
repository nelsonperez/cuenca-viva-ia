# Spec: Tablero de juego

**Estado**: Implementada (primera versión jugable)

## Objetivo

Una sola pantalla donde el estudiante juega los cinco años: ve cómo viene el año, reparte el agua,
compra tecnologías, ve la consecuencia antes de confirmar, simula y lee la explicación del tutor.
Al terminar puede jugar de nuevo y comparar las dos partidas.

## Contexto

- Diseño visual: boceto SimCuenca del autor (tablero claro, tipografía Barlow, azules para el
  agua, verdes para el agro, grises para la minería).
- Las bases piden que pueda usarse con el equipamiento de las escuelas: página liviana, sin
  servidor para jugar, usable en pantallas chicas.
- Código: `src/ui/`, `src/game/`.

## Requerimientos

1. **WHEN** se abre la página **THEN** se ve el año actual, su tipo, el agua que trae el río, el
   nivel del acuífero, los créditos y un cartel de que los datos son simulados.
2. **WHEN** el estudiante mueve un control de reparto **THEN** se actualizan en el momento el
   estrés hídrico, el bombeo, la recarga y la proyección del acuífero al cierre del año.
3. **WHEN** el estudiante marca una tecnología que le alcanza **THEN** baja la necesidad del
   sector y la pantalla muestra cuánto baja el estrés respecto de no tener tecnologías.
4. **WHEN** una tecnología no alcanza con los créditos **THEN** aparece bloqueada; **WHEN** ya
   está instalada **THEN** aparece como instalada y no se puede volver a comprar.
5. **WHEN** el estudiante aprieta "Simular año" **THEN** el motor calcula el año, la pantalla
   avanza al siguiente y el tutor explica lo que pasó.
6. **WHEN** termina el quinto año **THEN** se muestra el resumen de la partida y la opción de
   jugar de nuevo desde las mismas condiciones.
7. **WHEN** hay dos partidas terminadas **THEN** se muestran sus indicadores lado a lado.
8. **WHEN** la pantalla es angosta **THEN** las columnas se apilan y todo sigue siendo usable.
9. **WHEN** se usa solo el teclado **THEN** se puede jugar una partida completa.

### Enmienda pendiente (plan 001)

Aprobada el 2026-10-14; se aplica cuando se implemente [bienvenida-y-mision.md](bienvenida-y-mision.md):

1. **WHEN** el estudiante aprieta "Nueva partida" en la bienvenida **THEN** se ve el año actual, su tipo, el agua que trae el río, el nivel del acuífero, los créditos, la misión y un cartel de que los datos son simulados.

## Diseño

- El estado del juego vive en un reducer (`src/game/`): estado de la cuenca, historial de años,
  decisión en borrador y partidas terminadas.
- La vista previa es una llamada a `step` con la decisión en borrador, sin guardar el resultado.
  No hay una segunda implementación de las cuentas en la pantalla.
- Los controles de reparto van de 0 a 100 % de la necesidad de cada sector, así siguen teniendo
  sentido cuando una tecnología cambia esa necesidad.
- Sin cuentas ni servidor: todo corre en el navegador.

## Tareas

- [x] Reducer del juego y vista previa
- [x] Encabezado, mapa conceptual, acuífero, reparto, tecnologías, tutor y botón de simular
- [x] Resumen de partida y comparación de dos partidas
- [x] Diseño adaptable a pantallas angostas
- [ ] Prueba con estudiantes o un docente
- [ ] Revisión de accesibilidad completa

## Criterios de Aceptación

| # | Criterio | Estado |
|---|---|---|
| 1–5 | Partida jugable de punta a punta | Verificado a mano en el navegador |
| 6–7 | Resumen y comparación | Verificado a mano en el navegador |
| 8 | Pantalla angosta | Verificado a mano en el navegador |
| 9 | Teclado | Controles nativos; sin prueba completa |
