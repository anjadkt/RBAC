import type { Request, Response } from 'express'
import User from '../models/user.model'
import bcrypt from 'bcrypt'
import Role from '../models/role.model'
import env from '../config/env'
import jwt from 'jsonwebtoken'


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 24 * 60 * 60 * 1000,
}

function createAccessToken(
  user: { 
  _id: unknown; 
  email: string; 
  role?: unknown;
  isSuperAdmin ?: boolean
}) {
  return jwt.sign(
    { 
      userId: String(user._id), 
      email: user.email, 
      role: user.role,
      isSuperAdmin : user.isSuperAdmin
    },
    env.JWT_SECRET,
    { expiresIn: '1d' },
  )
}

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

    const hashedPass = await bcrypt.hash(password.toString(),10);

    const role = await Role.findOne({ name : "patient"});

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPass,
      role : role?._id
    });

    const accessToken = createAccessToken({ _id : user._id, role : user.role, email : user.email});

    return res
    .status(201)
    .cookie('access_token', accessToken, cookieOptions)
    .json({
      message: 'User registered successfully.',
      user: { id: user._id, name: user.name, email: user.email },
    })

  } catch (error) {

    console.log(error)
    
    return res.status(500).json({ message: 'Server error.', error })
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

    const isVerified = await bcrypt.compare(password.toString(),user.password);
    if(!isVerified) return res.status(401).json({ message: 'Invalid email or password.' })

    const accessToken = createAccessToken({ 
      _id : user._id, 
      role : user.role, 
      email : user.email,
      isSuperAdmin : user.isSuperAdmin || false
    })

    return res
    .status(200)
    .cookie('access_token', accessToken, cookieOptions)
    .json({
      message: 'Login successful.',
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch ( error ) {
    console.log(error)
    return res.status(500).json({ message: 'Server error.', error })
  }
}

export const logout = (_req: Request, res: Response) => {
  return res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ message: 'Logout successful.' })
}
