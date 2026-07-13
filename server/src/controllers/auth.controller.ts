import type { Request, Response } from 'express'
import User from '../models/user.model'
import bcrypt from 'bcrypt'

export const register = async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' })
    }

    const normalizedEmail = String(email).toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' })
    }

    const hashedPass = await bcrypt.hash(password,10);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPass,
    })

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    })

  } catch {
    return res.status(500).json({ message: 'Server error.' })
  }
}

export const login = async (req: Request, res: Response) => {

  try {
    
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email: String(email).toLowerCase().trim() })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const isVerified = await bcrypt.compare(password,user.password);
    if(!isVerified) return res.status(401).json({ message: 'Invalid email or password.' })

    return res.status(200).json({
      message: 'Login successful.',
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch {
    return res.status(500).json({ message: 'Server error.' })
  }
}

export const logout = (_req: Request, res: Response) => {
  return res.status(200).json({ message: 'Logout successful.' })
}
