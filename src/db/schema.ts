import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  decimal,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ────────────────────────────────────────────────────────────────────
export const productCategoryEnum = pgEnum("product_category", [
  "pen",
  "watch",
  "table",
  "nameplate",
]);

export const serviceCategoryEnum = pgEnum("service_category", [
  "custom_orders",
  "corporate_gifts",
  "flooring",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Products ─────────────────────────────────────────────────────────────────
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: productCategoryEnum("category").notNull(),
  mainCategory: varchar("main_category", { length: 255 }).default("Home Products").notNull(),
  subCategory: varchar("sub_category", { length: 255 }).default("Others").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  stock: integer("stock").default(0).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  relatedProductIds: text("related_product_ids").default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Portfolio ────────────────────────────────────────────────────────────────
export const portfolio = pgTable("portfolio", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  imagePublicId: text("image_public_id"),
  category: varchar("category", { length: 100 }),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  cost: varchar("cost", { length: 100 }),
  place: varchar("place", { length: 255 }),
  review: text("review"),
  socialLink: varchar("social_link", { length: 1000 }),
  additionalImages: text("additional_images"), // JSON string of array of URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Services ─────────────────────────────────────────────────────────────────
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: serviceCategoryEnum("category").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  features: text("features").default(""),
  active: boolean("active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Cart Items ───────────────────────────────────────────────────────────────
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  sessionId: varchar("session_id", { length: 255 }),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Orders ───────────────────────────────────────────────────────────────────
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "set null" }),
  status: orderStatusEnum("status").default("pending").notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Order Items ──────────────────────────────────────────────────────────────
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id, { onDelete: "set null" }),
  quantity: integer("quantity").notNull(),
  priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
  productName: varchar("product_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Hero Video ───────────────────────────────────────────────────────────────
export const heroSettings = pgTable("hero_settings", {
  id: serial("id").primaryKey(),
  videoUrl: text("video_url"),
  videoPublicId: text("video_public_id"),
  headline: varchar("headline", { length: 255 }).default("Crafted With Precision"),
  subheadline: text("subheadline").default("Premium engraved products for every occasion"),
  ctaText: varchar("cta_text", { length: 100 }).default("Shop Now"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Training Banner ──────────────────────────────────────────────────────────
export const trainingBannerSettings = pgTable("training_banner_settings", {
  id: serial("id").primaryKey(),
  mediaUrl: text("media_url"),
  mediaPublicId: text("media_public_id"),
  headline: varchar("headline", { length: 255 }),
  subheadline: text("subheadline"),
  ctaText: varchar("cta_text", { length: 100 }),
  ctaLink: varchar("cta_link", { length: 255 }).default("/trainings"),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).default("918319668016"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Instagram Posts ──────────────────────────────────────────────────────────
export const instagramPosts = pgTable("instagram_posts", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  imagePublicId: text("image_public_id"),
  postLink: varchar("post_link", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Testimonials ─────────────────────────────────────────────────────────────
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5).notNull(),
  avatarUrl: text("avatar_url"),
  avatarPublicId: text("avatar_public_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  mainCategory: varchar("main_category", { length: 255 }).notNull(),
  subCategory: varchar("sub_category", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 1000 }),
  description: text("description"),
  mainSortOrder: integer("main_sort_order").default(0).notNull(),
  subSortOrder: integer("sub_sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Service Categories ───────────────────────────────────────────────────────
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  mainCategory: varchar("main_category", { length: 255 }).notNull(),
  subCategory: varchar("sub_category", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 1000 }),
  description: text("description"),
  mainSortOrder: integer("main_sort_order").default(0).notNull(),
  subSortOrder: integer("sub_sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Trainings ───────────────────────────────────────────────────────────────
export const trainings = pgTable("trainings", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  description: text("description"),
  duration: varchar("duration", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).default("0").notNull(),
  language: varchar("language", { length: 100 }).default("English"),
  seats: integer("seats").default(10),
  imageUrl: varchar("image_url", { length: 1000 }),
  videoUrl: varchar("video_url", { length: 1000 }),
  learnings: text("learnings"),
  fullDetails: text("full_details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Student Success Stories ──────────────────────────────────────────────────
export const studentSuccessStories = pgTable("student_success_stories", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'review', 'video', 'gallery', 'before_after'
  mediaUrl: text("media_url"),
  mediaPublicId: text("media_public_id"),
  secondaryMediaUrl: text("secondary_media_url"),
  secondaryMediaPublicId: text("secondary_media_public_id"),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type StudentSuccessStory = typeof studentSuccessStories.$inferSelect;
export type NewStudentSuccessStory = typeof studentSuccessStories.$inferInsert;

// ─── About Page ───────────────────────────────────────────────────────────────
export const aboutSettings = pgTable("about_settings", {
  id: serial("id").primaryKey(),
  storyTitle: varchar("story_title", { length: 255 }).default("Our Story"),
  storyText: text("story_text").default(""),
  missionTitle: varchar("mission_title", { length: 255 }).default("Our Mission"),
  missionText: text("mission_text").default(""),
  visionTitle: varchar("vision_title", { length: 255 }).default("Our Vision"),
  visionText: text("vision_text").default(""),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const aboutGalleryImages = pgTable("about_gallery_images", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  imagePublicId: text("image_public_id"),
  caption: varchar("caption", { length: 255 }),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aboutPartners = pgTable("about_partners", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }),
  bio: text("bio"),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Blogs ────────────────────────────────────────────────────────────────────
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  imageUrl: varchar("image_url", { length: 1000 }),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Home Categories ──────────────────────────────────────────────────────────
export const homeCategories = pgTable("home_categories", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description").default(""),
  imageUrl: varchar("image_url", { length: 1000 }),
  imagePublicId: text("image_public_id"),
  storeQuery: varchar("store_query", { length: 500 }).default("/store"),
  sortOrder: integer("sort_order").default(0).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Menu Settings ──────────────────────────────────────────────────────────────
export const menuSettings = pgTable("menu_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  visible: boolean("visible").default(true).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Contact Requests ──────────────────────────────────────────────────────────
export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  productInterest: varchar("product_interest", { length: 255 }),
  budget: varchar("budget", { length: 100 }),
  appointmentDate: varchar("appointment_date", { length: 100 }),
  message: text("message"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Types ────────────────────────────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Portfolio = typeof portfolio.$inferSelect;
export type NewPortfolio = typeof portfolio.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type OrderItem = typeof orderItems.$inferSelect;
export type HeroSettings = typeof heroSettings.$inferSelect;
export type ProductCategory = typeof productCategories.$inferSelect;
export type NewProductCategory = typeof productCategories.$inferInsert;
export type AboutSettings = typeof aboutSettings.$inferSelect;
export type AboutGalleryImage = typeof aboutGalleryImages.$inferSelect;
export type AboutPartner = typeof aboutPartners.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type NewBlog = typeof blogs.$inferInsert;
export type HomeCategory = typeof homeCategories.$inferSelect;
export type NewHomeCategory = typeof homeCategories.$inferInsert;
export type MenuSetting = typeof menuSettings.$inferSelect;
export type ContactRequest = typeof contactRequests.$inferSelect;
export type NewContactRequest = typeof contactRequests.$inferInsert;

// ─── Custom Solutions ────────────────────────────────────────────────────────
export const customSolutionsSettings = pgTable("custom_solutions_settings", {
  id: serial("id").primaryKey(),
  heroVideoUrl: text("hero_video_url"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const solutions = pgTable("solutions", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const recentProjects = pgTable("recent_projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  city: varchar("city", { length: 255 }),
  costRange: varchar("cost_range", { length: 255 }),
  timeTaken: varchar("time_taken", { length: 255 }),
  description: text("description"),
  beforeImageUrl: text("before_image_url"),
  afterImageUrl: text("after_image_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customerReviews = pgTable("customer_reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: integer("rating").default(5).notNull(),
  text: text("text").notNull(),
  avatarUrl: text("avatar_url"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const customSolutionsInquiries = pgTable("custom_solutions_inquiries", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 50 }).notNull(), // 'quote' or 'visit'
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  projectType: varchar("project_type", { length: 255 }),
  area: varchar("area", { length: 100 }),
  budget: varchar("budget", { length: 100 }),
  preferredDate: varchar("preferred_date", { length: 100 }),
  preferredTime: varchar("preferred_time", { length: 100 }),
  address: text("address"),
  mapLocation: text("map_location"),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CustomSolutionsSetting = typeof customSolutionsSettings.$inferSelect;
export type Solution = typeof solutions.$inferSelect;
export type NewSolution = typeof solutions.$inferInsert;
export type RecentProject = typeof recentProjects.$inferSelect;
export type NewRecentProject = typeof recentProjects.$inferInsert;
export type CustomerReview = typeof customerReviews.$inferSelect;
export type NewCustomerReview = typeof customerReviews.$inferInsert;
export type CustomSolutionsInquiry = typeof customSolutionsInquiries.$inferSelect;
export type NewCustomSolutionsInquiry = typeof customSolutionsInquiries.$inferInsert;

// ─── Accessories Page ────────────────────────────────────────────────────────
export const accessoriesSettings = pgTable("accessories_settings", {
  id: serial("id").primaryKey(),
  heroVideoUrl: text("hero_video_url"),
  heroVideoPublicId: text("hero_video_public_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const portfolioSettings = pgTable("portfolio_settings", {
  id: serial("id").primaryKey(),
  heroVideoUrl: text("hero_video_url"),
  heroVideoPublicId: text("hero_video_public_id"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const accessoriesKits = pgTable("accessories_kits", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  contains: text("contains").notNull(), // JSON string or comma-separated
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const learningGuides = pgTable("learning_guides", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  imagePublicId: text("image_public_id"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── CRM Settings ─────────────────────────────────────────────────────────────
export const crmSettings = pgTable("crm_settings", {
  id: serial("id").primaryKey(),
  abandonedCartFirstReminderDays: integer("abandoned_cart_first_reminder_days").default(4).notNull(),
  abandonedCartRecurringReminderDays: integer("abandoned_cart_recurring_reminder_days").default(7).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type AccessoriesSetting = typeof accessoriesSettings.$inferSelect;
export type AccessoriesKit = typeof accessoriesKits.$inferSelect;
export type NewAccessoriesKit = typeof accessoriesKits.$inferInsert;
export type LearningGuide = typeof learningGuides.$inferSelect;
export type NewLearningGuide = typeof learningGuides.$inferInsert;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

// ─── Store Hero Images ────────────────────────────────────────────────────────
export const storeHeroImages = pgTable("store_hero_images", {
  id: serial("id").primaryKey(),
  mediaUrl: text("media_url").notNull(),
  mediaPublicId: text("media_public_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export type StoreHeroImage = typeof storeHeroImages.$inferSelect;
export type NewStoreHeroImage = typeof storeHeroImages.$inferInsert;

// ─── Blogs Hero Images ────────────────────────────────────────────────────────
export const blogsHeroImages = pgTable("blogs_hero_images", {
  id: serial("id").primaryKey(),
  mediaUrl: text("media_url").notNull(),
  mediaPublicId: text("media_public_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export type BlogsHeroImage = typeof blogsHeroImages.$inferSelect;
export type NewBlogsHeroImage = typeof blogsHeroImages.$inferInsert;

// ─── Contact Hero Images ──────────────────────────────────────────────────────
export const contactHeroImages = pgTable("contact_hero_images", {
  id: serial("id").primaryKey(),
  mediaUrl: text("media_url").notNull(),
  mediaPublicId: text("media_public_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export type ContactHeroImage = typeof contactHeroImages.$inferSelect;
export type NewContactHeroImage = typeof contactHeroImages.$inferInsert;

// ─── Services Hero Images ─────────────────────────────────────────────────────
export const servicesHeroImages = pgTable("services_hero_images", {
  id: serial("id").primaryKey(),
  mediaUrl: text("media_url").notNull(),
  mediaPublicId: text("media_public_id"),
  title: text("title"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
});

export type ServicesHeroImage = typeof servicesHeroImages.$inferSelect;
export type NewServicesHeroImage = typeof servicesHeroImages.$inferInsert;
