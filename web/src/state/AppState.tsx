import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { initialTransactions, missions, type Category, type GoalId, type Tx } from '../data'

export type AppState = {
  userName: string
  balance: number
  hideBalance: boolean
  invitationDismissed: boolean
  onboardingStarted: boolean
  goals: GoalId[]
  completedMissions: number[]
  rewardEarned: number
  points: number
  completedChallenges: string[]
  redeemed: string[]
  transactions: Tx[]
  budgets: Partial<Record<Category, number>>
  proactiveInsightSeen: boolean
}

const STORAGE_KEY = 'aladin-clone-state-v1'

const defaultState: AppState = {
  userName: 'Dani',
  balance: 1_250_000,
  hideBalance: true,
  invitationDismissed: false,
  onboardingStarted: false,
  goals: [],
  completedMissions: [],
  rewardEarned: 0,
  points: 0,
  completedChallenges: [],
  redeemed: [],
  transactions: initialTransactions,
  budgets: {},
  proactiveInsightSeen: false,
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
  } catch {
    // storage tidak tersedia, pakai default
  }
  return defaultState
}

type Ctx = {
  state: AppState
  onboardingDone: boolean
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void
  completeMission: (id: number) => void
  addTransaction: (tx: Omit<Tx, 'id' | 'date'>) => Tx
  setTxCategory: (id: string, category: Tx['category']) => void
  reset: () => void
}

const AppStateContext = createContext<Ctx | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // abaikan
    }
  }, [state])

  const value = useMemo<Ctx>(() => {
    const update: Ctx['update'] = (patch) =>
      setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }))

    return {
      state,
      onboardingDone: state.completedMissions.length >= missions.length,
      update,
      completeMission: (id) =>
        setState((s) => {
          if (s.completedMissions.includes(id)) return s
          const reward = missions.find((m) => m.id === id)?.reward ?? 0
          return {
            ...s,
            onboardingStarted: true,
            completedMissions: [...s.completedMissions, id],
            rewardEarned: s.rewardEarned + reward,
            balance: s.balance + reward,
          }
        }),
      addTransaction: (tx) => {
        const full: Tx = { ...tx, id: 't' + Date.now(), date: new Date().toISOString().slice(0, 10) }
        setState((s) => ({ ...s, balance: s.balance + tx.amount, transactions: [full, ...s.transactions] }))
        return full
      },
      setTxCategory: (id, category) =>
        setState((s) => ({ ...s, transactions: s.transactions.map((t) => (t.id === id ? { ...t, category } : t)) })),
      reset: () => setState(defaultState),
    }
  }, [state])

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useApp harus dipakai di dalam AppStateProvider')
  return ctx
}
