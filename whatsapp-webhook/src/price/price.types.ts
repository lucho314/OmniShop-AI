export interface VendureVariant {
  id: string;
  name: string;
  priceWithTax: number; // en centavos
  currencyCode: string; // ej: "USD" | "ARS"
}

export interface VendureProduct {
  id: string;
  name: string;
  variants: VendureVariant[];
}

export interface VendureProductsResponse {
  data: {
    products: {
      items: VendureProduct[];
    };
  };
}
