
import { NotePage } from '../types';

// Abstract storage service that can be easily switched between localStorage and API
export interface StorageService {
  getPages(): Promise<NotePage[]>;
  savePage(page: NotePage): Promise<void>;
  deletePage(pageId: string): Promise<void>;
  updatePage(pageId: string, updates: Partial<NotePage>): Promise<void>;
}

// Local storage implementation
export class LocalStorageService implements StorageService {
  private readonly key = 'notepad-pages';

  async getPages(): Promise<NotePage[]> {
    try {
      const data = localStorage.getItem(this.key);
      if (!data) return [];
      
      const pages = JSON.parse(data);
      // Convert date strings back to Date objects
      return pages.map((page: any) => ({
        ...page,
        createdAt: new Date(page.createdAt),
        updatedAt: new Date(page.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading pages from localStorage:', error);
      return [];
    }
  }

  async savePage(page: NotePage): Promise<void> {
    const pages = await this.getPages();
    const existingIndex = pages.findIndex(p => p.id === page.id);
    
    if (existingIndex >= 0) {
      pages[existingIndex] = page;
    } else {
      pages.push(page);
    }
    
    localStorage.setItem(this.key, JSON.stringify(pages));
  }

  async deletePage(pageId: string): Promise<void> {
    const pages = await this.getPages();
    const filteredPages = pages.filter(p => p.id !== pageId);
    localStorage.setItem(this.key, JSON.stringify(filteredPages));
  }

  async updatePage(pageId: string, updates: Partial<NotePage>): Promise<void> {
    const pages = await this.getPages();
    const pageIndex = pages.findIndex(p => p.id === pageId);
    
    if (pageIndex >= 0) {
      pages[pageIndex] = { ...pages[pageIndex], ...updates, updatedAt: new Date() };
      localStorage.setItem(this.key, JSON.stringify(pages));
    }
  }
}

// API storage implementation (ready for future use)
export class ApiStorageService implements StorageService {
  constructor(private baseUrl: string, private apiKey?: string) {}

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    return fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });
  }

  async getPages(): Promise<NotePage[]> {
    const response = await this.fetchWithAuth('/pages');
    if (!response.ok) throw new Error('Failed to fetch pages');
    
    const pages = await response.json();
    return pages.map((page: any) => ({
      ...page,
      createdAt: new Date(page.createdAt),
      updatedAt: new Date(page.updatedAt),
    }));
  }

  async savePage(page: NotePage): Promise<void> {
    const response = await this.fetchWithAuth('/pages', {
      method: 'POST',
      body: JSON.stringify(page),
    });
    
    if (!response.ok) throw new Error('Failed to save page');
  }

  async deletePage(pageId: string): Promise<void> {
    const response = await this.fetchWithAuth(`/pages/${pageId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) throw new Error('Failed to delete page');
  }

  async updatePage(pageId: string, updates: Partial<NotePage>): Promise<void> {
    const response = await this.fetchWithAuth(`/pages/${pageId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) throw new Error('Failed to update page');
  }
}

// Factory function to get the appropriate storage service
export function createStorageService(config?: { 
  type: 'localStorage' | 'api';
  apiUrl?: string;
  apiKey?: string;
}): StorageService {
  if (config?.type === 'api' && config.apiUrl) {
    return new ApiStorageService(config.apiUrl, config.apiKey);
  }
  
  return new LocalStorageService();
}
