// Fetch and render resources for beginner.html
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const response = await fetch('beginner_resources.json');
        const data = await response.json();

        // Render Books
        const booksContainer = document.getElementById('books-container');
        if (booksContainer) {
            booksContainer.innerHTML = ''; // Clear fallback content
            data.books.forEach(book => {
                booksContainer.innerHTML += `
                    <a href="${book.url}" target="_blank" class="book-thumbnail" style="background: ${book.gradient}; text-decoration: none; color: ${book.textColor}; border-color: ${book.borderColor};">
                        ${book.title}<br><i class="${book.icon}" style="margin-top: 5px;"></i>
                    </a>
                `;
            });
        }

        // Render Videos
        const videosContainer = document.getElementById('videos-container');
        if (videosContainer) {
            videosContainer.innerHTML = '';
            data.videos.forEach(video => {
                videosContainer.innerHTML += `
                    <a href="${video.url}" target="_blank" style="text-decoration: none; color: inherit; display: block;">
                        <div class="video-card" style="background: #1e293b; border-radius: 12px; padding: 15px; margin-bottom: 20px; border: 2px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 15px; text-align: left; transition: all 0.3s ease;">
                            <div style="width: 50px; height: 50px; background: ${video.iconBg}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; color: ${video.iconColor};">
                                <i class="${video.icon}"></i>
                            </div>
                            <div>
                                <div style="font-size: 14px; font-weight: 800;">${video.title}</div>
                                <div style="font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px;">${video.channel}</div>
                            </div>
                        </div>
                    </a>
                `;
            });
        }

        // Render Cheatsheets
        const cheatsheetsContainer = document.getElementById('cheatsheets-container');
        if (cheatsheetsContainer) {
            cheatsheetsContainer.innerHTML = '';
            data.cheatsheets.forEach(cs => {
                cheatsheetsContainer.innerHTML += `
                    <a href="${cs.url}" target="_blank" style="text-decoration: none; display: block;">
                        <div class="cheatsheet-card" style="background: linear-gradient(135deg, #1e1b4b, #312e81); border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 2px solid rgba(255,255,255,0.2); text-align: left; position: relative; overflow: hidden; transition: all 0.3s ease;">
                            <div style="position: absolute; top: -10px; right: -10px; font-size: 80px; color: rgba(255,255,255,0.05);">
                                <i class="${cs.icon}"></i>
                            </div>
                            <div style="font-family: var(--font-code); color: #a5b4fc; font-size: 12px; margin-bottom: 5px;">const cheatSheet = {</div>
                            <div style="font-family: var(--font-code); color: #fff; font-size: 16px; font-weight: 800; margin-bottom: 5px; padding-left: 15px;">title: "${cs.title}",</div>
                            <div style="font-family: var(--font-code); color: #34d399; font-size: 14px; margin-bottom: 10px; padding-left: 15px;">status: "${cs.status}",</div>
                            <div style="font-family: var(--font-code); color: #a5b4fc; font-size: 12px;">}</div>
                        </div>
                    </a>
                `;
            });
        }

    } catch (error) {
        console.error("Failed to load resources:", error);
    }
});
