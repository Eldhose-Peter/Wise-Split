export async function fetchClient<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, options);
  if (!response.ok) {
    // Optionally throw error with status
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
