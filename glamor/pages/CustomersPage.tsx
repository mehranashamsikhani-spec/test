import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

const statusStyles: { [key in OrderStatus]: { text: string; bg: string; } } = {
    [OrderStatus.Pending]: { text: 'text-yellow-800', bg: 'bg-yellow-200' },
    [OrderStatus.Confirmed]: { text: 'text-green-800', bg: 'bg-green-200' },
    [OrderStatus.Shipping]: { text: 'text-orange-800', bg: 'bg-orange-200' },
    [OrderStatus.Delivered]: { text: 'text-green-800', bg: 'bg-green-500' },
};

const OrderDetails: React.FC<{order: Order}> = ({order}) => {
    return (
        <div className="bg-stone-200 p-4 rounded-lg mt-2">
            <h4 className="font-semibold text-sm mb-2">جزئیات سفارش</h4>
            <div className="space-y-1 text-sm">
                {order.items.map(item => (
                    <div key={item.id} className="flex justify-between">
                        <span>{item.name} (×{item.quantity})</span>
                        <span>{(item.price * item.quantity).toLocaleString('fa-IR')}</span>
                    </div>
                ))}
            </div>
            <hr className="my-2 border-stone-400" />
            <div className="flex justify-between font-bold">
                <span>جمع کل:</span>
                <span>{order.totalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
        </div>
    )
}

const CustomersPage: React.FC = () => {
  const { orders, updateOrderStatus } = useAppContext();
  const [expandedOrderId, setExpandedOrderId] = React.useState<number | null>(null);

  const toggleOrderDetails = (orderId: number) => {
      setExpandedOrderId(prevId => prevId === orderId ? null : orderId);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">اطلاعات مشتریان و سفارشات</h1>
      {orders.length > 0 ? (
        <div className="space-y-4">
            {[...orders].reverse().map(order => (
                <div key={order.id} className="bg-[#F5F0E8] p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleOrderDetails(order.id)}>
                        <div>
                            <h3 className="font-bold">{order.customer.firstName} {order.customer.lastName}</h3>
                            <p className="text-sm text-[#663C1F]">{order.customer.phone}</p>
                             <p className="text-xs text-stone-600 mt-1">تاریخ: {new Date(order.date).toLocaleDateString('fa-IR')}</p>
                        </div>
                         <div className="flex items-center">
                             <span className={`px-3 py-1 text-xs font-semibold rounded-full hidden sm:block ${statusStyles[order.status].bg} ${statusStyles[order.status].text}`}>
                                {order.status}
                            </span>
                            <span className="font-semibold mx-4">{order.totalPrice.toLocaleString('fa-IR')} تومان</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform ${expandedOrderId === order.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                    {expandedOrderId === order.id && (
                        <div className="mt-4 border-t border-stone-400/50 pt-4">
                            <p><strong>آدرس:</strong> {order.customer.address}</p>
                            <p><strong>کدپستی:</strong> {order.customer.postalCode}</p>
                            <OrderDetails order={order} />
                             <div className="mt-4">
                                <label htmlFor={`status-${order.id}`} className="block text-sm font-medium mb-1">تغییر وضعیت سفارش:</label>
                                <select 
                                    id={`status-${order.id}`}
                                    value={order.status}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        updateOrderStatus(order.id, e.target.value as OrderStatus);
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    className="block w-full md:w-auto p-2 border border-gray-300 rounded-md shadow-sm bg-white"
                                >
                                    {Object.values(OrderStatus).map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
      ) : (
         <div className="bg-[#F5F0E8] p-8 rounded-lg shadow text-center">
            <p>هنوز هیچ سفارشی ثبت نشده است.</p>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;