export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 py-4 border-t border-gray-200">
      <div className="container mx-auto text-center">
        <p className="mb-2">
          © {new Date().getFullYear()} My Website. All rights reserved.
        </p>
        <ul className="flex justify-center space-x-4">
          <li>
            <a className="hover:text-blue-500">Home</a>
          </li>
          <li>
            <a className="hover:text-blue-500">About</a>
          </li>
          <li>
            <a className="hover:text-blue-500">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
