export interface Product {
  id: string; // Unique ID for keying in React lists
  name: string;
  category: string;
  price: number;
}

export type ProductCategory = 'مواد غذائية' | 'هدايا' | 'خدمة' | 'رصيد موبايل';

// If you needed to track quantity or other offer-specific details
// export interface OfferItem extends Product {
//   quantity: number;
// }
