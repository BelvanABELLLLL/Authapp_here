import { getToken } from "next-auth/jwt";
import { useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/AdminLayout";
import prisma from "../../../lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export async function getServerSideProps(context) {
  try {
    const token = await getToken({ req: context.req, secret });
    
    if (!token || token.role !== "admin") {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    const { id } = context.query; // ← AMBIL DARI QUERY PARAMETER

    if (!id) {
      return { notFound: true };
    }

    const product = await prisma.product.findUnique({
      where: { id: String(id) },
    });

    if (!product) {
      return { notFound: true };
    }

    return {
      props: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
}

export default function DeleteProductPage({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menghapus produk");
      }

      // Redirect ke admin setelah sukses
      router.push("/dashboard/admin");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  function handleCancel() {
    if (confirm("Batalkan penghapusan?")) {
      router.push("/dashboard/admin");
    }
  }

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Konfirmasi Hapus Produk</h1>
          
          <div style={styles.warningBox}>
            ⚠️ Anda akan menghapus produk berikut:
          </div>

          <div style={styles.productInfo}>
            <p><strong>Nama:</strong> {product.name}</p>
            <p><strong>Harga:</strong> Rp {product.price.toLocaleString()}</p>
            <p><strong>ID:</strong> {product.id}</p>
          </div>

          <p style={styles.warning}>
            Tindakan ini <strong>tidak dapat dibatalkan</strong>!
          </p>

          {error && (
            <div style={styles.errorBox}>
              ❌ {error}
            </div>
          )}

          <div style={styles.buttonGroup}>
            <button
              onClick={handleCancel}
              style={styles.cancelButton}
              disabled={loading}
            >
              Batal
            </button>
            
            <button
              onClick={handleDelete}
              style={styles.deleteButton}
              disabled={loading}
            >
              {loading ? "Menghapus..." : "Ya, Hapus Produk"}
            </button>
          </div>
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
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#1f2937",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    color: "#856404",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #ffeeba",
  },
  productInfo: {
    backgroundColor: "#f9fafb",
    padding: "15px",
    borderRadius: "6px",
    marginBottom: "20px",
    border: "1px solid #e5e7eb",
  },
  warning: {
    color: "#dc2626",
    marginBottom: "20px",
    fontSize: "14px",
  },
  errorBox: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "12px",
    borderRadius: "6px",
    marginBottom: "20px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  cancelButton: {
    flex: 1,
    padding: "12px",
    background: "#6b7280",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
  deleteButton: {
    flex: 1,
    padding: "12px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },
};