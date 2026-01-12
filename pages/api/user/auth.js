import prisma from "../../../lib/prisma";
import { compare } from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const isValid = await compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // buang password
    const { password: _, ...safeUser } = user;

    return res.status(200).json(safeUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "server error" });
  }
}
