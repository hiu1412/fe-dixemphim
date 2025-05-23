import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartItemProps {
  item: {
    product: string;
    productName: string;
    productImage: string;
    price: number;
    quantity: number;
  };
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemoveItem }: CartItemProps) {
  // Handler cho input change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(item.product, value);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 py-6 items-center gap-4">
      {/* Product info */}
      <div className="col-span-1 md:col-span-6 flex items-center gap-4">
        <div className="relative w-20 h-20 aspect-square rounded bg-muted/20 overflow-hidden">
          <Image 
            src={item.productImage} 
            alt={item.productName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{item.productName}</h3>
          {/* Mobile only price */}
          <div className="md:hidden mt-1 text-muted-foreground">
            {formatPrice(item.price)}
          </div>
        </div>
        {/* Remove button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onRemoveItem(item.product)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Price - Desktop */}
      <div className="hidden md:block md:col-span-2 text-center">
        {formatPrice(item.price)}
      </div>
      
      {/* Quantity */}
      <div className="col-span-1 md:col-span-2 flex justify-center">
        <div className="flex items-center border rounded-md overflow-hidden">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onUpdateQuantity(item.product, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <Input
            type="number" 
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 h-8 text-center border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-none"
            onClick={() => onUpdateQuantity(item.product, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {/* Total */}
      <div className="col-span-1 md:col-span-2 text-center font-medium">
        {formatPrice(item.price * item.quantity)}
      </div>
    </div>
  );
}