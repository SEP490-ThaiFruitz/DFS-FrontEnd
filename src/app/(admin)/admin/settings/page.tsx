import Link from 'next/link'
import React from 'react'

function SettingsPage() {
  return (
    <div className="flex">
      <div className="w-64 bg-gray-50 p-4 h-screen">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/company" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded">
                <span className="mr-2">🏢</span> Company
              </Link>
            </li>
            <li>
              <Link href="/site" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded">
                <span className="mr-2">🌐</span> Site
              </Link>
            </li>
            <li>
              <Link href="/delivery-zones" className="flex items-center p-2 text-gray-700 hover:bg-gray-200 rounded">
                <span className="mr-2">🚚</span> Delivery Zones
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="flex-1 p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Company</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name *</label>
            <input
              type="text"
              value="StoreKing - Grocery App with eCommerce Website & Admin Panel"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              readOnly
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                value="info@nilabs.net"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                value="+880133384628"
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                readOnly
              />
            </div>
          </div>
          {/* Add more form fields for Website, City, State, etc., as shown in the screenshot */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address *</label>
            <textarea
              value="House: 25, Road No: 2, Block A, Mirpur-1, Dhaka 1216"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              readOnly
            />
          </div>
        </form>
      </div>
    </div>
  )
}

export default SettingsPage