export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  productName: string;
}

export interface Order {
  _id: string;
  customer: string;
  time: string;
  items: OrderItem[];
  total: number;
  status: string;
  email: string;
  reference: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export interface DateRange {
  start: string;
  end: string;
}