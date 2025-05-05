import { supabase } from '@/lib/supabase'

export default  class ExerciseStore {
  constructor() {
    this.exercises = []
    this.loading = false
    this.error = null
  }

  async fetchAll() {
    this.loading = true
    this.error = null

    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching exercises:', error.message)
      this.error = error.message
    } else {
      this.exercises = data
    }

    this.loading = false
  }

  async addExercise(name, category) {
    const { data, error } = await supabase
      .from('exercises')
      .insert([{ name, category }])
      .select()

    if (error) {
      console.error('Error adding exercise:', error.message)
      return null
    }

    if (data && data.length > 0) {
      this.exercises.push(data[0])
      return data[0]
    }

    return null
  }

  getAll() {
    return this.exercises
  }

  getByCategory(category) {
    return this.exercises.filter(ex => ex.category === category)
  }

  search(term) {
    const lower = term.toLowerCase()
    return this.exercises.filter(ex => ex.name.toLowerCase().includes(lower))
  }
}
