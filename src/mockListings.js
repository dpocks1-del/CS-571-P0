const TITLES = [
  'Canon AE-1 35mm Film Camera',
  'Nikon FM2 Camera Body Only',
  'Polaroid SX-70 Instant Camera',
  'Sony Alpha a6400 Mirrorless Camera',
  'Pentax K1000 35mm SLR Camera Kit',
  'GoPro Hero 9 Black Action Camera',
  'Fujifilm Instax Mini 11 Instant Camera',
  'Vintage Polaroid Land Camera',
  'Nikon D3500 DSLR with Lens',
  'Minolta X-700 35mm SLR',
]

const CONDITIONS = ['New', 'Used', 'Certified - Refurbished']
const ALL_SOURCES = ['ebay', 'facebook', 'offerup']
const STATUSES = ['active', 'sold', 'draft']

const SOURCE_URL_BUILDERS = {
  ebay: (id) => `https://www.ebay.com/itm/${id}`,
  facebook: (id) => `https://www.facebook.com/marketplace/item/${id}`,
  offerup: (id) => `https://offerup.com/item/detail/${id}`,
}

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

// Picks 1-3 unique sources for a listing using the seeded RNG
function pickSources(rand) {
  const shuffled = [...ALL_SOURCES].sort(() => rand() - 0.5)
  const count = 1 + Math.floor(rand() * ALL_SOURCES.length)
  return shuffled.slice(0, count)
}

function generateMockListings(count) {
  const rand = seededRandom(7)
  const listings = []

  for (let i = 0; i < count; i++) {
    const title = TITLES[Math.floor(rand() * TITLES.length)]
    const condition = CONDITIONS[Math.floor(rand() * CONDITIONS.length)]
    const sources = pickSources(rand)
    const status = STATUSES[Math.floor(rand() * STATUSES.length)]
    const price = (20 + rand() * 980).toFixed(2)
    const views = Math.floor(rand() * 500)
    const rawId = `987654321${i.toString().padStart(2, '0')}`

    listings.push({
      itemId: `listing|${rawId}|0`,
      sources,
      // A URL per source, so each badge can link out to the right listing
      sourceUrls: Object.fromEntries(
        sources.map((s) => [s, SOURCE_URL_BUILDERS[s](rawId)])
      ),
      title: `${title} #${i + 1}`,
      price: { value: price, currency: 'USD' },
      image: {
        imageUrl: `https://i.ebayimg.com/images/g/listing${i}/s-l500.jpg`,
      },
      condition,
      status,
      views,
      categories: [{ categoryId: '625', categoryName: 'Cameras & Photo' }],
    })
  }

  return listings
}

export const mockListingsResponse = {
  total: 40,
  itemSummaries: generateMockListings(40),
}