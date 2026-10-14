# Evidencia del plan 001: bienvenida, misión y primer año guiado

Tomada el 2026-10-14 con Playwright sobre `ng serve` en `feat/bienvenida`.

## Recorrido solo con teclado

| Paso | Resultado |
|---|---|
| Bienvenida → Tab hasta "Cómo se juega" → Enter | Se abren las tarjetas |
| Flechas → y ← | Cambian de tarjeta; los puntos marcan la actual |
| Tab hasta "¡A jugar!" en la última → Enter | Empieza la partida con la guía |
| Paso 1 (río) | El foco está en "Entendido" |
| Paso 2 (reparto) | El foco está en el slider de agricultura; una flecha mueve la barra y la guía avanza |
| Pasos 3 y 4 | El foco está en "Entendido"; el paso 3 ilumina el estrés y el acuífero |
| Paso 5 | El foco está en "Simular año"; Enter simula y la guía se cierra |
| "Jugar de nuevo" | La guía no se repite |
| "Volver al inicio" | Vuelve a la bienvenida |

Sin errores ni advertencias en la consola. Sin scroll horizontal a 375 px en ninguna pantalla. En el paso 2 a 375 px, el slider señalado queda por encima del globo de Hidro.

## Medallas de las partidas de la línea de base

| Partida | Acuífero final | Medallas |
|---|---|---|
| Todo al 100 %, sin compras | 20,5 UE | 1 de 3 (Nadie sin agua) |
| "Reparar fugas" y agricultura al 80 % | 68,2 UE | 1 de 3 (Nadie sin agua) |

Coinciden con la calibración de la spec. En el recorrido grabado, la partida 1 se jugó con la agricultura al 95 % por la flecha de la guía, y también ganó 1 de 3.

## Capturas

| Archivo | Qué muestra |
|---|---|
| [01-bienvenida.png](01-bienvenida.png) | Bienvenida a 1280 px |
| [02-como-se-juega.png](02-como-se-juega.png) | Tarjeta 3, "Cuidá el acuífero" |
| [03-guia-paso-1.png](03-guia-paso-1.png) | Guía, paso 1: el río |
| [04-guia-paso-3.png](04-guia-paso-3.png) | Guía, paso 3: estrés y acuífero iluminados |
| [05-resumen-medallas.png](05-resumen-medallas.png) | Resumen con 1 de 3 medallas y consejos de Hidro |
| [06-tablero-con-mision.png](06-tablero-con-mision.png) | Tablero con la franja de misión |
| [07-bienvenida-375px.png](07-bienvenida-375px.png) … [10-resumen-375px.png](10-resumen-375px.png) | Las mismas pantallas a 375 px |

## Para la revisión pedagógica

- En el año 1, la franja de misión suele mostrar las tres medallas "en camino", porque mide la partida como si terminara ese año. Las sequías llegan después. Conviene que un docente evalúe si eso orienta o confunde.
