
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3D2412] text-stone-200 text-center p-6 w-full">
      <div className="container mx-auto">
        <h3 className="text-xl font-bold mb-4 text-white">GLAMOR</h3>
        <div className="space-y-2 mb-4">
          <p>آدرس: گرمسار خیابان خالدی بوتیک گلامور</p>
          <p>شماره تماس: ۰۲۱-۱۲۳۴۵۶۷۸</p>
        </div>
        <div className="flex justify-center space-x-4 space-x-reverse">
          <a href="#" className="hover:text-white">اینستاگرام</a>
          <a href="#" className="hover:text-white">تلگرام</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;