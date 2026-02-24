import { getToken } from "next-auth/jwt";
import prisma from "../../../lib/prisma";

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  console.log("📦 [API PRODUCTS] Method:", req.method);
  
  if (req.method !== "GET") {
    return res.status(405).json({ 
      success: false,
      message: "Method not allowed" 
    });
  }

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
    
    // 3. GET PRODUCTS
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    console.log(`✅ Found ${products.length} products`);
    
    return res.status(200).json(products);

  } catch (error) {
    console.error("❌ [API PRODUCTS] Error:", error);
    
    return res.status(500).json({ 
      success: false,
      message: "Database error" 
    });
  }
}