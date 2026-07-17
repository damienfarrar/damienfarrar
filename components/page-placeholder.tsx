export function PagePlaceholder({
  title,
  note,
}: {
  title: string;
  note: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-20 sm:px-10 sm:pt-24">
      <p className="font-mono text-primary text-[0.58rem] font-medium tracking-[0.14em] uppercase">
        Under construction
      </p>
      <h1 className="font-heading mt-4 text-4xl font-bold uppercase sm:text-6xl">
        {title}
      </h1>
      <p className="text-muted-foreground mt-5 max-w-xl text-lg">{note}</p>
    </div>
  );
}
