import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

export const useExerciseStore = defineStore('exercise', {
  state: () => ({
    allExercises: [],
    loading: false,
    error: null,
    mockExercises: [
      { name: 'Bench Press', category: 'Chest' },
      { name: 'Squats', category: 'Legs' },
      { name: 'Deadlift', category: 'Back' },
      { name: 'Pull-ups', category: 'Back' },
      { name: 'Push-ups', category: 'Chest' },
      { name: 'Lunges', category: 'Legs' },
      { name: 'Shoulder Press', category: 'Shoulders' },
      { name: 'Bicep Curls', category: 'Arms' },
      { name: 'Tricep Extensions', category: 'Arms' },
      { name: 'Plank', category: 'Core' },
      { name: 'Russian Twists', category: 'Core' },
      { name: 'Leg Press', category: 'Legs' },
      { name: 'Lat Pulldown', category: 'Back' },
      { name: 'Chest Fly', category: 'Chest' },
      { name: 'Lateral Raises', category: 'Shoulders' }
    ]
  }),

  getters: {
    getExercisesByCategory: (state) => (category) => {
      return state.allExercises.filter(exercise => exercise.category === category)
    },
    searchExercises: (state) => (term) => {
      const lower = term.toLowerCase()
      return state.allExercises.filter(ex => ex.name.toLowerCase().includes(lower))
    }
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null

      try {
        // Comment out Supabase call for now
        // const { data, error } = await supabase
        //   .from('exercises')
        //   .select('*')
        //   .order('name')

        // if (error) throw error
        // this.allExercises = data

        // Use mock data for now
        this.allExercises = this.mockExercises
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addExercise(name, category) {
      this.loading = true
      this.error = null

      try {
        // Comment out Supabase call for now
        // const { data, error } = await supabase
        //   .from('exercises')
        //   .insert([{ name, category }])
        //   .select()

        // if (error) throw error
        // if (data && data.length > 0) {
        //   this.allExercises.push(data[0])
        //   return data[0]
        // }

        // Use mock data for now
        const newExercise = {
          id: Date.now().toString(),
          name,
          category
        }
        this.allExercises.push(newExercise)
        return newExercise
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateExercise(id, updates) {
      this.loading = true
      this.error = null

      try {
        // Comment out Supabase call for now
        // const { error } = await supabase
        //   .from('exercises')
        //   .update(updates)
        //   .eq('id', id)

        // if (error) throw error

        const index = this.allExercises.findIndex(ex => ex.id === id)
        if (index !== -1) {
          this.allExercises[index] = {
            ...this.allExercises[index],
            ...updates
          }
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteExercise(id) {
      this.loading = true
      this.error = null

      try {
        // Comment out Supabase call for now
        // const { error } = await supabase
        //   .from('exercises')
        //   .delete()
        //   .eq('id', id)

        // if (error) throw error

        const index = this.allExercises.findIndex(ex => ex.id === id)
        if (index !== -1) {
          this.allExercises.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 