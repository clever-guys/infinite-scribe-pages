
import { Plus, Hash, MapPin, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { NotePage, TagCache } from '../types';

interface SidebarProps {
  pages: NotePage[];
  currentPageId: string | null;
  tagCache: TagCache;
  onPageSelect: (pageId: string) => void;
  onCreatePage: () => void;
  onTagSelect: (tag: string) => void;
}

export function Sidebar({ 
  pages, 
  currentPageId, 
  tagCache, 
  onPageSelect, 
  onCreatePage,
  onTagSelect 
}: SidebarProps) {
  const sortedPages = [...pages].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const allTags = Object.keys(tagCache).sort();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <Button 
          onClick={onCreatePage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Page
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Pages ({pages.length})
            </h3>
            <div className="space-y-1">
              {sortedPages.map(page => (
                <button
                  key={page.id}
                  onClick={() => onPageSelect(page.id)}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    currentPageId === page.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className="font-medium text-sm truncate">
                    {page.title || 'Untitled'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(page.updatedAt).toLocaleDateString()}
                  </div>
                  {page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {page.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                          #{tag}
                        </Badge>
                      ))}
                      {page.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          +{page.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Hash className="w-4 h-4 mr-2" />
                Tags ({allTags.length})
              </h3>
              <div className="space-y-1">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagSelect(tag)}
                    className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">#{tag}</span>
                    <Badge variant="outline" className="text-xs">
                      {tagCache[tag].length}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
