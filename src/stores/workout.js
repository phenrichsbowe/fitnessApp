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
      return state.workouts.find(workout => workout.date.split('T')[0] === dateKey)
    },
    getWorkoutsByDate: (state) => (date) => {
      const workout = state.workouts.find(w => w.date.split('T')[0] === date.toISOString().split('T')[0])
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
        // First, fetch all workouts
        const { data: workoutsData, error: workoutsError } = await supabase
          .from('workouts')
          .select('*')
          .order('date', { ascending: false })

        if (workoutsError) throw workoutsError

        // Then, fetch all exercises for these workouts
        const workoutIds = workoutsData.map(w => w.id)
        const { data: exercisesData, error: exercisesError } = await supabase
          .from('exercises')
          .select('*')
          .in('workout_id', workoutIds)

        if (exercisesError) throw exercisesError

        // Combine the data
        this.workouts = workoutsData.map(workout => ({
          ...workout,
          exercises: exercisesData
            .filter(exercise => exercise.workout_id === workout.id)
            .map(exercise => ({
              id: exercise.id,
              name: exercise.name,
              category: exercise.category,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              timePerSet: exercise.time_per_set
            }))
        }))
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

        const { data, error } = await supabase
          .from('workouts')
          .insert([{ 
            date: date.toISOString().split('T')[0],
            exercises: []
          }])
          .select()

        if (error) throw error
        if (data && data.length > 0) {
          this.workouts.push(data[0])
          return data[0]
        }
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
        
        const { data, error } = await supabase
          .from('exercises')
          .insert([{
            workout_id: workout.id,
            name: exerciseData.name,
            category: exerciseData.category,
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            weight: exerciseData.weight,
            time_per_set: exerciseData.timePerSet
          }])
          .select()

        if (error) throw error
        if (!data || data.length === 0) throw new Error('Failed to add exercise')

        const exercise = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          sets: data[0].sets,
          reps: data[0].reps,
          weight: data[0].weight,
          timePerSet: data[0].time_per_set
        }

        // Update local state
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

        const { error } = await supabase
          .from('exercises')
          .delete()
          .eq('id', exerciseId)

        if (error) throw error

        // Update local state
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

        const { error } = await supabase
          .from('exercises')
          .update({
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            weight: exerciseData.weight,
            time_per_set: exerciseData.timePerSet
          })
          .eq('id', exerciseId)

        if (error) throw error

        // Update local state
        const exercise = workout.exercises.find(ex => ex.id === exerciseId)
        if (exercise) {
          Object.assign(exercise, exerciseData)
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