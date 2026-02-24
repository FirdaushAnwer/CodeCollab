// Fetch events from local JSON file
async function fetchEventsData() {
    try {
        const response = await fetch('./events.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching events.json:', error);
        return [];
    }
}

// Helper to format date strings like "2026-10-15" to Month/Day
function parseEventDate(dateStr) {
    if (!dateStr) return { month: 'TBD', day: '--' };
    try {
        // Handle timezone offset issues by splitting
        const [year, month, day] = dateStr.split('-');
        const d = new Date(year, month - 1, day);
        if (isNaN(d.getTime())) return { month: 'TBD', day: '--' };

        return {
            month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
            day: d.getDate().toString().padStart(2, '0')
        };
    } catch {
        return { month: 'TBD', day: '--' };
    }
}

// Render events to the DOM
function renderEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) return;

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-light); border: 2px dashed var(--border-color); border-radius: 8px;">
                <i class="fa-solid fa-calendar-xmark fa-2x"></i>
                <p style="margin-top: 15px;">No hackathons right now. Check back soon!</p>
            </div>
        `;
        return;
    }

    let html = '';
    events.forEach((event, index) => {
        const parsedDate = parseEventDate(event.date);
        const delay = (index % 3) * 0.1;

        const status = event.status || "Registration Open";
        const tagClass = status.toLowerCase().includes('open') ? 'red' : 'yellow';
        const description = event.description || "Join the community and collaborate on this upcoming developer challenge.";
        const prize = event.prize || "TBD";
        const btnClass = status.toLowerCase().includes('open') ? 'btn-outline' : 'btn-outline disabled';
        const btnText = status.toLowerCase().includes('open') ? 'Apply Now <i class="fa-solid fa-arrow-right"></i>' : 'Applications Open Soon';

        html += `
            <div class="event-card fade-up visible" style="animation-delay: ${delay}s;">
                <div class="event-date">
                    <span class="month">${parsedDate.month}</span>
                    <span class="day">${parsedDate.day}</span>
                </div>
                <div class="event-details">
                    <div class="event-tag ${tagClass}">${status}</div>
                    <h3>${event.title}</h3>
                    <p>${description}</p>
                    <div class="event-meta">
                        <span><i class="fa-solid fa-globe"></i> Online</span>
                        <span><i class="fa-solid fa-trophy"></i> ${prize}</span>
                    </div>
                    <a href="${event.link}" target="_blank" class="btn ${btnClass} btn-event">${btnText}</a>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Main initialize function
export async function initializeEvents() {
    const events = await fetchEventsData();
    renderEvents(events);
}
