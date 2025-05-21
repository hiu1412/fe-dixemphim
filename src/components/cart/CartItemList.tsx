import CartItem from "./CartItem";

interface CartItemListProps {
  items: Array<{
    product: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  }>;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartItemList({ items, onUpdateQuantity, onRemoveItem }: CartItemListProps) {
  return (
    <div className="divide-y">
      {items.map((item, index) => (
        <CartItem 
          key={`${item.product}-${index}`}
          item={item}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}