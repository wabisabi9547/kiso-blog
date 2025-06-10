export default function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold tracking-wide">KISO</h3>
            <p className="text-sm text-muted-foreground">일상과 기술, 그리고 생각들을 담는 공간</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              <a 
                href="mailto:wabisabi.9547@gmail.com" 
                className="text-primary hover:underline"
              >
                wabisabi.9547@gmail.com
              </a>
            </p>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              © 2025 KISO. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 