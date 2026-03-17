// This tells JS to wait until the HTML is fully drawn on the screen before running
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubStats();
});

// The 'async' keyword allows us to use 'await' inside this function
async function fetchGitHubStats() {
    // Grab every HTML element that has a 'data-repo' attribute
    const projects = document.querySelectorAll('.project-tile[data-repo]');

    // Loop through each project tile
    for (const project of projects) {
        // Read the repository name we set in the HTML
        const repoPath = project.getAttribute('data-repo');
        const statsContainer = project.querySelector('.repo-stats');

        try {
            // Ping the GitHub API. 'await' pauses this function until GitHub replies
            const response = await fetch(`https://api.github.com/repos/${repoPath}`);
            
            // If the repo doesn't exist or we hit a rate limit, throw an error
            if (!response.ok) throw new Error('Network response failed');
            
            // Convert the raw response into a usable JSON object
            const data = await response.json();

            // Inject the dynamic HTML right into the container
            statsContainer.innerHTML = `
                <span class="stat">⭐ ${data.stargazers_count}</span>
                <span class="stat">🍴 ${data.forks_count}</span>
            `;
            
        } catch (error) {
            // If anything fails, log it to the console and show a fallback message
            console.error(`Could not load stats for ${repoPath}:`, error);
            statsContainer.innerHTML = `<span class="stat stat-error">Stats unavailable</span>`;
        }
    }
}