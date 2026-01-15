/**
 * Time Utilities
 * Handles time-aware logic (e.g., after 11 PM behavior)
 */

/**
 * Check if current time is after 11 PM
 * @param {Date} date - Date to check (defaults to now)
 * @returns {boolean} Is night time
 */
export function isNightTime(date = new Date()) {
  return date.getHours() >= 23 || date.getHours() < 6;
}

/**
 * Get time of day category
 * @param {Date} date - Date to check (defaults to now)
 * @returns {string} Time category
 */
export function getTimeCategory(date = new Date()) {
  const hour = date.getHours();
  
  if (hour >= 23 || hour < 6) {
    return 'night';
  } else if (hour >= 6 && hour < 12) {
    return 'morning';
  } else if (hour >= 12 && hour < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

