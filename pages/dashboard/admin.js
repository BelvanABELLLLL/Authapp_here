import { getToken } from "next-auth/jwt";
import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import { signOut } from "next-auth/react";

const secret = process.env.NEXTAUTH_SECRET;
const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});

export async function getServerSideProps(context) {
  console.log("🔍 Checking session on server...");
  
  try {
    // PAKAI getToken BUKAN getSession
    const token = await getToken({ 
      req: context.req, 
      secret 
    });
    
    console.log("Server token check:", {
      hasToken: !!token,
      userRole: token?.role,
      userEmail: token?.email
    });

    if (!token) {
      console.log("❌ No token found, redirecting to login");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    if (token.role !== "admin") {
      console.log(`❌ Invalid role: ${token.role}, expected admin`);
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    console.log("✅ Token valid, user is admin");
    return { props: {} };
    
  } catch (error) {
    console.error("❌ Error in getServerSideProps:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil data product
  async function fetchProducts() {
    try {
      console.log("🔄 Fetching products...");
      
      const res = await fetch("/api/products");
      
      console.log("📦 Fetch response:", {
        ok: res.ok,
        status: res.status,
        statusText: res.statusText
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Session expired. Redirecting to login...");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
          return;
        }
        throw new Error(`Gagal ambil data: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("✅ Products fetched:", data.length, "items");
      setProducts(data);
      setError("");
    } catch (err) {
      console.error("❌ Gagal ambil products:", err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // Hapus product
  <button
    style={{
      padding: "6px 12px",
      background: "#ef4444",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "500"
    }}
    onClick={() => window.location.href = `/dashboard/products/delete?id=${p.id}`}
  >
    Hapus
  </button>

  return (
    <AdminLayout title="Daftar Produk">
      {error && (
        <div style={{
          padding: "12px",
          background: "#fee2e2",
          border: "1px solid #fca5a5",
          borderRadius: "6px",
          marginBottom: "20px",
          color: "#dc2626"
        }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "600" }}>Daftar Produk</h2>
        <button
          onClick={() => window.location.href = "/dashboard/products/create"}
          style={{
            padding: "8px 16px",
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          + Tambah Produk
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading data produk...</p>
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            margin: "20px auto",
            animation: "spin 1s linear infinite"
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
          <p style={{ fontSize: "16px", marginBottom: "10px" }}>Belum ada data produk</p>
          <button
            onClick={() => window.location.href = "/dashboard/products/create"}
            style={{
              padding: "8px 16px",
              background: "#3b82f6",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Buat Produk Pertama
          </button>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "14px"
            }}
          >
            <thead>
              <tr style={{ 
                background: "#f9fafb", 
                borderBottom: "2px solid #e5e7eb" 
              }}>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>No</th>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>Nama Produk</th>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>Harga</th>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>Tanggal Dibuat</th>
                <th style={{ 
                  textAlign: "left", 
                  padding: "12px", 
                  fontWeight: "600", 
                  color: "#374151" 
                }}>Aksi</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p, index) => (
                <tr key={p.id} style={{ 
                  borderBottom: "1px solid #e5e7eb",
                  transition: "background 0.2s"
                }}>
                  <td style={{ 
                    padding: "12px", 
                    color: "#6b7280",
                    width: "50px"
                  }}>{index + 1}</td>
                  <td style={{ 
                    padding: "12px", 
                    fontWeight: "500",
                    maxWidth: "300px"
                  }}>{p.name}</td>
                  <td style={{ 
                    padding: "12px", 
                    fontWeight: "600",
                    color: "#059669"
                  }}>{rupiah.format(p.price)}</td>
                  <td style={{ 
                    padding: "12px", 
                    color: "#6b7280",
                    fontSize: "13px"
                  }}>
                    {new Date(p.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric"
                    })}
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button
                      style={{
                        marginRight: "8px",
                        padding: "6px 12px",
                        background: "#3b82f6",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500"
                      }}
                      onClick={() => window.location.href = `/dashboard/products/edit?id=${p.id}`}
                    >
                      Edit
                    </button>

                    <button
                      style={{
                        padding: "6px 12px",
                        background: "#ef4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "13px",
                        fontWeight: "500"
                      }}
                      onClick={() => window.location.href = `/dashboard/products/delete?id=${p.id}`}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {products.length > 0 && (
        <div style={{ 
          marginTop: "20px", 
          paddingTop: "15px",
          borderTop: "1px solid #e5e7eb",
          color: "#6b7280",
          fontSize: "13px"
        }}>
          Total: {products.length} produk
        </div>
      )}
    </AdminLayout>
  );
}