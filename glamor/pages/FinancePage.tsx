import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { FinancialEntry, PaymentMethod } from '../types';

const KpiCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg shadow ${color}`}>
    <h3 className="text-sm text-gray-700">{title}</h3>
    <p className="text-2xl font-bold text-gray-900">{value}</p>
  </div>
);

const DailySalesReportForm: React.FC = () => {
    const { addFinancialEntry, bankAccounts } = useAppContext();
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<{id: number, description: string, amount: string}[]>([]);
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemAmount, setNewItemAmount] = useState('');

    const [cashAmount, setCashAmount] = useState('0');
    const [cardAmount, setCardAmount] = useState('0');
    const [creditAmount, setCreditAmount] = useState('0');
    const [bankAccountId, setBankAccountId] = useState<string>(bankAccounts[0]?.id.toString() || '');

    const totalSales = useMemo(() => items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0), [items]);
    const totalPaid = useMemo(() => (Number(cashAmount) || 0) + (Number(cardAmount) || 0) + (Number(creditAmount) || 0), [cashAmount, cardAmount, creditAmount]);
    const remainingToAllocate = totalSales - totalPaid;

    const handleAddItem = () => {
        if (!newItemDesc.trim() || !newItemAmount || Number(newItemAmount) <= 0) return;
        setItems(prev => [...prev, { id: Date.now(), description: newItemDesc.trim(), amount: newItemAmount }]);
        setNewItemDesc('');
        setNewItemAmount('');
    };

    const handleRemoveItem = (id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) {
            alert('لطفاً حداقل یک مورد فروش را اضافه کنید.');
            return;
        }
        if (totalSales !== totalPaid) {
            alert('مجموع مبالغ نقدی، کارت و نسیه باید با جمع فروش روزانه برابر باشد.');
            return;
        }
        if (!date) {
            alert('لطفاً تاریخ گزارش را انتخاب کنید.');
            return;
        }

        const entryDate = new Date(date).toISOString();

        if (Number(cashAmount) > 0) {
            addFinancialEntry({
                date: entryDate, type: 'in-person', description: `فروش حضوری - نقدی`,
                totalAmount: Number(cashAmount), discountAmount: 0, finalAmount: Number(cashAmount), paymentMethod: 'cash',
            });
        }
        if (Number(cardAmount) > 0) {
            addFinancialEntry({
                date: entryDate, type: 'in-person', description: `فروش حضوری - کارت`,
                totalAmount: Number(cardAmount), discountAmount: 0, finalAmount: Number(cardAmount), paymentMethod: 'card', bankAccountId: Number(bankAccountId),
            });
        }
        if (Number(creditAmount) > 0) {
            addFinancialEntry({
                date: entryDate, type: 'in-person', description: `فروش حضوری - نسیه`,
                totalAmount: Number(creditAmount), discountAmount: 0, finalAmount: Number(creditAmount), paymentMethod: 'credit',
            });
        }
        
        // Reset form
        setItems([]);
        setCashAmount('0');
        setCardAmount('0');
        setCreditAmount('0');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-stone-200 p-4 rounded-lg space-y-4 mb-8">
            <h3 className="text-lg font-bold">ثبت گزارش فروش روزانه</h3>
            <div>
                <label htmlFor="reportDate" className="block text-sm font-medium mb-1">تاریخ گزارش</label>
                <input id="reportDate" type="date" value={date} onChange={e => setDate(e.target.value)} required className="w-full p-2 border rounded"/>
            </div>
            
            <div className="border border-stone-300 p-3 rounded-md space-y-2">
                <h4 className="font-semibold">۱. ثبت ریز فروش‌ها</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center bg-white p-2 rounded">
                            <span>{item.description}</span>
                            <div className="flex items-center gap-2">
                                <span className="font-mono">{Number(item.amount).toLocaleString('fa-IR')}</span>
                                <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 font-bold">&times;</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 items-center pt-2 border-t">
                    <input type="text" placeholder="شرح کالا (مثال: ۱ شلوار)" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} className="flex-grow p-2 border rounded"/>
                    <input type="number" placeholder="مبلغ" value={newItemAmount} onChange={e => setNewItemAmount(e.target.value)} className="w-32 p-2 border rounded"/>
                    <button type="button" onClick={handleAddItem} className="bg-[#895129] text-white px-3 py-2 rounded">افزودن</button>
                </div>
                <div className="text-left font-bold mt-2 pr-2">جمع فروش: {totalSales.toLocaleString('fa-IR')} تومان</div>
            </div>

            <div className="border border-stone-300 p-3 rounded-md space-y-2">
                <h4 className="font-semibold">۲. تفکیک پرداخت</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <input type="number" value={cashAmount} onChange={e => setCashAmount(e.target.value)} className="w-full p-2 border rounded" placeholder="مبلغ نقدی" />
                    <input type="number" value={cardAmount} onChange={e => setCardAmount(e.target.value)} className="w-full p-2 border rounded" placeholder="مبلغ کارت" />
                    <input type="number" value={creditAmount} onChange={e => setCreditAmount(e.target.value)} className="w-full p-2 border rounded" placeholder="مبلغ نسیه" />
                </div>
                 {totalSales > 0 && remainingToAllocate !== 0 && (
                     <p className={`text-center text-sm p-2 rounded ${remainingToAllocate > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                         مبلغ باقی‌مانده برای تخصیص: {remainingToAllocate.toLocaleString('fa-IR')}
                     </p>
                 )}
            </div>

            <button type="submit" disabled={items.length === 0 || totalSales !== totalPaid} className="w-full bg-[#3D2412] text-white p-2 rounded hover:bg-[#663C1F] disabled:bg-gray-400">ثبت گزارش</button>
        </form>
    );
};


const FinancePage: React.FC = () => {
  const { financialEntries, bankAccounts, orders } = useAppContext();
  const [activeTab, setActiveTab] = useState<'online' | 'in-person'>('online');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredEntries = useMemo(() => {
    return financialEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      if (start && entryDate < start) return false;
      if (end) {
        end.setHours(23, 59, 59, 999); // Include the whole end day
        if (entryDate > end) return false;
      }
      return true;
    });
  }, [financialEntries, startDate, endDate]);

  const kpis = useMemo(() => {
    const totalSales = filteredEntries.reduce((sum, e) => sum + e.totalAmount, 0);
    const totalDiscounts = filteredEntries.reduce((sum, e) => sum + e.discountAmount, 0);
    const netRevenue = totalSales - totalDiscounts;
    return { totalSales, totalDiscounts, netRevenue };
  }, [filteredEntries]);

  const monthlySales = useMemo(() => {
    const sales: { [key: string]: number } = {};
    filteredEntries.forEach(entry => {
        const month = new Date(entry.date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long'});
        if (!sales[month]) sales[month] = 0;
        sales[month] += entry.finalAmount;
    });
    return sales;
  }, [filteredEntries]);
  
  const getCustomerName = (orderId?: number) => {
    if(!orderId) return '-';
    const order = orders.find(o => o.id === orderId);
    return order ? `${order.customer.firstName} ${order.customer.lastName}` : 'نامشخص'
  };

  const paymentMethodText: {[key in PaymentMethod]: string} = { card: 'کارت', cash: 'نقدی', credit: 'نسیه' };


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">حسابداری مالی</h1>
      
      <div className="bg-[#F5F0E8] p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-bold mb-4">فیلتر زمانی</h2>
        <div className="flex flex-col md:flex-row gap-4">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full p-2 border rounded" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full p-2 border rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <KpiCard title="جمع فروش" value={new Intl.NumberFormat('fa-IR').format(kpis.totalSales)} color="bg-blue-200" />
        <KpiCard title="تخفیف ها" value={new Intl.NumberFormat('fa-IR').format(kpis.totalDiscounts)} color="bg-yellow-200" />
        <KpiCard title="درآمد خالص" value={new Intl.NumberFormat('fa-IR').format(kpis.netRevenue)} color="bg-green-200" />
      </div>

      <div className="bg-[#F5F0E8] p-4 rounded-lg shadow mb-8">
          <h2 className="text-lg font-bold mb-2">فروش ماهانه</h2>
          {Object.keys(monthlySales).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(monthlySales).map(([month, amount]) => (
                <div key={month} className="flex justify-between text-sm bg-stone-200 p-2 rounded">
                    <span>{month}</span>
                    {/* FIX: Cast amount to number to resolve TS error */}
                    <span className="font-semibold">{new Intl.NumberFormat('fa-IR').format(amount as number)} تومان</span>
                </div>
              ))}
            </div>
          ) : <p className="text-center text-sm text-gray-600">داده ای برای نمایش وجود ندارد.</p>}
      </div>

      <div className="mb-4 flex border-b-2 border-[#895129]">
        <button onClick={() => setActiveTab('online')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'online' ? 'bg-[#895129] text-white rounded-t-lg' : 'text-[#663C1F]'}`}>فروش آنلاین</button>
        <button onClick={() => setActiveTab('in-person')} className={`px-4 py-2 text-lg font-semibold ${activeTab === 'in-person' ? 'bg-[#895129] text-white rounded-t-lg' : 'text-[#663C1F]'}`}>فروش حضوری</button>
      </div>

      {activeTab === 'in-person' && <DailySalesReportForm />}

      <div className="bg-[#F5F0E8] shadow rounded-lg overflow-x-auto">
        <table className="w-full min-w-max text-sm">
            <thead className="bg-[#895129] text-stone-200">
                <tr>
                    <th className="p-3 text-right">تاریخ</th>
                    <th className="p-3 text-right">شرح</th>
                    <th className="p-3 text-right">مبلغ کل</th>
                    <th className="p-3 text-right">تخفیف</th>
                    <th className="p-3 text-right">مبلغ نهایی</th>
                    <th className="p-3 text-right">حساب</th>
                </tr>
            </thead>
            <tbody>
                {filteredEntries.filter(e => e.type === activeTab).map(entry => (
                    <tr key={entry.id} className="border-b">
                        <td className="p-2">{new Date(entry.date).toLocaleDateString('fa-IR')}</td>
                        <td className="p-2">
                          {entry.description}
                          {entry.type === 'online' && <div className="text-xs text-gray-600">{getCustomerName(entry.orderId)}</div>}
                        </td>
                        <td className="p-2">{new Intl.NumberFormat('fa-IR').format(entry.totalAmount)}</td>
                        <td className="p-2 text-red-600">{entry.discountAmount > 0 ? new Intl.NumberFormat('fa-IR').format(entry.discountAmount) : '-'}</td>
                        <td className="p-2 font-semibold">{new Intl.NumberFormat('fa-IR').format(entry.finalAmount)}</td>
                        <td className="p-2">
                          {paymentMethodText[entry.paymentMethod]}
                          {entry.bankAccountId && <div className="text-xs text-gray-600">{bankAccounts.find(b => b.id === entry.bankAccountId)?.name}</div>}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        {filteredEntries.filter(e => e.type === activeTab).length === 0 && <p className="text-center p-4">هیچ تراکنشی در این بازه یافت نشد.</p>}
      </div>

    </div>
  );
};

export default FinancePage;