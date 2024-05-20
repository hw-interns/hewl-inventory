interface ItemProps {
  id: string;
  name: string;
  location: string;
  quantity: number;
  min_quantity: number;
  tags: string;
  description?: string;
  links?: string[];
}

export default ItemProps;
