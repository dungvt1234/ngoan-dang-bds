export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  tags?: string[];
  size: "small" | "medium" | "large";
  aspect: "square" | "portrait" | "landscape";
  description?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  image: string;
  count: number;
}

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  role?: string;
  avatar?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  icon?: string;
}

export interface Stat {
  /** Numeric value to count up to */
  value: number;
  /** Suffix rendered after the number, e.g. "+" or "%" */
  suffix?: string;
  label: string;
}
