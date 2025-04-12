export default class Exercise {
  constructor(name = '', sets = 0, reps = 0) {
    this.name = name;
    this.sets = sets;
    this.reps = reps;
  }

  update(name, sets, reps) {
    this.name = name;
    this.sets = sets;
    this.reps = reps;
  }

  static createExercise(name, sets, reps) {
    return new Exercise(name, sets, reps);
  }
}