export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground space-y-2">
        <p>
          © {new Date().getFullYear()} EduTask · Built by{" "}
          <span className="font-medium">Pankaj Kumar Pandey</span>
        </p>

        <p className="flex justify-center gap-4 flex-wrap">
          <a
            target="_blank"
            className="hover:underline"
            href="http://mrpankajpandey.vercel.app">
            Portfolio
          </a>
          <a
            href="https://github.com/mrpankajpandey"
            target="_blank"
            className="hover:underline"
          >
            GitHub
          </a>

          <a
            href="https://linkedin.com/in/mrpankajpandey"
            target="_blank"
            className="hover:underline"
          >
            LinkedIn
          </a>

          <a
            href="https://edutask-mrpankajpandey.vercel.app"
            target="_blank"
            className="hover:underline"
          >
            Live Deployment
          </a>

          <a
            href="https://github.com/mrpankajpandey/Edtask-.git"
            target="_blank"
            className="hover:underline"
          >
            Repository
          </a>
        </p>
      </div>
    </footer>
  )
}
