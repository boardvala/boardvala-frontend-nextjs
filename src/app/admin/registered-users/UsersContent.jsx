"use client";

import { useEffect, useMemo, useState } from "react";
import { getRegisteredUsers } from "../../../services/adminDashboardService";

export default function RegisteredUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await getRegisteredUsers();

      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        (user.mobile || "").includes(search),
    );
  }, [users, search]);

  return (
    <>
      <style>{`
        .users-wrap{
          background:#f6f7f9;
          min-height:80vh;
        }

        .table-card{
          background:#fff;
          border-radius:16px;
          box-shadow:0 8px 22px rgba(15,23,42,.08);
          overflow:hidden;
        }

        .table thead{
          background:#0f172a;
          color:#fff;
        }

        .search-box{
          max-width:350px;
        }

        @media(max-width:576px){
          .search-box{
            max-width:100%;
          }
        }
      `}</style>

      <div className="users-wrap py-4 py-md-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h2 className="fw-bold mb-1">Registered Users</h2>
              <p className="text-muted mb-0">
                List of all registered customer accounts.
              </p>
            </div>

            <div className="search-box">
              <input
                className="form-control"
                placeholder="Search email or mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-3">
            <span className="badge bg-primary fs-6">
              Total Users : {filteredUsers.length}
            </span>
          </div>

          <div className="table-card">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Registered On</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        Loading users...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-5">
                        No registered users found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>

                        <td>{user.email}</td>

                        <td>{user.mobile || "-"}</td>

                        <td>
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
