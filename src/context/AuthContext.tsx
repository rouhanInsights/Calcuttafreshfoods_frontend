'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'
import { useCart } from '@/context/CartContext'

// Token structure
interface DecodedToken {
  userId: number
  phone: string
  exp: number
  iat: number
}

// User Profile type
interface User {
  user_id: number
  name: string
  phone: string
  email: string
  profile_image_url?: string
}

// Context type
interface AuthContextType {
  token: string | null
  user: User | null
  login: (token: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const router = useRouter()
  const { clearCart } = useCart()

  // ✅ Memoized logout
  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    clearCart()
    router.push('/')
  }, [clearCart, router])

  // ✅ Memoized fetchUser
  const fetchUser = useCallback(
    async (token: string) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          logout()
        }
      } catch {
        logout()
      }
    },
    [logout]
  )

  // ✅ Initial token check
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken)
        if (decoded.exp * 1000 < Date.now()) {
          logout()
        } else {
          setToken(storedToken)
          fetchUser(storedToken)
        }
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [fetchUser, logout])

  // ✅ Login
  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
    fetchUser(newToken)
  }

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
