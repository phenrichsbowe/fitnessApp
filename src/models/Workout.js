export default class Workout {
  constructor(date = new Date()) {
    this.date = date;
    this.exercises = [];
  }

  addExercise(exercise) {
    this.exercises.push(exercise);
  }

  removeExercise(index) {
    this.exercises.splice(index, 1);
  }

  getExercises() {
    return this.exercises;
  }
}