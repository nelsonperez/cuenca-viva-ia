# Checklist de verificación constitucional

Se completa **antes de escribir código** para cada plan (Art. 7.2) y se repite en la descripción de cada PR. Cualquier "no" frena el trabajo hasta corregir el plan o aprobar un ADR.

## Antes de implementar (plan)

- [ ] Leí la constitución vigente y las specs afectadas.
- [ ] Todo cambio de comportamiento tiene un requerimiento WHEN/THEN y un criterio en `specs/`.
- [ ] No se agregan dependencias, o cada una está justificada con su impacto en el bundle (2.7).
- [ ] No aparece nada de React: paquetes, `.tsx`/`.jsx`, `useXxx` (3).
- [ ] El dominio no importa `@angular`, `rxjs` ni el DOM (4.1).
- [ ] Ninguna cuenta del motor ni texto del tutor se reimplementa en servicios o componentes (4.2, 4.3, 4.5).
- [ ] Cada tarea que agrega conducta empieza por una prueba que cita el criterio (6.1, 6.2).
- [ ] Las excepciones técnicas tienen un ADR aceptado (9.2).

## Al revisar el código (PR)

- [ ] Componentes standalone, `OnPush`, sin `NgModule` (5.1, 5.2).
- [ ] Estado con `signal`/`computed`; `effect` solo para sincronizar con el exterior (5.3).
- [ ] `input()`/`output()`/`model()` e `inject()`; sin `@Input`, `@Output` ni inyección por constructor (5.4, 5.5).
- [ ] `@if`/`@for` con `track`/`@switch`; sin `*ngIf`/`*ngFor` (5.6).
- [ ] Sin RxJS para estado (5.7).
- [ ] Números con el pipe `fmt`; sin `DecimalPipe`, `PercentPipe` ni `toFixed` en plantillas (5.8).
- [ ] Textos en español rioplatense (5.9).
- [ ] Sin mutaciones dentro de signals (5.10).
- [ ] Colores y tipografía con tokens de `@theme`, sin valores sueltos (ADR 004).
- [ ] Controles nativos con `label`, avisos con `aria-live`, partida jugable con teclado (6.6).
- [ ] Cartel de datos simulados y nota legal visibles (1.3).

## Evidencia adjunta (obligatoria)

- [ ] Salida de `npm test` con cobertura dentro de los umbrales (6.3).
- [ ] Salida de `npm run lint`.
- [ ] Salida de `npm run build`, dentro del presupuesto (6.7).
- [ ] Tabla de criterios de la spec actualizada.
- [ ] Tareas del plan marcadas.
