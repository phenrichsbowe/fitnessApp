import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

export const useExerciseStore = defineStore('exercise', {
  state: () => ({
    exercises: [],
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
    allExercises: (state) => state.exercises,
    getByCategory: (state) => (category) => state.exercises.filter(ex => ex.category === category),
    searchExercises: (state) => (term) => {
      const lower = term.toLowerCase()
      return state.exercises.filter(ex => ex.name.toLowerCase().includes(lower))
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
        //   .order('name', { ascending: true })

        // if (error) throw error
        // this.exercises = data

        // Use mock data instead
        this.exercises = this.mockExercises
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
        //   this.exercises.push(data[0])
        //   return data[0]
        // }

        // Use mock data instead
        const newExercise = { name, category }
        this.exercises.push(newExercise)
        return newExercise
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 