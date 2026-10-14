import type { CSSProperties, ReactNode } from 'react'
import { purchase } from '../engine/engine'
import { SECTORS, TECHNOLOGIES } from '../engine/types'
import type { Params, Scenario, Sector, Technology, YearResult, YearType } from '../engine/types'
import type { Action, Game } from '../game/game'
import { advise, explainYear } from '../tutor/explain'
import { BAND_NAME, YEAR_NAME, fmt } from '../tutor/labels'
import {
  AgroIcon,
  ArrowDownIcon,
  CityIcon,
  DripIcon,
  MineIcon,
  MountainIcon,
  PlayIcon,
  RecycleIcon,
  RiverIcon,
  TrendDownIcon,
  TutorIcon,
  WrenchIcon,
} from './icons'

const SECTOR_UI: Record<Sector, { title: string; subtitle: string; icon: ReactNode }> = {
  agr: { title: 'Agricultura', subtitle: 'Polo agrícola', icon: <AgroIcon /> },
  mun: { title: 'Ciudad', subtitle: 'Gran San Juan', icon: <CityIcon /> },
  min: { title: 'Minería', subtitle: 'Complejo minero', icon: <MineIcon /> },
}

const TECHNOLOGY_UI: Record<Technology, { title: string; effect: string; icon: ReactNode }> = {
  drip: { title: 'Riego por goteo', effect: 'de necesidad del agro', icon: <DripIcon size={28} /> },
  leaks: { title: 'Reparar fugas', effect: 'de necesidad de la ciudad', icon: <WrenchIcon size={28} /> },
  recirc: {
    title: 'Recirculación minera',
    effect: 'de necesidad de la minería',
    icon: <RecycleIcon size={28} />,
  },
}

const MELT: Record<YearType, string> = {
  normal: 'Deshielo medio',
  drought: 'Deshielo bajo',
  extremeDrought: 'Deshielo muy bajo',
  wet: 'Deshielo alto',
}

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const percent = (value: number, max: number) => Math.max(0, Math.min(100, (value / max) * 100))
const width = (value: number): CSSProperties => ({ width: `${value}%` })

interface Props {
  game: Game
  preview: YearResult
  params: Params
  scenario: Scenario
  dispatch: (action: Action) => void
}

export function Board({ game, preview, params, scenario, dispatch }: Props) {
  const lastYear = game.history.at(-1)
  const isLast = game.basin.year === scenario.years.length - 1
  const advice = advise(preview)

  return (
    <main className="board">
      <div className="cols">
        <section className="stack">
          <BasinMap preview={preview} />
          <Aquifer preview={preview} params={params} />
        </section>
        <section className="stack">
          <Allocation game={game} preview={preview} dispatch={dispatch} />
          <Technologies game={game} preview={preview} params={params} dispatch={dispatch} />
        </section>
      </div>

      <footer className="foot">
        <div className="card tutor">
          <div className="tutor-avatar">
            <TutorIcon size={30} />
          </div>
          <div className="tutor-body">
            <h2 className="tutor-title">Tutor</h2>
            {lastYear && (
              <details className="tutor-last" open>
                <summary>Qué pasó el año pasado</summary>
                <ul>
                  {explainYear(lastYear).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </details>
            )}
            <p className={`tip tip-${advice.tone}`} aria-live="polite">
              {advice.text}
            </p>
          </div>
        </div>
        <div className="play-wrap">
          <button type="button" className="play" onClick={() => dispatch({ type: 'simulate' })}>
            <PlayIcon />
            <span>{isLast ? 'Cerrar partida' : 'Simular año'}</span>
          </button>
          <span className="hint">
            {isLast
              ? 'Último año de la partida'
              : `Sigue: ${YEAR_NAME[scenario.years[game.basin.year + 1].type]}`}
          </span>
        </div>
      </footer>
    </main>
  )
}

function BasinMap({ preview }: { preview: YearResult }) {
  return (
    <div className="card">
      <div className="card-head">
        <h2>Mapa conceptual de la cuenca</h2>
        <span className="muted">Oeste → Este</span>
      </div>

      <div className="source-row">
        <div className="node node-mountain">
          <MountainIcon size={32} />
          <div>
            <strong>Cordillera</strong>
            <span className="melt">{MELT[preview.yearType]}</span>
          </div>
        </div>
        <span className="arrow" aria-hidden="true">
          →
        </span>
        <div className="node node-river">
          <RiverIcon size={32} />
          <div>
            <strong>Río San Juan</strong>
            <span>Trae {fmt(preview.inflow)} UE este año</span>
          </div>
        </div>
      </div>

      <div className="sector-row">
        {SECTORS.map((sector) => (
          <div key={sector} className={`sector sector-${sector}`}>
            <div className="sector-name">
              {SECTOR_UI[sector].icon}
              <span>{SECTOR_UI[sector].title}</span>
            </div>
            <span className="sector-value">{fmt(preview.delivered[sector])} UE</span>
            <div className="bar">
              <div className="bar-fill" style={width(preview.coverage[sector] * 100)} />
            </div>
            <span className="muted small">
              {fmt(preview.coverage[sector] * 100, 0)} % de su necesidad
            </span>
          </div>
        ))}
      </div>

      <div className="note">
        <ArrowDownIcon size={18} />
        <span>
          {preview.riverFlow > 0 ? (
            <>
              Quedan <strong>{fmt(preview.riverFlow)} UE</strong> en el río:{' '}
              <strong>+{fmt(preview.riverRecharge)}</strong> infiltran en el cono aluvial.
            </>
          ) : (
            <>No queda agua en el río: su cauce no recarga el acuífero este año.</>
          )}
        </span>
      </div>
    </div>
  )
}

function Aquifer({ preview, params }: { preview: YearResult; params: Params }) {
  const level = percent(preview.groundBefore, params.groundMax)
  const projected = percent(preview.groundAfter, params.groundMax)
  const change = preview.groundAfter - preview.groundBefore
  const recharge = preview.riverRecharge + preview.irrigationReturn
  const tone = level > 40 ? 'ok' : level > 25 ? 'low' : 'critical'

  return (
    <div className="card">
      <div className="card-head">
        <h2>Acuífero subterráneo</h2>
        <span className="muted">Valle de Tulum</span>
      </div>
      <div className="aquifer">
        <div
          className="tank"
          role="img"
          aria-label={`Nivel del acuífero: ${fmt(level, 0)} por ciento de su capacidad`}
        >
          <div className={`tank-fill tank-${tone}`} style={{ height: `${level}%` }} />
          <div className="tank-projection" style={{ bottom: `${projected}%` }} />
          <div className="tank-label">{fmt(level, 0)}%</div>
        </div>
        <div className="aquifer-data">
          <div>
            <span className="eyebrow">Nivel del acuífero</span>
            <span className="big">{fmt(preview.groundBefore)} UE</span>
          </div>
          <div className="projection">
            <span className="dash" aria-hidden="true" />
            <span>
              Al cierre del año:{' '}
              <strong className={change >= 0 ? 'up' : 'down'}>
                {fmt(preview.groundAfter)} UE ({change >= 0 ? '+' : '−'}
                {fmt(Math.abs(change))})
              </strong>
            </span>
          </div>
          <div className="flows">
            <span>Recarga</span>
            <div className="bar">
              <div className="bar-fill fill-recharge" style={width(percent(recharge, 50))} />
            </div>
            <strong>+{fmt(recharge)}</strong>
            <span>Bombeo</span>
            <div className="bar">
              <div className="bar-fill fill-pump" style={width(percent(preview.pumping, 50))} />
            </div>
            <strong>−{fmt(preview.pumping)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

function Allocation({ game, preview, dispatch }: Pick<Props, 'game' | 'preview' | 'dispatch'>) {
  const requested = SECTORS.reduce((total, s) => total + preview.requested[s], 0)
  const over = preview.rules.includes('proportionalCut')

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Reparto del agua</h2>
          <span className="muted">Cuánto de su necesidad recibe cada sector este año</span>
        </div>
        <span className={`pill ${over ? 'pill-bad' : requested > preview.inflow ? 'pill-warn' : 'pill-ok'}`}>
          Pedido: {fmt(requested)} UE · Río: {fmt(preview.inflow)} UE
        </span>
      </div>

      {SECTORS.map((sector) => {
        const value = game.draft.coverage[sector]
        const id = `coverage-${sector}`
        return (
          <div key={sector} className={`srow sector-${sector}`}>
            <label htmlFor={id}>
              <span className="sector-badge">{SECTOR_UI[sector].icon}</span>
              <span>
                <strong>{SECTOR_UI[sector].title}</strong>
                <span className="muted small">
                  Necesita {fmt(preview.demand[sector])} UE
                </span>
              </span>
            </label>
            <input
              id={id}
              className="rng"
              type="range"
              min={0}
              max={100}
              step={5}
              value={value}
              style={{ '--fill': `${value}%` } as CSSProperties}
              onChange={(event) =>
                dispatch({ type: 'setCoverage', sector, value: Number(event.target.value) })
              }
            />
            <span className="srow-value">{value}%</span>
          </div>
        )
      })}

      <div className="stress">
        <div className="stress-head">
          <span>Estrés hídrico de la cuenca</span>
          <strong className={`band-${preview.stressBand}`}>
            {fmt(preview.stress, 2)} · {capitalize(BAND_NAME[preview.stressBand])}
          </strong>
        </div>
        <div className="meter">
          <div
            className={`meter-fill bg-${preview.stressBand}`}
            style={width(Math.min(100, preview.stress * 50))}
          />
          <div className="meter-mark" />
        </div>
        <div className="stress-foot">
          <span>
            Se usan {fmt(preview.riverUse + preview.pumping)} UE; el río trae {fmt(preview.inflow)}
            {preview.pumping > 0 && ` (${fmt(preview.pumping)} salen del acuífero)`}
          </span>
          <span>1,0 = se usa todo lo que trae el río</span>
        </div>
      </div>
    </div>
  )
}

function Technologies({ game, preview, params, dispatch }: Omit<Props, 'scenario'>) {
  const creditsLeft = purchase(game.basin, game.draft.buy, params).credits
  const helps = preview.stressWithoutTechnology > preview.stress

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>Tecnologías de ahorro</h2>
          <span className="muted">Lo que comprás queda instalado para el resto de la partida</span>
        </div>
        <span className="credits">Créditos: {creditsLeft}</span>
      </div>

      <div className="techs">
        {TECHNOLOGIES.map((technology) => {
          const spec = params.technologies[technology]
          const owned = game.basin.owned[technology]
          const selected = game.draft.buy.includes(technology)
          const locked = !owned && !selected && spec.cost > creditsLeft
          const status = owned
            ? 'Instalada'
            : selected
              ? 'Se instala este año'
              : locked
                ? 'Créditos insuficientes'
                : 'Comprar'
          return (
            <button
              key={technology}
              type="button"
              className={`tech ${owned ? 'is-owned' : selected ? 'is-on' : ''}`}
              aria-pressed={owned || selected}
              disabled={owned || locked}
              onClick={() => dispatch({ type: 'toggleBuy', technology })}
            >
              <span className="tech-top">
                {TECHNOLOGY_UI[technology].icon}
                <span className="tech-cost">{spec.cost} créditos</span>
              </span>
              <strong>{TECHNOLOGY_UI[technology].title}</strong>
              <span className="muted small">
                −{fmt(spec.saving * 100, 0)} % {TECHNOLOGY_UI[technology].effect}
              </span>
              <span className="chip">{status}</span>
            </button>
          )
        })}
      </div>

      <div className={`effect ${helps ? 'effect-on' : ''}`}>
        <TrendDownIcon size={20} />
        <span>
          {helps ? (
            <>
              Con las tecnologías el estrés baja de{' '}
              <strong>{fmt(preview.stressWithoutTechnology, 2)}</strong> a{' '}
              <strong>{fmt(preview.stress, 2)}</strong>.
            </>
          ) : (
            <>Todavía no hay tecnologías que bajen el estrés este año.</>
          )}
        </span>
      </div>
    </div>
  )
}
