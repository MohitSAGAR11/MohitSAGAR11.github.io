type Props = {
  index: string;
  children: string;
};

export function SectionLabel({ index, children }: Props) {
  return (
    <p className="label mb-8 flex items-center gap-3">
      <span className="text-amber">{index}</span>
      <span className="h-px w-8 bg-line" aria-hidden="true" />
      {children}
    </p>
  );
}
