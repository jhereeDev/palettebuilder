const { sql } = require('@vercel/postgres');

async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        clerk_id VARCHAR(255) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscription_tier VARCHAR(20) NOT NULL DEFAULT 'free',
        subscription_status VARCHAR(20) NOT NULL DEFAULT 'active',
        paypal_subscription_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;
    
    // Create color_palettes table
    await sql`
      CREATE TABLE IF NOT EXISTS color_palettes (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        name VARCHAR(255) NOT NULL,
        primary_color VARCHAR(7) NOT NULL,
        secondary_color VARCHAR(7),
        color_scale TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
    
    // Create user_exports table
    await sql`
      CREATE TABLE IF NOT EXISTS user_exports (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        count INTEGER NOT NULL DEFAULT 0,
        last_export_date TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `;
    
    console.log('Database tables created successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase(); 