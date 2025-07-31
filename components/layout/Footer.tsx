
export default function Footer() {
    return (
      <footer className="w-full bg-gray-900 text-white py-6 px-4 text-center text-sm select-none ">
        <p>© {new Date().getFullYear()} Image Processing Service. All rights reserved.</p>
        <p className="mt-2 max-w-lg mx-auto">
          We provide fast, reliable, and easy-to-use image processing tools to help you optimize, enhance, and transform your photos seamlessly.
        </p>
      </footer>
    );
  }
  