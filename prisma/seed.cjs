const { PrismaClient } = require('../src/generated/prisma')

const prisma = new PrismaClient()

const categories = [
  { name: 'Maternity Wear', slug: 'maternity-wear', sortOrder: 1 },
  { name: 'Robes', slug: 'robes', sortOrder: 2 },
  {
    name: 'Bridal Clothes', slug: 'bridal-clothes', sortOrder: 3,
    children: [
      { name: 'Pants', slug: 'bridal-pants', sortOrder: 1 },
      { name: 'Skirts', slug: 'bridal-skirts', sortOrder: 2 },
      { name: 'Shirts', slug: 'bridal-shirts', sortOrder: 3 },
    ],
  },
  {
    name: 'Bridal Accessories', slug: 'bridal-accessories', sortOrder: 4,
    children: [
      { name: 'Veil', slug: 'accessories-veil', sortOrder: 1 },
      { name: 'Banner', slug: 'accessories-banner', sortOrder: 2 },
      { name: 'Face Cover', slug: 'accessories-face-cover', sortOrder: 3 },
      { name: 'Bags', slug: 'accessories-bags', sortOrder: 4 },
      { name: 'Gloves', slug: 'accessories-gloves', sortOrder: 5 },
    ],
  },
  { name: 'Corsets', slug: 'corsets', sortOrder: 5 },
  {
    name: 'Dresses', slug: 'dresses', sortOrder: 6,
    children: [
      { name: 'Long Dress', slug: 'long-dress', sortOrder: 1 },
      { name: 'Short Dress', slug: 'short-dress', sortOrder: 2 },
    ],
  },
]

async function main() {
  console.log('Seeding categories...')
  for (const cat of categories) {
    const { children, ...catData } = cat
    const parent = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: { name: catData.name, sortOrder: catData.sortOrder },
      create: catData,
    })
    if (children) {
      for (const child of children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          update: { name: child.name, sortOrder: child.sortOrder, parentId: parent.id },
          create: { ...child, parentId: parent.id },
        })
      }
    }
  }
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
