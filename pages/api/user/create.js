import prisma from "../../../lib/prisma";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { name, email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }

  try {
    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "user",
      },
    });

    const { password: _, ...safeUser } = newUser;

    return res.status(201).json(safeUser);
  } catch (error) {
    console.error(error);

    // email unique error
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(500).json({ message: "Something went wrong" });
  }
}
