# Win Vision - Product Prototype

A modern prototype built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui design system.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎨 Design System

This project uses **shadcn/ui** - the most popular Tailwind CSS design system. All components are located in `src/components/ui/`.

### Available Components

- **Button** - Primary, secondary, outline, ghost variants
- **Card** - Content containers with header, content, footer
- **Input** - Text input fields with labels
- **Label** - Form labels with accessibility
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Dialog** - Modal dialogs and sheets
- **Form** - Form validation with React Hook Form
- **Table** - Data tables with sorting
- **Badge** - Status indicators and tags
- **Avatar** - User profile images
- **Dropdown Menu** - Context menus
- **Sheet** - Slide-out panels
- **Tabs** - Tabbed interfaces

### Usage Example

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Form</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter your name" />
          </div>
          <Button>Submit</Button>
        </div>
      </CardContent>
    </Card>
  )
}
```

## 💾 Local Storage CRUD

The project includes a comprehensive local storage utility for managing data without a backend.

### Storage Manager

```tsx
import { createStorageManager, StorageItem } from "@/lib/storage"

// Define your data type
interface User extends StorageItem {
  name: string;
  email: string;
  role: string;
}

// Create a storage manager
const userStorage = createStorageManager<User>("users")

// CRUD operations
const newUser = userStorage.create({
  name: "John Doe",
  email: "john@example.com",
  role: "admin"
})

const allUsers = userStorage.getAll()
const user = userStorage.getById("user-id")
const updatedUser = userStorage.update("user-id", { name: "Jane Doe" })
const deleted = userStorage.delete("user-id")

// Search functionality
const searchResults = userStorage.search("john", ["name", "email"])
```

### Features

- **Type Safety** - Full TypeScript support
- **Error Handling** - Graceful fallbacks for localStorage errors
- **Search** - Built-in search across multiple fields
- **Timestamps** - Automatic createdAt/updatedAt tracking
- **UUID Generation** - Unique IDs for all items

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── storage.ts        # Local storage utilities
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

## 🎯 Prototype Guidelines

1. **Use shadcn/ui components** - Don't create custom components unless necessary
2. **Leverage local storage** - Use the storage utility for all data persistence
3. **Keep it simple** - Focus on UI/UX, not backend complexity
4. **Document as you go** - Add comments for complex interactions
5. **Mobile first** - Design for mobile, enhance for desktop

## 🔧 Customization

### Colors and Theme

The design system uses CSS variables for theming. Modify `src/app/globals.css` to customize:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  /* ... more variables */
}
```

### Adding New Components

```bash
# Add a new shadcn/ui component
npx shadcn@latest add [component-name]
```

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🚀 Deployment

This prototype can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**

The build process optimizes for production automatically.

---

Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and shadcn/ui
# win-vision
