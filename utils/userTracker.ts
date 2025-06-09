// utils/userTracker.ts

interface UserTrackerData {
    [userId: string]: number; // A map where keys are user IDs and values are their counts
  }
  
  const USER_TRACKER_KEY = 'unsignedUserTracker'; // Key for localStorage to store all user counts
  const USER_ID_KEY = 'unsignedUserId'; // Key for localStorage to store the current user's ID
  
  /**
   * Generates a unique ID for an unsigned user.
   * @returns {string} A unique ID string.
   */
  function generateUniqueId(): string {
    return 'user_' + Date.now() + Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Initializes or retrieves the unsigned user's tracking data.
   * If no user ID exists, a new one is generated and stored.
   * If no count exists for the current user, it's initialized to 0.
   * @returns {{userId: string, count: number}} An object containing the current user's ID and count.
   */
  export function initializeUserTracking(): { userId: string; count: number } {
    let userId = localStorage.getItem(USER_ID_KEY);
    let trackerData: UserTrackerData = JSON.parse(localStorage.getItem(USER_TRACKER_KEY) || '{}');
  
    if (!userId) {
      userId = generateUniqueId();
      localStorage.setItem(USER_ID_KEY, userId);
    }
  
    // Ensure this specific user's count exists
    if (typeof trackerData[userId] === 'undefined') {
      trackerData[userId] = 0; // Initialize count for this user
      localStorage.setItem(USER_TRACKER_KEY, JSON.stringify(trackerData));
    }
  
    return {
      userId: userId,
      count: trackerData[userId]
    };
  }
  
  /**
   * Increments the count for the current unsigned user.
   * @returns {number} The new, incremented count.
   */
  export function incrementUserCount(): number {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      console.warn("User ID not found. Initialize tracking first.");
      return 0;
    }
  
    let trackerData: UserTrackerData = JSON.parse(localStorage.getItem(USER_TRACKER_KEY) || '{}');
  
    if (typeof trackerData[userId] === 'undefined') {
      trackerData[userId] = 0; // Initialize if somehow missing
    }
  
    trackerData[userId]++;
    localStorage.setItem(USER_TRACKER_KEY, JSON.stringify(trackerData));
    return trackerData[userId];
  }
  
  /**
   * Resets the count for the current unsigned user to 0.
   * @returns {number} The new count (which is 0).
   */
  export function resetUserCount(): number {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      console.warn("User ID not found. Initialize tracking first.");
      return 0;
    }
  
    let trackerData: UserTrackerData = JSON.parse(localStorage.getItem(USER_TRACKER_KEY) || '{}');
    trackerData[userId] = 0;
    localStorage.setItem(USER_TRACKER_KEY, JSON.stringify(trackerData));
    return 0;
  }
  
  /**
   * Gets the current count for the unsigned user.
   * @returns {number} The current count, or 0 if no user ID or count found.
   */
  export function getUnsignedUserCount(): number {
    const userId = localStorage.getItem(USER_ID_KEY);
    if (!userId) {
      return 0;
    }
    const trackerData: UserTrackerData = JSON.parse(localStorage.getItem(USER_TRACKER_KEY) || '{}');
    return trackerData[userId] || 0;
  }
  
  /**
   * Gets the ID of the current unsigned user.
   * @returns {string | null} The user ID, or null if not set.
   */
  export function getUnsignedUserId(): string | null {
    return localStorage.getItem(USER_ID_KEY);
  }