# Spec: Tutor por reglas

**Estado**: Implementada

## Objetivo

Explicarle al estudiante qué pasó en el año que acaba de simular y avisarle qué pasaría con la
decisión que está armando, sin usar IA. Es el modo gratuito del juego, el respaldo cuando no hay
conexión y la línea de base contra la que se va a comparar el tutor con IA.

## Contexto

- El motor entrega por año un resultado con valores intermedios y reglas activadas
  (`YearResult`).
- Decisión de proyecto: el motor calcula y el tutor solo interpreta.
- Código: `src/tutor/`.

## Requerimientos

1. **WHEN** se simula un año **THEN** el tutor devuelve una explicación en español con: cuánta agua
   trajo el río, qué se entregó y de dónde salió, cuánto se recargó el acuífero, cómo quedó el
   acuífero y el nivel de estrés.
2. **WHEN** hubo bombeo **THEN** la explicación dice cuánto se bombeó y por qué.
3. **WHEN** se alcanzó el tope de bombeo o se agotó el acuífero **THEN** la explicación dice que
   los sectores recibieron menos de lo pedido y por qué.
4. **WHEN** quedó agua en el río **THEN** la explicación dice cuánta quedó y cuánta recargó el
   acuífero.
5. **WHEN** hay tecnologías instaladas **THEN** la explicación compara el estrés con el que habría
   sin ellas.
6. **WHEN** el riego por goteo está instalado **THEN** la explicación menciona que el riego
   devuelve menos agua al acuífero.
7. **WHEN** el estudiante está armando su decisión **THEN** el tutor da un aviso de una frase sobre
   la consecuencia principal de esa decisión.
8. **WHEN** el tutor escribe cualquier texto **THEN** todo número que aparece coincide con un
   dato del resultado del motor.

## Diseño

- `facts(result)` reduce el resultado del año a una lista plana de datos con nombre, incluidos
  los derivados que el texto necesita (total pedido, cambio del acuífero, coberturas en
  porcentaje). El tutor por reglas y el tutor con IA van a recibir la misma lista.
- `explainYear(result)` y `advise(preview)` arman frases a partir de esos datos.
- `ungroundedNumbers(texto, datos)` devuelve los números del texto que no están en los datos. Es
  la verificación del requerimiento 8 y se va a reutilizar para evaluar al tutor con IA.

## Tareas

- [x] `facts`, formato de números en español
- [x] `explainYear` y `advise`
- [x] `ungroundedNumbers` y prueba sobre partidas completas
- [ ] Revisión pedagógica de los textos

## Criterios de Aceptación

| # | Criterio | Estado |
|---|---|---|
| 1–6 | Contenido de la explicación según el caso | Cumplido (prueba) |
| 7 | Aviso antes de simular | Cumplido (prueba) |
| 8 | Ningún número sin respaldo, en 200 partidas aleatorias | Cumplido (prueba) |
| — | Textos revisados por un docente | Pendiente |
