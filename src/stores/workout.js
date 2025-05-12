import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    loading: false,
    error: null
  }),

  getters: {
    getWorkoutByDate: (state) => (date) => {
      const dateKey = date.toISOString().split('T')[0]
      return state.workouts.find(workout => workout.date.toISOString().split('T')[0] === dateKey)
    },
    getWorkoutsByDate: (state) => (date) => {
      const workout = state.workouts.find(w => w.date.toISOString().split('T')[0] === date.toISOString().split('T')[0])
      if (!workout) return []
      
      // First group by category
      const groupedByCategory = workout.exercises.reduce((acc, exercise) => {
        if (!acc[exercise.category]) {
          acc[exercise.category] = {}
        }
        if (!acc[exercise.category][exercise.name]) {
          acc[exercise.category][exercise.name] = []
        }
        acc[exercise.category][exercise.name].push(exercise)
        return acc
      }, {})
      
      // Convert to array structure
      return Object.entries(groupedByCategory).map(([category, exercises]) => ({
        category,
        exercises: Object.entries(exercises).map(([name, entries]) => ({
          name,
          entries
        }))
      }))
    }
  },

  actions: {
    async fetchWorkouts() {
      this.loading = true
      this.error = null

      try {
        // Comment out Supabase call for now
        // const { data, error } = await supabase
        //   .from('workouts')
        //   .select('*')
        //   .order('date', { ascending: false })

        // if (error) throw error
        // this.workouts = data

        // Use mock data for now
        this.workouts = []
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addWorkout(date) {
      this.loading = true
      this.error = null

      try {
        const existingWorkout = this.getWorkoutByDate(date)
        if (existingWorkout) return existingWorkout

        // Comment out Supabase call for now
        // const { data, error } = await supabase
        //   .from('workouts')
        //   .insert([{ date }])
        //   .select()

        // if (error) throw error
        // if (data && data.length > 0) {
        //   this.workouts.push(data[0])
        //   return data[0]
        // }

        // Use mock data for now
        const newWorkout = {
          id: Date.now().toString(),
          date,
          exercises: []
        }
        this.workouts.push(newWorkout)
        return newWorkout
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async addExercise(date, exerciseData) {
      this.loading = true
      this.error = null

      try {
        const workout = await this.addWorkout(date)
        const exercise = {
          id: Date.now().toString(),
          name: exerciseData.name,
          category: exerciseData.category,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: exerciseData.weight,
          timePerSet: exerciseData.timePerSet
        }

        // Comment out Supabase call for now
        // const { error } = await supabase
        //   .from('workout_exercises')
        //   .insert([{
        //     workout_id: workout.id,
        //     exercise_id: exercise.id,
        //     sets: exercise.sets,
        //     reps: exercise.reps,
        //     weight: exercise.weight,
        //     time_per_set: exercise.timePerSet
        //   }])

        // if (error) throw error

        workout.exercises.push(exercise)
        return exercise
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeExercise(date, exerciseName, exerciseId) {
      this.loading = true
      this.error = null

      try {
        const workout = this.getWorkoutByDate(date)
        if (!workout) return

        // Comment out Supabase call for now
        // const { error } = await supabase
        //   .from('workout_exercises')
        //   .delete()
        //   .eq('id', exerciseId)

        // if (error) throw error

        const index = workout.exercises.findIndex(ex => ex.id === exerciseId)
        if (index !== -1) {
          workout.exercises.splice(index, 1)
        }
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateExercise(date, exerciseId, exerciseData) {
      this.loading = true
      this.error = null

      try {
        const workout = this.getWorkoutByDate(date)
        if (!workout) return

        const exercise = workout.exercises.find(ex => ex.id === exerciseId)
        if (!exercise) return

        // Comment out Supabase call for now
        // const { error } = await supabase
        //   .from('workout_exercises')
        //   .update({
        //     sets: exerciseData.sets,
        //     reps: exerciseData.reps,
        //     weight: exerciseData.weight,
        //     time_per_set: exerciseData.timePerSet
        //   })
        //   .eq('id', exercise.id)

        // if (error) throw error

        Object.assign(exercise, exerciseData)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
}) 