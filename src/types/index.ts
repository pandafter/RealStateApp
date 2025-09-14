export type Property = {
    id: string;
    idOwner: string;
    name: string;
    address: string;
    price: number;
    imageUrl: string;
  };
  
  export type PropertiesResponse = {
    items: Property[];
    total: number;
    page: number;
    size: number;
  };
  