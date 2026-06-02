import { Heart, Gem, Globe, Gift } from 'lucide-react'

const features = [
  { icon: Heart, label: 'Handmade', sub: 'With Love' },
  { icon: Gem, label: 'Premium', sub: 'Quality Fabrics' },
  { icon: Globe, label: 'Worldwide', sub: 'Shipping' },
  { icon: Gift, label: 'Luxury', sub: 'Packaging' },
]

export function FeaturesStrip() {
  return (
    <section className="border-y border-cream-200 py-10 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full border border-gold-400 flex items-center justify-center">
              <Icon size={18} className="text-gold-600" />
            </div>
            <div>
              <p className="font-montserrat text-[10px] tracking-widest uppercase text-dark-900 font-medium">{label}</p>
              <p className="font-montserrat text-[10px] tracking-widest uppercase text-dark-700">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
