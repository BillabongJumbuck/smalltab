import { getMessage } from './i18n.js';

export function initClock() {
    const timeDisplay = document.getElementById('time-display');
    const greetingDisplay = document.getElementById('greeting-display');

    function update() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        
        // Time Format HH:MM
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeDisplay.textContent = timeString;

        // Greeting
        let greetingKey = 'greetingEvening';
        if (hours >= 5 && hours < 12) {
            greetingKey = 'greetingMorning';
        } else if (hours >= 12 && hours < 18) {
            greetingKey = 'greetingAfternoon';
        }
        
        greetingDisplay.textContent = getMessage(greetingKey);
    }

    update();
    setInterval(update, 1000);
}
