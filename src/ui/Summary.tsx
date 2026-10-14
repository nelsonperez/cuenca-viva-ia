import { TECHNOLOGIES } from '../engine/types'
import type { GameSummary, Params } from '../engine/types'
import type { FinishedGame } from '../game/game'
import { BAND_NAME, TECHNOLOGY_NAME, YEAR_NAME, fmt } from '../tutor/labels'

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

const ROWS: { label: string; value: (summary: GameSummary) => string }[] = [
  { label: 'Acuífero al final', value: (s) => `${fmt(s.finalGround)} UE` },
  {
    label: 'Cambio del acuífero',
    value: (s) => `${s.groundChange >= 0 ? '+' : '−'}${fmt(Math.abs(s.groundChange))} UE`,
  },
  { label: 'Bombeo total', value: (s) => `${fmt(s.totalPumping)} UE` },
  { label: 'Recarga total', value: (s) => `${fmt(s.totalRecharge)} UE` },
  { label: 'Estrés hídrico medio', value: (s) => fmt(s.meanStress, 2) },
  { label: 'Agricultura atendida', value: (s) => `${fmt(s.meanCoverage.agr * 100, 0)} %` },
  { label: 'Ciudad atendida', value: (s) => `${fmt(s.meanCoverage.mun * 100, 0)} %` },
  { label: 'Minería atendida', value: (s) => `${fmt(s.meanCoverage.min * 100, 0)} %` },
  {
    label: 'Tecnologías instaladas',
    value: (s) => {
      const installed = TECHNOLOGIES.filter((t) => s.owned[t]).map((t) => TECHNOLOGY_NAME[t])
      return installed.length > 0 ? installed.join(', ') : 'ninguna'
    },
  },
]

interface Props {
  finished: FinishedGame[]
  params: Params
  onRestart: () => void
}

export function Summary({ finished, params, onRestart }: Props) {
  const current = finished.at(-1)
  if (!current) return null
  const previous = finished.length > 1 ? finished[0] : null
  const change = current.summary.groundChange

  return (
    <main className="board">
      <div className="card summary">
        <h2>Partida terminada</h2>
        <p className="lead">
          El acuífero empezó en {fmt(params.groundInitial)} UE y terminó en{' '}
          <strong className={change >= 0 ? 'up' : 'down'}>
            {fmt(current.summary.finalGround)} UE
          </strong>
          .{' '}
          {previous
            ? 'Compará esta partida con la anterior: ¿qué decisión cambió el resultado?'
            : 'Jugá de nuevo con otras decisiones para comparar las dos estrategias.'}
        </p>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Indicador</th>
                {previous && <th scope="col">Partida anterior</th>}
                <th scope="col">{previous ? 'Esta partida' : 'Resultado'}</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {previous && <td>{row.value(previous.summary)}</td>}
                  <td>{row.value(current.summary)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Año por año</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Año</th>
                <th scope="col">Tipo</th>
                <th scope="col">Río</th>
                <th scope="col">Bombeo</th>
                <th scope="col">Recarga</th>
                <th scope="col">Acuífero</th>
                <th scope="col">Estrés</th>
              </tr>
            </thead>
            <tbody>
              {current.history.map((year) => (
                <tr key={year.year}>
                  <th scope="row">{year.year + 1}</th>
                  <td>{capitalize(YEAR_NAME[year.yearType])}</td>
                  <td>{fmt(year.inflow)}</td>
                  <td>{fmt(year.pumping)}</td>
                  <td>{fmt(year.riverRecharge + year.irrigationReturn)}</td>
                  <td>{fmt(year.groundAfter)}</td>
                  <td className={`band-${year.stressBand}`}>
                    {fmt(year.stress, 2)} · {BAND_NAME[year.stressBand]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button type="button" className="play play-inline" onClick={onRestart}>
          Jugar de nuevo
        </button>
        <p className="muted small">
          Las dos partidas empiezan con el mismo acuífero y atraviesan los mismos años.
        </p>
      </div>
    </main>
  )
}
