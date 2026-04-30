// Fetch weather-related project READMEs from GitHub via REST API
// Uses Context7 live docs to ensure correct GitHub API endpoints and auth patterns

export async function fetchWeatherProjectReadmes(searchTerm = 'weather api') {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(searchTerm)}&sort=stars&order=desc&per_page=5`

  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`)
    }

    const data = await res.json()
    const projects = []

    for (const repo of data.items) {
      const readmeUrl = `https://api.github.com/repos/${repo.owner.login}/${repo.name}/readme`
      try {
        const readmeRes = await fetch(readmeUrl, {
          headers: {
            'Accept': 'application/vnd.github.v3.raw',
            'X-GitHub-Api-Version': '2022-11-28'
          }
        })

        if (readmeRes.ok) {
          const readmeText = await readmeRes.text()
          projects.push({
            name: repo.name,
            owner: repo.owner.login,
            url: repo.html_url,
            stars: repo.stargazers_count,
            description: repo.description,
            readmePreview: readmeText.substring(0, 500)
          })
        }
      } catch {
        // README not found, skip this repo
      }
    }

    return projects
  } catch (error) {
    console.error('GitHub fetch error:', error.message)
    return []
  }
}
