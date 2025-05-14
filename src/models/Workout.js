import { Exercise } from './Exercise'

export class Workout {
  constructor({
    id = null,
    name = '',
    date = new Date(),
    exercises = [],
    duration = 0,
    notes = '',
    userId = null,
    completed = false,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id
    this.name = name
    this.date = new Date(date)
    this.exercises = exercises.map(ex => ex instanceof Exercise ? ex : new Exercise(ex))
    this.duration = duration
    this.notes = notes
    this.userId = userId
    this.completed = completed
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  addExercise(exercise) {
    this.exercises.push(exercise instanceof Exercise ? exercise : new Exercise(exercise))
  }

  removeExercise(index) {
    if (index >= 0 && index < this.exercises.length) {
      this.exercises.splice(index, 1)
    }
  }

  updateExercise(index, exercise) {
    if (index >= 0 && index < this.exercises.length) {
      this.exercises[index] = exercise instanceof Exercise ? exercise : new Exercise(exercise)
    }
  }

  get totalSets() {
    return this.exercises.reduce((total, exercise) => total + exercise.sets.length, 0)
  }

  get completedSets() {
    return this.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0)
  }

  get progress() {
    return this.totalSets > 0 ? (this.completedSets / this.totalSets) * 100 : 0
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      date: this.date,
      exercises: this.exercises.map(ex => ex.toJSON()),
      duration: this.duration,
      notes: this.notes,
      userId: this.userId,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
} 