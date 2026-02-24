import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  console.log("📝 [API CREATE] Method:", req.method);
  
  if (req.method !== "POST") {
    return res.status(405).json({ 
      success: false,
      message: "Method not allowed" 
    });
  }

  try {
    // 1. GET TOKEN (bekerja di API routes)
    const token = await getToken({ req, secret });
    
    console.log("🔍 Token from getToken:", token);
    console.log("🔍 Token role:", token?.role);
    
    // 2. CHECK AUTH
    if (!token || token.role !== "admin") {
      console.log("❌ Unauthorized - Token:", token ? "exists" : "missing");
      return res.status(401).json({ 
        success: false,
        message: "Unauthorized - Admin only" 
      });
    }

    console.log("✅ Auth passed, user email:", token.email);
    
    // 3. PROCEED WITH CREATE
    const { name, price } = req.body;
    
    // Validasi
    if (!name || !price) {
      return res.status(400).json({ 
        success: false,
        message: "Nama dan harga harus diisi" 
      });
    }

    const priceNum = Number(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Harga harus angka positif" 
      });
    }

    // Buat produk
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price: priceNum,
      },
    });
    
    console.log("✅ Product created:", product.id);
    
    return res.status(201).json({
      success: true,
      data: product,
      message: "Produk berhasil dibuat"
    });

  } catch (error) {
    console.error("❌ [API CREATE] Error:", error);
    
    return res.status(500).json({ 
      success: false,
      message: error.message || "Terjadi kesalahan server" 
    });
  }
}