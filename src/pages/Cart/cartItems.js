import { Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import Image from 'next/image';

export default function CartItem({ item }) {
    const dispatch = useDispatch();

    if (!item) {
        return null;
    }

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity < 1) return;
        dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    };

    const handleRemoveItem = () => {
        dispatch(removeFromCart(item.id));
        toast.info('Item removed from cart');
    };

    return (
        <tr>
            <td>
                <div className="d-flex align-items-center">
                    <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                        <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded"
                        />
                    </div>
                    <span className="ms-3">{item.name}</span>
                </div>
            </td>
            <td className="align-middle">${item.price?.toFixed(2)}</td>
            <td className="align-middle">
                <div className="d-flex align-items-center">
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.quantity - 1)}
                        disabled={item.quantity <= 1}
                    >-</Button>
                    <span className="mx-3">{item.quantity}</span>
                    <Button
                        size="sm"
                        variant="outline-secondary"
                        onClick={() => handleQuantityChange(item.quantity + 1)}
                    >+</Button>
                </div>
            </td>
            <td className="align-middle">
                ${(item.price * item.quantity).toFixed(2)}
            </td>
            <td className="align-middle">
                <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={handleRemoveItem}
                >
                    Remove
                </Button>
            </td>
        </tr>
    );
}