import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'
import type { LoginPayload, RegisterPayload } from '@/api/auth'
import { ApiError, setToken, setUnauthorizedHandler } from '@/api/client'
import type { AuthPayload, User } from '@/types/api'

const TOKEN_KEY = 'kinoxii_token'

function readStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function writeStoredToken(value: string | null) {
  try {
    if (value) localStorage.setItem(TOKEN_KEY, value)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // storage unavailable: the session just won't survive a reload
  }
}

type AuthModal = 'login' | 'register' | null

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const ready = ref(false)
  const modal = ref<AuthModal>(null)
  let token = readStoredToken()

  const isAuthenticated = computed(() => user.value !== null)
  const profileComplete = computed(() => user.value?.profileComplete ?? false)

  let pendingLogin: Promise<void> | null = null
  let settle: { resolve: () => void; reject: (reason: Error) => void } | null = null

  function startSession(payload: AuthPayload) {
    user.value = payload.user
    token = payload.token
    setToken(token)
    writeStoredToken(token)
    modal.value = null
    settle?.resolve()
    pendingLogin = null
    settle = null
  }

  function clearSession() {
    user.value = null
    token = null
    setToken(null)
    writeStoredToken(null)
  }

  function requestLogin() {
    clearSession()
    if (!pendingLogin) {
      pendingLogin = new Promise<void>((resolve, reject) => {
        settle = { resolve, reject }
      })
    }
    modal.value = 'login'
    return pendingLogin
  }

  function openModal(kind: 'login' | 'register') {
    modal.value = kind
  }

  function closeModal() {
    modal.value = null
    settle?.reject(new Error('Login dismissed'))
    pendingLogin = null
    settle = null
  }

  async function init() {
    setUnauthorizedHandler(requestLogin)
    if (token) {
      setToken(token)
      try {
        user.value = await authApi.fetchMe()
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) clearSession()
      }
    }
    ready.value = true
  }

  async function login(payload: LoginPayload) {
    startSession(await authApi.login(payload))
  }

  async function register(payload: RegisterPayload) {
    startSession(await authApi.register(payload))
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch {
      // the token is dropped locally either way
    }
    clearSession()
  }

  function setUser(value: User) {
    user.value = value
  }

  return {
    user,
    ready,
    modal,
    isAuthenticated,
    profileComplete,
    init,
    login,
    register,
    logout,
    openModal,
    closeModal,
    requestLogin,
    setUser,
  }
})