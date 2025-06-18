
import { useState, useEffect, useRef } from 'react';
import { Trash2, MapPin, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { NotePage } from '../types';

interface NoteEditorProps {
  page: NotePage;
  onUpdate: (updates: Partial<NotePage>) => void;
  onDelete: () => void;
}

export function NoteEditor({ page, onUpdate, onDelete }: NoteEditorProps) {
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(page.title);
    setContent(page.content);
  }, [page.id, page.title, page.content]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    onUpdate({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onUpdate({ content: newContent });
  };

  const highlightSyntax = (text: string) => {
    return text
      .replace(/#(\w+)/g, '<span class="text-blue-600 font-medium">#$1</span>')
      .replace(/@(\w+(?:\s+\w+)*)/g, '<span class="text-green-600 font-medium">@$1</span>');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex-1 mr-4">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Page title..."
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 p-4">
        <div className="relative h-full">
          <Textarea
            ref={contentRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Start writing... Use #tags for organization and @place for locations"
            className="w-full h-full resize-none border-none shadow-none focus-visible:ring-0 text-base leading-relaxed"
            style={{ minHeight: '400px' }}
          />
        </div>
      </div>

      {(page.tags.length > 0 || page.places.length > 0) && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          {page.tags.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center mb-2">
                <Hash className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {page.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {page.places.length > 0 && (
            <div>
              <div className="flex items-center mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Places</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {page.places.map(place => (
                  <Badge key={place.id} variant="secondary" className="bg-green-100 text-green-800">
                    @{place.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
