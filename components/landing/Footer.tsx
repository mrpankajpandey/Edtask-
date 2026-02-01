export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} EduTask · Built by Pankaj Kumar Pandey
      </div>
    </footer>
  )
}
