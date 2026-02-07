import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useStore } from '../store/useStore';
import { WorkspaceSidebar } from '../components/WorkspaceSidebar';
import { SourcesPanel } from '../components/SourcesPanel';
import { ChatPanel } from '../components/ChatPanel';
import { WorkspaceModal } from '../components/WorkspaceModal';

export function Dashboard() {
  const { user, loading } = useAuth();
  const { currentWorkspaceId } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <WorkspaceSidebar onNewWorkspace={() => setIsModalOpen(true)} />

      {currentWorkspaceId ? (
        <div className="flex-1 flex">
          <div className="flex-1 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
            <SourcesPanel workspaceId={currentWorkspaceId} />
          </div>

          <div className="flex-1 bg-white dark:bg-gray-900">
            <ChatPanel workspaceId={currentWorkspaceId} />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to Workspace
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a workspace to get started
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Create Your First Workspace
            </button>
          </div>
        </div>
      )}

      <WorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
}
