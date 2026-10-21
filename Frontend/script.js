const API_URL = 'http://127.0.0.1:5000';

const reviewInput = document.getElementById('reviewInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn'); 
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

analyzeBtn.addEventListener('click', analyzeSentiment);

reviewInput.addEventListener('keydown', (e) =>{
    if((e.ctrlKey || e.metaKey) && e.key === 'Enter'){
        analyzeSentiment();
    }
});

//clear butten
clearBtn.addEventListener('click', () => {
    reviewInput.value = '';
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    reviewInput.focus();
});

async function analyzeSentiment() {
    const text = reviewInput.value.trim();

    if(!text){
        showError('please enter a review before analyzing..');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class = "loading"></span> Analyzing...';
    resultDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    try{
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        });

        if(!response.ok){
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while analyzing sentiment.');

        }
        const data = await response.json();
        showResult(data);
    }catch(err){
        showError(err.message || 'Failed to analyze sentiment. Please try again later.');
    }finally{
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Analyze Sentiment';
    }
}

function showResult(data) {
    const isPositive = data.sentiment === 'positive';
    const emoji = isPositive ? '😊' : '😞';
    const label = isPositive ? 'Positive' : 'Negative';

    resultDiv.className = `result ${isPositive ? 'positive' : 'negative'}`;
    resultDiv.innerHTML = `
        <div class="label">${emoji} ${label}</div>
        <div class="confidence">Confidence: ${data.confidence}%</div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${data.confidence}%"></div>
        </div>
    `;
    resultDiv.classList.remove('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}
