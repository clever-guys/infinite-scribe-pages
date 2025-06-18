
import { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { NotePage, TagCache, PlaceMarker } from '../types';

export function useNotepad() {
  const [pages, setPages] = useLocalStorage<NotePage[]>('notepad-pages', []);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const extractTags = (content: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = content.match(tagRegex);
    return matches ? matches.map(tag => tag.slice(1).toLowerCase()) : [];
  };

  const extractPlaces = (content: string): PlaceMarker[] => {
    const placeRegex = /@(\w+(?:\s+\w+)*)/g;
    const matches = content.match(placeRegex);
    return matches ? matches.map((place, index) => ({
      id: `place-${Date.now()}-${index}`,
      name: place.slice(1),
    })) : [];
  };

  const tagCache = useMemo<TagCache>(() => {
    const cache: TagCache = {};
    pages.forEach(page => {
      page.tags.forEach(tag => {
        if (!cache[tag]) cache[tag] = [];
        if (!cache[tag].includes(page.id)) {
          cache[tag].push(page.id);
        }
      });
    });
    return cache;
  }, [pages]);

  const createPage = useCallback(() => {
    const newPage: NotePage = {
      id: `page-${Date.now()}`,
      title: 'Untitled',
      content: '',
      tags: [],
      places: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setPages(prev => [...prev, newPage]);
    setCurrentPageId(newPage.id);
    return newPage.id;
  }, [setPages]);

  const updatePage = useCallback((pageId: string, updates: Partial<NotePage>) => {
    setPages(prev => prev.map(page => {
      if (page.id === pageId) {
        const updatedContent = updates.content || page.content;
        const updatedPage = {
          ...page,
          ...updates,
          tags: updates.content ? extractTags(updatedContent) : page.tags,
          places: updates.content ? extractPlaces(updatedContent) : page.places,
          updatedAt: new Date(),
        };
        return updatedPage;
      }
      return page;
    }));
  }, [setPages]);

  const deletePage = useCallback((pageId: string) => {
    setPages(prev => prev.filter(page => page.id !== pageId));
    if (currentPageId === pageId) {
      setCurrentPageId(null);
    }
  }, [setPages, currentPageId]);

  const getPagesByTag = useCallback((tag: string) => {
    const pageIds = tagCache[tag] || [];
    return pages.filter(page => pageIds.includes(page.id));
  }, [pages, tagCache]);

  const currentPage = pages.find(page => page.id === currentPageId);

  return {
    pages,
    currentPage,
    currentPageId,
    tagCache,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    getPagesByTag,
  };
}
