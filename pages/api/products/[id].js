import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  const { id } = req.query;
  
  console.log(`🔄 [API ${id}] Method:`, req.method);
  
  try {
    // 1. GET TOKEN
    const token = await getToken({ req, secret });
    
    console.log("🔍 Token role:", token?.role);
    
    // 2. CHECK AUTH
    if (!token || token.role !== "admin") {
      console.log("❌ Unauthorized");
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Admin only" 
      });
    }

    console.log("✅ Auth passed");
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID required"
      });
    }

    // ─── UPDATE ─────────────────────────────
    if (req.method === "PUT") {
      const { name, price } = req.body;
      
      if (!name || !price) {
        return res.status(400).json({ 
          success: false,
          message: "Data tidak lengkap" 
        });
      }

      const priceNum = Number(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Harga harus angka positif" 
        });
      }

      try {
        const product = await prisma.product.update({
          where: { id: String(id) },
          data: {
            name: name.trim(),
            price: priceNum,
          },
        });

        return res.status(200).json({
          success: true,
          data: product
        });
      } catch (error) {
        if (error.code === "P2025") {
          return res.status(404).json({
            success: false,
            message: "Produk tidak ditemukan"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Gagal update produk"
        });
      }
    }

    // ─── DELETE ─────────────────────────────
    if (req.method === "DELETE") {
      try {
        await prisma.product.delete({
          where: { id: String(id) },
        });

        return res.status(200).json({
          success: true,
          message: "Produk berhasil dihapus"
        });
      } catch (error) {
        if (error.code === "P2025") {
          return res.status(404).json({
            success: false,
            message: "Produk tidak ditemukan"
          });
        }
        return res.status(500).json({
          success: false,
          message: "Gagal menghapus produk"
        });
      }
    }

    res.setHeader('Allow', ['PUT', 'DELETE']);
    return res.status(405).json({
      success: false,
      message: "Method not allowed"
    });

  } catch (error) {
    console.error("❌ [API] Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
}