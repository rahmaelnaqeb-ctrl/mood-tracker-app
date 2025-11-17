// ====================================
//          GLOBAL STATE & MOCK DATA
// ====================================

// --- USER PROFILE GLOBAL STATE ---
let userProfile = {
    name: "",
    avatarUrl: "", 
    dateJoined: "April 1st, 2025"
};

// --- MOCK DATA --- (Use 7 entries for testing, extend to 10+ for a proper 5 vs 5 comparison)
const moodData = [
    {
        date: "2025-11-10", day: "Mon",
        mood: "Excited", moodScore: 4.5, sleepHours: 7.5, reflection: "Completed the first draft of the project.", quote: "The future belongs to those who believe in the beauty of their dreams."
    },
    {
        date: "2025-11-11", day: "Tue",
        mood: "Calm", moodScore: 4.0,
        sleepHours: 8, reflection: "Focused on deep work and enjoyed a quiet evening.", quote: "Peace comes from within. Do not seek it without."
    },
    {
        date: "2025-11-12", day: "Wed",
        mood: "Neutral", moodScore: 2.5,
        sleepHours: 6.5, reflection: "Day felt average. Need to plan for tomorrow.", quote: "The middle path is the only way."
    },
    {
        date: "2025-11-13", day: "Thu",
        mood: "Stressed", moodScore: 1.0,
        sleepHours: 5, reflection: "Stayed up late debugging. Definitely feeling the lack of sleep.", quote: "It's okay to not be okay. Just don't give up."
    },
    {
        date: "2025-11-14", day: "Fri",
        mood: "Joyful", moodScore: 5.0,
        sleepHours: 9, reflection: "Project launched successfully! Celebrated with friends.", quote: "Happiness is not something readymade. It comes from your own actions."
    },
    {
        date: "2025-11-15", day: "Sat",
        mood: "Tired", moodScore: 2.0,
        sleepHours: 10, reflection: "Recovering from the week. Took a long nap.", quote: "Rest is not idleness, and to lie sometimes on the grass is not a waste of time."
    },
    {
        date: "2025-11-16", day: "Sun",
        mood: "Content", moodScore: 3.5,
        sleepHours: 8, reflection: "Planned the upcoming week and felt ready for Monday.", quote: "Contentment is natural wealth, luxury is artificial poverty."
    }
];

const moodToScore = {
    "Joyful": 5.0,
    "Excited": 4.5,
    "Content": 3.5,
    "Calm": 3.0,
    "Neutral": 2.5,
    "Tired": 2.0,
    "Stressed": 1.0,
};

// ====================================
//          HELPER FUNCTIONS
// ====================================

/**
 * Calculates the average of a given array of numbers.
 * @param {Array<number>} dataArray - Array of numerical values.
 * @returns {number} The average.
 */
const calculateAverage = (dataArray) => {
    if (dataArray.length === 0) return 0;
    const sum = dataArray.reduce((acc, current) => acc + current, 0);
    return sum / dataArray.length;
};

// Function to get the correct emoji for the mood
const getMoodEmoji = (mood) => {
    switch(mood) {
        case 'Joyful':
        case 'Excited':
            return '😀';
        case 'Content':
        case 'Calm':
            return '😌';
        case 'Stressed':
        case 'Tired':
            return '😫';
        default:
            return '😐';
    }
};

// Function to reset and re-render all dynamic components
const updateApp = () => {
    // Clean up existing dynamically injected elements (like comparison results)
    const comparisonSection = document.querySelector('.sleep-comparison');
    if (comparisonSection) {
        comparisonSection.remove();
    }
    
    // Clean up old chart before re-rendering
    const chartContainer = document.getElementById('mood-chart-container');
    const oldCanvas = document.getElementById('moodChart');
    if (oldCanvas) {
        oldCanvas.remove();
    }
    const newCanvas = document.createElement('canvas');
    newCanvas.id = 'moodChart';
    chartContainer.appendChild(newCanvas);

    // Re-render everything with the new data
    displayTodayMood();
    renderMoodChart();
    compareAverages();
};


// ====================================
//          DISPLAY FUNCTIONS
// ====================================

// --- TASK 15: Display User Name ---
const displayUserName = () => {
    const greetingElement = document.getElementById('user-greeting');
    if (greetingElement) {
        greetingElement.innerHTML = `Hello, ${userProfile.name}!`;
    }
    // Set the default name in the settings form
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        userNameInput.value = userProfile.name;
    }
};

// --- TASK 3: DISPLAY TODAY'S MOOD ---
const displayTodayMood = () => {
    const latestEntry = moodData[moodData.length - 1];
    
    if (!latestEntry) {
        document.getElementById('today-mood-card').innerHTML = 
            "<p>No mood entries found.</p>";
        return;
    }

    const todayCard = document.getElementById('today-mood-card');
    const moodEmoji = getMoodEmoji(latestEntry.mood);

    const htmlContent = `
        <div class="mood-text-area">
            <p>I'm feeling</p>
            <h1>${latestEntry.mood}</h1>
            <span style="font-size: 70px;">${moodEmoji}</span>
            <hr>
            <blockquote>"${latestEntry.quote}"</blockquote>
        </div>
        <div class="details-area">
            <div>
                <strong>💤 Sleep</strong>
                <p>${latestEntry.sleepHours}+ hours</p>
            </div>
            <div>
                <strong>📝 Reflection</strong>
                <p>${latestEntry.reflection}</p>
            </div>
            <p style="font-size: 0.8rem; color: #a0aec0; margin-top: 15px;">#${latestEntry.mood}</p>
        </div>
    `;

    todayCard.innerHTML = htmlContent;
};


// --- TASK 13: Calculate and Compare Averages ---
const compareAverages = () => {
    // Using 3 entries for the small mock data set (change to 5 for production data)
    const requiredLength = 3; 
    
    if (moodData.length < requiredLength * 2) {
        // Fallback for smaller data set
        // console.warn(`Using a ${requiredLength} vs ${requiredLength} comparison.`);
    }

    // 1. Extract and Slice Data
    const allMoodScores = moodData.map(entry => entry.moodScore);
    const prevMoodSlice = allMoodScores.slice(0, requiredLength);
    const recentMoodSlice = allMoodScores.slice(requiredLength);
    
    const allSleepHours = moodData.map(entry => entry.sleepHours);
    const previousSleepSlice = allSleepHours.slice(0, requiredLength); 
    const recentSleepSlice = allSleepHours.slice(requiredLength); 

    // 2. Calculate Averages
    const prevMoodAvg = calculateAverage(prevMoodSlice);
    const recentMoodAvg = calculateAverage(recentMoodSlice);
    const prevSleepAvg = calculateAverage(previousSleepSlice);
    const recentSleepAvg = calculateAverage(recentSleepSlice);

    // 3. Generate comparison messages
    const moodDifference = (recentMoodAvg - prevMoodAvg);
    const sleepDifference = (recentSleepAvg - prevSleepAvg);
    
    const getStatusMessage = (diff, unit = '') => {
        if (diff > 0.01) return `Increase (${Math.abs(diff).toFixed(1)}${unit}) from the previous ${prevMoodSlice.length} check-ins`;
        if (diff < -0.01) return `Decrease (${Math.abs(diff).toFixed(1)}${unit}) from the previous ${prevMoodSlice.length} check-ins`;
        return `Same as the previous ${prevMoodSlice.length} check-ins`;
    };

    // 4. Display Results (Inject HTML)
    const comparisonSection = document.createElement('div');
    comparisonSection.classList.add('sleep-comparison');
    
    const firstColumn = document.querySelector('.dashboard-grid > div:first-child');
    if (firstColumn) {
        firstColumn.appendChild(comparisonSection);
    }

    comparisonSection.innerHTML = `
        <div class="average-mood-card">
            <p>Average Mood</p>
            <p>${recentMoodAvg.toFixed(1)} / 5</p>
            <small>${getStatusMessage(moodDifference)}</small>
        </div>
        <div class="average-sleep-card">
            <p>Average Sleep</p>
            <p>${recentSleepAvg.toFixed(1)} Hours</p>
            <small>${getStatusMessage(sleepDifference, ' hrs')}</small>
        </div>
    `;
};


// --- TASK 11: RENDER DUAL TREND CHART ---
let moodChartInstance = null; // To manage the chart instance for destruction

const renderMoodChart = () => {
    
    const chartLabels = moodData.map(entry => entry.day); 
    const sleepDataPoints = moodData.map(entry => entry.sleepHours);
    const moodDataPoints = moodData.map(entry => entry.moodScore); 

    const ctx = document.getElementById('moodChart').getContext('2d');

    // Destroy existing chart if it exists
    if (moodChartInstance) {
        moodChartInstance.destroy();
    }

    moodChartInstance = new Chart(ctx, {
        type: 'bar', 
        data: {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Sleep Hours (Hours)',
                    data: sleepDataPoints,
                    backgroundColor: 'rgba(99, 102, 241, 0.8)', // Primary color
                    yAxisID: 'y' 
                },
                {
                    label: 'Mood Score (1-5)',
                    data: moodDataPoints,
                    backgroundColor: 'transparent',
                    borderColor: '#f87171', // Coral color for mood line
                    pointBackgroundColor: '#f87171',
                    pointRadius: 5,
                    type: 'line', 
                    yAxisID: 'y1', 
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: { display: true, text: 'Sleep Hours' },
                    min: 0,
                    max: 12
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: { display: true, text: 'Mood Score' },
                    min: 0,
                    max: 5,
                    grid: { drawOnChartArea: false } 
                }
            }
        }
    });
};

// ====================================
//          EVENT HANDLERS
// ====================================

// --- TASK 7: Handle Mood Form Submission ---
const handleFormSubmit = (event) => {
    event.preventDefault(); 

    const form = event.target;
    const dateInput = form.entryDate.value;
    const moodInput = form.mood.value;
    const sleepInput = parseFloat(form.sleepHours.value);
    const reflectionInput = form.reflection.value;

    const randomQuote = 'Your mood matters. Keep tracking!';

    const newEntry = {
        date: dateInput,
        day: new Date(dateInput + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' }), // Use 'T12:00:00' to avoid timezone issues
        mood: moodInput,
        moodScore: moodToScore[moodInput] || 2.5,
        sleepHours: sleepInput,
        reflection: reflectionInput,
        quote: randomQuote
    };

    moodData.push(newEntry);
    
    updateApp();
    form.reset();
};

// --- TASK 15: Handle Profile Submission ---
const handleProfileSubmit = (event) => {
    event.preventDefault();
    
    const form = event.target;
    const newName = form.userName.value.trim();
    const statusMessage = document.getElementById('profile-status');
    const oldName = userProfile.name;

    if (newName && newName !== oldName) {
        userProfile.name = newName;
        displayUserName();
        statusMessage.textContent = "Profile updated successfully!";
        statusMessage.style.color = "green";
    } else if (newName === oldName) {
         statusMessage.textContent = "Name is already set to that value.";
         statusMessage.style.color = "orange";
    }
};


// ====================================
//          INITIALIZATION
// ====================================

document.addEventListener('DOMContentLoaded', () => {
    const moodForm = document.getElementById('mood-logger-form');
    if (moodForm) {
        moodForm.addEventListener('submit', handleFormSubmit);
    }

    const profileForm = document.getElementById('profile-settings-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileSubmit);
    }
    
    // Set initial values and render the app
    displayUserName(); 
    updateApp(); 
});