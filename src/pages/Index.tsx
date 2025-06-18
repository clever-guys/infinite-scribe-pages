
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotepad } from '../hooks/useNotepad';
import { Sidebar } from '../components/Sidebar';
import { NoteEditor } from '../components/NoteEditor';
import { TaggedPagesModal } from '../components/TaggedPagesModal';
import { StickyNote, Plus, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const {
    pages,
    currentPage,
    currentPageId,
    tagCache,
    setCurrentPageId,
    createPage,
    updatePage,
    deletePage,
    getPagesByTag,
  } = useNotepad();

  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagModal, setShowTagModal] = useState(false);

  const handleCreatePage = () => {
    createPage();
  };

  const handlePageSelect = (pageId: string) => {
    setCurrentPageId(pageId);
  };

  const handlePageUpdate = (updates: Partial<typeof currentPage>) => {
    if (currentPageId) {
      updatePage(currentPageId, updates);
    }
  };

  const handlePageDelete = () => {
    if (currentPageId) {
      deletePage(currentPageId);
    }
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    setShowTagModal(true);
  };

  const handleTagModalClose = () => {
    setShowTagModal(false);
    setSelectedTag(null);
  };

  const taggedPages = selectedTag ? getPagesByTag(selectedTag) : [];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        pages={pages}
        currentPageId={currentPageId}
        tagCache={tagCache}
        onPageSelect={handlePageSelect}
        onCreatePage={handleCreatePage}
        onTagSelect={handleTagSelect}
      />

      <div className="flex-1 flex flex-col">
        {currentPage ? (
          <>
            <div className="bg-white border-b border-gray-200 p-2 flex justify-end">
              <Link to="/mindmap">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Hash className="w-4 h-4 mr-2" />
                  View Mind Map
                </Button>
              </Link>
            </div>
            <NoteEditor
              page={currentPage}
              onUpdate={handlePageUpdate}
              onDelete={handlePageDelete}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-white">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <StickyNote className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to Your Notepad
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Create infinite pages with powerful organization. Use <span className="font-mono bg-gray-100 px-1 rounded">#tags</span> to categorize your notes and <span className="font-mono bg-gray-100 px-1 rounded">@places</span> to mark locations.
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={handleCreatePage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 w-full"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Page
                </Button>
                <Link to="/mindmap" className="block">
                  <Button 
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <Hash className="w-5 h-5 mr-2" />
                    View Tag Mind Map
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <TaggedPagesModal
        isOpen={showTagModal}
        onClose={handleTagModalClose}
        tag={selectedTag || ''}
        pages={taggedPages}
        onPageSelect={handlePageSelect}
      />
    </div>
  );
};

export default Index;
