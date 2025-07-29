import { create } from "zustand"
import { persist } from "zustand/middleware"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface Component {
  id: string
  name: string
  jsxCode: string
  cssCode: string
  version: number
}

interface Session {
  id: string
  title: string
  description?: string
  messages: ChatMessage[]
  components: Component[]
  activeComponentId?: string
  createdAt: Date
  updatedAt: Date
}

interface AppState {
  currentSession: Session | null
  sessions: Session[]
  isLoading: boolean
  // Actions
  setCurrentSession: (session: Session) => void
  setCurrentSessionById: (sessionId: string) => void
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  updateComponent: (component: Component) => void
  setActiveComponent: (componentId: string) => void
  createNewSession: (title: string) => void
  deleteSession: (sessionId: string) => void
  updateSessionTitle: (sessionId: string, title: string) => void
  loadSessions: (sessions: Session[]) => void
  setLoading: (loading: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      isLoading: false,

      setCurrentSession: (session) => set({ currentSession: session }),

      setCurrentSessionById: (sessionId) => {
        const session = get().sessions.find((s) => s.id === sessionId)
        if (session) {
          set({ currentSession: session })
        }
      },

      addMessage: (message) =>
        set((state) => {
          if (!state.currentSession) return state
          const newMessage: ChatMessage = {
            ...message,
            id: Date.now().toString(),
            timestamp: new Date(),
          }
          const updatedSession = {
            ...state.currentSession,
            messages: [...state.currentSession.messages, newMessage],
            updatedAt: new Date(),
          }
          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        }),

      updateComponent: (component) =>
        set((state) => {
          if (!state.currentSession) return state
          const existingIndex = state.currentSession.components.findIndex((c) => c.id === component.id)
          const updatedComponents =
            existingIndex >= 0
              ? state.currentSession.components.map((c, i) => (i === existingIndex ? component : c))
              : [...state.currentSession.components, component]

          const updatedSession = {
            ...state.currentSession,
            components: updatedComponents,
            updatedAt: new Date(),
          }

          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        }),

      setActiveComponent: (componentId) =>
        set((state) => {
          if (!state.currentSession) return state
          const updatedSession = {
            ...state.currentSession,
            activeComponentId: componentId,
          }
          return {
            currentSession: updatedSession,
            sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
          }
        }),

      createNewSession: (title) => {
        const newSession: Session = {
          id: Date.now().toString(),
          title,
          messages: [],
          components: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        set((state) => ({
          currentSession: newSession,
          sessions: [newSession, ...state.sessions],
        }))
      },

      deleteSession: (sessionId) =>
        set((state) => {
          const filteredSessions = state.sessions.filter((s) => s.id !== sessionId)
          const newCurrentSession =
            state.currentSession?.id === sessionId ? filteredSessions[0] || null : state.currentSession
          return {
            sessions: filteredSessions,
            currentSession: newCurrentSession,
          }
        }),

      updateSessionTitle: (sessionId, title) =>
        set((state) => {
          const updatedSessions = state.sessions.map((session) =>
            session.id === sessionId ? { ...session, title, updatedAt: new Date() } : session,
          )
          const updatedCurrentSession =
            state.currentSession?.id === sessionId
              ? { ...state.currentSession, title, updatedAt: new Date() }
              : state.currentSession

          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
          }
        }),

      loadSessions: (sessions) => set({ sessions }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "component-generator-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
      }),
    },
  ),
)
