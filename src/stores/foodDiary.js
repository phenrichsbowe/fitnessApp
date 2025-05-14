import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

// Helper function to ensure valid date string
const getValidDateString = (date) => {
  try {
    if (date instanceof Date) {
      if (isNaN(date.getTime())) {
        return new Date().toISOString().split('T')[0]
      }
      return date.toISOString().split('T')[0]
    }
    const newDate = new Date(date)
    if (isNaN(newDate.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    return newDate.toISOString().split('T')[0]
  } catch (e) {
    return new Date().toISOString().split('T')[0]
  }
}

export const useFoodDiaryStore = defineStore('foodDiary', {
  state: () => ({
    entries: [],
    loading: false,
    error: null
  }),

  getters: {
    getEntriesByDate: (state) => (date) => {
      if (!date) return []
      const dateStr = getValidDateString(date)
      return state.entries.filter(entry => 
        entry?.date?.split('T')[0] === dateStr
      )
    },

    getDailyNutrition: (state) => (date) => {
      const entries = state.getEntriesByDate(date)
      if (!entries || !Array.isArray(entries)) return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      }
      
      return entries.reduce((totals, entry) => ({
        calories: (totals.calories || 0) + (Number(entry?.calories) || 0),
        protein: (totals.protein || 0) + (Number(entry?.protein) || 0),
        carbs: (totals.carbs || 0) + (Number(entry?.carbs) || 0),
        fats: (totals.fats || 0) + (Number(entry?.fats) || 0)
      }), {
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      })
    },

    getEntriesByMealType: (state) => (date, mealType) => {
      if (!date || !mealType) return []
      const dateStr = getValidDateString(date)
      return state.entries.filter(entry => 
        entry?.date?.split('T')[0] === dateStr && 
        entry?.meal_type === mealType
      ) || []
    }
  },

  actions: {
    // Helper method to save entries to localStorage
    saveToLocalStorage() {
      localStorage.setItem('offlineFoodEntries', JSON.stringify(this.entries))
    },

    // Helper method to load entries from localStorage
    loadFromLocalStorage() {
      const storedEntries = localStorage.getItem('offlineFoodEntries')
      if (storedEntries) {
        this.entries = JSON.parse(storedEntries)
      }
    },

    async fetchEntries(startDate, endDate) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        // Handle offline mode
        if (authStore.isOfflineMode) {
          this.loadFromLocalStorage()
          return
        }

        if (!authStore.user) throw new Error('User not authenticated')

        let query = supabase
          .from('food_entries')
          .select('*')
          .eq('user_id', authStore.user.id)
          .order('date', { ascending: false })

        if (startDate) {
          query = query.gte('date', getValidDateString(startDate))
        }
        
        if (endDate) {
          query = query.lte('date', getValidDateString(endDate))
        }

        const { data, error } = await query

        if (error) throw error

        this.entries = data || []
      } catch (error) {
        this.error = error.message
        console.error('Error fetching entries:', error)
        this.entries = []
      } finally {
        this.loading = false
      }
    },

    async addEntry(date, entry) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        // Handle offline mode
        if (authStore.isOfflineMode) {
          const newEntry = {
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            date: getValidDateString(date),
            meal_type: entry.mealType,
            food_name: entry.food_name,
            calories: Number(entry.calories) || 0,
            protein: Number(entry.protein) || 0,
            carbs: Number(entry.carbs) || 0,
            fats: Number(entry.fats) || 0,
            notes: entry.notes || ''
          }
          this.entries.push(newEntry)
          this.saveToLocalStorage()
          return newEntry
        }

        if (!authStore.user) throw new Error('User not authenticated')

        const { data, error } = await supabase
          .from('food_entries')
          .insert({
            user_id: authStore.user.id,
            date: getValidDateString(date),
            meal_type: entry.mealType,
            food_name: entry.food_name,
            calories: Number(entry.calories) || 0,
            protein: Number(entry.protein) || 0,
            carbs: Number(entry.carbs) || 0,
            fats: Number(entry.fats) || 0,
            notes: entry.notes || ''
          })
          .select()
          .single()

        if (error) throw error

        this.entries = [...this.entries, data]
        return data
      } catch (error) {
        this.error = error.message
        console.error('Error adding entry:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateEntry(id, updates) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        // Handle offline mode
        if (authStore.isOfflineMode) {
          const index = this.entries.findIndex(e => e.id === id)
          if (index !== -1) {
            const updatedEntry = {
              ...this.entries[index],
              meal_type: updates.mealType,
              food_name: updates.food_name,
              calories: Number(updates.calories) || 0,
              protein: Number(updates.protein) || 0,
              carbs: Number(updates.carbs) || 0,
              fats: Number(updates.fats) || 0,
              notes: updates.notes || ''
            }
            this.entries[index] = updatedEntry
            this.saveToLocalStorage()
            return updatedEntry
          }
          throw new Error('Entry not found')
        }

        const { data, error } = await supabase
          .from('food_entries')
          .update({
            meal_type: updates.mealType,
            food_name: updates.food_name,
            calories: Number(updates.calories) || 0,
            protein: Number(updates.protein) || 0,
            carbs: Number(updates.carbs) || 0,
            fats: Number(updates.fats) || 0,
            notes: updates.notes || ''
          })
          .eq('id', id)
          .select()
          .single()

        if (error) throw error

        const index = this.entries.findIndex(e => e.id === id)
        if (index !== -1) {
          this.entries[index] = data
        }

        return data
      } catch (error) {
        this.error = error.message
        console.error('Error updating entry:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteEntry(id) {
      this.loading = true
      this.error = null

      try {
        const authStore = useAuthStore()

        // Handle offline mode
        if (authStore.isOfflineMode) {
          this.entries = this.entries.filter(e => e.id !== id)
          this.saveToLocalStorage()
          return
        }

        const { error } = await supabase
          .from('food_entries')
          .delete()
          .eq('id', id)

        if (error) throw error

        this.entries = this.entries.filter(e => e.id !== id)
      } catch (error) {
        this.error = error.message
        console.error('Error deleting entry:', error)
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 