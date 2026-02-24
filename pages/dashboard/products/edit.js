import { getToken } from "next-auth/jwt";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";
import prisma from "../../../lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

/* ===========================
   SSR PROTECTION (ADMIN ONLY)
=========================== */
export async function getServerSideProps(context) {
  try {
    // 1. PAKAI getToken BUKAN getSession
    const token = await getToken({ 
      req: context.req, 
      secret 
    });
    
    console.log("🔍 Edit page - Token role:", token?.role);
    
    // 2. CHECK AUTH
    if (!token || token.role !== "admin") {
      console.log("❌ Edit page - Unauthorized");
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const { id } = context.query;

    if (!id) {
      return { notFound: true };
    }

    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });

    if (!product) {
      return { notFound: true };
    }

    console.log("✅ Edit page - Auth passed");

    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          createdAt: product.createdAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error("❌ Edit page - Error:", error);
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

/* ===========================
   PAGE COMPONENT (SISANYA SAMA)
=========================== */
export default function EditProductPage({ product }) {
  const router = useRouter();

  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price)); // ← CONVERT KE STRING
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validasi
      if (!name.trim()) {
        throw new Error("Nama produk harus diisi");
      }
      
      const priceNum = parseInt(price);
      if (!priceNum || priceNum <= 0) {
        throw new Error("Harga harus angka positif");
      }

      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          price: priceNum 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || `Gagal mengubah produk: ${res.status}`);
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
    if (confirm("Batalkan perubahan produk?")) {
      router.push("/dashboard/admin");
    }
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Edit Produk</h1>
        
        <div style={styles.card}>
          <p style={styles.info}>
            ID: <code>{product.id}</code> • 
            Dibuat: {new Date(product.createdAt).toLocaleDateString("id-ID")}
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Nama Produk *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={styles.input}
                placeholder="Masukkan nama produk"
                required
                disabled={loading}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Harga (Rp) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={styles.input}
                placeholder="100000"
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
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

// Styles tetap sama...

/* ===========================
   STYLES
=========================== */
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
  info: {
    fontSize: "13px",
    marginBottom: "20px",
    color: "#6b7280",
    backgroundColor: "#f9fafb",
    padding: "8px 12px",
    borderRadius: "6px",
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
    background: "#16a34a",
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