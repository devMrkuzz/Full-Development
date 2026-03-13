import { useEffect, useState } from "react";

export default function RegistrarDashboard() {
  const [stats, setStats] = useState<any>();
  const [requests, setRequests] = useState<any[]>([]);
  const [searchTrackingCode, setSearchTrackingCode] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchDocumentType, setSearchDocumentType] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/requests/dashboard/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));

    fetch("http://localhost:3000/requests")
      .then((res) => res.json())
      .then((data) => setRequests(data));
  }, []);

  const completedRequests = async (id: string) => {
    await fetch(`http://localhost:3000/requests/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "COMPLETED",
      }),
    });

    //reqload request list
    const res = await fetch("http://localhost:3000/requests");
    const data = await res.json();
    setRequests(data);
  };

  const processRequest = async (id: string) => {
    await fetch(`http://localhost:3000/requests/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "ON PROCESS",
      }),
    });

    const res = await fetch("http://localhost:3000/requests"); // Fixed: localhost (was locahost)
    const data = await res.json();
    setRequests(data);
  };

  if (!stats) return <div>Loading...</div>;
  console.log("Stats:", stats);

  return (
    <div className="registrar-dashboard-container">
      <h1>Registrar Dashboard</h1>
      <h3>Total Requests: {stats.totalRequest}</h3>
      <h3>Pending: {stats.pendingRequest}</h3>
      <h3>On Process: {stats.onProcessRequests}</h3>
      <h3>Completed: {stats.completedRequests}</h3>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter tracking code"
          value={searchTrackingCode}
          onChange={(e) => setSearchTrackingCode(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by requester name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by document type"
          value={searchDocumentType}
          onChange={(e) => setSearchDocumentType(e.target.value)}
        />
      </div>

      <h2>Request List</h2>
      <table border={1} cellPadding={10} className="registrar-dashboard-table">
        <thead>
          <tr>
            <th>Tracking Code</th>
            <th>Name</th>
            <th>Document</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {requests
            .filter((request) => {
              const matchTracking = request.trackingCode
                .toLowerCase()
                .includes(searchTrackingCode.toLowerCase());

              const matchName = request.requesterName
                .toLowerCase()
                .includes(searchName.toLowerCase());

              const matchDocument = request.documentType
                .toLowerCase()
                .includes(searchDocumentType.toLowerCase());

              return matchTracking && matchName && matchDocument;
            })
            .map((request) => (
              <tr key={request.id}>
                <td>{request.trackingCode}</td>
                <td>{request.requesterName}</td>
                <td>{request.documentType}</td>
                <td>{request.purpose}</td>
                <td>{request.status}</td>
                <td>
                  <button
                    disabled={
                      request.status === "ON_PROCESS" ||
                      request.status === "COMPLETED"
                    }
                    onClick={() => processRequest(request.id)}
                  >
                    Process
                  </button>

                  <button
                    disabled={request.status === "COMPLETED"}
                    onClick={() => completedRequests(request.id)}
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
