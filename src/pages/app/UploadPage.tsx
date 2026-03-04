import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useScheduledMatches } from "@/hooks/api/useMatches";
import { useSessions, useCreateSession } from "@/hooks/api/useSessions";
import { usePresignedUrl, useConfirmUpload, useJobStatus } from "@/hooks/api/useUpload";
import AppLayout from "@/components/AppLayout";
import PageTransition from "@/components/PageTransition";

type UploadTab = "match" | "session";
type UploadStage = "select" | "upload" | "processing" | "complete";

const UploadPage = () => {
  const { user } = useAuth();
  const teamName = user?.team?.name || "Your Team";

  // Tab state
  const [activeTab, setActiveTab] = useState<UploadTab>("match");

  // Match film state
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [homeJersey, setHomeJersey] = useState("");
  const [awayJersey, setAwayJersey] = useState("");

  // Session state
  const [sessionTitle, setSessionTitle] = useState("");
  const [sessionType, setSessionType] = useState<"PRACTICE" | "SCRIMMAGE" | "TRAINING">("PRACTICE");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [uploadStage, setUploadStage] = useState<UploadStage>("select");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API hooks
  const { data: scheduledMatches, isLoading: matchesLoading } = useScheduledMatches();
  const { data: sessionsData } = useSessions({ type: sessionType });
  const createSession = useCreateSession();
  const presignedUrl = usePresignedUrl();
  const confirmUpload = useConfirmUpload();
  const { data: jobStatus } = useJobStatus(jobId);

  const sessions = sessionsData?.data || [];
  const matches = scheduledMatches || [];

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped && (dropped.type.includes("video") || dropped.name.match(/\.(mp4|mov|avi|mkv)$/i))) {
      setFile(dropped);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setUploadStage("upload");
      setUploadProgress(0);

      // 1. Get presigned URL
      const presignData = await presignedUrl.mutateAsync({
        matchId: activeTab === "match" ? selectedMatchId! : undefined,
        sessionId: activeTab === "session" ? selectedSessionId! : undefined,
        fileName: file.name,
        contentType: file.type || "video/mp4",
        type: activeTab === "match" ? "MATCH" : "SESSION",
      });

      // 2. Upload to S3 with progress
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.open("PUT", presignData.uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type || "video/mp4");
        xhr.onload = () => (xhr.status < 300 ? resolve() : reject(new Error("Upload failed")));
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(file);
      });

      // 3. Confirm upload to trigger processing
      const confirmData = await confirmUpload.mutateAsync({
        matchId: activeTab === "match" ? selectedMatchId! : undefined,
        sessionId: activeTab === "session" ? selectedSessionId! : undefined,
        s3Key: presignData.s3Key,
        homeJerseyColor: homeJersey || undefined,
        awayJerseyColor: awayJersey || undefined,
        type: activeTab === "match" ? "MATCH" : "SESSION",
      });

      // 4. Start polling job status
      setJobId(confirmData.jobId);
      setUploadStage("processing");
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStage("select");
    }
  };

  // Handle creating a new session
  const handleCreateSession = async () => {
    if (!sessionTitle.trim()) return;
    try {
      const session = await createSession.mutateAsync({
        title: sessionTitle,
        sessionType,
        date: new Date().toISOString(),
      });
      setSelectedSessionId(session.id);
      setSessionTitle("");
    } catch (err) {
      console.error("Create session error:", err);
    }
  };

  // Check if job is done
  const jobDone = jobStatus?.status === "COMPLETED";
  const jobFailed = jobStatus?.status === "FAILED";

  if (jobDone && uploadStage === "processing") {
    setUploadStage("complete");
  }

  const canUpload =
    file &&
    ((activeTab === "match" && selectedMatchId) ||
      (activeTab === "session" && selectedSessionId));

  const resetUpload = () => {
    setFile(null);
    setUploadStage("select");
    setUploadProgress(0);
    setJobId(null);
    setSelectedMatchId(null);
    setSelectedSessionId(null);
  };

  return (
    <AppLayout>
      <PageTransition className="flex-1 w-full max-w-[1440px] mx-auto p-6 md:p-8 flex flex-col gap-6">
        {/* Page Title */}
        <div>
          <h1 className="text-slate-100 text-2xl md:text-3xl font-bold leading-tight">Upload Game Film</h1>
          <p className="text-[#9ca3af] mt-1">Upload verified game footage or practice sessions for AI analysis.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#151515] rounded-xl border border-[#262626] p-1 w-fit">
          <button
            onClick={() => { setActiveTab("match"); resetUpload(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "match"
                ? "bg-[#ff6a00] text-white shadow-[0_0_15px_-3px_rgba(255,106,0,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">sports_basketball</span>
              Match Film
            </span>
          </button>
          <button
            onClick={() => { setActiveTab("session"); resetUpload(); }}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "session"
                ? "bg-[#14b8a6] text-white shadow-[0_0_15px_-3px_rgba(20,184,166,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">fitness_center</span>
              Practice / Session
            </span>
          </button>
        </div>

        {/* Info Banner */}
        <div className={`flex items-start gap-3 p-4 rounded-xl border ${
          activeTab === "match"
            ? "bg-[#ff6a00]/5 border-[#ff6a00]/20"
            : "bg-[#14b8a6]/5 border-[#14b8a6]/20"
        }`}>
          <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
            activeTab === "match" ? "text-[#ff6a00]" : "text-[#14b8a6]"
          }`}>info</span>
          <div>
            <p className="text-sm text-slate-200 font-medium">
              {activeTab === "match"
                ? "Match film uploads update the official MMR/Elo leaderboard."
                : "Practice sessions are for training feedback only and do NOT affect MMR/Elo."}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {activeTab === "match"
                ? "Select a scheduled match below, then upload the game footage."
                : "Create or select a session, then upload practice footage for AI analysis."}
            </p>
          </div>
        </div>

        {/* Upload Complete */}
        {uploadStage === "complete" && (
          <div className="bg-[#151515] border border-green-500/30 rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-500 text-[32px]">check_circle</span>
            </div>
            <h3 className="text-xl font-bold text-white">Analysis Complete!</h3>
            <p className="text-sm text-slate-400 max-w-md">
              {activeTab === "match"
                ? "Your match film has been processed. MMR/Elo ratings have been updated."
                : "Your practice session has been analyzed. View insights in Analytics."}
            </p>
            <div className="flex gap-3 mt-2">
              <button onClick={resetUpload} className="px-5 py-2.5 rounded-lg border border-[#262626] text-slate-300 hover:bg-[#1a1a1a] text-sm font-medium transition-colors">
                Upload Another
              </button>
              <a href="/app/analytics" className="px-5 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]">
                View Analytics
              </a>
            </div>
          </div>
        )}

        {/* Processing Stage */}
        {uploadStage === "processing" && (
          <div className="bg-[#151515] border border-[#262626] rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-[#ff6a00]/10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-2 border-[#ff6a00] border-t-transparent animate-spin" />
              <span className="material-symbols-outlined text-[#ff6a00] text-[28px]">smart_toy</span>
            </div>
            <h3 className="text-xl font-bold text-white">AI Processing</h3>
            <p className="text-sm text-slate-400">
              {jobStatus?.stage || "Analyzing game footage..."} {jobStatus?.progress ? `(${jobStatus.progress}%)` : ""}
            </p>
            {jobFailed && (
              <div className="mt-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">Processing failed. Please try uploading again.</p>
                <button onClick={resetUpload} className="mt-2 text-xs text-[#ff6a00] hover:underline">Try Again</button>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploadStage === "upload" && (
          <div className="bg-[#151515] border border-[#262626] rounded-xl p-8 text-center flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-[#ff6a00]/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#ff6a00] text-[28px]">cloud_upload</span>
            </div>
            <h3 className="text-xl font-bold text-white">Uploading {file?.name}</h3>
            <div className="w-full max-w-md">
              <div className="h-2 bg-[#262626] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ff6a00] rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(255,106,0,0.5)]"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-slate-400 mt-2">{uploadProgress}% uploaded</p>
            </div>
          </div>
        )}

        {/* Selection + Upload UI */}
        {uploadStage === "select" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left Panel — Selection */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              {activeTab === "match" ? (
                <>
                  <h2 className="text-lg font-bold text-slate-100">Scheduled Matches</h2>
                  {matchesLoading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-6 h-6 border-2 border-[#ff6a00] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="bg-[#151515] border border-[#262626] rounded-xl p-6 text-center">
                      <span className="material-symbols-outlined text-slate-600 text-[32px] mb-2">event_busy</span>
                      <p className="text-sm text-slate-500">No scheduled matches awaiting film.</p>
                    </div>
                  ) : (
                    matches.map((match: any) => {
                      const isSelected = selectedMatchId === match.id;
                      const date = new Date(match.scheduledDate);
                      return (
                        <div
                          key={match.id}
                          onClick={() => setSelectedMatchId(match.id)}
                          className={`bg-[#151515] rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            isSelected
                              ? "border-2 border-[#ff6a00]/40 shadow-[0_0_25px_-5px_rgba(255,106,0,0.2)]"
                              : "border border-[#262626] hover:border-[#ff6a00]/20"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="size-9 rounded-full bg-[#ff6a00]/20 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-[#ff6a00]">
                                {match.homeTeam?.abbreviation?.charAt(0) || "H"}
                              </div>
                              <span className="text-sm font-bold text-slate-100">vs</span>
                              <div className="size-9 rounded-full bg-slate-700 border border-[#262626] flex items-center justify-center text-[10px] font-bold text-white">
                                {match.awayTeam?.abbreviation?.charAt(0) || "A"}
                              </div>
                            </div>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/20">
                              Awaiting Film
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-white">
                            {match.homeTeam?.name || "Home"} vs {match.awayTeam?.name || "Away"}
                          </h3>
                          <p className="text-xs text-[#9ca3af] mt-0.5">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {match.venue && ` \u2022 ${match.venue}`}
                          </p>
                        </div>
                      );
                    })
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-100">Sessions</h2>
                  {/* Create new session */}
                  <div className="bg-[#151515] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
                    <p className="text-sm font-medium text-slate-300">Create New Session</p>
                    <input
                      type="text"
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="Session title..."
                      className="h-10 px-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm placeholder-[#555] focus:ring-1 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none"
                    />
                    <select
                      value={sessionType}
                      onChange={(e) => setSessionType(e.target.value as any)}
                      className="h-10 px-3 rounded-lg bg-[#0a0a0a] border border-[#262626] text-white text-sm focus:ring-1 focus:ring-[#14b8a6] focus:border-[#14b8a6] outline-none"
                    >
                      <option value="PRACTICE">Practice</option>
                      <option value="SCRIMMAGE">Scrimmage</option>
                      <option value="TRAINING">Training</option>
                    </select>
                    <button
                      onClick={handleCreateSession}
                      disabled={!sessionTitle.trim() || createSession.isPending}
                      className="h-10 rounded-lg bg-[#14b8a6] hover:bg-[#0d9488] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                    >
                      {createSession.isPending ? "Creating..." : "Create Session"}
                    </button>
                  </div>

                  {/* Existing sessions */}
                  {sessions.map((session: any) => {
                    const isSelected = selectedSessionId === session.id;
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        className={`bg-[#151515] rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                          isSelected
                            ? "border-2 border-[#14b8a6]/40 shadow-[0_0_25px_-5px_rgba(20,184,166,0.2)]"
                            : "border border-[#262626] hover:border-[#14b8a6]/20"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-bold text-white">{session.title}</h3>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#14b8a6]/10 text-[#14b8a6] border border-[#14b8a6]/20">
                            {session.sessionType}
                          </span>
                        </div>
                        <p className="text-xs text-[#9ca3af]">
                          {new Date(session.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Right Panel — Upload Zone */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Selected context header */}
              {(selectedMatchId || selectedSessionId) && (
                <div className="bg-[#151515] border border-[#262626] rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`material-symbols-outlined text-[16px] ${activeTab === "match" ? "text-[#ff6a00]" : "text-[#14b8a6]"}`}>check_circle</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${activeTab === "match" ? "text-[#ff6a00]" : "text-[#14b8a6]"}`}>
                      {activeTab === "match" ? "Match Selected" : "Session Selected"}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{teamName}</h3>
                  <p className="text-xs text-[#9ca3af] mt-1">
                    {activeTab === "match"
                      ? "Upload game film for official Elo processing"
                      : "Upload practice footage (will NOT update Elo)"}
                  </p>
                </div>
              )}

              {/* Upload Zone */}
              <div className="bg-[#151515] border border-[#262626] rounded-xl p-6 flex flex-col gap-6">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors duration-300 cursor-pointer group ${
                    file
                      ? "border-[#14b8a6]/40 bg-[#14b8a6]/5"
                      : "border-[#262626] hover:border-[#ff6a00]/40"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  {file ? (
                    <>
                      <div className="size-16 rounded-full bg-[#14b8a6]/10 border border-[#14b8a6]/30 flex items-center justify-center mb-4">
                        <span className="material-symbols-outlined text-[32px] text-[#14b8a6]">videocam</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">{file.name}</h4>
                      <p className="text-sm text-[#9ca3af]">{(file.size / (1024 * 1024)).toFixed(1)} MB</p>
                      <button
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors"
                      >
                        Remove file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="size-16 rounded-full bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-4 group-hover:border-[#ff6a00]/30 transition-colors">
                        <span className="material-symbols-outlined text-[32px] text-[#9ca3af] group-hover:text-[#ff6a00] transition-colors">cloud_upload</span>
                      </div>
                      <h4 className="text-lg font-bold text-white mb-1">Drag & Drop Game Film Here</h4>
                      <p className="text-sm text-[#9ca3af] mb-4">Supports MP4, MOV files. Up to 10GB</p>
                      <span className="px-6 py-2.5 rounded-lg bg-[#ff6a00] hover:bg-[#cc5500] text-white text-sm font-bold transition-colors shadow-[0_0_20px_-5px_rgba(255,106,0,0.3)]">
                        Browse Files
                      </span>
                    </>
                  )}
                </div>

                {/* Jersey color selectors (match film only) */}
                {activeTab === "match" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#9ca3af]">Our Jersey Color</label>
                      <select
                        value={homeJersey}
                        onChange={(e) => setHomeJersey(e.target.value)}
                        className="h-11 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white text-sm focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all"
                      >
                        <option value="">Select color</option>
                        <option value="white">White (Home)</option>
                        <option value="dark">Dark (Away)</option>
                        <option value="alt">Alternate</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-medium text-[#9ca3af]">Opponent Jersey Color</label>
                      <select
                        value={awayJersey}
                        onChange={(e) => setAwayJersey(e.target.value)}
                        className="h-11 px-4 rounded-lg bg-[#1a1a1a] border border-[#262626] text-white text-sm focus:ring-2 focus:ring-[#ff6a00]/50 focus:border-[#ff6a00] outline-none transition-all"
                      >
                        <option value="">Select color</option>
                        <option value="white">White (Home)</option>
                        <option value="dark">Dark (Away)</option>
                        <option value="alt">Alternate</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Submit */}
                <button
                  onClick={handleUpload}
                  disabled={!canUpload}
                  className={`w-full h-12 rounded-xl text-white font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-2 group ${
                    canUpload
                      ? activeTab === "match"
                        ? "bg-[#ff6a00] hover:bg-[#cc5500] shadow-[0_0_20px_rgba(255,106,0,0.3)] hover:shadow-[0_0_30px_rgba(255,106,0,0.5)]"
                        : "bg-[#14b8a6] hover:bg-[#0d9488] shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                      : "bg-[#262626] cursor-not-allowed text-slate-500"
                  }`}
                >
                  <span>
                    {activeTab === "match"
                      ? "Submit for AI Breakdown & Official Elo Processing"
                      : "Submit for AI Practice Analysis"}
                  </span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                </button>

                <p className="text-center text-[10px] text-[#9ca3af] flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  Film is encrypted end-to-end and only accessible to verified coaching staff.
                </p>
              </div>
            </div>
          </div>
        )}
      </PageTransition>
    </AppLayout>
  );
};

export default UploadPage;
