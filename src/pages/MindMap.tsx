
import { useNotepad } from '../hooks/useNotepad';
import { Link } from 'react-router-dom';
import { ArrowLeft, Hash, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MindMap = () => {
  const { tagCache, pages, getPagesByTag } = useNotepad();

  const tagData = Object.entries(tagCache).map(([tag, pageIds]) => ({
    tag,
    count: pageIds.length,
    pages: getPagesByTag(tag)
  })).sort((a, b) => b.count - a.count);

  const maxCount = Math.max(...tagData.map(item => item.count), 1);

  const getTagSize = (count: number) => {
    const ratio = count / maxCount;
    const minSize = 12;
    const maxSize = 48;
    return minSize + (ratio * (maxSize - minSize));
  };

  const getTagColor = (count: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'bg-red-500 text-white hover:bg-red-600';
    if (ratio > 0.4) return 'bg-orange-500 text-white hover:bg-orange-600';
    if (ratio > 0.2) return 'bg-yellow-500 text-white hover:bg-yellow-600';
    return 'bg-blue-500 text-white hover:bg-blue-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
            <div className="flex items-center">
              <Hash className="w-6 h-6 mr-3 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Tag Mind Map</h1>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2" />
            {pages.length} pages • {tagData.length} tags
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {tagData.length === 0 ? (
          <div className="text-center py-16">
            <Hash className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">No tags found</h2>
            <p className="text-gray-500">Start adding #tags to your notes to see the mind map</p>
          </div>
        ) : (
          <>
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                Tag sizes represent frequency • Larger tags appear more often in your notes
              </p>
            </div>

            <div className="flex flex-wrap justify-center items-center gap-4 min-h-96">
              {tagData.map(({ tag, count }) => (
                <div
                  key={tag}
                  className="relative group cursor-pointer transition-transform hover:scale-110"
                  style={{
                    fontSize: `${getTagSize(count)}px`,
                  }}
                >
                  <Badge
                    className={`${getTagColor(count)} transition-all duration-200 px-4 py-2 text-current border-0`}
                    style={{ fontSize: 'inherit' }}
                  >
                    #{tag}
                  </Badge>
                  
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                    <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                      {count} page{count !== 1 ? 's' : ''}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Hash className="w-5 h-5 mr-2" />
                Tag Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tagData.slice(0, 9).map(({ tag, count }) => (
                  <div key={tag} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      #{tag}
                    </Badge>
                    <span className="text-sm font-medium text-gray-700">
                      {count} page{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
              {tagData.length > 9 && (
                <div className="mt-4 text-center">
                  <span className="text-sm text-gray-500">
                    and {tagData.length - 9} more tag{tagData.length - 9 !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MindMap;
