const API_URL = 'http://127.0.0.1:5000';

const reviewInput = document.getElementById('reviewInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn'); 
const resultDiv = document.getElementById('result');
const errorDiv = document.getElementById('error');

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



