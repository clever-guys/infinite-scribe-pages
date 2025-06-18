// LocalStorage Utility Functions
const getLocalStorage = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
  }
  return defaultValue;
};

const setLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

document.addEventListener('alpine:init', () => {
  Alpine.store('notepad', {
    // State
    pages: getLocalStorage('notepad-pages', []),
    currentPageId: null,

    // Getters (methods that compute values)
    get currentPage() {
      return this.pages.find(page => page.id === this.currentPageId) || null;
    },

    get tagCache() {
      const cache = {};
      this.pages.forEach(page => {
        (page.tags || []).forEach(tag => {
          if (!cache[tag]) {
            cache[tag] = [];
          }
          cache[tag].push(page.id);
        });
      });
      return cache;
    },

    // Actions (methods)
    extractTags(content) {
      if (!content) return [];
      const tagRegex = /#([a-zA-Z0-9_]+)/g;
      const matches = content.match(tagRegex);
      return matches ? matches.map(tag => tag.substring(1)) : [];
    },

    extractPlaces(content) {
      if (!content) return [];
      const placeRegex = /@([a-zA-Z0-9_]+)/g; // Basic regex, can be improved
      const matches = content.match(placeRegex);
      return matches ? matches.map(place => place.substring(1)) : [];
    },

    createPage() {
      const newPage = {
        id: Date.now().toString(), // Simple unique ID
        title: 'New Page',
        content: '',
        tags: [],
        places: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.pages.push(newPage);
      this.currentPageId = newPage.id;
      setLocalStorage('notepad-pages', this.pages);
      return newPage;
    },

    updatePage(pageId, updates) {
      const pageIndex = this.pages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) return null;

      const originalPage = this.pages[pageIndex];
      const updatedPage = { ...originalPage, ...updates, updatedAt: new Date().toISOString() };

      if (updates.content !== undefined) {
        updatedPage.tags = this.extractTags(updates.content);
        updatedPage.places = this.extractPlaces(updates.content);
      }

      this.pages[pageIndex] = updatedPage;
      setLocalStorage('notepad-pages', this.pages);
      return updatedPage;
    },

    deletePage(pageId) {
      this.pages = this.pages.filter(p => p.id !== pageId);
      if (this.currentPageId === pageId) {
        this.currentPageId = this.pages.length > 0 ? this.pages[0].id : null;
      }
      setLocalStorage('notepad-pages', this.pages);
    },

    getPagesByTag(tag) {
      const pageIds = this.tagCache[tag] || [];
      return this.pages.filter(page => pageIds.includes(page.id));
    },

    setCurrentPageId(pageId) {
      this.currentPageId = pageId;
    },
  });
});
