import { useReducer } from 'react'
import { DEFAULT_PARAMS, DEFAULT_SCENARIO } from './engine/params'
import { newGame, preview, reduce } from './game/game'
import type { Action, Game } from './game/game'
import { YEAR_NAME } from './tutor/labels'
import { Board } from './ui/Board'
import { Summary } from './ui/Summary'
import { DropIcon } from './ui/icons'

const params = DEFAULT_PARAMS
const scenario = DEFAULT_SCENARIO

const reducer = (game: Game, action: Action) => reduce(game, action, params, scenario)

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

export default function App() {
  const [game, dispatch] = useReducer(reducer, params, newGame)
  const drafted = preview(game, params, scenario)
  const total = scenario.years.length
  const current = Math.min(game.basin.year, total - 1)

  return (
    <div className="app">
      <header className="top">
        <div className="top-inner">
          <div className="brand">
            <div className="logo">
              <DropIcon size={24} />
            </div>
            <div>
              <h1>Cuenca Viva IA</h1>
              <span className="muted small">Cuenca del río San Juan · Valle de Tulum</span>
            </div>
          </div>

          <div className="turn">
            <span>
              {drafted
                ? `Año ${current + 1} de ${total} · ${capitalize(YEAR_NAME[drafted.yearType])}`
                : 'Partida terminada'}
            </span>
            <div className="steps" aria-hidden="true">
              {scenario.years.map((_, index) => (
                <span
                  key={index}
                  className={
                    index < game.basin.year ? 'done' : index === game.basin.year ? 'now' : ''
                  }
                />
              ))}
            </div>
          </div>

          <span className="disclaimer">Datos simulados · Uso educativo</span>
        </div>
      </header>

      {drafted ? (
        <Board
          game={game}
          preview={drafted}
          params={params}
          scenario={scenario}
          dispatch={dispatch}
        />
      ) : (
        <Summary
          finished={game.finished}
          params={params}
          onRestart={() => dispatch({ type: 'restart' })}
        />
      )}

      <p className="legal">
        Modelo educativo con cantidades de ejemplo en unidades educativas (UE). No representa
        mediciones reales ni sirve para decidir sobre el recurso. Pendiente de revisión científica.
      </p>
    </div>
  )
}
