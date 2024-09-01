import React, { createContext, useState, useEffect, useCallback } from 'react'
import { URLBASE } from '../config/constant.js'
import axios from 'axios'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line no-undef
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      handleToken(storedToken)
    } else {
      setAuthChecked(true)
    }
  }, [])

  const decodeJWT = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join('')
      )

      return JSON.parse(jsonPayload)
    } catch (error) {
      return null
    }
  }, [])

  const isTokenValid = useCallback((decodedToken) => {
    const isValid = decodedToken && decodedToken.exp * 1000 > Date.now()
    return isValid
  }, [])

  const fetchProfile = useCallback(async (userId, authToken) => {
    if (!authToken) {
      return
    }
    try {
      const response = await axios.get(
        `${URLBASE}/mi_perfil/${userId}`,
        {
          headers: { Authorization: `Bearer ${authToken}` }
        }
      )
      setProfile(response.data)
    } catch (error) {
    }
  }, [])

  const handleToken = useCallback(
    (newToken) => {
      const decodedToken = decodeJWT(newToken)

      if (!decodedToken || !isTokenValid(decodedToken)) {
        logout() // Desloguea si el token es inválido o ha expirado
        return
      }

      const userId = decodedToken.id || decodedToken.userId
      setUser({
        email: decodedToken.email,
        role: decodedToken.role,
        id: userId
      })
      setToken(newToken)
      // eslint-disable-next-line no-undef
      localStorage.setItem('token', newToken)
      // eslint-disable-next-line no-undef
      localStorage.setItem('userRole', decodedToken.role)

      // Espera a que el token esté establecido antes de hacer fetchProfile
      fetchProfile(userId, newToken)

      setAuthChecked(true)
    },
    [decodeJWT, isTokenValid, fetchProfile]
  )

  const login = useCallback(
    async (email, contraseña, onSuccess) => {
      try {
        console.log('Iniciando sesión con:', email)
        const response = await axios.post(`${URLBASE}/login`, {
          email,
          contraseña
        })
        const { token } = response.data
        handleToken(token)
        if (onSuccess) onSuccess()
      } catch (error) {
        throw error
      }
    },
    [handleToken]
  )

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setProfile(null)
    // eslint-disable-next-line no-undef
    localStorage.removeItem('token')
    // eslint-disable-next-line no-undef
    localStorage.removeItem('userRole')
    setAuthChecked(true)
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, token, profile, setProfile, login, logout, authChecked }}
    >
      {children}
    </AuthContext.Provider>
  )
}
