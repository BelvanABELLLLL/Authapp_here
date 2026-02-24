import { signOut } from "next-auth/react";

export default function AdminLayout({ children, title = "Admin Dashboard" }) {
  return (
    <div style={{ 
      padding: "20px", 
      backgroundColor: "#f9fafb", 
      minHeight: "100vh" 
    }}>
      <div style={{ 
        maxWidth: "1200px", 
        margin: "0 auto" 
      }}>
        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "30px",
          paddingBottom: "15px",
          borderBottom: "1px solid #e5e7eb"
        }}>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: "24px", 
              fontWeight: "bold",
              color: "#1f2937"
            }}>
              {title}
            </h1>
            <p style={{ 
              margin: "5px 0 0 0", 
              color: "#6b7280",
              fontSize: "14px"
            }}>
              Welcome, Admin!
            </p>
          </div>
          
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "8px 16px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px"
            }}
          >
            Logout
          </button>
        </div>
        
        {/* Content */}
        <div style={{ 
          background: "#fff", 
          borderRadius: "8px", 
          padding: "24px",
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)"
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}