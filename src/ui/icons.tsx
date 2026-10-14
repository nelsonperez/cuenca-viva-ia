import type { ReactNode } from 'react'

function Icon({ size = 22, children }: { size?: number; children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

type Props = { size?: number }

export const DropIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />
    <path d="M9 14.5a3 3 0 0 0 3 3" />
  </Icon>
)

export const MountainIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M2 20 9 8l4 6 2.5-3.5L22 20z" />
    <path d="M7.2 11 9 8l1.8 2.7-1 .8z" />
  </Icon>
)

export const RiverIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M2 8c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 13c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    <path d="M2 18c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  </Icon>
)

export const AgroIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 21V9" />
    <path d="M12 14c-4 0-6.5-2.5-6.5-6 3.5 0 6.5 2.5 6.5 6z" />
    <path d="M12 11c0-4 2.5-6.5 6.5-6.5 0 3.5-2.5 6.5-6.5 6.5z" />
  </Icon>
)

export const CityIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V10l5-3v14" />
    <path d="M10 21V4h9v17" />
    <path d="M13.5 8h2M13.5 12h2M13.5 16h2" />
  </Icon>
)

export const MineIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 20 13 11" />
    <path d="M5 6.5C9 3.5 15 3.5 20 7c-3.2.4-5.6 1.5-7.5 3.5C10.5 8.5 8 7.2 5 6.5z" />
  </Icon>
)

export const DripIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M3 6h18" />
    <path d="M7 6v3M12 6v3M17 6v3" />
    <path d="M7 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6zM12 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6zM17 12.5s1.5 1.6 1.5 2.6a1.5 1.5 0 0 1-3 0c0-1 1.5-2.6 1.5-2.6z" />
    <path d="M3 20h18" />
  </Icon>
)

export const WrenchIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />
  </Icon>
)

export const RecycleIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" />
    <path d="M20 3.5v5h-5" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" />
    <path d="M4 20.5v-5h5" />
  </Icon>
)

export const ArrowDownIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M12 4v14M6 12l6 6 6-6" />
  </Icon>
)

export const TrendDownIcon = (p: Props) => (
  <Icon {...p}>
    <path d="M4 7l6 6 4-4 6 6" />
    <path d="M20 10v5h-5" />
  </Icon>
)

export const TutorIcon = (p: Props) => (
  <Icon {...p}>
    <rect x="4" y="8" width="16" height="12" rx="3" />
    <path d="M12 4.5V8" />
    <circle cx="12" cy="3.5" r="1" />
    <circle cx="9" cy="13.5" r="1.2" />
    <circle cx="15" cy="13.5" r="1.2" />
    <path d="M9.5 17h5" />
  </Icon>
)

export const PlayIcon = ({ size = 26 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 4.5v15l13-7.5z" fill="currentColor" />
  </svg>
)
