import { getToken } from "next-auth/jwt";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";

const secret = process.env.NEXTAUTH_SECRET;

export async function getServerSideProps(context) {
  try {
    // PAKAI getToken BUKAN getSession
    const token = await getToken({ 
      req: context.req, 
      secret 
    });
    
    console.log("🔍 Create page - Token role:", token?.role);
    
    if (!token || token.role !== "admin") {
      console.log("❌ Create page - Unauthorized");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    console.log("✅ Create page - Auth passed");
    return { props: {} };
    
  } catch (error) {
    console.error("❌ Create page - Error:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default function CreateProductPage() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi input
      if (!name.trim()) {
        throw new Error("Nama produk harus diisi");
      }
      
      const priceNum = parseInt(price);
      if (!priceNum || priceNum <= 0) {
        throw new Error("Harga harus angka positif");
      }

      // HAPUS credentials: "include" ← INI YANG BIKIN MASALAH!
      const res = await fetch("/api/products/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        // credentials: "include", ← HAPUS BARIS INI!
        body: JSON.stringify({
          name: name.trim(),
          price: priceNum,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Gagal menyimpan produk: ${res.status}`);
      }

      // Redirect ke admin page
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    if (confirm("Batalkan pembuatan produk?")) {
      router.push("/dashboard/admin");
    }
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Tambah Produk Baru</h1>
        
        <div style={styles.card}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* NAMA */}
            <div style={styles.field}>
              <label style={styles.label}>Nama Produk *</label>
              <input
                type="text"
                placeholder="Contoh: Laptop ASUS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                required
                disabled={loading}
              />
            </div>

            {/* HARGA */}
            <div style={styles.field}>
              <label style={styles.label}>Harga (Rp) *</label>
              <input
                type="number"
                placeholder="1000000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={styles.input}
                min="1"
                step="1"
                required
                disabled={loading}
              />
            </div>

            {error && (
              <div style={styles.errorBox}>
                ⚠️ {error}
              </div>
            )}

            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={handleCancel}
                style={styles.cancelButton}
                disabled={loading}
              >
                Batal
              </button>
              
              <button 
                type="submit" 
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Produk"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  title: {
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "600",
    color: "#1f2937",
  },
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  form: {
    width: "100%",
  },
  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "10px 12px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "13px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  submitButton: {
    flex: 1,
    padding: "10px 16px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  cancelButton: {
    flex: 1,
    padding: "10px 16px",
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
};