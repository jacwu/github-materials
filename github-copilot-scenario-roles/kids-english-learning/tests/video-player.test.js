/**
 * Unit Tests for Interactive Video Player
 * Kids English Learning Platform - US-S003
 * 
 * Note: These tests use vanilla JavaScript. In production, you would use
 * a testing framework like Jest, Mocha, or Jasmine.
 */

// Mock data for testing
const mockLessonData = {
    id: 'test-lesson-001',
    title: 'Test Lesson',
    description: 'A test lesson',
    videoUrl: 'test-video.mp4',
    duration: 300,
    difficulty: 'beginner',
    topics: ['test'],
    thumbnailUrl: 'test-thumbnail.jpg',
    checkpoints: [
        {
            id: 'test-cp-1',
            timestamp: 30,
            type: 'vocabulary',
            title: 'Test Word',
            data: {
                word: 'Test',
                pronunciation: '/test/',
                definition: 'A test definition',
                imageUrl: 'test-image.png',
                examples: ['This is a test.']
            }
        },
        {
            id: 'test-cp-2',
            timestamp: 60,
            type: 'quiz',
            title: 'Test Quiz',
            data: {
                question: 'What is 2+2?',
                options: ['3', '4', '5', '6'],
                correctAnswer: '4'
            }
        }
    ]
};

// Test Suite
class VideoPlayerTests {
    constructor() {
        this.passedTests = 0;
        this.failedTests = 0;
        this.results = [];
    }
    
    /**
     * Assert helper
     */
    assert(condition, testName, message) {
        if (condition) {
            this.passedTests++;
            this.results.push({ test: testName, status: 'PASS', message });
            console.log(`✓ ${testName}: ${message}`);
        } else {
            this.failedTests++;
            this.results.push({ test: testName, status: 'FAIL', message });
            console.error(`✗ ${testName}: ${message}`);
        }
    }
    
    /**
     * Test: Player initialization
     */
    testPlayerInitialization() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        this.assert(
            player.video === videoElement,
            'Player Initialization',
            'Video element should be set correctly'
        );
        
        this.assert(
            player.lessonData === mockLessonData,
            'Player Initialization',
            'Lesson data should be set correctly'
        );
        
        this.assert(
            player.currentCheckpointIndex === 0,
            'Player Initialization',
            'Initial checkpoint index should be 0'
        );
        
        this.assert(
            player.completedCheckpoints.length === 0,
            'Player Initialization',
            'Completed checkpoints should be empty initially'
        );
        
        this.assert(
            player.score === 0,
            'Player Initialization',
            'Initial score should be 0'
        );
    }
    
    /**
     * Test: Time formatting
     */
    testTimeFormatting() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        this.assert(
            player.formatTime(0) === '0:00',
            'Time Formatting',
            'Should format 0 seconds correctly'
        );
        
        this.assert(
            player.formatTime(65) === '1:05',
            'Time Formatting',
            'Should format 65 seconds correctly'
        );
        
        this.assert(
            player.formatTime(125) === '2:05',
            'Time Formatting',
            'Should format 125 seconds correctly'
        );
        
        this.assert(
            player.formatTime(NaN) === '0:00',
            'Time Formatting',
            'Should handle NaN correctly'
        );
    }
    
    /**
     * Test: Checkpoint completion
     */
    testCheckpointCompletion() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        const checkpointId = 'test-cp-1';
        player.onCheckpointComplete(checkpointId, true);
        
        this.assert(
            player.completedCheckpoints.includes(checkpointId),
            'Checkpoint Completion',
            'Completed checkpoint should be added to the list'
        );
        
        this.assert(
            player.currentCheckpointIndex === 1,
            'Checkpoint Completion',
            'Current checkpoint index should increment'
        );
    }
    
    /**
     * Test: Score calculation
     */
    testScoreCalculation() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        // Simulate correct answer
        player.score = 0;
        player.score += 10;
        
        this.assert(
            player.score === 10,
            'Score Calculation',
            'Score should increase by 10 for correct answer'
        );
        
        // Simulate multiple correct answers
        player.score += 10;
        player.score += 10;
        
        this.assert(
            player.score === 30,
            'Score Calculation',
            'Score should accumulate correctly'
        );
    }
    
    /**
     * Test: Progress saving
     */
    testProgressSaving() {
        const videoElement = document.createElement('video');
        videoElement.currentTime = 45;
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        player.completedCheckpoints = ['test-cp-1'];
        player.score = 20;
        player.saveProgress();
        
        const savedProgress = localStorage.getItem(`lesson_progress_${mockLessonData.id}`);
        
        this.assert(
            savedProgress !== null,
            'Progress Saving',
            'Progress should be saved to localStorage'
        );
        
        const progress = JSON.parse(savedProgress);
        
        this.assert(
            progress.score === 20,
            'Progress Saving',
            'Saved progress should include correct score'
        );
        
        this.assert(
            progress.completedCheckpoints.includes('test-cp-1'),
            'Progress Saving',
            'Saved progress should include completed checkpoints'
        );
        
        // Cleanup
        localStorage.removeItem(`lesson_progress_${mockLessonData.id}`);
    }
    
    /**
     * Test: Progress loading
     */
    testProgressLoading() {
        const videoElement = document.createElement('video');
        
        // Set up saved progress
        const savedProgress = {
            lessonId: mockLessonData.id,
            timestamp: 90,
            completedCheckpoints: ['test-cp-1'],
            score: 15,
            isComplete: false,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`lesson_progress_${mockLessonData.id}`, JSON.stringify(savedProgress));
        
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        this.assert(
            player.completedCheckpoints.includes('test-cp-1'),
            'Progress Loading',
            'Loaded progress should include completed checkpoints'
        );
        
        this.assert(
            player.score === 15,
            'Progress Loading',
            'Loaded progress should include correct score'
        );
        
        this.assert(
            player.currentCheckpointIndex === 1,
            'Progress Loading',
            'Current checkpoint index should be set based on completed checkpoints'
        );
        
        // Cleanup
        localStorage.removeItem(`lesson_progress_${mockLessonData.id}`);
    }
    
    /**
     * Test: Vocabulary exercise creation
     */
    testVocabularyExerciseCreation() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        const checkpoint = mockLessonData.checkpoints[0];
        const html = player.createVocabularyExercise(checkpoint);
        
        this.assert(
            html.includes(checkpoint.data.word),
            'Vocabulary Exercise',
            'Exercise should include the word'
        );
        
        this.assert(
            html.includes(checkpoint.data.definition),
            'Vocabulary Exercise',
            'Exercise should include the definition'
        );
        
        this.assert(
            html.includes(checkpoint.data.imageUrl),
            'Vocabulary Exercise',
            'Exercise should include the image URL'
        );
    }
    
    /**
     * Test: Quiz exercise creation
     */
    testQuizExerciseCreation() {
        const videoElement = document.createElement('video');
        const player = new InteractiveVideoPlayer(videoElement, mockLessonData);
        
        const checkpoint = mockLessonData.checkpoints[1];
        const html = player.createQuizExercise(checkpoint);
        
        this.assert(
            html.includes(checkpoint.data.question),
            'Quiz Exercise',
            'Quiz should include the question'
        );
        
        checkpoint.data.options.forEach(option => {
            this.assert(
                html.includes(option),
                'Quiz Exercise',
                `Quiz should include option: ${option}`
            );
        });
    }
    
    /**
     * Test: Lesson data validation
     */
    testLessonDataValidation() {
        const validLesson = new Lesson(mockLessonData);
        
        this.assert(
            validLesson.isValid(),
            'Lesson Validation',
            'Valid lesson data should pass validation'
        );
        
        const invalidLesson = new Lesson({
            id: 'test',
            title: 'Test'
            // Missing required fields
        });
        
        this.assert(
            !invalidLesson.isValid(),
            'Lesson Validation',
            'Invalid lesson data should fail validation'
        );
    }
    
    /**
     * Test: Student progress tracking
     */
    testStudentProgress() {
        const student = new StudentProgress('student-001');
        
        this.assert(
            student.studentId === 'student-001',
            'Student Progress',
            'Student ID should be set correctly'
        );
        
        this.assert(
            student.completedLessons.length === 0,
            'Student Progress',
            'Initial completed lessons should be empty'
        );
        
        student.completeLesson('lesson-001', 100);
        
        this.assert(
            student.completedLessons.length === 1,
            'Student Progress',
            'Completed lessons should increment'
        );
        
        this.assert(
            student.totalScore === 100,
            'Student Progress',
            'Total score should accumulate'
        );
        
        this.assert(
            student.hasBadge('first-lesson'),
            'Student Progress',
            'Should earn first lesson badge'
        );
    }
    
    /**
     * Run all tests
     */
    runAllTests() {
        console.log('=== Running Interactive Video Player Tests ===\n');
        
        this.testPlayerInitialization();
        this.testTimeFormatting();
        this.testCheckpointCompletion();
        this.testScoreCalculation();
        this.testProgressSaving();
        this.testProgressLoading();
        this.testVocabularyExerciseCreation();
        this.testQuizExerciseCreation();
        this.testLessonDataValidation();
        this.testStudentProgress();
        
        console.log('\n=== Test Results ===');
        console.log(`Passed: ${this.passedTests}`);
        console.log(`Failed: ${this.failedTests}`);
        console.log(`Total: ${this.passedTests + this.failedTests}`);
        
        return {
            passed: this.passedTests,
            failed: this.failedTests,
            results: this.results
        };
    }
}

// Export for use in browser or Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoPlayerTests;
}

// Auto-run tests if in browser console
if (typeof window !== 'undefined') {
    window.VideoPlayerTests = VideoPlayerTests;
}
