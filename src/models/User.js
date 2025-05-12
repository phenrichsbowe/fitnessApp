export class User {
  constructor({
    id,
    email,
    username = null,
    isOfflineMode = false,
    metadata = {}
  }) {
    this.id = id
    this.email = email
    this.username = username || email?.split('@')[0] || 'User'
    this.isOfflineMode = isOfflineMode
    this.metadata = metadata
  }

  static fromSupabaseUser(supabaseUser) {
    if (!supabaseUser) return null
    
    return new User({
      id: supabaseUser.id,
      email: supabaseUser.email,
      username: supabaseUser.user_metadata?.username,
      metadata: supabaseUser.user_metadata || {}
    })
  }

  static createOfflineUser() {
    return new User({
      id: 'offline-user',
      email: null,
      username: 'Offline User',
      isOfflineMode: true
    })
  }

  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      isOfflineMode: this.isOfflineMode,
      metadata: this.metadata
    }
  }
} 