/**
 * Mood Tracker - Handles mood tracking functionality with data visualization
 * Includes mood entry, history tracking, and trend analysis
 */

class MoodTracker {
    constructor() {
        this.selectedMood = null;
        this.chart = null;
        this.initializeEventListeners();
        this.loadMoodData();
        this.updateMoodStats();
    }

    /**
     * Initialize event listeners for mood tracking
     */
    initializeEventListeners() {
        // Mood selection
        document.querySelectorAll('.mood-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectMood(e.currentTarget);
            });
        });

        // Save mood button
        const saveMoodBtn = document.getElementById('save-mood');
        if (saveMoodBtn) {
            saveMoodBtn.addEventListener('click', () => {
                this.saveMood();
            });
        }
    }

    /**
     * Handle mood selection
     */
    selectMood(option) {
        // Remove previous selection
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });

        // Add selection to clicked option
        option.classList.add('selected');
        this.selectedMood = parseInt(option.dataset.mood);
    }

    /**
     * Save mood entry
     */
    async saveMood() {
        if (!this.selectedMood) {
            this.showNotification('Please select a mood first', 'warning');
            return;
        }

        const notes = document.getElementById('mood-notes').value.trim();
        const moodData = {
            mood: this.selectedMood,
            notes: notes,
            timestamp: new Date().toISOString()
        };

        try {
            // Save to data manager
            const savedEntry = window.dataManager.addMoodEntry(moodData);
            
            // Show success message
            this.showNotification('Mood saved successfully!', 'success');
            
            // Clear form
            this.clearForm();
            
            // Update display
            this.updateMoodStats();
            this.updateMoodChart();
            
            // Show encouraging message based on mood
            this.showMoodEncouragement(savedEntry.mood);
            
        } catch (error) {
            console.error('Error saving mood:', error);
            this.showNotification('Error saving mood. Please try again.', 'error');
        }
    }

    /**
     * Clear mood entry form
     */
    clearForm() {
        this.selectedMood = null;
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.getElementById('mood-notes').value = '';
    }

    /**
     * Load and display mood data
     */
    loadMoodData() {
        this.updateMoodStats();
        this.updateMoodChart();
    }

    /**
     * Update mood statistics display
     */
    updateMoodStats() {
        const stats = window.dataManager.getMoodStats();
        
        // Update stat elements
        const avgMoodEl = document.getElementById('avg-mood');
        const bestMoodEl = document.getElementById('best-mood');
        const daysTrackedEl = document.getElementById('days-tracked');
        
        if (avgMoodEl) avgMoodEl.textContent = stats.average > 0 ? stats.average.toFixed(1) : '-';
        if (bestMoodEl) bestMoodEl.textContent = stats.best > 0 ? stats.best : '-';
        if (daysTrackedEl) daysTrackedEl.textContent = stats.totalDays;
    }

    /**
     * Update mood chart visualization
     */
    updateMoodChart() {
        const moodData = window.dataManager.getMoodData();
        const canvas = document.getElementById('mood-chart');
        
        if (!canvas || moodData.length === 0) {
            this.showNoDataMessage();
            return;
        }

        // Clear previous chart
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Prepare data for chart (last 30 days)
        const last30Days = this.getLast30DaysData(moodData);
        this.drawMoodChart(ctx, last30Days);
    }

    /**
     * Get mood data for the last 30 days
     */
    getLast30DaysData(moodData) {
        const last30Days = [];
        const today = new Date();
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toDateString();
            
            const dayData = moodData.find(entry => entry.date === dateString);
            last30Days.push({
                date: dateString,
                mood: dayData ? dayData.mood : null,
                notes: dayData ? dayData.notes : null
            });
        }
        
        return last30Days;
    }

    /**
     * Draw mood chart on canvas
     */
    drawMoodChart(ctx, data) {
        const canvas = ctx.canvas;
        const padding = 40;
        const chartWidth = canvas.width - (padding * 2);
        const chartHeight = canvas.height - (padding * 2);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid lines
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // Draw mood line
        this.drawMoodLine(ctx, data, padding, chartWidth, chartHeight);
        
        // Draw data points
        this.drawDataPoints(ctx, data, padding, chartWidth, chartHeight);
        
        // Draw labels
        this.drawLabels(ctx, padding, chartWidth, chartHeight);
    }

    /**
     * Draw grid lines for the chart
     */
    drawGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#e1e8ed';
        ctx.lineWidth = 1;
        
        // Horizontal lines (mood levels)
        for (let i = 1; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * (5 - i);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
        
        // Vertical lines (days)
        const daySpacing = chartWidth / 6;
        for (let i = 1; i <= 5; i++) {
            const x = padding + daySpacing * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
    }

    /**
     * Draw mood line connecting data points
     */
    drawMoodLine(ctx, data, padding, chartWidth, chartHeight) {
        const validData = data.filter(d => d.mood !== null);
        if (validData.length < 2) return;
        
        ctx.strokeStyle = '#4A90E2';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        validData.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * data.indexOf(point);
            const y = padding + chartHeight - (chartHeight / 4) * (point.mood - 1);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
    }

    /**
     * Draw data points on the chart
     */
    drawDataPoints(ctx, data, padding, chartWidth, chartHeight) {
        const validData = data.filter(d => d.mood !== null);
        
        validData.forEach(point => {
            const x = padding + (chartWidth / (data.length - 1)) * data.indexOf(point);
            const y = padding + chartHeight - (chartHeight / 4) * (point.mood - 1);
            
            // Draw point
            ctx.fillStyle = '#4A90E2';
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
            
            // Draw white border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    }

    /**
     * Draw chart labels
     */
    drawLabels(ctx, padding, chartWidth, chartHeight) {
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        
        // Y-axis labels (mood levels)
        for (let i = 1; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * (5 - i) + 4;
            ctx.fillText(i.toString(), padding - 20, y);
        }
        
        // X-axis labels (days)
        const daySpacing = chartWidth / 6;
        const days = ['Mon', 'Wed', 'Fri', 'Sun', 'Tue', 'Thu'];
        for (let i = 0; i < 6; i++) {
            const x = padding + daySpacing * i;
            ctx.fillText(days[i], x, padding + chartHeight + 20);
        }
    }

    /**
     * Show message when no data is available
     */
    showNoDataMessage() {
        const canvas = document.getElementById('mood-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#7F8C8D';
        ctx.font = '16px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Start tracking your mood to see your chart here', canvas.width / 2, canvas.height / 2);
    }

    /**
     * Show encouraging message based on mood
     */
    showMoodEncouragement(mood) {
        const messages = {
            1: "I'm sorry you're feeling low. Remember that difficult feelings are temporary, and you're not alone. Is there anything specific that's been weighing on you?",
            2: "I hear that you're having a tough time. It's okay to not be okay. What's one small thing that might help you feel a little better today?",
            3: "Neutral feelings are completely normal. Sometimes we need to just be where we are. How has your day been overall?",
            4: "It's wonderful that you're feeling good! What's contributing to this positive mood?",
            5: "That's fantastic! I'm so glad you're feeling great. What's been going well for you lately?"
        };

        const message = messages[mood] || "Thank you for sharing your mood with me.";
        
        // Show in chat if chat is active
        if (window.app && window.app.chatInterface) {
            window.app.chatInterface.addBotMessage(message);
        }
    }

    /**
     * Get mood trend analysis
     */
    getMoodTrend() {
        const moodData = window.dataManager.getMoodData();
        if (moodData.length < 7) return 'insufficient_data';
        
        const recentWeek = moodData.slice(-7);
        const previousWeek = moodData.slice(-14, -7);
        
        if (previousWeek.length < 7) return 'insufficient_data';
        
        const recentAvg = recentWeek.reduce((sum, entry) => sum + entry.mood, 0) / recentWeek.length;
        const previousAvg = previousWeek.reduce((sum, entry) => sum + entry.mood, 0) / previousWeek.length;
        
        const difference = recentAvg - previousAvg;
        
        if (difference > 0.5) return 'improving';
        if (difference < -0.5) return 'declining';
        return 'stable';
    }

    /**
     * Export mood data
     */
    exportMoodData() {
        const moodData = window.dataManager.getMoodData();
        const exportData = {
            exportDate: new Date().toISOString(),
            totalEntries: moodData.length,
            moodData: moodData,
            stats: window.dataManager.getMoodStats()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mood-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '9999',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#27AE60',
            warning: '#F39C12',
            error: '#E74C3C',
            info: '#4A90E2'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * Get mood insights
     */
    getMoodInsights() {
        const moodData = window.dataManager.getMoodData();
        if (moodData.length < 7) return null;
        
        const insights = [];
        const stats = window.dataManager.getMoodStats();
        
        // Trend insight
        if (stats.recentTrend === 'improving') {
            insights.push("Your mood has been improving recently! Keep up the great work.");
        } else if (stats.recentTrend === 'declining') {
            insights.push("I notice your mood has been lower lately. Remember that it's okay to reach out for support.");
        }
        
        // Consistency insight
        const moodVariance = this.calculateMoodVariance(moodData);
        if (moodVariance < 1) {
            insights.push("Your mood has been quite consistent. This stability can be a good foundation for growth.");
        }
        
        // Best day insight
        const bestDay = moodData.reduce((best, current) => 
            current.mood > best.mood ? current : best
        );
        if (bestDay.notes) {
            insights.push(`Your best day was when you noted: "${bestDay.notes}". What made that day special?`);
        }
        
        return insights;
    }

    /**
     * Calculate mood variance
     */
    calculateMoodVariance(moodData) {
        const moods = moodData.map(entry => entry.mood);
        const mean = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - mean, 2), 0) / moods.length;
        return Math.sqrt(variance);
    }
}

// Initialize mood tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.moodTracker = new MoodTracker();
});
