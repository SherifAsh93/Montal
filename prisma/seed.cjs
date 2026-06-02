const { Pool } = require('pg')
const { randomUUID } = require('crypto')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

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
  const client = await pool.connect()
  try {
    console.log('Seeding categories...')
    for (const cat of categories) {
      const { children, ...catData } = cat
      const id = randomUUID()
      await client.query(
        `INSERT INTO "Category" (id, name, slug, "sortOrder") VALUES ($1,$2,$3,$4)
         ON CONFLICT (slug) DO UPDATE SET name=$2, "sortOrder"=$4`,
        [id, catData.name, catData.slug, catData.sortOrder]
      )
      const parentRes = await client.query(`SELECT id FROM "Category" WHERE slug=$1`, [catData.slug])
      const parentId = parentRes.rows[0].id

      if (children) {
        for (const child of children) {
          await client.query(
            `INSERT INTO "Category" (id, name, slug, "parentId", "sortOrder") VALUES ($1,$2,$3,$4,$5)
             ON CONFLICT (slug) DO UPDATE SET name=$2, "parentId"=$4, "sortOrder"=$5`,
            [randomUUID(), child.name, child.slug, parentId, child.sortOrder]
          )
        }
      }
    }
    console.log('Categories seeded!')
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(console.error)
