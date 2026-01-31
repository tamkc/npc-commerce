import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container-page py-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              NPC Commerce
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              AI-powered e-commerce platform with personalized recommendations
              and smart search.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/search"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Search
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Account</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link
                  href="/auth/login"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Order History
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} NPC Commerce. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
