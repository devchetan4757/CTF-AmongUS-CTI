import { useState } from "react";
import { api } from "../api/client.js";

/**
 * A bare-bones "security panel" login. Teaches default credentials:
 * there's no clever exploit here, just trying the factory username
 * and password that nobody ever got around to changing.
 */
export default function SecurityLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const res = await api.securityLogin(username, password);
      setStatus(res);
    } catch {
      setStatus({ success: false, message: "The panel didn't respond. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border-[3px] border-black bg-void p-4 shadow-[6px_6px_0_0_#000]">
      {/* HEADER -- alert-red theme to match this room's Security Panel
          scene hotspot. */}
      <div className="flex items-center gap-2.5 border-b-[3px] border-alert pb-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FF6B5B"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 shrink-0"
        >
          <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
          <path d="m9.5 12 2 2 3.5-3.5" />
        </svg>
        <h3 className="font-display text-sm font-black uppercase tracking-widest text-alert">
          Security Panel
        </h3>
      </div>

      <form onSubmit={handleLogin} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username"
          className="flex-1 border-2 border-black bg-panel px-3 py-2 font-mono text-sm text-paper placeholder:text-paper-dim focus:border-signal focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          className="flex-1 border-2 border-black bg-panel px-3 py-2 font-mono text-sm text-paper placeholder:text-paper-dim focus:border-signal focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="border-[3px] border-black bg-panel-raised px-4 py-2 font-body text-sm text-paper shadow-[3px_3px_0_0_#000] transition-transform hover:scale-[1.02] active:translate-y-[2px] active:shadow-none"
        >
          Log in
        </button>
      </form>

      {status && (
        <p className={`mt-3 font-body text-sm ${status.success ? "text-signal" : "text-alert"}`}>
          {status.message}
        </p>
      )}
      {status?.flag && (
        <p className="mt-1 font-mono text-xs text-paper">
          Panel dumped this to the session log: {status.flag}
        </p>
      )}
    </div>
  );
}
