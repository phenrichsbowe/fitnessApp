import Workout from './Workout';
import Exercise from './Exercise';

export default class WorkoutManager {
  constructor() {
    this.workouts = [];
  }

  getWorkoutByDate(date) {
    const dateKey = date.toISOString().split('T')[0];
    return this.workouts.find(workout => workout.date.toISOString().split('T')[0] === dateKey);
  }

  getWorkouts(date) {
    const workout = this.getWorkoutByDate(date);
    return workout ? workout.getExercises() : [];
  }

  addWorkout(date) {
    const existingWorkout = this.getWorkoutByDate(date);
    if (!existingWorkout) {
      const newWorkout = new Workout(date);
      this.workouts.push(newWorkout);
      return newWorkout;
    }
    return existingWorkout;
  }

  addExercise(date, exerciseData) {
    console.log(date, exerciseData)
    const workout = this.addWorkout(date);
    const exercise = Exercise.createExercise(exerciseData.name, exerciseData.sets, exerciseData.reps);
    workout.addExercise(exercise);
  }

  removeExercise(date, exerciseIndex) {
    const workout = this.getWorkoutByDate(date);
    if (workout) {
      workout.removeExercise(exerciseIndex);
    }
  }

  updateExercise(date, exerciseIndex, exerciseData) {
    const workout = this.getWorkoutByDate(date);

    if (workout) {
      const exercise = workout.getExercises()[exerciseIndex];

      if (exercise) {
        exercise.update(exerciseData.name, exerciseData.sets, exerciseData.reps);
      }
    }
  }
}
