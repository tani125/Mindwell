/**
 * Data Manager - Handles all localStorage operations for the mental health chatbot
 * Manages chat history, mood data, check-ins, and user preferences
 */

class DataManager {
    constructor() {
        this.storageKeys = {
            chatHistory: 'mindcare_chat_history',
            moodData: 'mindcare_mood_data',
            checkIns: 'mindcare_checkins',
            userPreferences: 'mindcare_preferences',
            streakData: 'mindcare_streak'
        };
        
        this.initializeData();
    }

    /**
     * Initialize default data structure if not exists
     */
    initializeData() {
        const defaultPreferences = {
            dailyReminders: true,
            moodReminders: true,
            theme: 'light',
            notifications: true
        };

        if (!this.getData(this.storageKeys.userPreferences)) {
            this.saveData(this.storageKeys.userPreferences, defaultPreferences);
        }

        if (!this.getData(this.storageKeys.streakData)) {
            this.saveData(this.storageKeys.streakData, {
                currentStreak: 0,
                longestStreak: 0,
                lastCheckIn: null
            });
        }
    }

    /**
     * Generic data retrieval with error handling
     */
    getData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`Error retrieving data for key ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Generic data saving with error handling
     */
    saveData(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error(`Error saving data for key ${key}:`, error);
            return false;
        }
    }

    /**
     * Chat History Management
     */
    getChatHistory() {
        return this.getData(this.storageKeys.chatHistory, []);
    }

    addChatMessage(message) {
        const chatHistory = this.getChatHistory();
        const newMessage = {
            id: this.generateId(),
            ...message,
            timestamp: new Date().toISOString()
        };
        
        chatHistory.push(newMessage);
        this.saveData(this.storageKeys.chatHistory, chatHistory);
        return newMessage;
    }

    clearChatHistory() {
        this.saveData(this.storageKeys.chatHistory, []);
    }

    /**
     * Mood Data Management
     */
    getMoodData() {
        return this.getData(this.storageKeys.moodData, []);
    }

    addMoodEntry(moodData) {
        const moodHistory = this.getMoodData();
        const newEntry = {
            id: this.generateId(),
            ...moodData,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        moodHistory.push(newEntry);
        this.saveData(this.storageKeys.moodData, moodHistory);
        return newEntry;
    }

    getMoodForDate(date) {
        const moodHistory = this.getMoodData();
        return moodHistory.find(entry => entry.date === date);
    }

    getMoodStats() {
        const moodHistory = this.getMoodData();
        if (moodHistory.length === 0) {
            return {
                average: 0,
                best: 0,
                worst: 0,
                totalDays: 0,
                recentTrend: 'stable'
            };
        }

        const moods = moodHistory.map(entry => entry.mood);
        const average = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        const best = Math.max(...moods);
        const worst = Math.min(...moods);
        
        // Calculate recent trend (last 7 days vs previous 7 days)
        const recentMoods = moodHistory.slice(-7).map(entry => entry.mood);
        const previousMoods = moodHistory.slice(-14, -7).map(entry => entry.mood);
        
        let recentTrend = 'stable';
        if (recentMoods.length >= 3 && previousMoods.length >= 3) {
            const recentAvg = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
            const previousAvg = previousMoods.reduce((sum, mood) => sum + mood, 0) / previousMoods.length;
            
            if (recentAvg > previousAvg + 0.5) recentTrend = 'improving';
            else if (recentAvg < previousAvg - 0.5) recentTrend = 'declining';
        }

        return {
            average: Math.round(average * 10) / 10,
            best,
            worst,
            totalDays: moodHistory.length,
            recentTrend
        };
    }

    /**
     * Check-in Management
     */
    getCheckIns() {
        return this.getData(this.storageKeys.checkIns, []);
    }

    addCheckIn(checkInData) {
        const checkIns = this.getCheckIns();
        const newCheckIn = {
            id: this.generateId(),
            ...checkInData,
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
        };
        
        checkIns.push(newCheckIn);
        this.saveData(this.storageKeys.checkIns, checkIns);
        
        // Update streak
        this.updateStreak();
        
        return newCheckIn;
    }

    getCheckInForDate(date) {
        const checkIns = this.getCheckIns();
        return checkIns.find(checkIn => checkIn.date === date);
    }

    /**
     * Streak Management
     */
    getStreakData() {
        return this.getData(this.storageKeys.streakData, {
            currentStreak: 0,
            longestStreak: 0,
            lastCheckIn: null
        });
    }

    updateStreak() {
        const streakData = this.getStreakData();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        
        if (streakData.lastCheckIn === today) {
            // Already checked in today
            return streakData.currentStreak;
        }
        
        if (streakData.lastCheckIn === yesterday || streakData.currentStreak === 0) {
            // Consecutive day or first check-in
            streakData.currentStreak += 1;
        } else {
            // Streak broken
            streakData.currentStreak = 1;
        }
        
        streakData.longestStreak = Math.max(streakData.longestStreak, streakData.currentStreak);
        streakData.lastCheckIn = today;
        
        this.saveData(this.storageKeys.streakData, streakData);
        return streakData.currentStreak;
    }

    /**
     * User Preferences Management
     */
    getPreferences() {
        return this.getData(this.storageKeys.userPreferences, {
            dailyReminders: true,
            moodReminders: true,
            theme: 'light',
            notifications: true
        });
    }

    updatePreferences(newPreferences) {
        const currentPreferences = this.getPreferences();
        const updatedPreferences = { ...currentPreferences, ...newPreferences };
        this.saveData(this.storageKeys.userPreferences, updatedPreferences);
        return updatedPreferences;
    }

    /**
     * Data Export/Import
     */
    exportAllData() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            chatHistory: this.getChatHistory(),
            moodData: this.getMoodData(),
            checkIns: this.getCheckIns(),
            preferences: this.getPreferences(),
            streakData: this.getStreakData()
        };
        
        return JSON.stringify(exportData, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate data structure
            if (!data.version || !data.exportDate) {
                throw new Error('Invalid data format');
            }
            
            // Import each data type if it exists
            if (data.chatHistory) {
                this.saveData(this.storageKeys.chatHistory, data.chatHistory);
            }
            if (data.moodData) {
                this.saveData(this.storageKeys.moodData, data.moodData);
            }
            if (data.checkIns) {
                this.saveData(this.storageKeys.checkIns, data.checkIns);
            }
            if (data.preferences) {
                this.saveData(this.storageKeys.userPreferences, data.preferences);
            }
            if (data.streakData) {
                this.saveData(this.storageKeys.streakData, data.streakData);
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    clearAllData() {
        Object.values(this.storageKeys).forEach(key => {
            localStorage.removeItem(key);
        });
        this.initializeData();
    }

    /**
     * Utility Functions
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    formatTime(date) {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Data validation
     */
    validateMoodData(moodData) {
        return moodData && 
               typeof moodData.mood === 'number' && 
               moodData.mood >= 1 && 
               moodData.mood <= 5;
    }

    validateCheckInData(checkInData) {
        return checkInData && 
               typeof checkInData.dayRating === 'number' && 
               checkInData.dayRating >= 1 && 
               checkInData.dayRating <= 5;
    }

    /**
     * Get data summary for dashboard
     */
    getDataSummary() {
        const chatHistory = this.getChatHistory();
        const moodData = this.getMoodData();
        const checkIns = this.getCheckIns();
        const streakData = this.getStreakData();
        const moodStats = this.getMoodStats();

        return {
            totalMessages: chatHistory.length,
            totalMoodEntries: moodData.length,
            totalCheckIns: checkIns.length,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            averageMood: moodStats.average,
            recentTrend: moodStats.recentTrend,
            lastActivity: this.getLastActivityDate()
        };
    }

    getLastActivityDate() {
        const chatHistory = this.getChatHistory();
        const moodData = this.getMoodData();
        const checkIns = this.getCheckIns();
        
        const dates = [
            ...chatHistory.map(msg => new Date(msg.timestamp)),
            ...moodData.map(entry => new Date(entry.timestamp)),
            ...checkIns.map(checkIn => new Date(checkIn.timestamp))
        ];
        
        if (dates.length === 0) return null;
        
        const lastDate = new Date(Math.max(...dates));
        return this.formatDate(lastDate);
    }
}

// Initialize global data manager instance
window.dataManager = new DataManager();
