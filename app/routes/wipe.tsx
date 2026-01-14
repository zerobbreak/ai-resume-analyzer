import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
  const { auth, isLoading, error, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<FSItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loadFiles = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    if (files) {
      setFiles(files);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate("/auth?next=/wipe");
    }
  }, [isLoading, auth.isAuthenticated, navigate]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          await fs.delete(file.path);
        })
      );
      await kv.flush();
      await loadFiles();
    } catch (err) {
      console.error("Failed to wipe data", err);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-500 text-xl font-semibold">Error</div>
        <div>{error}</div>
        <Link to="/" className="text-blue-500 hover:underline">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center pt-20 px-4 pb-12">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 max-w-2xl w-full border border-gray-100">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Data Management
              </h1>
              <p className="text-gray-500">
                Manage your stored files and reset application data.
              </p>
              <div className="text-sm bg-blue-50 text-blue-700 px-4 py-2 rounded-lg self-center mt-2">
                Authenticated as:{" "}
                <span className="font-semibold">{auth.user?.username}</span>
              </div>
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center justify-between">
                <span>Stored Files</span>
                <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                  {files.length} items
                </span>
              </h2>

              {files.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                  <p className="text-gray-400">No files found.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {files.map((file) => (
                    <div
                      key={file.id || file.name}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors group"
                    >
                      <div className="p-2 bg-gray-100 rounded-md group-hover:bg-blue-50 transition-colors">
                        <img
                          src="/icons/document.svg"
                          alt="file"
                          className="w-5 h-5 opacity-60"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                        {/* Fallback icon if image fails */}
                        <div
                          className="w-5 h-5 bg-gray-300 rounded-sm"
                          style={{
                            display: "none", // Only show via CSS if img fails, simplistic fallback logic here
                          }}
                        />
                      </div>
                      <p className="text-gray-700 font-medium truncate flex-1">
                        {file.name}
                      </p>
                      <span className="text-xs text-gray-400 font-mono">
                        {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full h-px bg-gray-200" />

            <div className="flex flex-col gap-4 bg-red-50 p-6 rounded-xl border border-red-100">
              <h3 className="text-red-800 font-semibold text-lg">
                Danger Zone
              </h3>
              <p className="text-red-600/80 text-sm">
                This action will permanently delete all uploaded files and clear
                the database records. This cannot be undone.
              </p>

              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  disabled={files.length === 0 || isDeleting}
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span className="text-lg">🗑️</span> Wipe App Data
                </button>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <p className="text-red-700 font-medium text-center">
                    Are you absolutely sure?
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowConfirm(false)}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        "Yes, Delete Everything"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default WipeApp;
