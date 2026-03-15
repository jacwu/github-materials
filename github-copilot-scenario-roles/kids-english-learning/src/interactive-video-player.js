/**
 * Interactive Video Player for Kids English Learning Platform
 * Implements US-S003: Interactive Video Lessons
 */

class InteractiveVideoPlayer {
    constructor(videoElement, lessonData, options = {}) {
        this.video = videoElement;
        this.lessonData = lessonData;
        this.currentCheckpointIndex = 0;
        this.completedCheckpoints = [];
        this.score = 0;
        
        // Configuration options
        this.options = {
            autoplay: options.autoplay || false,
            showControls: options.showControls !== false,
            enableSubtitles: options.enableSubtitles || true,
            playbackSpeeds: options.playbackSpeeds || [0.75, 1, 1.25],
            ...options
        };
        
        this.initialize();
    }
    
    /**
     * Initialize the video player and event listeners
     */
    initialize() {
        this.setupEventListeners();
        this.loadProgress();
        this.setupControls();
        
        if (this.options.autoplay) {
            this.play();
        }
    }
    
    /**
     * Setup video event listeners
     */
    setupEventListeners() {
        // Monitor time updates to trigger interactive checkpoints
        this.video.addEventListener('timeupdate', () => this.checkForInteractivePoint());
        
        // Save progress on pause
        this.video.addEventListener('pause', () => this.saveProgress());
        
        // Handle video end
        this.video.addEventListener('ended', () => this.onLessonComplete());
        
        // Handle errors
        this.video.addEventListener('error', (e) => this.handleError(e));
    }
    
    /**
     * Setup custom video controls
     */
    setupControls() {
        const controlsContainer = document.createElement('div');
        controlsContainer.className = 'video-controls';
        controlsContainer.innerHTML = `
            <button class="control-btn play-pause" aria-label="Play/Pause">
                <span class="icon-play">▶️</span>
                <span class="icon-pause" style="display:none;">⏸️</span>
            </button>
            <div class="progress-bar">
                <div class="progress-filled"></div>
            </div>
            <span class="time-display">0:00 / 0:00</span>
            <button class="control-btn speed" aria-label="Playback Speed">1x</button>
            <button class="control-btn subtitles" aria-label="Toggle Subtitles">CC</button>
            <button class="control-btn fullscreen" aria-label="Fullscreen">⛶</button>
        `;
        
        this.video.parentElement.appendChild(controlsContainer);
        this.attachControlHandlers(controlsContainer);
    }
    
    /**
     * Attach event handlers to control buttons
     */
    attachControlHandlers(controlsContainer) {
        // Play/Pause button
        const playPauseBtn = controlsContainer.querySelector('.play-pause');
        playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Progress bar
        const progressBar = controlsContainer.querySelector('.progress-bar');
        progressBar.addEventListener('click', (e) => this.seek(e));
        
        // Speed control
        const speedBtn = controlsContainer.querySelector('.speed');
        speedBtn.addEventListener('click', () => this.cyclePlaybackSpeed());
        
        // Subtitles toggle
        const subtitlesBtn = controlsContainer.querySelector('.subtitles');
        subtitlesBtn.addEventListener('click', () => this.toggleSubtitles());
        
        // Fullscreen
        const fullscreenBtn = controlsContainer.querySelector('.fullscreen');
        fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
    
    /**
     * Check if current time matches any interactive checkpoint
     */
    checkForInteractivePoint() {
        const currentTime = this.video.currentTime;
        const checkpoint = this.lessonData.checkpoints[this.currentCheckpointIndex];
        
        if (checkpoint && currentTime >= checkpoint.timestamp && 
            !this.completedCheckpoints.includes(checkpoint.id)) {
            this.triggerInteractiveElement(checkpoint);
        }
        
        // Update progress bar
        this.updateProgressBar();
    }
    
    /**
     * Trigger an interactive element (quiz, exercise, etc.)
     */
    triggerInteractiveElement(checkpoint) {
        this.pause();
        
        const overlay = this.createInteractiveOverlay(checkpoint);
        document.body.appendChild(overlay);
        
        // Log analytics
        this.logEvent('checkpoint_triggered', {
            checkpointId: checkpoint.id,
            type: checkpoint.type,
            timestamp: checkpoint.timestamp
        });
    }
    
    /**
     * Create interactive overlay based on checkpoint type
     */
    createInteractiveOverlay(checkpoint) {
        const overlay = document.createElement('div');
        overlay.className = 'interactive-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-labelledby', 'checkpoint-title');
        
        let content = '';
        
        switch (checkpoint.type) {
            case 'vocabulary':
                content = this.createVocabularyExercise(checkpoint);
                break;
            case 'quiz':
                content = this.createQuizExercise(checkpoint);
                break;
            case 'pronunciation':
                content = this.createPronunciationExercise(checkpoint);
                break;
            default:
                content = '<p>Unknown exercise type</p>';
        }
        
        overlay.innerHTML = `
            <div class="overlay-content">
                <h2 id="checkpoint-title">${checkpoint.title}</h2>
                ${content}
            </div>
        `;
        
        return overlay;
    }
    
    /**
     * Create vocabulary exercise UI
     */
    createVocabularyExercise(checkpoint) {
        const word = checkpoint.data.word;
        const definition = checkpoint.data.definition;
        const imageUrl = checkpoint.data.imageUrl;
        const examples = checkpoint.data.examples || [];
        
        return `
            <div class="vocabulary-exercise">
                <div class="word-display">
                    <img src="${imageUrl}" alt="${word}" class="word-image" />
                    <h3 class="word">${word}</h3>
                    <p class="pronunciation">${checkpoint.data.pronunciation || ''}</p>
                </div>
                <div class="definition">
                    <p>${definition}</p>
                </div>
                ${examples.length > 0 ? `
                    <div class="examples">
                        <h4>Examples:</h4>
                        <ul>
                            ${examples.map(ex => `<li>${ex}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                <button class="btn-continue" onclick="this.closest('.interactive-overlay').remove(); window.videoPlayer.onCheckpointComplete('${checkpoint.id}', true)">
                    Got it! Continue 🎉
                </button>
            </div>
        `;
    }
    
    /**
     * Create quiz exercise UI
     */
    createQuizExercise(checkpoint) {
        const question = checkpoint.data.question;
        const options = checkpoint.data.options;
        const correctAnswer = checkpoint.data.correctAnswer;
        
        return `
            <div class="quiz-exercise">
                <p class="question">${question}</p>
                <div class="options">
                    ${options.map((option, index) => `
                        <button class="option-btn" data-answer="${option}" data-correct="${option === correctAnswer}" 
                                onclick="window.videoPlayer.handleQuizAnswer('${checkpoint.id}', this)">
                            ${option}
                        </button>
                    `).join('')}
                </div>
                <div class="feedback" style="display: none;"></div>
            </div>
        `;
    }
    
    /**
     * Create pronunciation exercise UI
     */
    createPronunciationExercise(checkpoint) {
        const phrase = checkpoint.data.phrase;
        const audioUrl = checkpoint.data.audioUrl;
        
        return `
            <div class="pronunciation-exercise">
                <p class="instructions">Listen and repeat:</p>
                <h3 class="phrase">${phrase}</h3>
                <div class="pronunciation-controls">
                    <button class="btn-listen" onclick="window.videoPlayer.playPronunciation('${audioUrl}')">
                        🔊 Listen
                    </button>
                    <button class="btn-record" onclick="window.videoPlayer.recordPronunciation('${checkpoint.id}')">
                        🎤 Record
                    </button>
                </div>
                <div class="pronunciation-feedback" style="display: none;"></div>
                <button class="btn-skip" onclick="this.closest('.interactive-overlay').remove(); window.videoPlayer.onCheckpointComplete('${checkpoint.id}', true)">
                    Skip for now
                </button>
            </div>
        `;
    }
    
    /**
     * Handle quiz answer submission
     */
    handleQuizAnswer(checkpointId, buttonElement) {
        const isCorrect = buttonElement.getAttribute('data-correct') === 'true';
        const feedbackDiv = buttonElement.closest('.quiz-exercise').querySelector('.feedback');
        
        // Disable all buttons
        const buttons = buttonElement.closest('.options').querySelectorAll('.option-btn');
        buttons.forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            buttonElement.classList.add('correct');
            feedbackDiv.innerHTML = `
                <div class="correct-feedback">
                    <span class="emoji">🎉</span>
                    <p>Excellent! That's correct!</p>
                </div>
            `;
            this.score += 10;
            
            // Auto-continue after delay
            setTimeout(() => {
                buttonElement.closest('.interactive-overlay').remove();
                this.onCheckpointComplete(checkpointId, true);
            }, 2000);
        } else {
            buttonElement.classList.add('incorrect');
            const correctBtn = Array.from(buttons).find(btn => btn.getAttribute('data-correct') === 'true');
            if (correctBtn) correctBtn.classList.add('correct');
            
            feedbackDiv.innerHTML = `
                <div class="incorrect-feedback">
                    <span class="emoji">💭</span>
                    <p>Not quite! The correct answer is: <strong>${correctBtn.textContent.trim()}</strong></p>
                    <button class="btn-continue" onclick="this.closest('.interactive-overlay').remove(); window.videoPlayer.onCheckpointComplete('${checkpointId}', false)">
                        Continue
                    </button>
                </div>
            `;
        }
        
        feedbackDiv.style.display = 'block';
        
        // Log analytics
        this.logEvent('quiz_answered', {
            checkpointId,
            isCorrect,
            answer: buttonElement.getAttribute('data-answer')
        });
    }
    
    /**
     * Handle checkpoint completion
     */
    onCheckpointComplete(checkpointId, isCorrect) {
        this.completedCheckpoints.push(checkpointId);
        this.currentCheckpointIndex++;
        
        // Save progress
        this.saveProgress();
        
        // Resume video
        this.play();
        
        // Log completion
        this.logEvent('checkpoint_completed', {
            checkpointId,
            isCorrect,
            totalCompleted: this.completedCheckpoints.length
        });
    }
    
    /**
     * Play pronunciation audio
     */
    playPronunciation(audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
    
    /**
     * Record student pronunciation (placeholder for speech recognition API)
     */
    async recordPronunciation(checkpointId) {
        // This would integrate with a speech recognition API
        // For now, show a placeholder message
        const feedbackDiv = document.querySelector('.pronunciation-feedback');
        feedbackDiv.innerHTML = '<p>Recording... (Speech recognition would be integrated here)</p>';
        feedbackDiv.style.display = 'block';
        
        // Simulate recording delay
        setTimeout(() => {
            feedbackDiv.innerHTML = `
                <div class="pronunciation-result">
                    <span class="emoji">👍</span>
                    <p>Great job! Your pronunciation sounds good!</p>
                    <button class="btn-continue" onclick="this.closest('.interactive-overlay').remove(); window.videoPlayer.onCheckpointComplete('${checkpointId}', true)">
                        Continue
                    </button>
                </div>
            `;
        }, 2000);
    }
    
    /**
     * Handle lesson completion
     */
    onLessonComplete() {
        const performanceSummary = {
            lessonId: this.lessonData.id,
            completionDate: new Date().toISOString(),
            score: this.score,
            totalCheckpoints: this.lessonData.checkpoints.length,
            completedCheckpoints: this.completedCheckpoints.length,
            accuracy: this.completedCheckpoints.length > 0 
                ? (this.score / (this.completedCheckpoints.length * 10)) * 100 
                : 0
        };
        
        this.showCompletionScreen(performanceSummary);
        this.saveProgress(true);
        
        // Log completion
        this.logEvent('lesson_completed', performanceSummary);
    }
    
    /**
     * Show lesson completion screen
     */
    showCompletionScreen(summary) {
        const stars = Math.ceil((summary.accuracy / 100) * 5);
        const starDisplay = '⭐'.repeat(stars) + '☆'.repeat(5 - stars);
        
        const overlay = document.createElement('div');
        overlay.className = 'completion-overlay';
        overlay.innerHTML = `
            <div class="completion-content">
                <h2>🎉 Lesson Complete!</h2>
                <div class="stars">${starDisplay}</div>
                <div class="summary">
                    <p><strong>Score:</strong> ${summary.score} points</p>
                    <p><strong>Accuracy:</strong> ${summary.accuracy.toFixed(1)}%</p>
                    <p><strong>Completed:</strong> ${summary.completedCheckpoints}/${summary.totalCheckpoints} activities</p>
                </div>
                <div class="actions">
                    <button class="btn-replay" onclick="window.videoPlayer.replay()">
                        🔄 Watch Again
                    </button>
                    <button class="btn-next" onclick="window.videoPlayer.goToNextLesson()">
                        ➡️ Next Lesson
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    /**
     * Save progress to localStorage (or backend API)
     */
    saveProgress(isComplete = false) {
        const progress = {
            lessonId: this.lessonData.id,
            timestamp: this.video.currentTime,
            completedCheckpoints: this.completedCheckpoints,
            score: this.score,
            isComplete,
            lastUpdated: new Date().toISOString()
        };
        
        localStorage.setItem(`lesson_progress_${this.lessonData.id}`, JSON.stringify(progress));
        
        // In production, also save to backend
        // this.saveToBackend(progress);
    }
    
    /**
     * Load saved progress
     */
    loadProgress() {
        const savedProgress = localStorage.getItem(`lesson_progress_${this.lessonData.id}`);
        
        if (savedProgress) {
            const progress = JSON.parse(savedProgress);
            
            if (!progress.isComplete) {
                this.video.currentTime = progress.timestamp;
                this.completedCheckpoints = progress.completedCheckpoints || [];
                this.score = progress.score || 0;
                this.currentCheckpointIndex = this.completedCheckpoints.length;
            }
        }
    }
    
    /**
     * Basic playback controls
     */
    play() {
        this.video.play();
        this.updatePlayPauseButton(true);
    }
    
    pause() {
        this.video.pause();
        this.updatePlayPauseButton(false);
    }
    
    togglePlayPause() {
        if (this.video.paused) {
            this.play();
        } else {
            this.pause();
        }
    }
    
    updatePlayPauseButton(isPlaying) {
        const playIcon = document.querySelector('.icon-play');
        const pauseIcon = document.querySelector('.icon-pause');
        
        if (playIcon && pauseIcon) {
            playIcon.style.display = isPlaying ? 'none' : 'inline';
            pauseIcon.style.display = isPlaying ? 'inline' : 'none';
        }
    }
    
    seek(event) {
        const progressBar = event.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.video.currentTime = percent * this.video.duration;
    }
    
    updateProgressBar() {
        const progressFilled = document.querySelector('.progress-filled');
        const timeDisplay = document.querySelector('.time-display');
        
        if (progressFilled && this.video.duration) {
            const percent = (this.video.currentTime / this.video.duration) * 100;
            progressFilled.style.width = `${percent}%`;
        }
        
        if (timeDisplay) {
            const current = this.formatTime(this.video.currentTime);
            const duration = this.formatTime(this.video.duration);
            timeDisplay.textContent = `${current} / ${duration}`;
        }
    }
    
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    cyclePlaybackSpeed() {
        const currentSpeed = this.video.playbackRate;
        const speeds = this.options.playbackSpeeds;
        const currentIndex = speeds.indexOf(currentSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        
        this.video.playbackRate = speeds[nextIndex];
        
        const speedBtn = document.querySelector('.speed');
        if (speedBtn) {
            speedBtn.textContent = `${speeds[nextIndex]}x`;
        }
    }
    
    toggleSubtitles() {
        const tracks = this.video.textTracks;
        
        if (tracks.length > 0) {
            const track = tracks[0];
            track.mode = track.mode === 'showing' ? 'hidden' : 'showing';
            
            const subtitlesBtn = document.querySelector('.subtitles');
            if (subtitlesBtn) {
                subtitlesBtn.classList.toggle('active', track.mode === 'showing');
            }
        }
    }
    
    toggleFullscreen() {
        const container = this.video.parentElement;
        
        if (!document.fullscreenElement) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }
    
    replay() {
        this.video.currentTime = 0;
        this.currentCheckpointIndex = 0;
        this.completedCheckpoints = [];
        this.score = 0;
        
        // Remove completion overlay
        const completionOverlay = document.querySelector('.completion-overlay');
        if (completionOverlay) {
            completionOverlay.remove();
        }
        
        this.play();
    }
    
    goToNextLesson() {
        // This would navigate to the next lesson
        // Implementation depends on the application architecture
        this.logEvent('next_lesson_clicked', { currentLessonId: this.lessonData.id });
        alert('Navigate to next lesson (implementation needed)');
    }
    
    handleError(error) {
        console.error('Video player error:', error);
        
        const errorOverlay = document.createElement('div');
        errorOverlay.className = 'error-overlay';
        errorOverlay.innerHTML = `
            <div class="error-content">
                <h2>⚠️ Oops!</h2>
                <p>We're having trouble loading this video.</p>
                <button onclick="location.reload()">Try Again</button>
            </div>
        `;
        
        document.body.appendChild(errorOverlay);
    }
    
    logEvent(eventName, data) {
        // Analytics logging
        console.log(`Event: ${eventName}`, data);
        
        // In production, send to analytics service
        // analytics.track(eventName, data);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InteractiveVideoPlayer;
}
