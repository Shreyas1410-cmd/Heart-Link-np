export function Footer() {
  return (
    <footer className="bg-foreground text-neutral-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">HeartLink</h3>
            <p className="text-sm text-neutral-medium">Connecting generations through meaningful conversations</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Security
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-primary transition">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-neutral-dark pt-8 text-center text-sm text-neutral-medium">
          <p>&copy; 2025 HeartLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
