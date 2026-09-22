import { Property, Testimonial, NavLink, Service } from "@/types";

export const navLinks: NavLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Dự án", href: "/du-an" },
  { label: "Kiến thức", href: "/kien-thuc" },
  { label: "Phân tích", href: "/phan-tich" },
  { label: "Case Study", href: "/case-study" },
  { label: "Tin tức & Sự kiện", href: "/tin-tuc" },
  { label: "Về Ngoan", href: "/ve-ngoan" },
];

export const featuredProperties: Property[] = [
  {
    id: "1",
    title: "The Forest Residence",
    location: "Da Nang, Vietnam",
    price: "$2.4M",
    image: "/images/hero-choice.jpg",
    tags: ["Modern", "Forest View"],
    size: "large",
    aspect: "landscape",
    description: "A modern concrete masterpiece nestled in lush tropical forest.",
    beds: 4,
    baths: 3,
    sqft: 3200,
  },
  {
    id: "2",
    title: "Mist Valley Villa",
    location: "Da Lat, Vietnam",
    price: "$1.8M",
    image: "/images/hero-cabin-mist.jpg",
    tags: ["Contemporary", "Mountain"],
    size: "medium",
    aspect: "portrait",
    description: "Where fog meets architecture in perfect harmony.",
    beds: 3,
    baths: 2,
    sqft: 2400,
  },
  {
    id: "3",
    title: "Coastal Serenity",
    location: "Nha Trang, Vietnam",
    price: "$3.2M",
    image: "/images/hero-forest-overcast.jpg",
    tags: ["Luxury", "Ocean View"],
    size: "small",
    aspect: "square",
    description: "Oceanfront living with panoramic coastal views.",
    beds: 5,
    baths: 4,
    sqft: 4100,
  },
  {
    id: "4",
    title: "Urban Forest Loft",
    location: "Ho Chi Minh City, Vietnam",
    price: "$890K",
    image: "/images/hero-cabin-dark.jpg",
    tags: ["Industrial", "Urban"],
    size: "medium",
    aspect: "landscape",
    description: "Industrial chic meets urban greenery in the heart of the city.",
    beds: 2,
    baths: 2,
    sqft: 1600,
  },
];

export const collections = [
  {
    id: "modern-forest",
    name: "Modern Forest",
    description: "Concrete and glass harmonizing with ancient trees",
    image: "/images/hero-forest.jpg",
    count: 12,
  },
  {
    id: "coastal-minimal",
    name: "Coastal Minimal",
    description: "Clean lines meeting ocean horizons",
    image: "/images/hero-cabin-mist.jpg",
    count: 8,
  },
  {
    id: "urban-oasis",
    name: "Urban Oasis",
    description: "Green sanctuaries within the city",
    image: "/images/hero-forest-overcast.jpg",
    count: 15,
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    text: "The attention to detail is extraordinary. Every angle reveals something new, something intentional.",
    author: "Sarah Chen",
    role: "Architect, Studio Chen",
  },
  {
    id: "2",
    text: "Living here feels like being inside a work of art that somehow also feels like home.",
    author: "Marcus Webb",
    role: "Homeowner",
  },
  {
    id: "3",
    text: "They understood that we wanted silence, space, and light — and delivered beyond expectation.",
    author: "Linh Nguyen",
    role: "Interior Designer",
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Architectural Curation",
    description: "We source and present properties that meet our exacting standards for design excellence.",
    image: "/images/hero-forest.jpg",
  },
  {
    id: "2",
    title: "Design Consultation",
    description: "Our team of architects helps you visualize and personalize your future space.",
    image: "/images/hero-cabin-mist.jpg",
  },
  {
    id: "3",
    title: "Seamless Acquisition",
    description: "From first viewing to final keys, we handle every detail with precision.",
    image: "/images/hero-cabin-dark.jpg",
  },
];
