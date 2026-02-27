import { useEffect, useState } from "react";
import API from "../services/api";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    try {
      setLoading(true);

      const receivedRes = await API.get("/api/swaps/received");
      const sentRes = await API.get("/api/swaps/my");

      setRequests(receivedRes.data);
      setSentRequests(sentRes.data);

    } catch (err) {
      console.error("Request fetch error:", err.response?.data || err.message);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.patch(`/api/swaps/${id}`, { status });

      // update UI instantly
      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status } : r
        )
      );

    } catch (err) {
      console.error("Status update error:", err.response?.data || err.message);
      alert("Failed to update request");
    }
  };

  if (loading)
    return <div className="card">Loading requests…</div>;

  return (
    <div>
      <h2>Requests Received</h2>

      {requests.length === 0 ? (
        <div className="card muted">No requests yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {requests.map((r) => (
            <div
              key={r._id}
              className="card"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>
                  {r.fromUser?.username || "User"}
                </div>

                <div className="small muted">
                  Offered: {r.offeredSkill?.title || "—"} • Requested:{" "}
                  {r.requestedSkill?.title || "—"}
                </div>

                <div className="muted">
                  Status: {r.status || "pending"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                {r.status !== "accepted" && (
                  <button
                    className="btn"
                    onClick={() =>
                      updateStatus(r._id, "accepted")
                    }
                  >
                    Accept
                  </button>
                )}

                {r.status !== "rejected" && (
                  <button
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: 0,
                      padding: "8px 10px",
                      borderRadius: 8,
                    }}
                    onClick={() =>
                      updateStatus(r._id, "rejected")
                    }
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 style={{ marginTop: 20 }}>Requests Sent</h2>

      {sentRequests.length === 0 ? (
        <div className="card muted">
          You haven't sent any requests yet.
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {sentRequests.map((r) => (
            <div key={r._id} className="card">
              <div style={{ fontWeight: 700 }}>
                {r.toUser?.username || "User"}
              </div>

              <div className="small muted">
                Offered: {r.offeredSkill?.title || "—"} • Requested:{" "}
                {r.requestedSkill?.title || "—"}
              </div>

              <div className="muted">
                Status: {r.status || "pending"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}