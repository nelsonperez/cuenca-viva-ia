# Spec: Motor de simulación de la cuenca

**Estado**: Implementada

## Objetivo

Calcular, año por año, qué pasa con el agua de la cuenca según lo que decide el estudiante. Es la
única fuente de números del juego: la pantalla los muestra y el tutor los explica.

## Contexto

- Diseño del modelo: borrador v0.2 (reglas, parámetros provisionales y preguntas abiertas).
- Todas las cantidades están en unidades educativas (UE). Nada está calibrado con datos reales.
- Código: `src/engine/`. Pruebas: `src/engine/engine.test.ts`.

## Requerimientos

1. **WHEN** se juega un año **THEN** el agua del río se usa primero y el faltante se bombea del
   acuífero, hasta el tope de bombeo y hasta lo que el acuífero tenga.
2. **WHEN** lo pedido supera lo que el río y el bombeo pueden dar **THEN** los tres sectores se
   reducen en la misma proporción.
3. **WHEN** queda agua del río sin repartir **THEN** una fracción recarga el acuífero y el resto
   sale de la cuenca.
4. **WHEN** se entrega agua a la agricultura **THEN** una fracción vuelve al acuífero; con riego
   por goteo esa fracción es menor.
5. **WHEN** se pide comprar una tecnología que alcanza con los créditos y no está instalada
   **THEN** se instala, baja la necesidad de su sector desde ese año y no se pierde.
6. **WHEN** se pide comprar una tecnología que no alcanza o ya está instalada **THEN** se ignora.
7. **WHEN** termina un año **THEN** se suman los créditos anuales a los no gastados.
8. **WHEN** se calcula un año **THEN** el resultado incluye el estrés hídrico real y el que habría
   sin tecnologías con la misma cobertura por sector.
9. **WHEN** se calcula cualquier año **THEN** se cumple el balance: acuífero inicial más agua del
   río es igual a acuífero final más consumo más salida de la cuenca.
10. **WHEN** se calcula cualquier año **THEN** el acuífero queda entre cero y su capacidad.
11. **WHEN** se pide más que la necesidad de un sector, o un valor negativo **THEN** se ajusta al
    rango válido.
12. **WHEN** se intenta jugar después del último año **THEN** el motor falla con un error.

## Diseño

- Funciones puras: `step(estado, decisión, parámetros, escenario)` devuelve estado nuevo y
  resultado. No hay estado global ni aleatoriedad, así dos partidas con las mismas decisiones dan
  lo mismo.
- El resultado de cada año incluye valores intermedios y la lista de reglas activadas. Es el
  contrato con el tutor.
- Parámetros y escenario viven en `params.ts`, separados de las reglas.

## Tareas

- [x] Tipos, parámetros y escenario de cinco años
- [x] `step`, `playGame`, `summarize`, `balanceError`
- [x] Pruebas de reglas, balance con partidas aleatorias y estrategias de referencia
- [ ] Revisión científica de reglas y parámetros

## Criterios de Aceptación

| # | Criterio | Estado |
|---|---|---|
| 1 | Río primero, bombeo después, con tope | Cumplido (prueba) |
| 2 | Recorte proporcional | Cumplido (prueba) |
| 3 | Recarga desde el río | Cumplido (prueba) |
| 4 | Retorno de riego, menor con goteo | Cumplido (prueba) |
| 5–7 | Compras y créditos | Cumplido (prueba) |
| 8 | Estrés con y sin tecnologías | Cumplido (prueba) |
| 9–10 | Balance y límites, 200 partidas aleatorias | Cumplido (prueba) |
| 11–12 | Ajuste de pedidos y fin de partida | Cumplido (prueba) |
| — | Validación científica del modelo | Pendiente |
