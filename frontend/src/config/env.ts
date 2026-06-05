const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  console.warn(
    'VITE_API_URL is not defined. Copy .env.example to .env and set your API URL.',
  )
}

export const env = {
  apiUrl: apiUrl ?? 'http://localhost:3000/api',
} as const
