# 🎨 Palette Builder

A modern, comprehensive color palette generator and theme builder built with Next.js, TypeScript, and Tailwind CSS. Create beautiful, accessible color palettes with advanced color theory tools and export them in multiple formats.

## ✨ Features

### 🎯 Core Features

- **Advanced Color Generation**: Generate color scales using modern color theory (OKLCH, LAB)
- **Color Harmony Tools**: Complementary, triadic, tetradic, analogous, and monochromatic harmonies
- **Real-time Preview**: Live preview with sample components and charts
- **Accessibility Testing**: Built-in contrast grid and WCAG compliance checking
- **Multiple Export Formats**: CSS, Tailwind, SCSS, SVG, and more

### 🚀 Enhanced Features

- **HSL Color Sliders**: Interactive color adjustment with real-time feedback
- **Color Information Panel**: Detailed color data including luminance, contrast ratios
- **Semantic Color Generation**: Automatic generation of semantic color variations
- **Gradient Generation**: Linear, radial, and conic gradient variations
- **Color Temperature Analysis**: Warm, cool, and neutral color classification
- **Enhanced Export System**: Organized export options with copy-to-clipboard functionality

### 🎨 User Experience

- **Modern UI**: Clean, responsive design with dark/light theme support
- **Interactive Components**: Hover effects, animations, and smooth transitions
- **Mobile Responsive**: Optimized for all device sizes
- **User Authentication**: Save and manage personal color palettes
- **Community Features**: Browse and share color palettes

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom styling
- **Color Processing**: Chroma.js for advanced color manipulation
- **Authentication**: Clerk for user management
- **Database**: PostgreSQL with Drizzle ORM
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd palettebuilder
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/palettebuilder"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"

   # PayPal (optional)
   PAYPAL_CLIENT_ID="your_paypal_client_id"
   PAYPAL_CLIENT_SECRET="your_paypal_client_secret"
   ```

4. **Set up the database**

   ```bash
   npm run db:setup
   npm run db:push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
palettebuilder/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── browse/            # Browse community palettes
│   ├── pricing/           # Pricing page
│   ├── saved/             # User saved palettes
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── sample/           # Sample component previews
│   ├── EnhancedColorInput.tsx
│   ├── EnhancedColorPalette.tsx
│   └── ...
├── lib/                  # Utility libraries
│   ├── colors.ts         # Color definitions
│   ├── colorUtils.ts     # Enhanced color utilities
│   ├── db.ts            # Database connection
│   └── schema.ts        # Database schema
├── hooks/               # Custom React hooks
├── migrations/          # Database migrations
└── public/             # Static assets
```

## 🎨 Key Components

### EnhancedColorInput

- Multi-tab interface (Color Picker, Text Input, Harmony)
- HSL sliders for precise color adjustment
- Color harmony generation
- Real-time color information display

### EnhancedColorPalette

- Multiple view modes (Grid, List)
- Accessibility information display
- Enhanced export options
- Color harmony visualization

### Color Utilities

- Modern color scale generation using OKLCH
- Color harmony algorithms
- Accessibility analysis
- Semantic color generation

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:setup     # Initial database setup

# Deployment
npm run deploy       # Deploy to production
```

## 🎯 Usage Examples

### Basic Color Generation

```typescript
import { generateColorScale } from "@/lib/colorUtils";

const colorScale = generateColorScale("#3B82F6");
// Returns: { 50: '#EFF6FF', 100: '#DBEAFE', ..., 900: '#1E3A8A' }
```

### Color Harmony Generation

```typescript
import { generateColorHarmony } from "@/lib/colorUtils";

const harmony = generateColorHarmony("#3B82F6");
// Returns: { complementary: [...], triadic: [...], ... }
```

### Complete Palette Generation

```typescript
import { generateCompletePalette } from "@/lib/colorUtils";

const palette = generateCompletePalette("#3B82F6", "#10B981");
// Returns: { scale, harmony, info, accessible, gradients, ... }
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chroma.js](https://gka.github.io/chroma.js/) for color manipulation
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Next.js](https://nextjs.org/) for the framework
- [Clerk](https://clerk.com/) for authentication

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation
- Contact the maintainers

---

**Made with ❤️ for the design community**
