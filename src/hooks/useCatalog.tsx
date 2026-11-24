import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  products as staticProducts,
  type Product,
} from '../data/products';
import {
  categories as staticCategories,
  categoryGroups as staticCategoryGroups,
  materials as staticMaterials,
  type Category,
  type MaterialInfo,
} from '../data/categories';
import { fetchCategories, fetchProducts } from '../lib/api';

export type FilterOptions = {
  materials: string[];
  grades: string[];
  diameters: string[];
  finishes: string[];
  threads: string[];
  availability: readonly string[];
};

type CatalogValue = {
  products: Product[];
  categories: Category[];
  categoryGroups: string[];
  materials: MaterialInfo[];
  filterOptions: FilterOptions;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  refresh: () => Promise<void>;
  loading: boolean;
  /** 'api' once the backend responded, 'static' while falling back to the bundled catalog. */
  source: 'api' | 'static';
};

const CatalogContext = createContext<CatalogValue | null>(null);

const AVAILABILITY = ['in-stock', 'low-stock', 'made-to-order', 'quote-only'] as const;

function uniq(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function deriveFilterOptions(list: Product[]): FilterOptions {
  return {
    materials: uniq(list.map((p) => p.material)),
    grades: uniq(list.map((p) => p.grade)),
    diameters: uniq(list.map((p) => p.diameter)),
    finishes: uniq(list.map((p) => p.finish)),
    threads: uniq(list.map((p) => p.threadType)),
    availability: AVAILABILITY,
  };
}

export function CatalogProvider({ children }: { children: ReactNode }) {
  // Seed with the bundled catalog so the store (and the cart) works instantly,
  // then replace with live backend data when it responds.
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [categories, setCategories] = useState<Category[]>(staticCategories);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'api' | 'static'>('static');

  const refresh = useCallback(async () => {
    try {
      const [apiProducts, apiCategories] = await Promise.all([fetchProducts(), fetchCategories()]);
      if (Array.isArray(apiProducts) && apiProducts.length > 0) {
        setProducts(apiProducts);
        setSource('api');
      }
      if (Array.isArray(apiCategories) && apiCategories.length > 0) {
        setCategories(apiCategories);
      }
    } catch {
      // Backend unreachable → keep the bundled catalog (offline-first fallback).
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo<CatalogValue>(() => {
    const categoryGroups = uniq(categories.map((c) => c.group));
    return {
      products,
      categories,
      categoryGroups: categoryGroups.length > 0 ? categoryGroups : (staticCategoryGroups as string[]),
      materials: staticMaterials,
      filterOptions: deriveFilterOptions(products),
      getProductById: (id) => products.find((p) => p.id === id),
      getProductBySlug: (slug) => products.find((p) => p.slug === slug),
      refresh,
      loading,
      source,
    };
  }, [products, categories, refresh, loading, source]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used inside CatalogProvider');
  return ctx;
}
