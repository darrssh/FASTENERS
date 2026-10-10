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

function Field({ label, value, onChange, options, name }: { label: string; value: string; onChange: (v: string) => void; options: string[]; name: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border hairline bg-ink-900 px-3 py-2.5 text-[14px] text-paper focus:border-accent focus:outline-none"
      >
        <option value="all">All</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

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
        <button onClick={() => onChange({ ...EMPTY_FILTERS, query: filters.query })} className="text-[13px] text-brass-light hover:underline">
          Reset
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <Field label="Category" name="category" value={filters.category} onChange={set('category')} options={categories.map((c) => c.id)} />
        <Field label="Material" name="material" value={filters.material} onChange={set('material')} options={filterOptions.materials} />
        <Field label="Grade" name="grade" value={filters.grade} onChange={set('grade')} options={filterOptions.grades} />
        <Field label="Diameter" name="diameter" value={filters.diameter} onChange={set('diameter')} options={filterOptions.diameters} />
        <Field label="Finish" name="finish" value={filters.finish} onChange={set('finish')} options={filterOptions.finishes} />
        <Field label="Thread type" name="thread" value={filters.thread} onChange={set('thread')} options={filterOptions.threads} />
        <Field label="Availability" name="availability" value={filters.availability} onChange={set('availability')} options={[...filterOptions.availability]} />
        <Field label="Sort" name="sort" value={filters.sort} onChange={set('sort')} options={['featured', 'name', 'price-asc', 'price-desc']} />
      </div>
    </div>
  );
}
