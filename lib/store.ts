import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface Message {
  id?: string
  role: "user" | "assistant"
  content: string
  timestamp?: number
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
  userId: string // Assuming userId is string from NextAuth token
  title: string
  description?: string
  messages: Message[]
  components: Component[]
  createdAt?: string
  updatedAt?: string
}

interface AppStore {
  currentSession: Session | null
  sessions: Session[]
  activeComponentId: string | null

  // Actions
  setCurrentSession: (session: Session | null) => void
  addMessage: (message: Message) => void
  updateComponent: (component: Component) => void
  setActiveComponent: (componentId: string | null) => void
  addSession: (session: Session) => void
  createNewSession: (title: string, description?: string) => Promise<void>
  createAndSetNewSession: (userId: string, title: string, description?: string) => Promise<void>
  deleteSession: (sessionId: string) => void
  setCurrentSessionById: (sessionId: string) => void
  updateSessionTitle: (sessionId: string, newTitle: string) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      activeComponentId: null,

      setCurrentSession: (session) => {
        set({ currentSession: session })
        if (session && session.components.length > 0) {
          set({ activeComponentId: session.components[session.components.length - 1].id })
        } else {
          set({ activeComponentId: null })
        }
      },
      addMessage: (message) => {
        set((state) => {
          if (!state.currentSession) return state
          const updatedMessages = [
            ...state.currentSession.messages,
            { ...message, id: message.id || Date.now().toString(), timestamp: Date.now() },
          ]
          const updatedSession = { ...state.currentSession, messages: updatedMessages }

          // Update sessions list as well
          const updatedSessions = state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))

          return {
            currentSession: updatedSession,
            sessions: updatedSessions,
          }
        })
      },
      updateComponent: (component) => {
        set((state) => {
          if (!state.currentSession) return state
          const existingComponentIndex = state.currentSession.components.findIndex((c) => c.id === component.id)
          let updatedComponents
          if (existingComponentIndex > -1) {
            updatedComponents = state.currentSession.components.map((c, index) =>
              index === existingComponentIndex ? component : c,
            )
          } else {
            updatedComponents = [...state.currentSession.components, component]
          }
          const updatedSession = { ...state.currentSession, components: updatedComponents }

          // Update sessions list as well
          const updatedSessions = state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s))

          return {
            currentSession: updatedSession,
            activeComponentId: component.id,
            sessions: updatedSessions,
          }
        })
      },
      setActiveComponent: (componentId) => set({ activeComponentId: componentId }),
      addSession: (session) => {
        set((state) => ({
          sessions: [...state.sessions, session],
        }))
      },

      // New action to create a session via API and set it as current
      createAndSetNewSession: async (userId, title, description) => {
        try {
          const response = await fetch("/api/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description }),
          })

          if (!response.ok) {
            throw new Error(`Failed to create session: ${response.statusText}`)
          }

          const data = await response.json()
          const newSession: Session = {
            ...data.session,
            messages: [], // Initialize messages and components for new session
            components: [],
            userId: userId, // Ensure userId is set
          }

          set((state) => ({
            sessions: [...state.sessions, newSession],
            currentSession: newSession,
            activeComponentId: null, // Reset active component for new session
          }))
          console.log("New session created and set:", newSession)
        } catch (error) {
          console.error("Error creating and setting new session:", error)
          // You might want to set an error state here
        }
      },

      // Improved createNewSession function that handles user authentication
      createNewSession: async (title, description) => {
        try {
          // First, get the current user session from NextAuth
          const response = await fetch("/api/auth/session")
          if (!response.ok) {
            throw new Error("Not authenticated")
          }

          const session = await response.json()
          if (!session?.user?.id) {
            throw new Error("User not found in session")
          }

          const { createAndSetNewSession } = get()
          await createAndSetNewSession(session.user.id, title, description)
        } catch (error) {
          console.error("Error creating new session:", error)
          throw error
        }
      },

      // Add these new action implementations after createNewSession
      deleteSession: (sessionId) => {
        set((state) => {
          const updatedSessions = state.sessions.filter((s) => s.id !== sessionId)

          // If we're deleting the current session, clear it
          const updatedCurrentSession = state.currentSession?.id === sessionId ? null : state.currentSession

          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
            activeComponentId: updatedCurrentSession ? state.activeComponentId : null,
          }
        })
      },

      setCurrentSessionById: (sessionId) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId)
          if (session) {
            return {
              currentSession: session,
              activeComponentId:
                session.components.length > 0 ? session.components[session.components.length - 1].id : null,
            }
          }
          return state
        })
      },

      updateSessionTitle: (sessionId, newTitle) => {
        set((state) => {
          const updatedSessions = state.sessions.map((s) => (s.id === sessionId ? { ...s, title: newTitle } : s))

          const updatedCurrentSession =
            state.currentSession?.id === sessionId ? { ...state.currentSession, title: newTitle } : state.currentSession

          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
          }
        })
      },
    }),
    {
      name: "app-store", // name of the item in storage
      storage: createJSONStorage(() => localStorage), // Use localStorage
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
        activeComponentId: state.activeComponentId,
      }), // Only persist these parts of the state
    },
  ),
)
