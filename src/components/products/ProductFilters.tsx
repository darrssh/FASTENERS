import { filterOptions } from '../../data/products';
import { categories } from '../../data/categories';

export type FilterState = {
  query: string;
  category: string;
  material: string;
  grade: string;
  diameter: string;
  finish: string;
  thread: string;
  availability: string;
  sort: 'featured' | 'name' | 'price-asc' | 'price-desc';
};

export const EMPTY_FILTERS: FilterState = {
  query: '',
  category: 'all',
  material: 'all',
  grade: 'all',
  diameter: 'all',
  finish: 'all',
  thread: 'all',
  availability: 'all',
  sort: 'featured',
};

type Option = { value: string; label: string };

// '—' in data means "not applicable" — show those items under All,
// never as a selectable (confusing) option value.
const withoutNA = (values: string[]): Option[] =>
  values.filter((v) => v !== '—').map((v) => ({ value: v, label: v }));

function Field({ label, value, onChange, options, name }: { label: string; value: string; onChange: (v: string) => void; options: Option[]; name: string }) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-full rounded-lg border hairline bg-ink-900 px-3 py-2.5 text-base text-paper focus:border-accent"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

const SORT_OPTIONS: Option[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export function ProductFilters({
  filters,
  onChange,
  count,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  count: number;
}) {
  const set = (k: keyof FilterState) => (v: string) => onChange({ ...filters, [k]: v });
  const activeCount = (Object.keys(filters) as (keyof FilterState)[]).filter((k) => k !== 'query' && k !== 'sort' && filters[k] !== 'all').length;
  return (
    <div className="card-premium p-5" aria-label="Product filters">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Filter · {count} shown{activeCount > 0 ? ` · ${activeCount} on` : ''}</p>
        <button type="button" onClick={() => onChange({ ...EMPTY_FILTERS, query: filters.query })} className="min-h-[44px] px-2 text-[13px] text-brass-light hover:underline">
          Reset
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Field label="Category" name="category" value={filters.category} onChange={set('category')} options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        <Field label="Material" name="material" value={filters.material} onChange={set('material')} options={withoutNA(filterOptions.materials)} />
        <Field label="Grade" name="grade" value={filters.grade} onChange={set('grade')} options={withoutNA(filterOptions.grades)} />
        <Field label="Diameter" name="diameter" value={filters.diameter} onChange={set('diameter')} options={withoutNA(filterOptions.diameters)} />
        <Field label="Finish" name="finish" value={filters.finish} onChange={set('finish')} options={withoutNA(filterOptions.finishes)} />
        <Field label="Thread type" name="thread" value={filters.thread} onChange={set('thread')} options={withoutNA(filterOptions.threads)} />
        <Field label="Availability" name="availability" value={filters.availability} onChange={set('availability')} options={filterOptions.availability.map((v) => ({ value: v, label: v }))} />
        <Field label="Sort" name="sort" value={filters.sort} onChange={set('sort')} options={SORT_OPTIONS} />
      </div>
    </div>
  );
}
