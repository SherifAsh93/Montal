export function AnnouncementBar() {
  const messages = [
    '✦ Worldwide Shipping Available',
    '✦ Free Shipping on Orders Over 800 EGP',
    '✦ Easy Returns & Exchanges',
    '✦ Handcrafted with Premium Fabrics',
    '✦ Custom Orders Welcome',
  ]
  const text = messages.join('     ')

  return (
    <div className="bg-dark-900 text-cream-100 text-[10px] tracking-widest overflow-hidden py-2.5">
      <div className="flex whitespace-nowrap">
        <span className="animate-marquee pr-8">{text + '     ' + text}</span>
      </div>
    </div>
  )
}
