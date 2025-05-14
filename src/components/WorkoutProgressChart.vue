<template>
  <div class="chart-container">
    <Line
      v-if="loaded"
      :data="chartData"
      :options="chartOptions"
    />
    <v-skeleton-loader
      v-else
      type="image"
      height="300"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { useWorkoutStore } from '@/stores/workout'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const workoutStore = useWorkoutStore()
const loaded = ref(false)

// Chart configuration
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Your Workout Progress'
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Exercises Completed'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Date'
      }
    }
  }
}

const chartData = computed(() => {
  const workouts = workoutStore.workouts
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  return {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Exercises Completed',
        backgroundColor: 'rgba(71, 183, 132, 0.2)',
        borderColor: '#47b784',
        borderWidth: 2,
        data: last7Days.map(date => {
          const workout = workouts.find(w => 
            w.date.toISOString().split('T')[0] === date
          )
          return workout ? workout.exercises.length : 0
        })
      }
    ]
  }
})

onMounted(async () => {
  try {
    await workoutStore.fetchWorkouts()
    loaded.value = true
  } catch (error) {
    console.error('Error loading workout data:', error)
  }
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin: 20px 0;
}
</style> 