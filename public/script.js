document.getElementById('dateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    
    const response = await fetch('/api/submit-date', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date })
    });
    
    const result = await response.json();
    
    document.getElementById('response').innerText = result.message;
});
