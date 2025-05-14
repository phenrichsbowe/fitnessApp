import { defineStore } from 'pinia'
import supabase from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { useExerciseStore } from '@/stores/exercise'
import { useSettingsStore } from './settings'

export const useWorkoutStore = defineStore('workout', {
  state: () => ({
    workouts: [],
    loading: false,
    error: null
  }),

  getters: {
    getWorkoutByDate: (state) => (date) => {
      const dateKey = date.toISOString().split('T')[0]
      return state.workouts.find(workout => 
        workout.date.toISOString().split('T')[0] === dateKey
      )
    },
    getWorkoutsByDate: (state) => (date) => {
      const workout = state.workouts.find(w => 
        w.date.toISOString().split('T')[0] === date.toISOString().split('T')[0]
      )
      if (!workout || !workout.exercises || !Array.isArray(workout.exercises)) return []
      
      // First group by category
      const groupedByCategory = workout.exercises.reduce((acc, exercise) => {
        if (!exercise || !exercise.category || !exercise.name) return acc
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

      const authStore = useAuthStore()
      const settingsStore = useSettingsStore()

      try {
        // Handle offline mode using localStorage
        if (authStore.isOfflineMode) {
          const storedWorkouts = localStorage.getItem('offlineWorkouts')
          this.workouts = storedWorkouts ? JSON.parse(storedWorkouts) : []
          
          // Convert date strings back to Date objects
          this.workouts.forEach(workout => {
            workout.date = new Date(workout.date)
          })
          return
        }

        if (!authStore.user) throw new Error('User not authenticated')

        const { data: workouts, error } = await supabase
          .from('workouts')
          .select(`
            id,
            date,
            workout_exercises (
              id,
              sets,
              reps,
              weight,
              time_per_set,
              exercises (
                name,
                category,
                muscle_groups
              )
            )
          `)
          .eq('user_id', authStore.user.id)
          .order('date', { ascending: false })

        if (error) throw error

        this.workouts = workouts.map(workout => {
          const exercises = workout.workout_exercises.map(ex => ({
            id: ex.id,
            name: ex.exercises.name,
            category: ex.exercises.category,
            muscleGroups: ex.exercises.muscle_groups,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight && !settingsStore.isMetric 
              ? settingsStore.convertWeight(ex.weight, false)
              : ex.weight,
            timePerSet: ex.time_per_set
          }))

          return {
            id: workout.id,
            date: new Date(workout.date),
            exercises
          }
        })
      } catch (error) {
        console.error('Error fetching workouts:', error)
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
        const authStore = useAuthStore()
        if (!authStore.user) throw new Error('User not authenticated')

        const existingWorkout = this.getWorkoutByDate(date)
        if (existingWorkout) return existingWorkout

        const { data, error } = await supabase
          .from('workouts')
          .insert([{ 
            date: date.toISOString().split('T')[0],
            user_id: authStore.user.id
          }])
          .select()

        if (error) throw error
        if (data && data.length > 0) {
          const newWorkout = {
            ...data[0],
            exercises: []
          }
          this.workouts.push(newWorkout)
          return newWorkout
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

      const authStore = useAuthStore()
      const settingsStore = useSettingsStore()

      try {
        // Handle offline mode using localStorage
        if (authStore.isOfflineMode) {
          let workout = this.getWorkoutByDate(date)
          
          // Create new workout if it doesn't exist
          if (!workout) {
            workout = {
              id: `local-${Date.now()}`,
              date: new Date(date),
              exercises: []
            }
            this.workouts.push(workout)
          }

          // Add exercise to workout
          const newExercise = {
            id: `local-${Date.now()}-${workout.exercises.length}`,
            name: exerciseData.name,
            category: exerciseData.category,
            muscleGroups: exerciseData.muscleGroups || [],
            sets: exerciseData.sets || 3,
            reps: exerciseData.reps || 10,
            weight: exerciseData.weight || null,
            notes: exerciseData.notes || null
          }

          workout.exercises.push(newExercise)
          
          // Save to localStorage
          localStorage.setItem('offlineWorkouts', JSON.stringify(this.workouts))
          return newExercise
        }

        if (!authStore.user) throw new Error('User not authenticated')

        // Rest of the existing online mode code...
        let workout = this.getWorkoutByDate(date)
        let workoutId = workout?.id

        if (!workoutId) {
          const { data: newWorkout, error: workoutError } = await supabase
            .from('workouts')
            .insert({
              user_id: authStore.user.id,
              date: date.toISOString().split('T')[0]
            })
            .select()
            .single()

          if (workoutError) throw workoutError
          workoutId = newWorkout.id
        }

        // Ensure we have a valid UUID for the exercise
        if (!exerciseData.exerciseId || typeof exerciseData.exerciseId !== 'string') {
          throw new Error('Invalid exercise ID. Expected UUID string.')
        }

        const { data: newExercise, error: exerciseError } = await supabase
          .from('workout_exercises')
          .insert({
            workout_id: workoutId,
            exercise_id: exerciseData.exerciseId,
            sets: exerciseData.sets || 3,
            reps: exerciseData.reps || 10,
            weight: exerciseData.weight || null,
            notes: exerciseData.notes || null
          })
          .select(`
            id,
            sets,
            reps,
            weight,
            notes,
            exercises (
              name,
              category,
              muscle_groups
            )
          `)
          .single()

        if (exerciseError) throw exerciseError

        if (!workout) {
          this.workouts.push({
            id: workoutId,
            date: new Date(date),
            exercises: []
          })
          workout = this.workouts[this.workouts.length - 1]
        }

        workout.exercises.push({
          id: newExercise.id,
          name: newExercise.exercises.name,
          category: newExercise.exercises.category,
          muscleGroups: newExercise.exercises.muscle_groups,
          sets: newExercise.sets,
          reps: newExercise.reps,
          weight: newExercise.weight,
          notes: newExercise.notes
        })

      } catch (error) {
        console.error('Error adding exercise:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async removeExercise(date, exerciseName, exerciseId) {
      this.loading = true
      this.error = null

      const authStore = useAuthStore()

      try {
        // Handle offline mode
        if (authStore.isOfflineMode) {
          const workout = this.getWorkoutByDate(date)
          if (workout) {
            workout.exercises = workout.exercises.filter(e => e.id !== exerciseId)
            localStorage.setItem('offlineWorkouts', JSON.stringify(this.workouts))
          }
          return
        }

        const { error: deleteError } = await supabase
          .from('workout_exercises')
          .delete()
          .eq('id', exerciseId)

        if (deleteError) throw deleteError

        // Update local state
        const workout = this.getWorkoutByDate(date)
        if (workout) {
          workout.exercises = workout.exercises.filter(e => e.id !== exerciseId)
        }
      } catch (error) {
        console.error('Error removing exercise:', error)
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
        const authStore = useAuthStore()
        if (!authStore.user) throw new Error('User not authenticated')

        const workout = this.getWorkoutByDate(date)
        if (!workout) return


        console.log('here update3')
        const exercise = workout.exercises.find(ex => ex.id === exerciseId)
        if (!exercise) return

        const { error } = await supabase
          .from('workout_exercises')
          .update({
            sets: exerciseData.sets,
            reps: exerciseData.reps,
            weight: exerciseData.weight,
            time_per_set: exerciseData.timePerSet
          })
          .eq('id', exercise.id)
          .eq('workout_id', workout.id)

        if (error) throw error

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