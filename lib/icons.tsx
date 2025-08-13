// lib/icons.tsx - Vollständiges Icon-System für TAILR.WIKI
import { 
  Microscope,      // Wissenschaftlich fundiert
  BarChart3,       // Umfassende Profile  
  Stethoscope,     // Expertenrat
  RefreshCw,       // Immer aktuell
  Search,          // Suche
  Heart,           // Favoriten
  Shield,          // Datenschutz
  Smartphone,      // Mobile
  Star,            // Kostenlos
  ArrowRight,      // Navigation
  ChevronRight,    // ✅ HINZUGEFÜGT: Für NavigationIcons
  ExternalLink,    // Externe Links
  Clock,           // Zeit
  TrendingUp,      // Stats
  Users,           // Community
  Award            // Qualität
} from 'lucide-react'

// ✅ TAILR.WIKI Feature Icons
export const FeatureIcons = {
  Scientific: Microscope,
  Analytics: BarChart3,
  Medical: Stethoscope,
  Updates: RefreshCw,
  Search: Search,
  Heart: Heart,
  Award: Award
} as const

// ✅ Trust Indicator Icons
export const TrustIcons = {
  Free: Star,
  Mobile: Smartphone,  
  Privacy: Shield
} as const

// ✅ Stats Icons
export const StatsIcons = {
  Pets: Heart,
  Categories: BarChart3,
  Articles: Award,
  Growth: TrendingUp
} as const

// ✅ NAVIGATION ICONS - HINZUGEFÜGT
export const NavigationIcons = {
  ChevronRight: ChevronRight,
  ArrowRight: ArrowRight,
  ExternalLink: ExternalLink
} as const

// ✅ Icon Wrapper Component
interface IconProps {
  icon: React.ComponentType<any>
  size?: number
  className?: string
  strokeWidth?: number
}

export function Icon({ 
  icon: IconComponent, 
  size = 20, 
  className = '',
  strokeWidth = 2 
}: IconProps) {
  return (
    <IconComponent
      size={size}
      strokeWidth={strokeWidth}
      className={className}
    />
  )
}
