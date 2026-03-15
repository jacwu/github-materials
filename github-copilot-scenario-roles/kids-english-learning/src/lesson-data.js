/**
 * Lesson data model and sample lessons
 * for the Kids English Learning Platform
 */

class Lesson {
    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.videoUrl = data.videoUrl;
        this.duration = data.duration; // in seconds
        this.difficulty = data.difficulty; // 'beginner', 'intermediate', 'advanced'
        this.topics = data.topics || [];
        this.thumbnailUrl = data.thumbnailUrl;
        this.checkpoints = data.checkpoints || [];
        this.subtitlesUrl = data.subtitlesUrl;
    }
    
    /**
     * Validate lesson data
     */
    isValid() {
        return this.id && this.title && this.videoUrl && this.checkpoints.length > 0;
    }
    
    /**
     * Get checkpoints by type
     */
    getCheckpointsByType(type) {
        return this.checkpoints.filter(cp => cp.type === type);
    }
}

class Checkpoint {
    constructor(data) {
        this.id = data.id;
        this.timestamp = data.timestamp; // time in video when checkpoint triggers
        this.type = data.type; // 'vocabulary', 'quiz', 'pronunciation'
        this.title = data.title;
        this.data = data.data; // type-specific data
    }
}

// Sample lesson data
const sampleLessons = {
    lesson1: new Lesson({
        id: 'lesson-001',
        title: 'Greetings and Introductions',
        description: 'Learn how to greet people and introduce yourself in English',
        videoUrl: 'https://example.com/videos/lesson-001.mp4',
        duration: 300, // 5 minutes
        difficulty: 'beginner',
        topics: ['greetings', 'introductions', 'basic phrases'],
        thumbnailUrl: 'https://example.com/thumbnails/lesson-001.jpg',
        subtitlesUrl: 'https://example.com/subtitles/lesson-001.vtt',
        checkpoints: [
            {
                id: 'cp-001-1',
                timestamp: 30,
                type: 'vocabulary',
                title: 'New Word: Hello',
                data: {
                    word: 'Hello',
                    pronunciation: '/həˈloʊ/',
                    definition: 'A greeting used when you meet someone',
                    imageUrl: 'https://example.com/images/hello.png',
                    examples: [
                        'Hello! How are you?',
                        'Hello, nice to meet you!'
                    ]
                }
            },
            {
                id: 'cp-001-2',
                timestamp: 90,
                type: 'quiz',
                title: 'Quick Quiz',
                data: {
                    question: 'What do you say when you meet someone for the first time?',
                    options: [
                        'Goodbye',
                        'Hello, nice to meet you',
                        'See you later',
                        'Good night'
                    ],
                    correctAnswer: 'Hello, nice to meet you'
                }
            },
            {
                id: 'cp-001-3',
                timestamp: 150,
                type: 'pronunciation',
                title: 'Practice Pronunciation',
                data: {
                    phrase: 'Nice to meet you',
                    audioUrl: 'https://example.com/audio/nice-to-meet-you.mp3'
                }
            },
            {
                id: 'cp-001-4',
                timestamp: 210,
                type: 'vocabulary',
                title: 'New Word: Goodbye',
                data: {
                    word: 'Goodbye',
                    pronunciation: '/ɡʊdˈbaɪ/',
                    definition: 'A farewell phrase said when you leave someone',
                    imageUrl: 'https://example.com/images/goodbye.png',
                    examples: [
                        'Goodbye! See you tomorrow.',
                        'Goodbye, have a great day!'
                    ]
                }
            },
            {
                id: 'cp-001-5',
                timestamp: 270,
                type: 'quiz',
                title: 'Final Check',
                data: {
                    question: 'Which phrase means "farewell"?',
                    options: [
                        'Hello',
                        'Thank you',
                        'Goodbye',
                        'Please'
                    ],
                    correctAnswer: 'Goodbye'
                }
            }
        ]
    }),
    
    lesson2: new Lesson({
        id: 'lesson-002',
        title: 'Colors and Shapes',
        description: 'Learn the names of different colors and shapes in English',
        videoUrl: 'https://example.com/videos/lesson-002.mp4',
        duration: 360, // 6 minutes
        difficulty: 'beginner',
        topics: ['colors', 'shapes', 'adjectives'],
        thumbnailUrl: 'https://example.com/thumbnails/lesson-002.jpg',
        subtitlesUrl: 'https://example.com/subtitles/lesson-002.vtt',
        checkpoints: [
            {
                id: 'cp-002-1',
                timestamp: 45,
                type: 'vocabulary',
                title: 'Color: Red',
                data: {
                    word: 'Red',
                    pronunciation: '/red/',
                    definition: 'The color of blood or a ripe tomato',
                    imageUrl: 'https://example.com/images/red.png',
                    examples: [
                        'The apple is red.',
                        'I have a red car.'
                    ]
                }
            },
            {
                id: 'cp-002-2',
                timestamp: 120,
                type: 'quiz',
                title: 'Color Quiz',
                data: {
                    question: 'What color is the sky on a sunny day?',
                    options: [
                        'Red',
                        'Blue',
                        'Green',
                        'Yellow'
                    ],
                    correctAnswer: 'Blue'
                }
            },
            {
                id: 'cp-002-3',
                timestamp: 180,
                type: 'vocabulary',
                title: 'Shape: Circle',
                data: {
                    word: 'Circle',
                    pronunciation: '/ˈsɜːrkəl/',
                    definition: 'A round shape with no corners',
                    imageUrl: 'https://example.com/images/circle.png',
                    examples: [
                        'The ball is a circle.',
                        'Draw a big circle.'
                    ]
                }
            },
            {
                id: 'cp-002-4',
                timestamp: 240,
                type: 'pronunciation',
                title: 'Say the Colors',
                data: {
                    phrase: 'Red, blue, green, yellow',
                    audioUrl: 'https://example.com/audio/colors.mp3'
                }
            },
            {
                id: 'cp-002-5',
                timestamp: 300,
                type: 'quiz',
                title: 'Shapes Quiz',
                data: {
                    question: 'How many sides does a triangle have?',
                    options: [
                        'Two',
                        'Three',
                        'Four',
                        'Five'
                    ],
                    correctAnswer: 'Three'
                }
            }
        ]
    }),
    
    lesson3: new Lesson({
        id: 'lesson-003',
        title: 'Animals and Their Sounds',
        description: 'Discover different animals and learn the sounds they make',
        videoUrl: 'https://example.com/videos/lesson-003.mp4',
        duration: 420, // 7 minutes
        difficulty: 'beginner',
        topics: ['animals', 'sounds', 'nature'],
        thumbnailUrl: 'https://example.com/thumbnails/lesson-003.jpg',
        subtitlesUrl: 'https://example.com/subtitles/lesson-003.vtt',
        checkpoints: [
            {
                id: 'cp-003-1',
                timestamp: 40,
                type: 'vocabulary',
                title: 'Animal: Dog',
                data: {
                    word: 'Dog',
                    pronunciation: '/dɔːɡ/',
                    definition: 'A common pet animal that barks',
                    imageUrl: 'https://example.com/images/dog.png',
                    examples: [
                        'The dog says "woof woof".',
                        'I have a pet dog.'
                    ]
                }
            },
            {
                id: 'cp-003-2',
                timestamp: 100,
                type: 'pronunciation',
                title: 'Animal Sounds',
                data: {
                    phrase: 'The dog says woof',
                    audioUrl: 'https://example.com/audio/dog-woof.mp3'
                }
            },
            {
                id: 'cp-003-3',
                timestamp: 160,
                type: 'quiz',
                title: 'Animal Quiz',
                data: {
                    question: 'What sound does a cat make?',
                    options: [
                        'Woof woof',
                        'Meow',
                        'Moo',
                        'Oink'
                    ],
                    correctAnswer: 'Meow'
                }
            },
            {
                id: 'cp-003-4',
                timestamp: 240,
                type: 'vocabulary',
                title: 'Animal: Cat',
                data: {
                    word: 'Cat',
                    pronunciation: '/kæt/',
                    definition: 'A small furry pet that says meow',
                    imageUrl: 'https://example.com/images/cat.png',
                    examples: [
                        'The cat is sleeping.',
                        'My cat likes milk.'
                    ]
                }
            },
            {
                id: 'cp-003-5',
                timestamp: 320,
                type: 'quiz',
                title: 'Match the Animal',
                data: {
                    question: 'Which animal lives on a farm and says "moo"?',
                    options: [
                        'Dog',
                        'Cat',
                        'Cow',
                        'Bird'
                    ],
                    correctAnswer: 'Cow'
                }
            },
            {
                id: 'cp-003-6',
                timestamp: 380,
                type: 'pronunciation',
                title: 'Practice Animal Names',
                data: {
                    phrase: 'Dog, cat, cow, bird',
                    audioUrl: 'https://example.com/audio/animals.mp3'
                }
            }
        ]
    })
};

// Student progress model
class StudentProgress {
    constructor(studentId) {
        this.studentId = studentId;
        this.completedLessons = [];
        this.currentLesson = null;
        this.totalScore = 0;
        this.badges = [];
        this.lastActivity = null;
    }
    
    /**
     * Mark a lesson as completed
     */
    completeLesson(lessonId, score) {
        this.completedLessons.push({
            lessonId,
            completionDate: new Date(),
            score
        });
        
        this.totalScore += score;
        this.lastActivity = new Date();
        
        // Check for badge achievements
        this.checkBadges();
    }
    
    /**
     * Check and award badges
     */
    checkBadges() {
        // First lesson badge
        if (this.completedLessons.length === 1 && !this.hasBadge('first-lesson')) {
            this.badges.push({
                id: 'first-lesson',
                name: 'Getting Started',
                description: 'Completed your first lesson!',
                icon: '🎓',
                earnedDate: new Date()
            });
        }
        
        // Five lessons badge
        if (this.completedLessons.length === 5 && !this.hasBadge('five-lessons')) {
            this.badges.push({
                id: 'five-lessons',
                name: 'Learning Streak',
                description: 'Completed 5 lessons!',
                icon: '🌟',
                earnedDate: new Date()
            });
        }
        
        // Perfect score badge
        const latestLesson = this.completedLessons[this.completedLessons.length - 1];
        if (latestLesson && latestLesson.score >= 100 && !this.hasBadge('perfect-score')) {
            this.badges.push({
                id: 'perfect-score',
                name: 'Perfect!',
                description: 'Got a perfect score!',
                icon: '💯',
                earnedDate: new Date()
            });
        }
    }
    
    /**
     * Check if student has a specific badge
     */
    hasBadge(badgeId) {
        return this.badges.some(badge => badge.id === badgeId);
    }
    
    /**
     * Get completion percentage
     */
    getCompletionPercentage(totalLessons) {
        return (this.completedLessons.length / totalLessons) * 100;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Lesson,
        Checkpoint,
        StudentProgress,
        sampleLessons
    };
}
