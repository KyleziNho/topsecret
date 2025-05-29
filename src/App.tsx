import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { Dashboard } from './components/Dashboard/Dashboard';
import { NewDealModal } from './components/NewDeal/NewDealModal';
import { ModelBuilder } from './components/ModelBuilder/ModelBuilder';
import { ChatInterface } from './components/Chat/ChatInterface';

type View = 'dashboard' | 'model-builder' | 'chat';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [currentDeal, setCurrentDeal] = useState<any>(null);

  const handleNewDeal = (dealData: any) => {
    setCurrentDeal(dealData);
    setShowNewDealModal(false);
    setCurrentView('model-builder');
  };

  return (
    <Layout>
      {currentView === 'dashboard' && (
        <Dashboard onNewDeal={() => setShowNewDealModal(true)} />
      )}
      
      {currentView === 'model-builder' && currentDeal && (
        <ModelBuilder deal={currentDeal} onOpenChat={() => setCurrentView('chat')} />
      )}
      
      {currentView === 'chat' && currentDeal && (
        <ChatInterface 
          deal={currentDeal} 
          onBack={() => setCurrentView('model-builder')}
        />
      )}

      {showNewDealModal && (
        <NewDealModal
          onClose={() => setShowNewDealModal(false)}
          onSubmit={handleNewDeal}
        />
      )}
    </Layout>
  );
}

export default App;