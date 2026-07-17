import { db } from "../src/db";
import { portfolio } from "../src/db/schema";
import { sql } from "drizzle-orm";

const dummyData = [
  {
    title: "Luxury Ocean Resin Table",
    description: "A stunning piece for any dining room, featuring deep ocean blue epoxy resin running through premium walnut wood.",
    category: "Epoxy Table",
    subCategory: "Home",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800",
    cost: "₹1,20,000",
    place: "Mumbai, MH",
    review: "Absolutely breathtaking. The centerpiece of our new dining room. The craftsmanship is flawless.",
    clientExperience: "The team was highly professional, delivering exactly what was designed in the 3D mockups. Highly recommended.",
    sortOrder: 1,
  },
  {
    title: "Commercial Metallic Flooring",
    description: "Durable and aesthetic metallic epoxy flooring for high-traffic commercial spaces.",
    category: "Epoxy Flooring",
    subCategory: "Commercial",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=800",
    cost: "₹4,50,000",
    place: "Bengaluru, KA",
    review: "Transformed our office lobby. Customers compliment it every day.",
    clientExperience: "Installation was quick and didn't disrupt our business operations.",
    sortOrder: 2,
  },
  {
    title: "Minimalist Wall Clock",
    description: "A beautiful fusion of olive wood and white pearlescent epoxy.",
    category: "Epoxy Clock",
    subCategory: "Home",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&q=80&w=800",
    cost: "₹8,500",
    place: "Pune, MH",
    review: "Perfect addition to our living room wall.",
    clientExperience: "Shipped securely and arrived on time.",
    sortOrder: 3,
  },
  {
    title: "Abstract River Wall Art",
    description: "Large scale wall art combining multiple resin pouring techniques.",
    category: "Epoxy Wall Art",
    subCategory: "Commercial",
    featured: true,
    imageUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800",
    cost: "₹45,000",
    place: "Delhi",
    review: "Creates an amazing focal point for our conference room.",
    clientExperience: "Great collaboration during the design phase to match our brand colors.",
    sortOrder: 4,
  },
  {
    title: "Live Edge Coffee Table",
    description: "Rustic live edge coffee table with clear epoxy resin filling natural voids.",
    category: "Epoxy Table",
    subCategory: "Home",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
    cost: "₹35,000",
    place: "Hyderabad, TS",
    review: "Beautiful table, exactly what we wanted for our modern rustic living room.",
    clientExperience: "Very responsive and provided updates throughout the building process.",
    sortOrder: 5,
  },
  {
    title: "Warehouse Epoxy Floor",
    description: "Heavy duty epoxy coating for industrial warehouse.",
    category: "Epoxy Flooring",
    subCategory: "Commercial",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356f12?auto=format&fit=crop&q=80&w=800",
    cost: "₹8,00,000",
    place: "Chennai, TN",
    review: "Extremely durable, handles forklift traffic easily.",
    clientExperience: "Professional crew, completed the large project on schedule.",
    sortOrder: 6,
  },
  {
    title: "Galaxy Theme Clock",
    description: "Deep space themed epoxy clock with glowing elements.",
    category: "Epoxy Clock",
    subCategory: "Home",
    featured: false,
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
    cost: "₹12,000",
    place: "Kochi, KL",
    review: "Looks amazing at night with the subtle glow.",
    clientExperience: "Unique piece, safely packaged.",
    sortOrder: 7,
  }
];

async function seed() {
  console.log("Clearing existing portfolio data...");
  await db.delete(portfolio);
  
  console.log("Inserting dummy data...");
  for (const item of dummyData) {
    await db.insert(portfolio).values(item);
  }
  
  console.log("Successfully seeded portfolio data!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
