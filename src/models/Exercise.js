export class Exercise {
  constructor({
    id = null,
    name,
    category,
    muscleGroups = [],
    sets = [],
    userId = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id
    this.name = name
    this.category = category
    this.muscleGroups = muscleGroups
    this.sets = sets
    this.userId = userId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  addSet(weight, reps) {
    this.sets.push({ weight, reps, completed: false })
  }

  removeSet(index) {
    if (index >= 0 && index < this.sets.length) {
      this.sets.splice(index, 1)
    }
  }

  toggleSetCompletion(index) {
    if (index >= 0 && index < this.sets.length) {
      this.sets[index].completed = !this.sets[index].completed
    }
  }

  updateSet(index, weight, reps) {
    if (index >= 0 && index < this.sets.length) {
      this.sets[index] = { ...this.sets[index], weight, reps }
    }
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      category: this.category,
      muscleGroups: this.muscleGroups,
      sets: this.sets,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }
  }
} 