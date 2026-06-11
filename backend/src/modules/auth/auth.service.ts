import jwt from 'jsonwebtoken';
import { User, IUser } from './auth.model';
import { ApiError } from '../../utils/ApiError';
import { env } from '../../config/env';

export class AuthService {
  private generateToken(userId: string): string {
    const secret = env.JWT_SECRET || 'fallback_secret';
    return jwt.sign({ id: userId }, secret, {
      expiresIn: (env.JWT_EXPIRES_IN as any) || '7d',
    });
  }

  async register(name: string, email: string, passwordHash: string) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(400, 'User already exists');
    }
    const user = await User.create({ name, email, passwordHash });
    const token = this.generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async login(email: string, passwordHash: string) {
    const user = await User.findOne({ email });
    if (!user) throw new ApiError(401, 'Invalid credentials');
    
    const isMatch = await user.comparePassword(passwordHash);
    if (!isMatch) throw new ApiError(401, 'Invalid credentials');
    
    const token = this.generateToken(user.id);
    return { user: { id: user.id, name: user.name, email: user.email }, token };
  }

  async getUserById(id: string) {
    const user = await User.findById(id).select('-passwordHash');
    if (!user) throw new ApiError(404, 'User not found');
    return { id: user.id, name: user.name, email: user.email };
  }
}
