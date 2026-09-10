export interface Milestone {
  count: number;
  label: string;
}

export interface Customer {
  name: string;
  phone: string;
  visits: number;
  tier: "Bronze" | "Silver" | "Gold";
  lastVisit: string;
}

export interface Business {
  id: string;
  name: string;
  location: string;
  contactEmail: string;
  contactPhone: string;
  milestones: Milestone[];
  customers: Customer[];
  pin: string;
}

const BUSINESSES: Record<string, Business> = {
  kaapi: {
    id: "kaapi",
    name: "Kaapi House",
    location: "Indiranagar, Bengaluru",
    contactEmail: "hello@kaapihouse.in",
    contactPhone: "98765 43210",
    milestones: [
      { count: 5, label: "Free coffee" },
      { count: 10, label: "20% off the bill" },
      { count: 15, label: "Free dessert" },
    ],
    customers: [
      { name: "Priya S.", phone: "98765 43210", visits: 12, tier: "Silver", lastVisit: "Today" },
      { name: "Arjun K.", phone: "91234 56789", visits: 8, tier: "Bronze", lastVisit: "2 Sep" },
      { name: "Meera R.", phone: "99887 76655", visits: 15, tier: "Gold", lastVisit: "28 Aug" },
      { name: "Vikram P.", phone: "90012 34567", visits: 3, tier: "Bronze", lastVisit: "21 Aug" },
      { name: "Sneha M.", phone: "97654 32109", visits: 6, tier: "Bronze", lastVisit: "15 Aug" },
    ],
    pin: "4821",
  },
  chai: {
    id: "chai",
    name: "Chai Point",
    location: "Bandra, Mumbai",
    contactEmail: "hi@chaipoint.com",
    contactPhone: "91234 56789",
    milestones: [
      { count: 4, label: "Free chai" },
      { count: 8, label: "Free samosa" },
      { count: 12, label: "25% off" },
    ],
    customers: [
      { name: "Rahul D.", phone: "91234 56789", visits: 10, tier: "Silver", lastVisit: "Today" },
      { name: "Ananya T.", phone: "92345 67890", visits: 4, tier: "Bronze", lastVisit: "1 Sep" },
      { name: "Karthik V.", phone: "93456 78901", visits: 12, tier: "Gold", lastVisit: "25 Aug" },
    ],
    pin: "4821",
  },
  blue: {
    id: "blue",
    name: "Blue Tokai",
    location: "Hauz Khas, Delhi",
    contactEmail: "delhi@bluetokai.com",
    contactPhone: "93456 78901",
    milestones: [
      { count: 5, label: "Free cold brew" },
      { count: 10, label: "Free pastry" },
      { count: 15, label: "30% off" },
    ],
    customers: [
      { name: "Nisha G.", phone: "93456 78901", visits: 18, tier: "Gold", lastVisit: "Today" },
      { name: "Amit J.", phone: "94567 89012", visits: 7, tier: "Bronze", lastVisit: "3 Sep" },
      { name: "Pooja K.", phone: "95678 90123", visits: 14, tier: "Silver", lastVisit: "20 Aug" },
      { name: "Sanjay L.", phone: "96789 01234", visits: 2, tier: "Bronze", lastVisit: "10 Sep" },
    ],
    pin: "4821",
  },
};

export function getBusiness(id: string): Business | undefined {
  return BUSINESSES[id];
}

export function getAllBusinesses(): Pick<Business, "id" | "name" | "location" | "customers">[] {
  return Object.values(BUSINESSES).map((b) => ({
    id: b.id,
    name: b.name,
    location: b.location,
    customers: b.customers,
  }));
}
