export default function UserLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return(
        <main className=" bg-muted/40">
            {children}
        </main>
    )
  }