import React, { useEffect } from 'react';
import { VCardForm } from './components/VCardForm';
import { VCardPreview } from './components/VCardPreview';
import { Moon, Sun } from 'lucide-react';
import { useVCardStore } from './store/useVCardStore';
import { Button } from './components/ui/Button';

function App() {
  const { theme, toggleTheme, loadSharedData, setPreviewMode, isAdmin, setIsAdmin } = useVCardStore();
  const [view, setView] = React.useState<'form' | 'preview'>('form');

  useEffect(() => {
    // Check URL parameters for shared card
    const params = new URLSearchParams(window.location.search);
    const cardId = params.get('id');
    const isPreview = params.get('preview') === 'true';
    const adminKey = params.get('admin');

    // Set admin status based on URL parameter
    setIsAdmin(adminKey === import.meta.env.VITE_ADMIN_KEY);

    if (cardId) {
      loadSharedData(cardId);
      setView('preview');
      setPreviewMode(isPreview);
    } else {
      setPreviewMode(false);
    }
  }, [loadSharedData, setPreviewMode, setIsAdmin]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">VisionFrost vCard</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-full"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              {isAdmin && !window.location.search.includes('preview=true') && (
                <Button
                  variant="secondary"
                  onClick={() => setView(view === 'form' ? 'preview' : 'form')}
                >
                  {view === 'form' ? 'Preview' : 'Edit'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-2xl mx-auto">
          {(view === 'form' && isAdmin) ? (
            <VCardForm onPreview={() => setView('preview')} />
          ) : (
            <VCardPreview onEdit={isAdmin ? () => setView('form') : undefined} />
          )}
        </div>
      </main>

      <footer className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>{isAdmin ? 'Admin Mode - Full editing capabilities enabled' : 'View Only Mode'}</p>
      </footer>
    </div>
  );
}

export default App;