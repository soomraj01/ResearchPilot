export class SemanticScholarService {
  async searchPapers(query: string, limit: number = 10): Promise<any[]> {
    try {
      // Using Crossref API as it has no auth requirement and very high rate limits
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(query)}&select=title,abstract,author,issued,URL&rows=${limit}`;
      const response = await fetch(url);
      const data = (await response.json()) as any;
      
      const items = data.message?.items || [];
      
      return items.map((item: any) => ({
        paperId: item.URL, // use URL as unique id
        title: item.title?.[0] || 'Unknown Title',
        abstract: item.abstract ? item.abstract.replace(/<[^>]*>?/gm, '') : 'No abstract available.',
        authors: item.author ? item.author.map((a: any) => `${a.given || ''} ${a.family || ''}`.trim()) : [],
        year: item.issued?.['date-parts']?.[0]?.[0] || new Date().getFullYear(),
        paperUrl: item.URL
      }));
    } catch (error) {
      console.error('Error fetching from Crossref:', error);
      throw error;
    }
  }
}
