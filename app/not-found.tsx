export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 gradient-text">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        <a href="/" className="text-primary hover:text-accent transition-colors underline">
          Return to Home
        </a>
      </div>
    </div>
  );
}
