import axios from 'axios'
import { config } from 'dotenv'
import { getFileSha } from '../utils/getFileSha.js'

// Carga las variables de entorno
config()

export async function uploadImageToGitHub (fileName, fileBuffer) {
  const githubToken = process.env.GITHUB_TOKEN
  const repoOwner = process.env.GITHUB_REPO_OWNER
  const repoName = process.env.GITHUB_REPO_NAME
  const branch = process.env.GITHUB_BRANCH

  const url = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/images/${fileName}`
  const content = fileBuffer.toString('base64')

  try {
    let sha
    try {
      // Obtener el SHA del archivo actual (si existe)
      sha = await getFileSha(repoOwner, repoName, `images/${fileName}`, githubToken)
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Si el archivo no existe, continua sin el SHA
        sha = null
      } else {
        throw error
      }
    }

    const data = {
      message: `Añadiendo la imagen ${fileName}`,
      content,
      branch,
      ...(sha && { sha }) // Incluye el SHA en la solicitud si existe
    }

    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github.v3+json'
      }
    })

    if (response.status === 201 || response.status === 200) {
      return response.data.content.download_url // Devuelve la URL de la imagen subida
    } else {
      throw new Error(`Error al subir la imagen: ${response.statusText}`)
    }
  } catch (error) {
    if (error.response && error.response.status === 409) {
      // Si hay un conflicto de SHA, se vuelve a intentar con el nuevo SHA
      return await uploadImageToGitHub(fileName, fileBuffer)
    } else {
      throw error
    }
  }
}
