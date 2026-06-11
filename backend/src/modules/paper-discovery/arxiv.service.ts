export class ArxivService {
  async searchPapers(query: string, maxResults: number = 10): Promise<any[]> {
    const url = `http://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}`;
    try {
      const response = await fetch(url);
      const text = await response.text();
      // Returning raw data for now as placeholder for full parsing logic
      return [{ source: 'arxiv', raw: text }];
    } catch (error) {
      console.error('Error fetching from Arxiv:', error);
      throw error;
    }
  }
}
