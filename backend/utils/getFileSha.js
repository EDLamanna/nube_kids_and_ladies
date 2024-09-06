import axios from 'axios'

export async function getFileSha (owner, repo, path, token) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  })
  return response.data.sha
}
