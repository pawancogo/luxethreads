import React from 'react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Online Shopping */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">
              Online Shopping
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Men</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Women</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Kids</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Home & Living</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Beauty</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Gift Cards</a></li>
            </ul>
          </div>

          {/* Customer Policies */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">
              Customer Policies
            </h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">FAQ</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">T&C</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Terms Of Use</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Track Orders</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Shipping</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Cancellation</a></li>
              <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Returns</a></li>
            </ul>
          </div>

          {/* Experience App */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-4">
              Experience App
            </h3>
            <div className="flex space-x-3 mb-6">
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=120&h=40&fit=crop" alt="Google Play" className="h-10" />
              <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=120&h=40&fit=crop" alt="App Store" className="h-10" />
            </div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Keep in Touch</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Guarantee */}
          <div>
            <div className="flex items-start space-x-3 mb-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">100% Original</h4>
                <p className="text-xs text-gray-600">guarantee for all products at FashionStore.com</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Return within 30days</h4>
                <p className="text-xs text-gray-600">of receiving your order</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Searches */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">POPULAR SEARCHES</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'Kurta Pajama', 'Sarees', 'Ethnic Wear', 'Formal Shirts', 'Casual Shirts',
              'Jeans', 'Dresses', 'Tops', 'Kurtis', 'Leggings', 'Shoes', 'Bags'
            ].map((search) => (
              <span key={search} className="text-xs text-gray-600 hover:text-gray-900 cursor-pointer">
                {search} |
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xs text-gray-600 mb-2 md:mb-0">
              © 2024 FashionStore.com. All rights reserved.
            </div>
            <div className="flex space-x-6 text-xs text-gray-600">
              <a href="#" className="hover:text-gray-900">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900">Terms & Conditions</a>
              <a href="#" className="hover:text-gray-900">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;