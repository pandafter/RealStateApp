export type Property = {
    id: string;
    idOwner: string;
    name: string;
    address: string;
    price: number;
    codeInternal: string;
    year: number;
    imageUrl?: string;
    createdAt?: string;
  };
  
  export type PropertiesResponse = {
    items: Property[];
    total: number;
    page: number;
    size: number;
  };


  export type PropertyFilter = {
    name?: string;
    address?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: number;
    size?: number;
  }

  export type PropertyImage = {
    id: string;
    idProperty: string;
    file: string;
    enabled: boolean;
    createdAt: string;
  };