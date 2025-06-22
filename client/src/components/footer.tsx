export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="mb-2">© {new Date().getFullYear()} My Website. All rights reserved.</p>
        <ul className="flex justify-center space-x-4">
          <li>
            <a className="hover:text-gray-400">Home</a>
          </li>
          <li>
            <a className="hover:text-gray-400">About</a>
          </li>
          <li>
            <a className="hover:text-gray-400">Contact</a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
