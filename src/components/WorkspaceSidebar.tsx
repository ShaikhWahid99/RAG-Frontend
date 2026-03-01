import { useState, useEffect } from 'react';
import { Plus, Folder, Moon, Sun, LogOut } from 'lucide-react';
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useStore, Workspace } from "../store/useStore";

interface WorkspaceSidebarProps {
  onNewWorkspace: () => void;
}

export function WorkspaceSidebar({ onNewWorkspace }: WorkspaceSidebarProps) {
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();
  const {
    currentWorkspaceId,
    setCurrentWorkspaceId,
    darkMode,
    toggleDarkMode,
    workspaces,
    setWorkspaces,
  } = useStore();

  useEffect(() => {
    if (user && workspaces.length === 0) {
      loadWorkspaces();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadWorkspaces = async () => {
    // Simulated fetch - in a real app, this would be an API call
    const initialData: Workspace[] = [
      {
        id: "1",
        name: "Personal",
        description: "For personal projects and ideas",
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Work",
        description: "For work-related projects",
        created_at: new Date().toISOString(),
      },
    ];

    setWorkspaces(initialData);
    if (initialData.length > 0 && !currentWorkspaceId) {
      setCurrentWorkspaceId(initialData[0].id);
    }
    setLoading(false);
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={onNewWorkspace}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="font-medium">New Workspace</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            Loading...
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="text-sm">No workspaces yet.</p>
            <p className="text-sm mt-2">Create one to get started!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {workspaces.map((workspace) => (
              <motion.button
                key={workspace.id}
                onClick={() => setCurrentWorkspaceId(workspace.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  currentWorkspaceId === workspace.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Folder className="w-5 h-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{workspace.name}</p>
                  {workspace.description && (
                    <p className="text-xs opacity-70 truncate">
                      {workspace.description}
                    </p>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
          <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button
          onClick={signOut}
          className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
