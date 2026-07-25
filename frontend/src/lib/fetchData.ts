const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

export async function fetchContent(model: string) {
  try {
    const res = await fetch(`${API_URL}/content/${model}`, {
      next: { tags: [model] },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(`Error fetching ${model}:`, error);
    return null;
  }
}
