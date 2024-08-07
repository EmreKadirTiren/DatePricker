function selectOption(dateDiv, option) {
    const buttons = dateDiv.querySelectorAll('button');
    buttons.forEach(button => button.classList.remove('selected'));

    const selectedButton = dateDiv.querySelector(`button.${option}`);
    selectedButton.classList.add('selected');
}

document.addEventListener('DOMContentLoaded', async function() {
    const response = await fetch('/api/get-dates');
    const dates = await response.json();

    const datesContainer = document.getElementById('dates-container');

    dates.forEach(date => {
        const dateDiv = document.createElement('div');
        dateDiv.classList.add('date-option');

        const dateSpan = document.createElement('span');
        dateSpan.textContent = new Date(date).toLocaleDateString('nl-NL');
        dateDiv.appendChild(dateSpan);

        const greenButton = document.createElement('button');
        greenButton.classList.add('green');
        greenButton.innerHTML = '✔️';
        greenButton.addEventListener('click', () => selectOption(dateDiv, 'green'));
        dateDiv.appendChild(greenButton);

        const yellowButton = document.createElement('button');
        yellowButton.classList.add('yellow');
        yellowButton.innerHTML = '➖';
        yellowButton.addEventListener('click', () => selectOption(dateDiv, 'yellow'));
        dateDiv.appendChild(yellowButton);

        const redButton = document.createElement('button');
        redButton.classList.add('red');
        redButton.innerHTML = '❌';
        redButton.addEventListener('click', () => selectOption(dateDiv, 'red'));
        dateDiv.appendChild(redButton);

        datesContainer.appendChild(dateDiv);
    });
});

document.getElementById('userForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const dateOptions = document.querySelectorAll('.date-option');
    const choices = [];

    dateOptions.forEach(option => {
        const date = option.querySelector('span').textContent;
        const selectedButton = option.querySelector('button.selected');
        if (selectedButton) {
            choices.push({ date: new Date(date).toISOString().split('T')[0], choice: selectedButton.classList[0] });
        }
    });

    const response = await fetch('/api/submit-choices', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, choices })
    });

    const result = await response.json();
    document.getElementById('response').innerText = result.message;
});