export const metadata = {
  title: 'PDF Rule Checker',
  description: 'Upload a PDF, add rules, get quick pass/fail + JSON',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
