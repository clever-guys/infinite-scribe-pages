
import { X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NotePage } from '../types';

interface TaggedPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  tag: string;
  pages: NotePage[];
  onPageSelect: (pageId: string) => void;
}

export function TaggedPagesModal({ 
  isOpen, 
  onClose, 
  tag, 
  pages, 
  onPageSelect 
}: TaggedPagesModalProps) {
  if (!isOpen) return null;

  const handlePageClick = (pageId: string) => {
    onPageSelect(pageId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center">
            <Badge className="bg-blue-100 text-blue-800 mr-3">#{tag}</Badge>
            <h2 className="text-lg font-semibold">Pages with this tag</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-96">
          {pages.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No pages found with this tag</p>
          ) : (
            <div className="space-y-3">
              {pages.map(page => (
                <button
                  key={page.id}
                  onClick={() => handlePageClick(page.id)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start">
                    <FileText className="w-4 h-4 mt-1 mr-3 text-gray-400" />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {page.title || 'Untitled'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {page.content || 'No content'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {page.tags.slice(0, 3).map(pageTag => (
                            <Badge 
                              key={pageTag} 
                              variant="secondary" 
                              className={`text-xs ${pageTag === tag ? 'bg-blue-100 text-blue-800' : ''}`}
                            >
                              #{pageTag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
