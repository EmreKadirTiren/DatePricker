document.getElementById('dateForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    const response = await fetch('/api/set-dates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate })
    });

    const result = await response.json();
    document.getElementById('response').innerText = result.message;
});
