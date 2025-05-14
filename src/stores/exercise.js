import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Exercise } from '@/models/Exercise'
import { useAuthStore } from './auth'
import { useSettingsStore } from './settings'
import supabase from '@/lib/supabase'

// Default exercises with descriptions
const DEFAULT_EXERCISES = [
  {
    name: 'Bench Press',
    category: 'Chest',
    muscleGroups: ['Shoulders', 'Triceps'],
    description: 'A compound exercise that targets the chest, shoulders, and triceps. Lie on a flat bench and press the weight up from your chest.',
    isCustom: false
  },
  {
    name: 'Push-Ups',
    category: 'Chest',
    muscleGroups: ['Shoulders', 'Triceps', 'Core'],
    description: 'A bodyweight exercise that works the chest, shoulders, triceps, and core. Start in a plank position and lower your body until your chest nearly touches the ground.',
    isCustom: false
  },
  {
    name: 'Dumbbell Flyes',
    category: 'Chest',
    muscleGroups: ['Shoulders'],
    description: 'An isolation exercise for the chest. Lie on a flat bench with dumbbells extended above your chest, then lower them out to the sides with slightly bent elbows.',
    isCustom: false
  },
  {
    name: 'Pull-Ups',
    category: 'Back',
    muscleGroups: ['Biceps', 'Shoulders'],
    description: 'A compound bodyweight exercise that targets the back, biceps, and shoulders. Hang from a bar and pull yourself up until your chin is over the bar.',
    isCustom: false
  },
  {
    name: 'Bent Over Rows',
    category: 'Back',
    muscleGroups: ['Biceps', 'Shoulders'],
    description: 'A compound exercise that works the back, biceps, and rear shoulders. Bend at the hips and pull weight towards your lower chest while maintaining a straight back.',
    isCustom: false
  },
  {
    name: 'Lat Pulldowns',
    category: 'Back',
    muscleGroups: ['Biceps'],
    description: 'A machine exercise targeting the latissimus dorsi and biceps. Sit at a pulldown machine and pull the bar down to your upper chest.',
    isCustom: false
  },
  {
    name: 'Squats',
    category: 'Legs',
    muscleGroups: ['Core', 'Back'],
    description: 'A fundamental compound exercise that targets the entire lower body. Stand with feet shoulder-width apart and lower your body as if sitting back into a chair.',
    isCustom: false
  },
  {
    name: 'Deadlifts',
    category: 'Legs',
    muscleGroups: ['Back', 'Core'],
    description: 'A compound exercise that works the entire posterior chain. With feet hip-width apart, bend at the hips and knees to lift a weight from the floor while maintaining a neutral spine.',
    isCustom: false
  },
  {
    name: 'Leg Press',
    category: 'Legs',
    muscleGroups: [],
    description: 'A machine-based compound exercise for the lower body. Sit in the leg press machine and push the weight away from your body using your legs.',
    isCustom: false
  },
  {
    name: 'Overhead Press',
    category: 'Shoulders',
    muscleGroups: ['Triceps'],
    description: 'A compound exercise targeting the shoulders and triceps. Press weight overhead from shoulder level while standing or seated.',
    isCustom: false
  },
  {
    name: 'Lateral Raises',
    category: 'Shoulders',
    muscleGroups: [],
    description: 'An isolation exercise for the lateral deltoids. Stand with dumbbells at your sides and raise them out to shoulder level with slightly bent elbows.',
    isCustom: false
  },
  {
    name: 'Front Raises',
    category: 'Shoulders',
    muscleGroups: [],
    description: 'An isolation exercise for the front deltoids. Raise weights from the front of your thighs up to shoulder level while keeping arms straight.',
    isCustom: false
  },
  {
    name: 'Bicep Curls',
    category: 'Arms',
    muscleGroups: ['Forearms'],
    description: 'An isolation exercise for the biceps. Curl weight from a fully extended arm position up towards your shoulders while keeping upper arms still.',
    isCustom: false
  },
  {
    name: 'Tricep Extensions',
    category: 'Arms',
    muscleGroups: [],
    description: 'An isolation exercise for the triceps. Hold weight overhead and lower it behind your head by bending at the elbows, then extend arms back up.',
    isCustom: false
  },
  {
    name: 'Hammer Curls',
    category: 'Arms',
    muscleGroups: ['Forearms'],
    description: 'A bicep curl variation that also targets the brachialis. Perform curls with palms facing each other throughout the movement.',
    isCustom: false
  }
]

export const useExerciseStore = defineStore('exercise', () => {
  const authStore = useAuthStore()
  const exercises = ref([])
  const loading = ref(false)
  const error = ref(null)
  const initialized = ref(false)

  const allExercises = computed(() => exercises.value)

  const exercisesByMuscleGroup = computed(() => {
    const groups = {}
    exercises.value.forEach(exercise => {
      const category = exercise.category
      if (!groups[category]) {
        groups[category] = {
          name: category,
          exercises: []
        }
      }
      groups[category].exercises.push(exercise)
    })
    return Object.values(groups)
  })

  const findExerciseByName = (name) => {
    return exercises.value.find(ex => ex.name === name)
  }

  const fetchAll = async () => {
    loading.value = true
    error.value = null

    try {
      // Handle offline mode using localStorage
      if (authStore.isOfflineMode) {
        // Try to get exercises from localStorage first
        const storedExercises = localStorage.getItem('offlineExercises')
        if (storedExercises) {
          exercises.value = JSON.parse(storedExercises).map(ex => new Exercise(ex))
        } else {
          // Initialize with default exercises if nothing in localStorage
          exercises.value = DEFAULT_EXERCISES.map((ex, index) => new Exercise({
            id: `local-${index}`,
            ...ex,
            userId: null
          }))
          // Save to localStorage
          localStorage.setItem('offlineExercises', JSON.stringify(exercises.value))
        }
        initialized.value = true
        return exercises.value
      }

      // Online mode - fetch from Supabase
      if (authStore.user && !authStore.isOfflineMode) {
        // First try to get user's custom exercises
        const { data: userExercises, error: userExError } = await supabase
          .from('exercises')
          .select('*')
          .eq('user_id', authStore.user.id)
          .order('name')

        if (userExError) throw userExError

        // If user has no exercises, add default exercises to their account
        if (!userExercises || userExercises.length === 0) {
          // Insert default exercises for this user
          const { data: insertedExercises, error: insertError } = await supabase
            .from('exercises')
            .insert(
              DEFAULT_EXERCISES.map(ex => ({
                name: ex.name,
                category: ex.category,
                muscle_groups: ex.muscleGroups,
                description: ex.description,
                is_custom: false,
                user_id: authStore.user.id // Set the user_id to create user's copy
              }))
            )
            .select()

          if (insertError) throw insertError

          exercises.value = insertedExercises.map(exercise => new Exercise({
            id: exercise.id,
            name: exercise.name,
            category: exercise.category,
            muscleGroups: exercise.muscle_groups || [],
            description: exercise.description,
            isCustom: false,
            userId: exercise.user_id,
            createdAt: new Date(exercise.created_at),
            updatedAt: new Date(exercise.updated_at)
          }))
        } else {
          // User has exercises, use those
          exercises.value = userExercises.map(exercise => new Exercise({
            id: exercise.id,
            name: exercise.name,
            category: exercise.category,
            muscleGroups: exercise.muscle_groups || [],
            description: exercise.description,
            isCustom: exercise.is_custom || false,
            userId: exercise.user_id,
            createdAt: new Date(exercise.created_at),
            updatedAt: new Date(exercise.updated_at)
          }))
        }

        return exercises.value
      }

      // Unauthenticated mode - only get default exercises
      const { data, error: fetchError } = await supabase
        .from('exercises')
        .select('*')
        .is('user_id', null)
        .order('name')

      if (fetchError) throw fetchError

      exercises.value = data.map(exercise => new Exercise({
        id: exercise.id,
        name: exercise.name,
        category: exercise.category,
        muscleGroups: exercise.muscle_groups || [],
        description: exercise.description,
        isCustom: false,
        userId: null,
        createdAt: new Date(exercise.created_at),
        updatedAt: new Date(exercise.updated_at)
      }))

      initialized.value = true
      return exercises.value
    } catch (err) {
      console.error('Error fetching exercises:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createCustomExercise = async (exerciseData) => {
    if (authStore.isOfflineMode) {
      const newExercise = {
        id: `local-${Date.now()}`,
        name: exerciseData.name,
        category: exerciseData.category,
        muscleGroups: exerciseData.muscleGroups || [],
        description: exerciseData.description,
        isCustom: true,
        userId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      exercises.value.push(newExercise)
      
      // Update localStorage
      localStorage.setItem('offlineExercises', JSON.stringify(exercises.value))
      return newExercise
    }

    if (!authStore.user) return null

    try {
      const { data, error: insertError } = await supabase
        .from('exercises')
        .insert({
          name: exerciseData.name,
          category: exerciseData.category,
          muscle_groups: exerciseData.muscleGroups || [],
          description: exerciseData.description,
          is_custom: true,
          user_id: authStore.user.id
        })
        .select()
        .single()

      if (insertError) throw insertError

      const newExercise = {
        id: data.id,
        name: data.name,
        category: data.category,
        muscleGroups: data.muscle_groups || [],
        description: data.description,
        isCustom: true,
        userId: data.user_id,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }

      exercises.value.push(newExercise)
      return newExercise
    } catch (err) {
      console.error('Error creating custom exercise:', err)
      throw err
    }
  }

  const deleteCustomExercise = async (exerciseId) => {
    const exercise = exercises.value.find(ex => ex.id === exerciseId)
    if (!exercise || !exercise.isCustom) return false

    // Handle offline mode
    if (authStore.isOfflineMode) {
      exercises.value = exercises.value.filter(ex => ex.id !== exerciseId)
      localStorage.setItem('offlineExercises', JSON.stringify(exercises.value))
      return true
    }

    try {
      const { error: deleteError } = await supabase
        .from('exercises')
        .delete()
        .eq('id', exerciseId)
        .eq('user_id', authStore.user.id)

      if (deleteError) throw deleteError

      exercises.value = exercises.value.filter(ex => ex.id !== exerciseId)
      return true
    } catch (err) {
      console.error('Error deleting custom exercise:', err)
      throw err
    }
  }

  const reset = () => {
    exercises.value = []
    initialized.value = false
    error.value = null
  }

  return {
    exercises,
    loading,
    error,
    allExercises,
    exercisesByMuscleGroup,
    findExerciseByName,
    fetchAll,
    createCustomExercise,
    deleteCustomExercise,
    reset
  }
}) 