const TITLES = [
  'Canon AE-1 35mm Film Camera',
  'Nikon FM2 Camera Body Only',
  'Polaroid SX-70 Instant Camera',
  'Sony Alpha a6400 Mirrorless Camera',
  'Pentax K1000 35mm SLR Camera Kit',
  'GoPro Hero 9 Black Action Camera',
  'Fujifilm Instax Mini 11 Instant Camera',
  'Canon EOS Rebel T7 DSLR',
  'Olympus OM-1 35mm Film Camera',
  'Leica M6 Rangefinder Camera',
  'Sony Cybershot Point and Shoot',
  'DJI Osmo Pocket Gimbal Camera',
  'Kodak Disposable Film Camera 3-Pack',
  'Panasonic Lumix GH5 Mirrorless',
  'Canon PowerShot G7X Mark III',
  'Vintage Polaroid Land Camera',
  'Nikon D3500 DSLR with Lens',
  'Yashica Electro 35 Rangefinder',
  'Insta360 X3 360 Camera',
  'Minolta X-700 35mm SLR',
]

const CONDITIONS = ['New', 'Used', 'Certified - Refurbished']

const SELLERS = [
  'vintagelensco',
  'retrocamerashop',
  'instantfilmfan',
  'electronicswarehouse',
  'filmcamerasupply',
  'techdealsdirect',
  'shutterbugoutlet',
  'oldschoolcameras',
  'lensandlightco',
  'pixelperfectgear',
]

const SOURCES = ['ebay', 'facebook', 'offerup']

const SOURCE_URL_BUILDERS = {
  ebay: (id) => `https://www.ebay.com/itm/${id}`,
  facebook: (id) => `https://www.facebook.com/marketplace/item/${id}`,
  offerup: (id) => `https://offerup.com/item/detail/${id}`,
}

// Simple deterministic pseudo-random generator so data is stable across reloads
function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}

function generateMockItems(count) {
  const rand = seededRandom(42)
  const items = []

  for (let i = 0; i < count; i++) {
    const title = TITLES[Math.floor(rand() * TITLES.length)]
    const condition = CONDITIONS[Math.floor(rand() * CONDITIONS.length)]
    const seller = SELLERS[Math.floor(rand() * SELLERS.length)]
    const source = SOURCES[Math.floor(rand() * SOURCES.length)]
    const price = (20 + rand() * 980).toFixed(2) // $20 - $1000
    const feedback = (90 + rand() * 10).toFixed(1) // 90.0 - 100.0
    const rawId = `1234567890${i.toString().padStart(2, '0')}`

    // ~65% of listings offer local pickup and have a distance from the user.
    // The rest are ship-only/national listings with no location data.
    const hasLocalPickup = rand() < 0.65
    const distanceMiles = hasLocalPickup
      ? Number((0.5 + rand() * 59.5).toFixed(1)) // 0.5 - 60 miles
      : null

    items.push({
      itemId: `${source}|${rawId}|0`,
      source,
      title: `${title} #${i + 1}`,
      price: { value: price, currency: 'USD' },
      image: { imageUrl: `https://i.ebayimg.com/images/g/fake${i}/s-l500.jpg` },
      itemWebUrl: SOURCE_URL_BUILDERS[source](rawId),
      condition,
      categories: [{ categoryId: '625', categoryName: 'Cameras & Photo' }],
      seller: { username: seller, feedbackPercentage: feedback },
      distanceMiles,
    })
  }

  return items
}

export const mockEbayResponse = {
  href: 'https://api.ebay.com/buy/browse/v1/item_summary/search?q=camera',
  total: 100,
  itemSummaries: generateMockItems(100),
}