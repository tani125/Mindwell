/**
 * Main Application - Handles navigation, chat interface, and app coordination
 * Manages the overall application state and user interactions
 */

class MentalHealthApp {
    constructor() {
        this.currentSection = 'chat';
        this.currentLanguage = 'en';
        this.chatInterface = null;
        this.moodTracker = null;
        this.checkInSystem = null;
        this.resourceModal = null;
        
        this.initializeApp();
    }

    /**
     * Initialize the application
     */
    initializeApp() {
        this.setupNavigation();
        this.initializeMobileMenu();
        this.initializeLanguageSystem();
        this.initializeChatInterface();
        this.initializeCheckInSystem();
        this.initializeResourceModal();
        this.initializeSettings();
        this.initializeThemeToggle();
        this.loadInitialData();
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup navigation between sections
     */
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
                this.closeMobileMenu(); // Close mobile menu after navigation
            });
        });
    }

    /**
     * Initialize mobile menu functionality
     */
    initializeMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const mobileCloseBtn = document.getElementById('mobile-close-btn');
        const sidebar = document.getElementById('sidebar');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.openMobileMenu();
            });
        }
        
        if (mobileCloseBtn) {
            mobileCloseBtn.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (sidebar && sidebar.classList.contains('open')) {
                if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
                this.closeMobileMenu();
            }
        });
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebar) {
            sidebar.classList.add('open');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
        
        if (mobileMenuToggle) {
            mobileMenuToggle.style.display = 'none';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        
        if (sidebar) {
            sidebar.classList.remove('open');
            document.body.style.overflow = ''; // Restore scrolling
        }
        
        if (mobileMenuToggle) {
            mobileMenuToggle.style.display = 'flex';
        }
    }

    /**
     * Initialize language system
     */
    initializeLanguageSystem() {
        this.translations = this.initializeTranslations();
        this.setupLanguageSwitcher();
        this.loadSavedLanguage();
    }

    /**
     * Setup language switcher event listener
     */
    setupLanguageSwitcher() {
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.changeLanguage(e.target.value);
            });
        }
    }

    /**
     * Load saved language preference
     */
    loadSavedLanguage() {
        const savedLanguage = localStorage.getItem('app-language') || 'en';
        this.changeLanguage(savedLanguage);
    }

    /**
     * Change application language
     */
    changeLanguage(languageCode) {
        this.currentLanguage = languageCode;
        localStorage.setItem('app-language', languageCode);
        
        // Update language selector
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = languageCode;
        }
        
        // Update all UI elements
        this.updateUIForLanguage();
        
        // Update chatbot language
        if (window.chatbot) {
            window.chatbot.setLanguage(languageCode);
        }
    }

    /**
     * Update UI elements for current language
     */
    updateUIForLanguage() {
        const currentLang = this.translations[this.currentLanguage];
        
        // Update navigation items
        this.updateElementText('[data-section="chat"] span', currentLang.nav.chat);
        this.updateElementText('[data-section="mood"] span', currentLang.nav.mood);
        this.updateElementText('[data-section="checkin"] span', currentLang.nav.checkin);
        this.updateElementText('[data-section="resources"] span', currentLang.nav.resources);
        this.updateElementText('[data-section="settings"] span', currentLang.nav.settings);
        
        // Update chat section
        this.updateElementText('#chat-section .chat-header h2', currentLang.chat.title);
        this.updateElementText('#chat-section .chat-header p', currentLang.chat.subtitle);
        this.updateElementText('#chat-input', currentLang.chat.placeholder);
        
        // Update mood tracker
        this.updateElementText('#mood-section .mood-header h2', currentLang.mood.title);
        this.updateElementText('#mood-section .mood-header p', currentLang.mood.subtitle);
        this.updateElementText('#mood-section .mood-entry h3', currentLang.mood.question);
        this.updateElementText('#mood-notes label', currentLang.mood.notesLabel);
        this.updateElementText('#mood-notes', currentLang.mood.notesPlaceholder);
        this.updateElementText('#save-mood', currentLang.mood.saveButton);
        
        // Update check-in section
        this.updateElementText('#checkin-section .checkin-header h2', currentLang.checkin.title);
        this.updateElementText('#checkin-section .checkin-header p', currentLang.checkin.subtitle);
        
        // Update resources section
        this.updateElementText('#resources-section .resources-header h2', currentLang.resources.title);
        this.updateElementText('#resources-section .resources-header p', currentLang.resources.subtitle);
        
        // Update settings section
        this.updateElementText('#settings-section .settings-header h2', currentLang.settings.title);
        this.updateElementText('#settings-section .settings-header p', currentLang.settings.subtitle);
    }

    /**
     * Helper method to update element text
     */
    updateElementText(selector, text) {
        const element = document.querySelector(selector);
        if (element) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    }

    /**
     * Initialize translations for all supported languages
     */
    initializeTranslations() {
        return {
            en: {
                nav: {
                    chat: "Local Chat",
                    mood: "Mood Tracker",
                    checkin: "Daily Check-in",
                    resources: "Resources",
                    settings: "Settings"
                },
                chat: {
                    title: "Local Wellness Chat",
                    subtitle: "Simple pattern-matching mental health support",
                    placeholder: "Type your message here..."
                },
                mood: {
                    title: "Mood Tracker",
                    subtitle: "Track your daily mood and see patterns over time",
                    question: "How are you feeling today?",
                    notesLabel: "Optional notes:",
                    notesPlaceholder: "What's contributing to your mood today?",
                    saveButton: "Save Mood"
                },
                checkin: {
                    title: "Daily Check-in",
                    subtitle: "Reflect on your day and set intentions for tomorrow"
                },
                resources: {
                    title: "Mental Health Resources",
                    subtitle: "Tools and techniques to support your mental wellness"
                },
                settings: {
                    title: "Settings",
                    subtitle: "Customize your experience"
                }
            },
            hi: {
                nav: {
                    chat: "स्थानीय चैट",
                    mood: "मूड ट्रैकर",
                    checkin: "दैनिक जांच",
                    resources: "संसाधन",
                    settings: "सेटिंग्स"
                },
                chat: {
                    title: "स्थानीय कल्याण चैट",
                    subtitle: "सरल पैटर्न-मैचिंग मानसिक स्वास्थ्य सहायता",
                    placeholder: "अपना संदेश यहाँ टाइप करें..."
                },
                mood: {
                    title: "मूड ट्रैकर",
                    subtitle: "अपने दैनिक मूड को ट्रैक करें और समय के साथ पैटर्न देखें",
                    question: "आज आप कैसा महसूस कर रहे हैं?",
                    notesLabel: "वैकल्पिक नोट्स:",
                    notesPlaceholder: "आज आपके मूड में क्या योगदान दे रहा है?",
                    saveButton: "मूड सेव करें"
                },
                checkin: {
                    title: "दैनिक जांच",
                    subtitle: "अपने दिन पर विचार करें और कल के लिए इरादे निर्धारित करें"
                },
                resources: {
                    title: "मानसिक स्वास्थ्य संसाधन",
                    subtitle: "आपके मानसिक कल्याण का समर्थन करने के लिए उपकरण और तकनीक"
                },
                settings: {
                    title: "सेटिंग्स",
                    subtitle: "अपना अनुभव अनुकूलित करें"
                }
            },
            mr: {
                nav: {
                    chat: "स्थानिक चॅट",
                    mood: "मूड ट्रॅकर",
                    checkin: "दैनंदिन तपासणी",
                    resources: "संसाधने",
                    settings: "सेटिंग्ज"
                },
                chat: {
                    title: "स्थानिक कल्याण चॅट",
                    subtitle: "सोपी पॅटर्न-मॅचिंग मानसिक आरोग्य सहायता",
                    placeholder: "आपला संदेश येथे टाइप करा..."
                },
                mood: {
                    title: "मूड ट्रॅकर",
                    subtitle: "आपल्या दैनंदिन मूडचा मागोवा घ्या आणि कालांतराने नमुने पहा",
                    question: "आज तुम्हाला कसे वाटत आहे?",
                    notesLabel: "पर्यायी नोट्स:",
                    notesPlaceholder: "आज तुमच्या मूडमध्ये काय योगदान देत आहे?",
                    saveButton: "मूड सेव्ह करा"
                },
                checkin: {
                    title: "दैनंदिन तपासणी",
                    subtitle: "आपल्या दिवसाचा विचार करा आणि उद्या साठी हेतू निर्धारित करा"
                },
                resources: {
                    title: "मानसिक आरोग्य संसाधने",
                    subtitle: "आपल्या मानसिक कल्याणासाठी साधने आणि तंत्रे"
                },
                settings: {
                    title: "सेटिंग्ज",
                    subtitle: "आपला अनुभव अनुकूलित करा"
                }
            },
            kn: {
                nav: {
                    chat: "ಸ್ಥಳೀಯ ಚಾಟ್",
                    mood: "ಮನಸ್ಥಿತಿ ಟ್ರ್ಯಾಕರ್",
                    checkin: "ದೈನಂದಿನ ಪರಿಶೀಲನೆ",
                    resources: "ಸಂಪನ್ಮೂಲಗಳು",
                    settings: "ಸೆಟ್ಟಿಂಗ್ಗಳು"
                },
                chat: {
                    title: "ಸ್ಥಳೀಯ ಕಲ್ಯಾಣ ಚಾಟ್",
                    subtitle: "ಸರಳ ಪ್ಯಾಟರ್ನ್-ಮ್ಯಾಚಿಂಗ್ ಮಾನಸಿಕ ಆರೋಗ್ಯ ಬೆಂಬಲ",
                    placeholder: "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಇಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ..."
                },
                mood: {
                    title: "ಮನಸ್ಥಿತಿ ಟ್ರ್ಯಾಕರ್",
                    subtitle: "ನಿಮ್ಮ ದೈನಂದಿನ ಮನಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ ಮತ್ತು ಕಾಲಾನಂತರದಲ್ಲಿ ಮಾದರಿಗಳನ್ನು ನೋಡಿ",
                    question: "ಇಂದು ನಿಮಗೆ ಹೇಗೆ ಅನಿಸುತ್ತಿದೆ?",
                    notesLabel: "ಐಚ್ಛಿಕ ಟಿಪ್ಪಣಿಗಳು:",
                    notesPlaceholder: "ಇಂದು ನಿಮ್ಮ ಮನಸ್ಥಿತಿಗೆ ಏನು ಕೊಡುಗೆ ನೀಡುತ್ತಿದೆ?",
                    saveButton: "ಮನಸ್ಥಿತಿ ಉಳಿಸಿ"
                },
                checkin: {
                    title: "ದೈನಂದಿನ ಪರಿಶೀಲನೆ",
                    subtitle: "ನಿಮ್ಮ ದಿನದ ಬಗ್ಗೆ ಯೋಚಿಸಿ ಮತ್ತು ನಾಳೆಗಾಗಿ ಉದ್ದೇಶಗಳನ್ನು ಹೊಂದಿಸಿ"
                },
                resources: {
                    title: "ಮಾನಸಿಕ ಆರೋಗ್ಯ ಸಂಪನ್ಮೂಲಗಳು",
                    subtitle: "ನಿಮ್ಮ ಮಾನಸಿಕ ಕಲ್ಯಾಣವನ್ನು ಬೆಂಬಲಿಸಲು ಸಾಧನಗಳು ಮತ್ತು ತಂತ್ರಗಳು"
                },
                settings: {
                    title: "ಸೆಟ್ಟಿಂಗ್ಗಳು",
                    subtitle: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹೊಂದಾಣಿಕೆ ಮಾಡಿ"
                }
            }
        };
    }

    /**
     * Switch to a different section
     */
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        const navItem = document.querySelector(`[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }

        // Update content sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        this.currentSection = sectionName;

        // Load section-specific data
        this.loadSectionData(sectionName);
    }

    /**
     * Load data specific to each section
     */
    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'chat':
                this.loadChatHistory();
                break;
            case 'mood':
                if (window.moodTracker) {
                    window.moodTracker.loadMoodData();
                }
                break;
            case 'checkin':
                this.loadCheckInHistory();
                break;
            case 'resources':
                // Resources are static, no data loading needed
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    /**
     * Initialize chat interface
     */
    initializeChatInterface() {
        this.chatInterface = new ChatInterface();
    }

    /**
     * Initialize check-in system
     */
    initializeCheckInSystem() {
        this.checkInSystem = new CheckInSystem();
    }

    /**
     * Initialize resource modal
     */
    initializeResourceModal() {
        this.resourceModal = new ResourceModal();
    }

    /**
     * Initialize settings functionality
     */
    initializeSettings() {
        this.setupSettingsEventListeners();
    }

    /**
     * Initialize theme toggle
     */
    initializeThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            // Load saved theme
            const savedTheme = window.dataManager.getPreferences().theme || 'light';
            this.applyTheme(savedTheme);
            themeToggle.checked = savedTheme === 'dark';
            
            // Add event listener
            themeToggle.addEventListener('change', (e) => {
                const theme = e.target.checked ? 'dark' : 'light';
                this.applyTheme(theme);
                this.updatePreferences({ theme });
            });
        }
    }

    /**
     * Apply theme to the document
     */
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    /**
     * Setup settings event listeners
     */
    setupSettingsEventListeners() {
        // Export data
        const exportBtn = document.getElementById('export-data');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportAllData();
            });
        }

        // Import data
        const importBtn = document.getElementById('import-data');
        const importFile = document.getElementById('import-file');
        if (importBtn && importFile) {
            importBtn.addEventListener('click', () => {
                importFile.click();
            });
            
            importFile.addEventListener('change', (e) => {
                this.importData(e.target.files[0]);
            });
        }

        // Clear data
        const clearBtn = document.getElementById('clear-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearAllData();
            });
        }

        // Notification settings
        const dailyReminders = document.getElementById('daily-reminders');
        const moodReminders = document.getElementById('mood-reminders');
        
        if (dailyReminders) {
            dailyReminders.addEventListener('change', (e) => {
                this.updatePreferences({ dailyReminders: e.target.checked });
            });
        }
        
        if (moodReminders) {
            moodReminders.addEventListener('change', (e) => {
                this.updatePreferences({ moodReminders: e.target.checked });
            });
        }
    }

    /**
     * Load initial application data
     */
    loadInitialData() {
        this.updateStreakDisplay();
        this.loadChatHistory();
    }

    /**
     * Load chat history
     */
    loadChatHistory() {
        const chatHistory = window.dataManager.getChatHistory();
        const chatMessages = document.getElementById('chat-messages');
        
        if (!chatMessages) return;

        // Clear existing messages
        chatMessages.innerHTML = '';

        // Add messages from history
        chatHistory.forEach(message => {
            this.addMessageToChat(message);
        });

        // Scroll to bottom
        this.scrollChatToBottom();
    }

    /**
     * Add message to chat display
     */
    addMessageToChat(message) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = message.sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `
            <p>${message.text}</p>
            <span class="message-time">${this.formatTime(message.timestamp)}</span>
        `;
        
        messageEl.appendChild(avatar);
        messageEl.appendChild(content);
        chatMessages.appendChild(messageEl);
    }

    /**
     * Load check-in history
     */
    loadCheckInHistory() {
        const checkIns = window.dataManager.getCheckIns();
        const checkInList = document.getElementById('checkin-list');
        
        if (!checkInList) return;

        checkInList.innerHTML = '';

        if (checkIns.length === 0) {
            checkInList.innerHTML = '<p class="no-data">No check-ins yet. Complete your first check-in to get started!</p>';
            return;
        }

        // Show last 5 check-ins
        checkIns.slice(-5).reverse().forEach(checkIn => {
            const checkInEl = document.createElement('div');
            checkInEl.className = 'checkin-item';
            checkInEl.innerHTML = `
                <div class="checkin-date">${window.dataManager.formatDate(checkIn.timestamp)}</div>
                <div class="checkin-rating">Day Rating: ${checkIn.dayRating}/5</div>
                ${checkIn.positiveThings ? `<div class="checkin-detail"><strong>What went well:</strong> ${checkIn.positiveThings}</div>` : ''}
                ${checkIn.gratitude ? `<div class="checkin-detail"><strong>Gratitude:</strong> ${checkIn.gratitude}</div>` : ''}
            `;
            checkInList.appendChild(checkInEl);
        });
    }

    /**
     * Load settings
     */
    loadSettings() {
        const preferences = window.dataManager.getPreferences();
        
        const dailyReminders = document.getElementById('daily-reminders');
        const moodReminders = document.getElementById('mood-reminders');
        
        if (dailyReminders) dailyReminders.checked = preferences.dailyReminders;
        if (moodReminders) moodReminders.checked = preferences.moodReminders;
    }

    /**
     * Update streak display
     */
    updateStreakDisplay() {
        const streakData = window.dataManager.getStreakData();
        const streakCount = document.getElementById('streak-count');
        
        if (streakCount) {
            streakCount.textContent = streakData.currentStreak;
        }
    }

    /**
     * Export all data
     */
    exportAllData() {
        try {
            const exportData = window.dataManager.exportAllData();
            const blob = new Blob([exportData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `mindcare-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Error exporting data', 'error');
        }
    }

    /**
     * Import data from file
     */
    importData(file) {
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const success = window.dataManager.importData(e.target.result);
                if (success) {
                    this.showNotification('Data imported successfully!', 'success');
                    this.loadInitialData();
                } else {
                    this.showNotification('Error importing data. Please check the file format.', 'error');
                }
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Error importing data', 'error');
            }
        };
        reader.readAsText(file);
    }

    /**
     * Clear all data
     */
    clearAllData() {
        if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
            window.dataManager.clearAllData();
            this.showNotification('All data cleared', 'success');
            this.loadInitialData();
        }
    }

    /**
     * Update user preferences
     */
    updatePreferences(newPreferences) {
        window.dataManager.updatePreferences(newPreferences);
        this.showNotification('Settings updated', 'success');
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + number keys for navigation
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                const sections = ['chat', 'mood', 'checkin', 'resources', 'settings'];
                const sectionIndex = parseInt(e.key) - 1;
                if (sections[sectionIndex]) {
                    this.switchSection(sections[sectionIndex]);
                }
            }
        });
    }

    /**
     * Scroll chat to bottom
     */
    scrollChatToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /**
     * Format time for display
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now - date) / (1000 * 60 * 60);
        
        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${Math.floor(diffInHours)}h ago`;
        } else {
            return date.toLocaleDateString();
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
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
        
        const colors = {
            success: '#27AE60',
            warning: '#F39C12',
            error: '#E74C3C',
            info: '#4A90E2'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

/**
 * Chat Interface - Handles chat functionality
 */
class ChatInterface {
    constructor() {
        this.initializeChatInterface();
    }

    initializeChatInterface() {
        this.setupChatInput();
        this.setupTypingIndicator();
        this.setupNewChatButton();
    }

    setupChatInput() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-button');
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
        
        if (sendButton) {
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    setupTypingIndicator() {
        this.typingIndicator = document.getElementById('typing-indicator');
    }

    setupNewChatButton() {
        const newChatButton = document.getElementById('new-chat-button');
        if (newChatButton) {
            newChatButton.addEventListener('click', () => {
                this.startNewChat();
            });
        }
    }

    startNewChat() {
        // Clear the chat messages
        this.clearChat();
        
        // Add a fresh welcome message
        this.addBotMessage("Hello! I'm here to listen and support you. How can I help today?");
        
        // Show a brief confirmation
        this.showNewChatConfirmation();
    }

    clearChat() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
        }
        
        // Clear chat history from data manager
        if (window.dataManager) {
            window.dataManager.clearChatHistory();
        }
    }

    showNewChatConfirmation() {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            font-size: 14px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = 'New chat started!';
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    async sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();
        
        if (!message) return;
        
        // Clear input
        chatInput.value = '';
        
        // Add user message to chat
        this.addUserMessage(message);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Generate bot response
        setTimeout(() => {
            this.hideTypingIndicator();
            const botResponse = window.chatbot.generateResponse(message);
            this.addBotMessage(botResponse.text);
        }, 1000 + Math.random() * 2000); // Random delay for realism
    }

    addUserMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message user-message';
        
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        
        chatMessages.appendChild(messageEl);
        
        // Save to data manager
        window.dataManager.addChatMessage({
            sender: 'user',
            text: message
        });
        
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageEl = document.createElement('div');
        messageEl.className = 'message bot-message';
        
        messageEl.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">Just now</span>
            </div>
        `;
        
        chatMessages.appendChild(messageEl);
        
        // Save to data manager
        window.dataManager.addChatMessage({
            sender: 'bot',
            text: message
        });
        
        this.scrollToBottom();
    }

    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'flex';
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }

    scrollToBottom() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }
}

/**
 * Check-in System - Handles daily check-ins
 */
class CheckInSystem {
    constructor() {
        this.initializeCheckInSystem();
    }

    initializeCheckInSystem() {
        this.setupCheckInForm();
    }

    setupCheckInForm() {
        const submitBtn = document.getElementById('submit-checkin');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitCheckIn();
            });
        }
    }

    async submitCheckIn() {
        const dayRating = document.querySelector('input[name="day-rating"]:checked');
        const positiveThings = document.getElementById('positive-things').value.trim();
        const challenges = document.getElementById('challenges').value.trim();
        const gratitude = document.getElementById('gratitude').value.trim();
        const tomorrowFocus = document.getElementById('tomorrow-focus').value.trim();
        
        if (!dayRating) {
            this.showNotification('Please rate your day', 'warning');
            return;
        }
        
        const checkInData = {
            dayRating: parseInt(dayRating.value),
            positiveThings,
            challenges,
            gratitude,
            tomorrowFocus
        };
        
        try {
            const savedCheckIn = window.dataManager.addCheckIn(checkInData);
            this.showNotification('Check-in completed successfully!', 'success');
            this.clearCheckInForm();
            this.updateStreakDisplay();
        } catch (error) {
            console.error('Error saving check-in:', error);
            this.showNotification('Error saving check-in', 'error');
        }
    }

    clearCheckInForm() {
        document.querySelectorAll('input[name="day-rating"]').forEach(input => {
            input.checked = false;
        });
        document.getElementById('positive-things').value = '';
        document.getElementById('challenges').value = '';
        document.getElementById('gratitude').value = '';
        document.getElementById('tomorrow-focus').value = '';
    }

    updateStreakDisplay() {
        if (window.app) {
            window.app.updateStreakDisplay();
        }
    }

    showNotification(message, type) {
        if (window.app) {
            window.app.showNotification(message, type);
        }
    }
}

/**
 * Resource Modal - Handles resource display
 */
class ResourceModal {
    constructor() {
        this.initializeResourceModal();
    }

    initializeResourceModal() {
        this.setupResourceButtons();
        this.setupModalControls();
    }

    setupResourceButtons() {
        document.querySelectorAll('.resource-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const resource = e.target.dataset.resource;
                this.showResource(resource);
            });
        });
    }

    setupModalControls() {
        const modal = document.getElementById('resource-modal');
        const closeBtn = document.querySelector('.close-modal');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hideModal();
            });
        }
        
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            });
        }
    }

    showResource(resourceType) {
        const modal = document.getElementById('resource-modal');
        const title = document.getElementById('modal-title');
        const body = document.getElementById('modal-body');
        
        if (!modal || !title || !body) return;
        
        const resourceContent = this.getResourceContent(resourceType);
        title.textContent = resourceContent.title;
        body.innerHTML = resourceContent.content;
        
        modal.classList.add('show');
    }

    getResourceContent(resourceType) {
        const resources = {
            cbt: {
                title: 'CBT Techniques',
                content: `
                    <h4>Cognitive Behavioral Therapy (CBT) Techniques</h4>
                    <p>CBT helps you understand the connection between your thoughts, feelings, and behaviors.</p>
                    
                    <h5>Thought Challenging</h5>
                    <ol>
                        <li>Identify the automatic thought</li>
                        <li>Rate how much you believe it (0-100%)</li>
                        <li>Look for evidence for and against the thought</li>
                        <li>Consider alternative explanations</li>
                        <li>Rate your belief again</li>
                        <li>Develop a balanced thought</li>
                    </ol>
                    
                    <h5>Common Cognitive Distortions</h5>
                    <ul>
                        <li><strong>All-or-nothing thinking:</strong> Seeing things in black and white</li>
                        <li><strong>Catastrophizing:</strong> Expecting the worst possible outcome</li>
                        <li><strong>Mind reading:</strong> Assuming you know what others are thinking</li>
                        <li><strong>Fortune telling:</strong> Predicting negative future events</li>
                        <li><strong>Should statements:</strong> Using "should" and "must" statements</li>
                    </ul>
                `
            },
            breathing: {
                title: 'Breathing Exercises',
                content: `
                    <h4>Guided Breathing Exercises</h4>
                    
                    <div class="breathing-exercise">
                        <h5>4-7-8 Breathing</h5>
                        <p>Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.</p>
                        <button class="start-exercise-btn" data-exercise="4-7-8">Start Exercise</button>
                    </div>
                    
                    <div class="breathing-exercise">
                        <h5>Box Breathing</h5>
                        <p>Breathe in for 4, hold for 4, exhale for 4, hold for 4. Imagine drawing a box.</p>
                        <button class="start-exercise-btn" data-exercise="box">Start Exercise</button>
                    </div>
                    
                    <div class="breathing-exercise">
                        <h5>Diaphragmatic Breathing</h5>
                        <p>Place one hand on chest, one on belly. Breathe so only your belly hand moves.</p>
                        <button class="start-exercise-btn" data-exercise="diaphragmatic">Start Exercise</button>
                    </div>
                `
            },
            mindfulness: {
                title: 'Mindfulness Techniques',
                content: `
                    <h4>Mindfulness Practices</h4>
                    
                    <div class="mindfulness-technique">
                        <h5>5-4-3-2-1 Grounding</h5>
                        <p>Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.</p>
                        <button class="start-practice-btn" data-practice="grounding">Start Practice</button>
                    </div>
                    
                    <div class="mindfulness-technique">
                        <h5>Body Scan</h5>
                        <p>Slowly scan your body from head to toe, noticing sensations without judgment.</p>
                        <button class="start-practice-btn" data-practice="body-scan">Start Practice</button>
                    </div>
                    
                    <div class="mindfulness-technique">
                        <h5>Mindful Breathing</h5>
                        <p>Focus on your breath without changing it. When your mind wanders, gently return to your breath.</p>
                        <button class="start-practice-btn" data-practice="breathing">Start Practice</button>
                    </div>
                `
            },
            behavioral: {
                title: 'Behavioral Activation',
                content: `
                    <h4>Behavioral Activation Activities</h4>
                    <p>Engaging in activities that bring pleasure or a sense of mastery can improve mood.</p>
                    
                    <h5>Pleasure Activities</h5>
                    <ul>
                        <li>Take a short walk</li>
                        <li>Call a friend</li>
                        <li>Listen to music</li>
                        <li>Do something creative</li>
                        <li>Practice a hobby</li>
                        <li>Read a book</li>
                        <li>Watch a favorite show</li>
                    </ul>
                    
                    <h5>Mastery Activities</h5>
                    <ul>
                        <li>Complete a small task</li>
                        <li>Organize a space</li>
                        <li>Learn something new</li>
                        <li>Exercise or stretch</li>
                        <li>Cook a meal</li>
                        <li>Write in a journal</li>
                    </ul>
                `
            },
            crisis: {
                title: 'Crisis Resources',
                content: `
                    <h4>Emergency Mental Health Resources</h4>
                    <p><strong>If you're in immediate danger, please call emergency services (911 in the US, 999 in the UK).</strong></p>
                    
                    <h5>United States</h5>
                    <ul>
                        <li><strong>National Suicide Prevention Lifeline:</strong> 988</li>
                        <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                        <li><strong>National Suicide Prevention Lifeline:</strong> 1-800-273-8255</li>
                    </ul>
                    
                    <h5>United Kingdom</h5>
                    <ul>
                        <li><strong>Samaritans:</strong> 116 123</li>
                        <li><strong>Crisis Text Line:</strong> Text SHOUT to 85258</li>
                    </ul>
                    
                    <h5>Australia</h5>
                    <ul>
                        <li><strong>Lifeline:</strong> 13 11 14</li>
                        <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                    </ul>
                    
                    <p><em>Remember: You don't have to face this alone. There are people who care and want to help you.</em></p>
                `
            },
            articles: {
                title: 'Self-Help Articles',
                content: `
                    <h4>Mental Health Education</h4>
                    
                    <h5>Understanding Mental Health</h5>
                    <ul>
                        <li>What is mental health and why it matters</li>
                        <li>Common mental health conditions</li>
                        <li>Signs and symptoms to watch for</li>
                        <li>When to seek professional help</li>
                    </ul>
                    
                    <h5>Coping Strategies</h5>
                    <ul>
                        <li>Stress management techniques</li>
                        <li>Building resilience</li>
                        <li>Healthy coping mechanisms</li>
                        <li>Self-care practices</li>
                    </ul>
                    
                    <h5>Building Support Systems</h5>
                    <ul>
                        <li>How to talk about mental health</li>
                        <li>Supporting loved ones</li>
                        <li>Finding community resources</li>
                        <li>Building healthy relationships</li>
                    </ul>
                    
                    <p><em>Note: This is educational content. For professional mental health support, please consult with a qualified therapist or counselor.</em></p>
                `
            }
        };
        
        return resources[resourceType] || {
            title: 'Resource',
            content: '<p>Resource content not available.</p>'
        };
    }

    hideModal() {
        const modal = document.getElementById('resource-modal');
        if (modal) {
            modal.classList.remove('show');
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MentalHealthApp();
});
