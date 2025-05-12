import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import supabase from '@/lib/supabase'
import { User } from '@/models/User'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref(null)
  const ready = ref(false)

  // Initialize store
  const init = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      if (sessionError) throw sessionError

      if (session?.user) {
        user.value = User.fromSupabaseUser(session.user)
      }
      ready.value = true
      return session
    } catch (err) {
      console.error('Error initializing auth store:', err)
      error.value = err.message
      return null
    }
  }

  // Initialize immediately
  init()

  const isAuthenticated = computed(() => !!user.value)
  const isOfflineMode = computed(() => user.value?.isOfflineMode || false)

  const loginWithSupabase = async (email, password) => {
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError

      user.value = User.fromSupabaseUser(data.user)
      error.value = null
      return data
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      throw err
    }
  }

  const signUp = async (email, password, username) => {
    const signUpResponse = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        username
      })
    });

    if (!signUpResponse.ok) {
      error.value = 'Failed to register user ' + signUpResponse.errror;
    }

    try {
      // Call the server endpoint instead of using supabaseAdmin directly
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to register user');
      }

      // After successful registration, log the user in
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;

      user.value = User.fromSupabaseUser(loginData.user)
      error.value = null
      return loginData
    } catch (err) {
      console.error('Signup error:', err)
      error.value = err.message
      throw err
    }
  }

  const loginOffline = () => {
    user.value = User.createOfflineUser()
    error.value = null
  }

  const logout = async () => {
    try {
      if (!user.value?.isOfflineMode) {
        const { error: signOutError } = await supabase.auth.signOut()
        if (signOutError) throw signOutError
      }
      user.value = null
      error.value = null
    } catch (err) {
      console.error('Logout error:', err)
      error.value = err.message
      throw err
    }
  }

  const updateProfile = async (username) => {
    try {
      if (!user.value || user.value.isOfflineMode) return

      const { error: updateError } = await supabase.auth.updateUser({
        data: { username }
      })
      if (updateError) throw updateError

      user.value = new User({
        ...user.value,
        username
      })
      error.value = null
    } catch (err) {
      console.error('Profile update error:', err)
      error.value = err.message
      throw err
    }
  }

  return {
    user,
    error,
    isAuthenticated,
    isOfflineMode,
    init,
    loginWithSupabase,
    signUp,
    loginOffline,
    logout,
    updateProfile,
    ready
  }
}) 