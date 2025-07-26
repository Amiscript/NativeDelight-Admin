export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer: string;
  time: string;
  items: OrderItem[];
  total: number;
  status: string;
}

export interface DateRange {
  start: string;
  end: string;
}