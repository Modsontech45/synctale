# Synctale Backend Development Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Database Schema](#database-schema)
4. [API Architecture](#api-architecture)
5. [Authentication System](#authentication-system)
6. [Core Features Implementation](#core-features-implementation)
7. [Real-time Features](#real-time-features)
8. [File Upload & Storage](#file-upload--storage)
9. [Payment Integration](#payment-integration)
10. [Security Considerations](#security-considerations)
11. [Performance Optimization](#performance-optimization)
12. [Deployment Guide](#deployment-guide)
13. [API Documentation](#api-documentation)

## Project Overview

Synctale is a social blogging platform where creators can:
- Write and publish blog posts with rich content
- Earn money through a coin-based reward system
- Interact through likes, comments, and direct messaging
- Build communities through following/follower relationships
- Manage earnings and request payouts

### Key Business Logic
- **Coin System**: 1 USD = 78 coins (fixed conversion rate)
- **Revenue Split**: Platform takes 60%, creators get 40% of coin gifts
- **Minimum Payout**: $5.00 USD (390 coins)
- **Payout Processing**: 3-5 business days

## Technology Stack

### Required Technologies
```json
{
  "runtime": "Node.js 18+",
  "framework": "Express.js",
  "database": "PostgreSQL 14+",
  "orm": "Prisma",
  "authentication": "JWT + bcrypt",
  "realtime": "Socket.io",
  "fileStorage": "AWS S3 / Cloudinary",
  "payments": "Stripe",
  "email": "SendGrid / Nodemailer",
  "caching": "Redis",
  "validation": "Joi / Zod",
  "logging": "Winston",
  "monitoring": "Sentry"
}
```

### Project Structure
```
backend/
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── config/
│   ├── validators/
│   └── types/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── tests/
├── docs/
└── package.json
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  profile_picture TEXT,
  bio TEXT,
  balance INTEGER DEFAULT 100, -- in coins
  total_earned INTEGER DEFAULT 0, -- total coins earned
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  posts_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false,
  email_verification_token TEXT,
  password_reset_token TEXT,
  password_reset_expires TIMESTAMP,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  preview TEXT, -- auto-generated excerpt
  category VARCHAR(50) NOT NULL,
  images TEXT[], -- array of image URLs
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  dislikes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  gifts INTEGER DEFAULT 0, -- total coins gifted
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_published BOOLEAN DEFAULT true,
  published_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Search optimization
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', title || ' ' || content || ' ' || category)
  ) STORED
);

CREATE INDEX idx_posts_search ON posts USING GIN(search_vector);
CREATE INDEX idx_posts_creator ON posts(creator_id);
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_published ON posts(published_at DESC) WHERE is_published = true;
```

#### Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  text TEXT NOT NULL,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE, -- for nested comments
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_creator ON comments(creator_id);
```

#### Follows Table
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
```

#### Post Interactions Table
```sql
CREATE TABLE post_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('like', 'dislike', 'view')),
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(user_id, post_id, interaction_type)
);

CREATE INDEX idx_interactions_user ON post_interactions(user_id);
CREATE INDEX idx_interactions_post ON post_interactions(post_id);
```

#### Transactions Table
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('purchase', 'gift_sent', 'gift_received', 'payout')),
  amount INTEGER NOT NULL, -- in coins (negative for outgoing)
  usd_amount DECIMAL(10,2), -- for purchases and payouts
  related_user_id UUID REFERENCES users(id), -- for gifts
  related_post_id UUID REFERENCES posts(id), -- for post gifts
  stripe_payment_intent_id TEXT, -- for purchases
  description TEXT,
  status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
```

#### Payouts Table
```sql
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  coins INTEGER NOT NULL,
  usd_amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL,
  net_payout DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
  stripe_transfer_id TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP,
  notes TEXT
);

CREATE INDEX idx_payouts_creator ON payouts(creator_id);
CREATE INDEX idx_payouts_status ON payouts(status);
```

#### Chat System Tables
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
```

#### Notifications Table
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'gift', 'payout')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_user_id UUID REFERENCES users(id),
  related_post_id UUID REFERENCES posts(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
```

## API Architecture

### Base Configuration
```javascript
// src/config/database.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;
```

### Middleware Setup
```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        isActive: true,
        isVerified: true
      }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid or inactive user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };
```

### Error Handling Middleware
```javascript
// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Duplicate entry',
      field: err.meta?.target?.[0]
    });
  }

  // Validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation error',
      details: err.details.map(d => d.message)
    });
  }

  // Default error
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
```

## Authentication System

### User Registration
```javascript
// src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const prisma = require('../config/database');
const { sendVerificationEmail } = require('../services/emailService');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        error: existingUser.email === email.toLowerCase() 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);
    const emailVerificationToken = uuidv4();

    // Create user
    const user = await prisma.user.create({
      data: {
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        passwordHash,
        emailVerificationToken,
        balance: 100 // Welcome bonus
      },
      select: {
        id: true,
        username: true,
        email: true,
        balance: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Send verification email
    await sendVerificationEmail(user.email, emailVerificationToken);

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data (excluding sensitive info)
    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      balance: user.balance,
      totalEarned: user.totalEarned,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postsCount: user.postsCount,
      isVerified: user.isVerified
    };

    res.json({
      message: 'Login successful',
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

module.exports = { register, login };
```

## Core Features Implementation

### Posts Management
```javascript
// src/controllers/postsController.js
const prisma = require('../config/database');
const { generatePreview } = require('../utils/textUtils');

const createPost = async (req, res) => {
  try {
    const { title, content, category, images } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    // Generate preview from content
    const preview = generatePreview(content, 200);

    // Create post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        preview,
        category,
        images: images || [],
        creatorId: userId
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    // Update user's post count
    await prisma.user.update({
      where: { id: userId },
      data: { postsCount: { increment: 1 } }
    });

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, sort = 'recent' } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = {};
    switch (sort) {
      case 'trending':
        orderBy = { likes: 'desc' };
        break;
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      default:
        orderBy = { publishedAt: 'desc' };
    }

    const where = {
      isPublished: true,
      ...(category && { category })
    };

    const posts = await prisma.post.findMany({
      where,
      orderBy,
      skip: parseInt(offset),
      take: parseInt(limit),
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    const total = await prisma.post.count({ where });

    res.json({
      posts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            profilePicture: true,
            isVerified: true
          }
        }
      }
    });

    if (!post || !post.isPublished) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Record view if user is authenticated and not the creator
    if (userId && userId !== post.creatorId) {
      await prisma.postInteraction.upsert({
        where: {
          userId_postId_interactionType: {
            userId,
            postId: id,
            interactionType: 'view'
          }
        },
        update: {},
        create: {
          userId,
          postId: id,
          interactionType: 'view'
        }
      });

      // Update view count
      await prisma.post.update({
        where: { id },
        data: { views: { increment: 1 } }
      });
    }

    // Get user's interactions with this post
    let userInteractions = {};
    if (userId) {
      const interactions = await prisma.postInteraction.findMany({
        where: {
          userId,
          postId: id,
          interactionType: { in: ['like', 'dislike'] }
        }
      });

      userInteractions = interactions.reduce((acc, interaction) => {
        acc[interaction.interactionType] = true;
        return acc;
      }, {});
    }

    res.json({
      ...post,
      isLiked: userInteractions.like || false,
      isDisliked: userInteractions.dislike || false
    });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
};

module.exports = { createPost, getPosts, getPost };
```

### Coin System & Transactions
```javascript
// src/controllers/coinsController.js
const prisma = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const COINS_PER_USD = 78;
const PLATFORM_FEE_PERCENT = 60;
const CREATOR_PERCENT = 40;

const purchaseCoins = async (req, res) => {
  try {
    const { packageId, paymentMethodId } = req.body;
    const userId = req.user.id;

    // Define coin packages
    const packages = {
      1: { coins: 100, price: 4.99, bonus: 0 },
      2: { coins: 250, price: 9.99, bonus: 25 },
      3: { coins: 500, price: 19.99, bonus: 75 },
      4: { coins: 1000, price: 34.99, bonus: 200 },
      5: { coins: 2500, price: 79.99, bonus: 600 },
      6: { coins: 5000, price: 149.99, bonus: 1500 }
    };

    const selectedPackage = packages[packageId];
    if (!selectedPackage) {
      return res.status(400).json({ error: 'Invalid package selected' });
    }

    const totalCoins = selectedPackage.coins + selectedPackage.bonus;
    const amountInCents = Math.round(selectedPackage.price * 100);

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true,
      metadata: {
        userId,
        coins: totalCoins.toString(),
        packageId: packageId.toString()
      }
    });

    if (paymentIntent.status === 'succeeded') {
      // Update user balance
      await prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: totalCoins } }
      });

      // Record transaction
      await prisma.transaction.create({
        data: {
          userId,
          transactionType: 'purchase',
          amount: totalCoins,
          usdAmount: selectedPackage.price,
          stripePaymentIntentId: paymentIntent.id,
          description: `Purchased ${totalCoins} coins`,
          status: 'completed'
        }
      });

      res.json({
        message: 'Coins purchased successfully',
        coins: totalCoins,
        paymentIntentId: paymentIntent.id
      });
    } else {
      res.status(400).json({ error: 'Payment failed' });
    }
  } catch (error) {
    console.error('Purchase coins error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

const giftCoins = async (req, res) => {
  try {
    const { recipientId, amount, message } = req.body;
    const senderId = req.user.id;

    if (senderId === recipientId) {
      return res.status(400).json({ error: 'Cannot gift coins to yourself' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Invalid gift amount' });
    }

    // Check sender's balance
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { balance: true }
    });

    if (!sender || sender.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Check recipient exists
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
      select: { id: true, username: true }
    });

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Perform transaction
    await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: senderId },
        data: { balance: { decrement: amount } }
      });

      // Add to recipient
      await tx.user.update({
        where: { id: recipientId },
        data: { 
          balance: { increment: amount },
          totalEarned: { increment: amount }
        }
      });

      // Record sender transaction
      await tx.transaction.create({
        data: {
          userId: senderId,
          transactionType: 'gift_sent',
          amount: -amount,
          relatedUserId: recipientId,
          description: `Gift sent to @${recipient.username}`,
          status: 'completed'
        }
      });

      // Record recipient transaction
      await tx.transaction.create({
        data: {
          userId: recipientId,
          transactionType: 'gift_received',
          amount: amount,
          relatedUserId: senderId,
          description: `Gift received from @${req.user.username}`,
          status: 'completed'
        }
      });

      // Create notification
      await tx.notification.create({
        data: {
          userId: recipientId,
          type: 'gift',
          title: 'Coins Received',
          message: `@${req.user.username} sent you ${amount} coins`,
          relatedUserId: senderId
        }
      });
    });

    res.json({
      message: 'Coins gifted successfully',
      amount,
      recipient: recipient.username
    });
  } catch (error) {
    console.error('Gift coins error:', error);
    res.status(500).json({ error: 'Failed to gift coins' });
  }
};

module.exports = { purchaseCoins, giftCoins };
```

### Earnings & Payouts
```javascript
// src/controllers/earningsController.js
const prisma = require('../config/database');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const COINS_PER_USD = 78;
const CREATOR_PERCENT = 40;
const MINIMUM_PAYOUT_USD = 5.00;

const getEarnings = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalEarned: true, balance: true }
    });

    const totalEarnedUSD = (user.totalEarned / COINS_PER_USD) * (CREATOR_PERCENT / 100);
    const availableForPayout = totalEarnedUSD >= MINIMUM_PAYOUT_USD ? totalEarnedUSD : 0;

    // Get payout history
    const payouts = await prisma.payout.findMany({
      where: { creatorId: userId },
      orderBy: { requestedAt: 'desc' },
      take: 10
    });

    res.json({
      totalEarnedCoins: user.totalEarned,
      totalEarnedUSD: parseFloat(totalEarnedUSD.toFixed(2)),
      availableForPayout: parseFloat(availableForPayout.toFixed(2)),
      minimumPayout: MINIMUM_PAYOUT_USD,
      payouts
    });
  } catch (error) {
    console.error('Get earnings error:', error);
    res.status(500).json({ error: 'Failed to fetch earnings' });
  }
};

const requestPayout = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalEarned: true, email: true }
    });

    const totalEarnedUSD = (user.totalEarned / COINS_PER_USD) * (CREATOR_PERCENT / 100);

    if (totalEarnedUSD < MINIMUM_PAYOUT_USD) {
      return res.status(400).json({ 
        error: `Minimum payout amount is $${MINIMUM_PAYOUT_USD}` 
      });
    }

    // Check for pending payouts
    const pendingPayout = await prisma.payout.findFirst({
      where: {
        creatorId: userId,
        status: { in: ['pending', 'processing'] }
      }
    });

    if (pendingPayout) {
      return res.status(400).json({ 
        error: 'You already have a pending payout request' 
      });
    }

    const platformFee = totalEarnedUSD * 0.6; // 60% platform fee
    const netPayout = totalEarnedUSD * 0.4; // 40% to creator

    // Create payout record
    const payout = await prisma.payout.create({
      data: {
        creatorId: userId,
        coins: user.totalEarned,
        usdAmount: parseFloat(totalEarnedUSD.toFixed(2)),
        platformFee: parseFloat(platformFee.toFixed(2)),
        netPayout: parseFloat(netPayout.toFixed(2)),
        status: 'pending'
      }
    });

    // Reset user's total earned
    await prisma.user.update({
      where: { id: userId },
      data: { totalEarned: 0 }
    });

    // TODO: Integrate with Stripe Connect for actual payouts
    // For now, we'll mark it as processing
    setTimeout(async () => {
      await prisma.payout.update({
        where: { id: payout.id },
        data: { 
          status: 'processing',
          processedAt: new Date()
        }
      });
    }, 1000);

    res.json({
      message: 'Payout requested successfully',
      payout
    });
  } catch (error) {
    console.error('Request payout error:', error);
    res.status(500).json({ error: 'Failed to request payout' });
  }
};

module.exports = { getEarnings, requestPayout };
```

## Real-time Features

### Socket.io Setup
```javascript
// src/services/socketService.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');

let io;

const initializeSocket = (server) => {
  io = socketIo(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, username: true, isActive: true }
      });

      if (!user || !user.isActive) {
        return next(new Error('Authentication failed'));
      }

      socket.userId = user.id;
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.username} connected`);

    // Join user to their personal room for notifications
    socket.join(`user_${socket.userId}`);

    // Handle chat events
    socket.on('join_conversation', (conversationId) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId) => {
      socket.leave(`conversation_${conversationId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { conversationId, message } = data;

        // Verify user is part of conversation
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            conversationId,
            userId: socket.userId
          }
        });

        if (!participant) {
          socket.emit('error', { message: 'Not authorized for this conversation' });
          return;
        }

        // Create message
        const newMessage = await prisma.message.create({
          data: {
            conversationId,
            senderId: socket.userId,
            message
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                profilePicture: true
              }
            }
          }
        });

        // Update conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { updatedAt: new Date() }
        });

        // Emit to all participants
        io.to(`conversation_${conversationId}`).emit('new_message', newMessage);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.username} disconnected`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

// Utility functions for emitting events
const emitNotification = (userId, notification) => {
  if (io) {
    io.to(`user_${userId}`).emit('notification', notification);
  }
};

const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(`conversation_${conversationId}`).emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitNotification,
  emitToConversation
};
```

### Chat System Implementation
```javascript
// src/controllers/chatController.js
const prisma = require('../config/database');
const { emitToConversation } = require('../services/socketService');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    profilePicture: true,
                    isVerified: true
                  }
                }
              }
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
              include: {
                sender: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: {
        conversation: {
          updatedAt: 'desc'
        }
      }
    });

    const formattedConversations = conversations.map(cp => {
      const otherParticipant = cp.conversation.participants[0]?.user;
      const lastMessage = cp.conversation.messages[0];

      return {
        id: cp.conversation.id,
        participants: [otherParticipant],
        lastMessage,
        unreadCount: 0, // TODO: Calculate unread count
        updatedAt: cp.conversation.updatedAt
      };
    });

    res.json({ conversations: formattedConversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const userId = req.user.id;
    const offset = (page - 1) * limit;

    // Verify user is part of conversation
    const participant = await prisma.conversationParticipant.findFirst({
      where: {
        conversationId,
        userId
      }
    });

    if (!participant) {
      return res.status(403).json({ error: 'Not authorized for this conversation' });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      skip: parseInt(offset),
      take: parseInt(limit),
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profilePicture: true
          }
        }
      }
    });

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false
      },
      data: { isRead: true }
    });

    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

const createConversation = async (req, res) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (userId === participantId) {
      return res.status(400).json({ error: 'Cannot create conversation with yourself' });
    }

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: [userId, participantId] }
          }
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    if (existingConversation) {
      return res.json({ conversation: existingConversation });
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: participantId }
          ]
        }
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profilePicture: true,
                isVerified: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  createConversation
};
```

## Security Considerations

### Input Validation
```javascript
// src/validators/postValidator.js
const Joi = require('joi');

const createPostSchema = Joi.object({
  title: Joi.string().min(5).max(255).required(),
  content: Joi.string().min(50).max(50000).required(),
  category: Joi.string().valid(
    'Finance', 'Motivational', 'Relationship', 'Health', 
    'Technology', 'Travel', 'Food', 'Lifestyle', 
    'Education', 'Entertainment'
  ).required(),
  images: Joi.array().items(Joi.string().uri()).max(5).optional()
});

const validateCreatePost = (req, res, next) => {
  const { error } = createPostSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error.details.map(d => d.message)
    });
  }
  next();
};

module.exports = { validateCreatePost };
```

### Rate Limiting
```javascript
// src/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL);

// General API rate limit
const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

// Message sending rate limit
const messageLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 messages per minute
  message: 'Too many messages sent, please slow down.'
});

module.exports = { apiLimiter, authLimiter, messageLimiter };
```

### Content Moderation
```javascript
// src/services/moderationService.js
const Filter = require('bad-words');
const filter = new Filter();

const moderateContent = (text) => {
  // Check for profanity
  if (filter.isProfane(text)) {
    return {
      isAllowed: false,
      reason: 'Content contains inappropriate language'
    };
  }

  // Check for spam patterns
  const spamPatterns = [
    /(.)\1{10,}/, // Repeated characters
    /https?:\/\/[^\s]+/gi, // Multiple URLs
    /\b(buy|sell|cheap|free|money|cash|prize|winner)\b/gi // Spam keywords
  ];

  for (const pattern of spamPatterns) {
    if (pattern.test(text)) {
      return {
        isAllowed: false,
        reason: 'Content appears to be spam'
      };
    }
  }

  return { isAllowed: true };
};

module.exports = { moderateContent };
```

## Performance Optimization

### Database Indexing Strategy
```sql
-- Essential indexes for performance
CREATE INDEX CONCURRENTLY idx_posts_creator_published ON posts(creator_id, published_at DESC) WHERE is_published = true;
CREATE INDEX CONCURRENTLY idx_posts_category_published ON posts(category, published_at DESC) WHERE is_published = true;
CREATE INDEX CONCURRENTLY idx_posts_likes_published ON posts(likes DESC, published_at DESC) WHERE is_published = true;
CREATE INDEX CONCURRENTLY idx_posts_views_published ON posts(views DESC, published_at DESC) WHERE is_published = true;

CREATE INDEX CONCURRENTLY idx_comments_post_created ON comments(post_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_follows_follower_created ON follows(follower_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_follows_following_created ON follows(following_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_transactions_user_created ON transactions(user_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_transactions_type_created ON transactions(transaction_type, created_at DESC);

CREATE INDEX CONCURRENTLY idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX CONCURRENTLY idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE is_read = false;
```

### Caching Strategy
```javascript
// src/services/cacheService.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

const CACHE_TTL = {
  USER_PROFILE: 300, // 5 minutes
  POST_DETAIL: 600, // 10 minutes
  POSTS_LIST: 180, // 3 minutes
  TRENDING_POSTS: 900 // 15 minutes
};

const cacheGet = async (key) => {
  try {
    const cached = await redis.get(key);
    return cached ? JSON.parse(cached) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

const cacheSet = async (key, data, ttl = 300) => {
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Cache set error:', error);
  }
};

const cacheDelete = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
};

// Cache middleware
const cacheMiddleware = (keyGenerator, ttl = 300) => {
  return async (req, res, next) => {
    const key = keyGenerator(req);
    const cached = await cacheGet(key);
    
    if (cached) {
      return res.json(cached);
    }

    // Store original json method
    const originalJson = res.json;
    
    // Override json method to cache response
    res.json = function(data) {
      cacheSet(key, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

module.exports = {
  cacheGet,
  cacheSet,
  cacheDelete,
  cacheMiddleware,
  CACHE_TTL
};
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "username": "string (3-50 chars, unique)",
  "email": "string (valid email, unique)",
  "password": "string (min 6 chars)"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "balance": 100,
    "isVerified": false,
    "createdAt": "timestamp"
  },
  "token": "jwt_token"
}
```

#### POST /api/auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "profilePicture": "string|null",
    "bio": "string|null",
    "balance": "number",
    "totalEarned": "number",
    "followersCount": "number",
    "followingCount": "number",
    "postsCount": "number",
    "isVerified": "boolean"
  },
  "token": "jwt_token"
}
```

### Posts Endpoints

#### GET /api/posts
Get paginated list of posts.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 10, max: 50)
- `category` (string, optional)
- `sort` (string: 'recent'|'trending'|'popular', default: 'recent')

**Response (200):**
```json
{
  "posts": [
    {
      "id": "uuid",
      "title": "string",
      "preview": "string",
      "category": "string",
      "images": ["string"],
      "views": "number",
      "likes": "number",
      "dislikes": "number",
      "commentsCount": "number",
      "gifts": "number",
      "creator": {
        "id": "uuid",
        "username": "string",
        "profilePicture": "string|null",
        "isVerified": "boolean"
      },
      "createdAt": "timestamp"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "pages": "number"
  }
}
```

#### POST /api/posts
Create a new post (requires authentication).

**Request Body:**
```json
{
  "title": "string (5-255 chars)",
  "content": "string (50-50000 chars)",
  "category": "string (valid category)",
  "images": ["string"] // optional, max 5 URLs
}
```

**Response (201):**
```json
{
  "message": "Post created successfully",
  "post": {
    "id": "uuid",
    "title": "string",
    "content": "string",
    "preview": "string",
    "category": "string",
    "images": ["string"],
    "views": 0,
    "likes": 0,
    "dislikes": 0,
    "commentsCount": 0,
    "gifts": 0,
    "creator": {
      "id": "uuid",
      "username": "string",
      "profilePicture": "string|null",
      "isVerified": "boolean"
    },
    "createdAt": "timestamp"
  }
}
```

### Coins Endpoints

#### POST /api/coins/purchase
Purchase coins using Stripe payment.

**Request Body:**
```json
{
  "packageId": "number (1-6)",
  "paymentMethodId": "string (Stripe payment method ID)"
}
```

**Response (200):**
```json
{
  "message": "Coins purchased successfully",
  "coins": "number",
  "paymentIntentId": "string"
}
```

#### POST /api/coins/gift
Send coins to another user.

**Request Body:**
```json
{
  "recipientId": "uuid",
  "amount": "number (positive)",
  "message": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Coins gifted successfully",
  "amount": "number",
  "recipient": "string"
}
```

### Chat Endpoints

#### GET /api/chat/conversations
Get user's conversations.

**Response (200):**
```json
{
  "conversations": [
    {
      "id": "uuid",
      "participants": [
        {
          "id": "uuid",
          "username": "string",
          "profilePicture": "string|null",
          "isVerified": "boolean"
        }
      ],
      "lastMessage": {
        "id": "uuid",
        "message": "string",
        "senderId": "uuid",
        "createdAt": "timestamp"
      },
      "unreadCount": "number",
      "updatedAt": "timestamp"
    }
  ]
}
```

#### GET /api/chat/conversations/:id/messages
Get messages from a conversation.

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 50)

**Response (200):**
```json
{
  "messages": [
    {
      "id": "uuid",
      "message": "string",
      "senderId": "uuid",
      "sender": {
        "id": "uuid",
        "username": "string",
        "profilePicture": "string|null"
      },
      "isRead": "boolean",
      "createdAt": "timestamp"
    }
  ]
}
```

## Environment Variables

Create a `.env` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synctale"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Redis
REDIS_URL="redis://localhost:6379"

# Email (SendGrid)
SENDGRID_API_KEY="SG...."
FROM_EMAIL="noreply@synctale.com"

# File Upload (AWS S3)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="synctale-uploads"

# Frontend URL
FRONTEND_URL="http://localhost:3000"

# Server
PORT=5000
NODE_ENV="development"

# Logging
LOG_LEVEL="info"
SENTRY_DSN="https://your-sentry-dsn"
```

## Deployment Guide

### Docker Setup
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/synctale
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - ./uploads:/app/uploads

  db:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=synctale
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### Production Deployment Checklist

1. **Security**
   - [ ] Use strong JWT secrets
   - [ ] Enable HTTPS/SSL
   - [ ] Set up proper CORS
   - [ ] Configure rate limiting
   - [ ] Set up firewall rules

2. **Database**
   - [ ] Set up database backups
   - [ ] Configure connection pooling
   - [ ] Set up read replicas if needed
   - [ ] Monitor database performance

3. **Monitoring**
   - [ ] Set up application monitoring (Sentry)
   - [ ] Configure log aggregation
   - [ ] Set up health checks
   - [ ] Monitor API response times

4. **Scaling**
   - [ ] Configure load balancer
   - [ ] Set up horizontal scaling
   - [ ] Implement caching strategy
   - [ ] Optimize database queries

5. **Backup & Recovery**
   - [ ] Database backup strategy
   - [ ] File storage backup
   - [ ] Disaster recovery plan
   - [ ] Test restore procedures

This documentation provides a comprehensive guide for building the Synctale backend. The implementation covers all major features including authentication, posts management, coin system, real-time chat, and earnings tracking with proper security, performance optimization, and deployment considerations.