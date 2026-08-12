// Mock data for the Communications tab.
// Swap this for real data once messages are wired up to your listing/platform APIs.

export const listings = [
  {
    id: 'lst-1',
    title: "Vintage Levi's Trucker Jacket",
    price: 65,
    platform: 'ebay',
    status: 'active',
    icon: 'shirt',
  },
  {
    id: 'lst-2',
    title: 'IKEA Kallax Shelf, 4x4',
    price: 40,
    platform: 'facebook',
    status: 'active',
    icon: 'grid',
  },
  {
    id: 'lst-3',
    title: 'Nintendo Switch OLED, used',
    price: 180,
    platform: 'offerup',
    status: 'pending',
    icon: 'gamepad',
  },
  {
    id: 'lst-4',
    title: 'Herman Miller Aeron Chair',
    price: 350,
    platform: 'ebay',
    status: 'active',
    icon: 'chair',
  },
];

export const conversations = [
  {
    id: 'cv-1',
    role: 'selling',
    listingId: 'lst-1',
    platform: 'ebay',
    contactName: 'jmartinez_82',
    unread: 2,
    lastTime: '2026-08-10T14:32:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Hi! Does this run true to size? I usually wear a men\u2019s medium.', time: '2026-08-10T13:58:00' },
      { id: 'm2', sender: 'me', text: 'It runs slightly slim, so a medium should fit fine.', time: '2026-08-10T14:05:00' },
      { id: 'm3', sender: 'buyer', text: 'Perfect, would you take $55 shipped?', time: '2026-08-10T14:30:00' },
      { id: 'm4', sender: 'buyer', text: 'Also, is the collar snap in good shape?', time: '2026-08-10T14:32:00' },
    ],
  },
  {
    id: 'cv-2',
    role: 'selling',
    listingId: 'lst-2',
    platform: 'facebook',
    contactName: 'Priya S.',
    unread: 0,
    lastTime: '2026-08-10T11:15:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Is this still available? I can pick up today.', time: '2026-08-10T10:50:00' },
      { id: 'm2', sender: 'me', text: 'Yep, still available! I\u2019m free after 5pm today.', time: '2026-08-10T11:02:00' },
      { id: 'm3', sender: 'buyer', text: 'Works for me, I\u2019ll message when I\u2019m on my way.', time: '2026-08-10T11:15:00' },
    ],
  },
  {
    id: 'cv-3',
    role: 'selling',
    listingId: 'lst-2',
    platform: 'facebook',
    contactName: 'Dan W.',
    unread: 1,
    lastTime: '2026-08-09T20:04:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Would you split the pair? I only need two cubes.', time: '2026-08-09T20:04:00' },
    ],
  },
  {
    id: 'cv-4',
    role: 'selling',
    listingId: 'lst-3',
    platform: 'offerup',
    contactName: 'switchfan21',
    unread: 0,
    lastTime: '2026-08-09T09:40:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Does it come with the dock and both Joy-Cons?', time: '2026-08-09T09:12:00' },
      { id: 'm2', sender: 'me', text: 'Yes, full set: console, dock, both Joy-Cons, and the case.', time: '2026-08-09T09:20:00' },
      { id: 'm3', sender: 'buyer', text: 'Great, I\u2019ll take it. Meeting at the location you listed?', time: '2026-08-09T09:40:00' },
    ],
  },
  {
    id: 'cv-5',
    role: 'selling',
    listingId: 'lst-4',
    platform: 'ebay',
    contactName: 'office_upgrades',
    unread: 0,
    lastTime: '2026-08-08T16:22:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'What size is this, B or C?', time: '2026-08-08T16:10:00' },
      { id: 'm2', sender: 'me', text: 'It\u2019s a size B, medium frame.', time: '2026-08-08T16:22:00' },
    ],
  },
  {
    id: 'cv-6',
    role: 'selling',
    listingId: 'lst-4',
    platform: 'ebay',
    contactName: 'remote_worker_kt',
    unread: 3,
    lastTime: '2026-08-10T08:05:00',
    messages: [
      { id: 'm1', sender: 'buyer', text: 'Any rips or stains on the mesh?', time: '2026-08-09T19:00:00' },
      { id: 'm2', sender: 'buyer', text: 'Also curious if the arms are fully adjustable.', time: '2026-08-09T19:01:00' },
      { id: 'm3', sender: 'buyer', text: 'Would you do local pickup in Madison to skip shipping?', time: '2026-08-10T08:05:00' },
    ],
  },
];