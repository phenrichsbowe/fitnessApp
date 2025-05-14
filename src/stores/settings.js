import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const isMetric = ref(true) // Default to metric
  const notifications = ref(true)
  const enableTips = ref(false)
  const language = ref('English')

  // Convert weight between metric and imperial
  const convertWeight = (weight, toMetric) => {
    if (!weight) return weight
    return toMetric 
      ? Math.round(weight * 0.45359237 * 100) / 100  // lbs to kg
      : Math.round(weight * 2.20462262 * 100) / 100  // kg to lbs
  }

  // Get the appropriate weight unit based on current setting
  const weightUnit = computed(() => isMetric.value ? 'kg' : 'lbs')

  // Save settings to localStorage
  const saveSettings = () => {
    localStorage.setItem('settings', JSON.stringify({
      isMetric: isMetric.value,
      notifications: notifications.value,
      enableTips: enableTips.value,
      language: language.value
    }))
  }

  // Load settings from localStorage
  const loadSettings = () => {
    const settings = JSON.parse(localStorage.getItem('settings'))
    if (settings) {
      isMetric.value = settings.isMetric ?? true
      notifications.value = settings.notifications ?? true
      enableTips.value = settings.enableTips ?? false
      language.value = settings.language ?? 'English'
    }
  }

  // Initialize settings on store creation
  loadSettings()

  return {
    isMetric,
    notifications,
    enableTips,
    language,
    weightUnit,
    convertWeight,
    saveSettings,
    loadSettings
  }
}) 