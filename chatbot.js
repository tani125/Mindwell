/**
 * Chatbot Engine - Pattern-matching AI with CBT content library
 * Provides empathetic responses and mental health support
 */

class MentalHealthChatbot {
    constructor() {
        this.responses = this.initializeResponses();
        this.cbtTechniques = this.initializeCBTTechniques();
        this.breathingExercises = this.initializeBreathingExercises();
        this.mindfulnessTechniques = this.initializeMindfulnessTechniques();
        this.crisisResources = this.initializeCrisisResources();
        this.conversationContext = {
            lastMood: null,
            recentTopics: [],
            userNeeds: []
        };
    }

    /**
     * Main response generation method
     */
    generateResponse(userMessage) {
        const message = userMessage.toLowerCase().trim();
        
        // Update conversation context
        this.updateContext(userMessage);
        
        // Check for crisis keywords first
        if (this.isCrisisMessage(message)) {
            return this.handleCrisisResponse();
        }
        
        // Intent recognition
        const intent = this.recognizeIntent(message);
        
        // Generate appropriate response
        switch (intent) {
            case 'greeting':
                return this.handleGreeting();
            case 'mood_sharing':
                return this.handleMoodSharing(message);
            case 'anxiety':
                return this.handleAnxiety();
            case 'depression':
                return this.handleDepression();
            case 'stress':
                return this.handleStress();
            case 'sleep':
                return this.handleSleep();
            case 'relationships':
                return this.handleRelationships();
            case 'self_care':
                return this.handleSelfCare();
            case 'cbt_help':
                return this.handleCBTRequest();
            case 'breathing':
                return this.handleBreathingRequest();
            case 'mindfulness':
                return this.handleMindfulnessRequest();
            case 'gratitude':
                return this.handleGratitude();
            case 'coping':
                return this.handleCopingStrategies();
            case 'progress':
                return this.handleProgressCheck();
            case 'resources':
                return this.handleResourcesRequest();
            default:
                return this.handleGeneralResponse(message);
        }
    }

    /**
     * Intent recognition using keyword matching
     */
    recognizeIntent(message) {
        const intents = {
            greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
            mood_sharing: ['feeling', 'feel', 'mood', 'sad', 'happy', 'angry', 'anxious', 'depressed', 'excited', 'worried'],
            anxiety: ['anxious', 'anxiety', 'worried', 'worry', 'nervous', 'panic', 'overwhelmed', 'stressed'],
            depression: ['depressed', 'sad', 'down', 'hopeless', 'empty', 'worthless', 'suicidal'],
            stress: ['stressed', 'stress', 'pressure', 'overwhelmed', 'burnout', 'tired'],
            sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'rest'],
            relationships: ['relationship', 'partner', 'family', 'friend', 'lonely', 'isolated'],
            self_care: ['self care', 'self-care', 'care for myself', 'treat myself'],
            cbt_help: ['cbt', 'cognitive', 'thoughts', 'thinking', 'negative thoughts'],
            breathing: ['breathing', 'breathe', 'calm down', 'relax'],
            mindfulness: ['mindful', 'mindfulness', 'meditation', 'present'],
            gratitude: ['grateful', 'gratitude', 'thankful', 'appreciate'],
            coping: ['cope', 'coping', 'deal with', 'handle'],
            progress: ['progress', 'improvement', 'better', 'getting better'],
            resources: ['help', 'resources', 'support', 'crisis']
        };

        for (const [intent, keywords] of Object.entries(intents)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                return intent;
            }
        }

        return 'general';
    }

    /**
     * Crisis detection and response
     */
    isCrisisMessage(message) {
        const crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'not worth living',
            'hurt myself', 'self harm', 'cutting', 'overdose',
            'emergency', 'crisis', 'help me', 'can\'t go on'
        ];
        
        return crisisKeywords.some(keyword => message.includes(keyword));
    }

    handleCrisisResponse() {
        return {
            text: "I'm really concerned about what you're sharing with me. Your safety is the most important thing right now. Please reach out to a crisis helpline immediately:\n\n" +
                  "🇺🇸 National Suicide Prevention Lifeline: 988\n" +
                  "🇺🇸 Crisis Text Line: Text HOME to 741741\n" +
                  "🇬🇧 Samaritans: 116 123\n" +
                  "🇦🇺 Lifeline: 13 11 14\n\n" +
                  "You don't have to face this alone. There are people who care and want to help you. Please reach out to someone you trust or a mental health professional right away.",
            type: 'crisis',
            urgent: true
        };
    }

    /**
     * Intent-specific response handlers
     */
    handleGreeting() {
        const greetings = [
            "Hello! I'm so glad you're here. How are you feeling today?",
            "Hi there! I'm your mental health companion. What's on your mind?",
            "Welcome! I'm here to listen and support you. How can I help today?",
            "Hello! It's great to see you. How are you doing right now?"
        ];
        
        return {
            text: greetings[Math.floor(Math.random() * greetings.length)],
            type: 'greeting'
        };
    }

    handleMoodSharing(message) {
        const moodResponses = {
            positive: [
                "That's wonderful to hear! I'm so glad you're feeling good. What's contributing to this positive mood?",
                "It makes me happy to know you're feeling well! Can you tell me more about what's going well for you?",
                "That's fantastic! Positive moments like these are so important. What helped you feel this way?"
            ],
            negative: [
                "I'm sorry you're feeling this way. Your feelings are completely valid. Can you tell me more about what's going on?",
                "I hear that you're struggling right now. That must be really difficult. I'm here to listen and support you.",
                "Thank you for sharing how you're feeling. It takes courage to be open about difficult emotions. What's been weighing on you?"
            ],
            neutral: [
                "I understand you're feeling neutral right now. Sometimes that's exactly what we need. How has your day been overall?",
                "Neutral feelings are completely normal. Sometimes we need to just be where we are. What's been on your mind lately?"
            ]
        };

        let responseType = 'neutral';
        if (message.includes('good') || message.includes('great') || message.includes('happy') || message.includes('excited')) {
            responseType = 'positive';
        } else if (message.includes('bad') || message.includes('sad') || message.includes('terrible') || message.includes('awful')) {
            responseType = 'negative';
        }

        return {
            text: moodResponses[responseType][Math.floor(Math.random() * moodResponses[responseType].length)],
            type: 'mood_response'
        };
    }

    handleAnxiety() {
        const anxietyResponses = [
            "I understand anxiety can feel overwhelming. Let's try a simple breathing exercise together. Take a slow, deep breath in for 4 counts, hold for 4, and exhale for 6. Would you like to try this?",
            "Anxiety is challenging, but you're not alone in this. One technique that often helps is the 5-4-3-2-1 grounding method: name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
            "When anxiety feels intense, remember that this feeling will pass. Try focusing on your breathing and remind yourself that you've gotten through difficult moments before. What usually helps you feel more grounded?"
        ];

        return {
            text: anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)],
            type: 'anxiety_support',
            techniques: ['breathing', 'grounding']
        };
    }

    handleDepression() {
        const depressionResponses = [
            "I'm sorry you're feeling this way. Depression can make everything feel heavy and difficult. Remember that your feelings are valid, and it's okay to not be okay. What's one small thing that might feel manageable right now?",
            "When depression feels overwhelming, sometimes the smallest steps can make a difference. Even getting out of bed or taking a shower can be an accomplishment. What's one thing you're proud of yourself for today?",
            "Depression can make us feel isolated, but you're not alone. Many people understand what you're going through. What's been the most challenging part of your day?"
        ];

        return {
            text: depressionResponses[Math.floor(Math.random() * depressionResponses.length)],
            type: 'depression_support',
            techniques: ['behavioral_activation', 'self_compassion']
        };
    }

    handleStress() {
        const stressResponses = [
            "Stress can feel overwhelming, but there are ways to manage it. Let's try a quick stress relief technique: tense and then relax each muscle group, starting from your toes and working up to your head.",
            "When stress builds up, it's important to take breaks. Even a 5-minute walk or some deep breathing can help reset your nervous system. What's one small thing you could do for yourself right now?",
            "Stress is your body's response to pressure, and it's completely normal. The key is finding healthy ways to manage it. What usually helps you feel more relaxed?"
        ];

        return {
            text: stressResponses[Math.floor(Math.random() * stressResponses.length)],
            type: 'stress_support',
            techniques: ['progressive_relaxation', 'mindfulness']
        };
    }

    handleSleep() {
        const sleepResponses = [
            "Sleep is so important for mental health. Try creating a relaxing bedtime routine: dim the lights, avoid screens an hour before bed, and try some gentle stretching or reading.",
            "If you're having trouble sleeping, try the 4-7-8 breathing technique: inhale for 4, hold for 7, exhale for 8. This can help activate your body's relaxation response.",
            "Good sleep hygiene includes keeping a consistent schedule, even on weekends. What's your current bedtime routine like?"
        ];

        return {
            text: sleepResponses[Math.floor(Math.random() * sleepResponses.length)],
            type: 'sleep_support',
            techniques: ['sleep_hygiene', 'breathing']
        };
    }

    handleRelationships() {
        const relationshipResponses = [
            "Relationships can be complex and sometimes challenging. It's important to communicate your needs clearly and set healthy boundaries. What's been on your mind regarding your relationships?",
            "Healthy relationships require effort from both people. Remember that you deserve to be treated with respect and kindness. What's one thing you could do to nurture your relationships?",
            "Sometimes we need to step back and evaluate our relationships. What's been working well, and what might need some attention?"
        ];

        return {
            text: relationshipResponses[Math.floor(Math.random() * relationshipResponses.length)],
            type: 'relationship_support'
        };
    }

    handleSelfCare() {
        const selfCareResponses = [
            "Self-care isn't selfish—it's essential! What's one thing you could do today to take care of yourself? Even small acts of self-care can make a big difference.",
            "Self-care looks different for everyone. It might be taking a bath, going for a walk, reading a book, or simply allowing yourself to rest. What feels nourishing to you?",
            "Remember that self-care includes both physical and emotional needs. What's one way you could be kinder to yourself today?"
        ];

        return {
            text: selfCareResponses[Math.floor(Math.random() * selfCareResponses.length)],
            type: 'self_care_support'
        };
    }

    handleCBTRequest() {
        const cbtResponse = "CBT (Cognitive Behavioral Therapy) helps us understand the connection between our thoughts, feelings, and behaviors. Here's a simple CBT technique:\n\n" +
                          "1. Notice your thought\n" +
                          "2. Ask: 'Is this thought helpful or harmful?'\n" +
                          "3. If harmful, ask: 'What's a more balanced way to think about this?'\n" +
                          "4. Practice the new thought\n\n" +
                          "Would you like to try this with a specific thought that's been bothering you?";

        return {
            text: cbtResponse,
            type: 'cbt_technique',
            techniques: ['thought_challenging']
        };
    }

    handleBreathingRequest() {
        const breathingExercise = this.getRandomBreathingExercise();
        return {
            text: breathingExercise.instruction,
            type: 'breathing_exercise',
            exercise: breathingExercise
        };
    }

    handleMindfulnessRequest() {
        const mindfulnessResponse = "Mindfulness is about being present in the moment without judgment. Here's a simple mindfulness practice:\n\n" +
                                  "Take a moment to notice:\n" +
                                  "• 5 things you can see\n" +
                                  "• 4 things you can touch\n" +
                                  "• 3 things you can hear\n" +
                                  "• 2 things you can smell\n" +
                                  "• 1 thing you can taste\n\n" +
                                  "This grounding technique can help bring you back to the present moment. How does it feel?";

        return {
            text: mindfulnessResponse,
            type: 'mindfulness_practice',
            techniques: ['grounding']
        };
    }

    handleGratitude() {
        const gratitudeResponses = [
            "Gratitude is such a powerful practice! Even in difficult times, there are often small things to appreciate. What's one thing you're grateful for today?",
            "Practicing gratitude can shift our perspective and improve our mood. What's something positive that happened today, no matter how small?",
            "Gratitude doesn't mean ignoring difficult feelings—it's about finding balance. What's one thing that brought you a moment of joy or peace today?"
        ];

        return {
            text: gratitudeResponses[Math.floor(Math.random() * gratitudeResponses.length)],
            type: 'gratitude_practice'
        };
    }

    handleCopingStrategies() {
        const copingResponse = "Here are some healthy coping strategies you can try:\n\n" +
                             "• Deep breathing exercises\n" +
                             "• Physical activity or gentle movement\n" +
                             "• Talking to someone you trust\n" +
                             "• Journaling your thoughts and feelings\n" +
                             "• Engaging in a hobby you enjoy\n" +
                             "• Practicing mindfulness or meditation\n\n" +
                             "What coping strategies have worked for you in the past?";

        return {
            text: copingResponse,
            type: 'coping_strategies'
        };
    }

    handleProgressCheck() {
        const progressResponses = [
            "It's wonderful that you're noticing progress! Growth isn't always linear, and every step forward matters. What changes have you noticed in yourself?",
            "Celebrating progress, no matter how small, is so important. What's one thing you're proud of yourself for recently?",
            "Progress looks different for everyone. Sometimes it's about managing difficult days better, or being kinder to yourself. What progress are you noticing?"
        ];

        return {
            text: progressResponses[Math.floor(Math.random() * progressResponses.length)],
            type: 'progress_celebration'
        };
    }

    handleResourcesRequest() {
        return {
            text: "I'm here to provide support, but I also want to make sure you have access to professional resources when needed:\n\n" +
                  "• Consider speaking with a therapist or counselor\n" +
                  "• Reach out to trusted friends or family\n" +
                  "• Use crisis helplines if you're in immediate distress\n" +
                  "• Practice self-care and healthy coping strategies\n\n" +
                  "Remember, seeking professional help is a sign of strength, not weakness. What kind of support are you looking for?",
            type: 'resources_info'
        };
    }

    handleGeneralResponse(message) {
        const generalResponses = [
            "I'm here to listen and support you. Can you tell me more about what's on your mind?",
            "Thank you for sharing with me. I want to understand better—what's been challenging for you lately?",
            "I'm listening. Sometimes it helps to talk through what we're experiencing. What's been weighing on you?",
            "I'm here for you. What would be most helpful for you right now?"
        ];

        return {
            text: generalResponses[Math.floor(Math.random() * generalResponses.length)],
            type: 'general_support'
        };
    }

    /**
     * Update conversation context
     */
    updateContext(message) {
        this.conversationContext.recentTopics.push(message);
        if (this.conversationContext.recentTopics.length > 5) {
            this.conversationContext.recentTopics.shift();
        }
    }

    /**
     * Initialize response templates
     */
    initializeResponses() {
        return {
            empathetic: [
                "I hear you, and I want you to know that your feelings are valid.",
                "It takes courage to share what you're going through.",
                "I'm here with you, and you don't have to face this alone.",
                "Your experience matters, and I'm listening."
            ],
            encouraging: [
                "You're stronger than you know.",
                "Every step forward, no matter how small, is progress.",
                "It's okay to not be okay sometimes.",
                "You're doing the best you can, and that's enough."
            ]
        };
    }

    /**
     * Initialize CBT techniques database
     */
    initializeCBTTechniques() {
        return {
            thoughtChallenging: {
                name: "Thought Challenging",
                steps: [
                    "Identify the automatic thought",
                    "Rate how much you believe it (0-100%)",
                    "Look for evidence for and against the thought",
                    "Consider alternative explanations",
                    "Rate your belief again",
                    "Develop a balanced thought"
                ]
            },
            behavioralActivation: {
                name: "Behavioral Activation",
                description: "Engaging in activities that bring pleasure or mastery",
                suggestions: [
                    "Take a short walk",
                    "Call a friend",
                    "Listen to music",
                    "Do something creative",
                    "Practice a hobby"
                ]
            },
            cognitiveRestructuring: {
                name: "Cognitive Restructuring",
                description: "Changing negative thought patterns",
                techniques: [
                    "All-or-nothing thinking",
                    "Catastrophizing",
                    "Mind reading",
                    "Fortune telling",
                    "Should statements"
                ]
            }
        };
    }

    /**
     * Initialize breathing exercises
     */
    initializeBreathingExercises() {
        return [
            {
                name: "4-7-8 Breathing",
                instruction: "Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times. This activates your body's relaxation response.",
                duration: "2-3 minutes"
            },
            {
                name: "Box Breathing",
                instruction: "Breathe in for 4, hold for 4, exhale for 4, hold for 4. Imagine drawing a box with your breath.",
                duration: "3-5 minutes"
            },
            {
                name: "Diaphragmatic Breathing",
                instruction: "Place one hand on your chest, one on your belly. Breathe so only your belly hand moves. This engages your diaphragm for deeper, calmer breathing.",
                duration: "5-10 minutes"
            }
        ];
    }

    /**
     * Initialize mindfulness techniques
     */
    initializeMindfulnessTechniques() {
        return [
            {
                name: "5-4-3-2-1 Grounding",
                instruction: "Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. This brings you back to the present moment."
            },
            {
                name: "Body Scan",
                instruction: "Slowly scan your body from head to toe, noticing any sensations without judgment. This helps you connect with your physical self."
            },
            {
                name: "Mindful Breathing",
                instruction: "Focus on your breath without changing it. When your mind wanders, gently return to your breath. This builds present-moment awareness."
            }
        ];
    }

    /**
     * Initialize crisis resources
     */
    initializeCrisisResources() {
        return {
            us: {
                suicidePrevention: "988",
                crisisText: "Text HOME to 741741",
                nationalLifeline: "1-800-273-8255"
            },
            uk: {
                samaritans: "116 123",
                crisisText: "Text SHOUT to 85258"
            },
            australia: {
                lifeline: "13 11 14",
                crisisText: "Text HOME to 741741"
            }
        };
    }

    /**
     * Get random breathing exercise
     */
    getRandomBreathingExercise() {
        return this.breathingExercises[Math.floor(Math.random() * this.breathingExercises.length)];
    }

    /**
     * Get CBT technique by name
     */
    getCBTTechnique(techniqueName) {
        return this.cbtTechniques[techniqueName] || null;
    }

    /**
     * Get mindfulness technique
     */
    getMindfulnessTechnique() {
        return this.mindfulnessTechniques[Math.floor(Math.random() * this.mindfulnessTechniques.length)];
    }
}

// Initialize global chatbot instance
window.chatbot = new MentalHealthChatbot();
