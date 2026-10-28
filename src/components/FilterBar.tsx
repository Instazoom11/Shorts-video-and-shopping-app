import React from 'react';
import { SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { ProductCategory, FilterState } from '../types';

interface FilterBarProps {
  filterState: FilterState;
  onUpdateFilters: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProductsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onUpdateFilters,
  onResetFilters,
  totalProductsCount
}) => {
  const subcategoriesMap: Record<ProductCategory, string[]> = {
    ALL: ['All Styles', 'Shirts & Jackets', 'Dresses', 'Sneakers', 'T-Shirts', 'Ethnic & Fusion', 'Bags & Wallets', 'Jeans & Trousers'],
    MEN: ['All Styles', 'Shirts & Jackets', 'T-Shirts', 'Jeans & Trousers'],
    WOMEN: ['All Styles', 'Dresses', 'Ethnic & Fusion', 'Skirts'],
    KIDS: ['All Styles', 'Baby & Toddler', 'Boys & Girls'],
    FOOTWEAR: ['All Styles', 'Sneakers', 'Boots'],
    ACCESSORIES: ['All Styles', 'Bags & Wallets', 'Watches']
  };

  const currentSubcategories = subcategoriesMap[filterState.category] || subcategoriesMap.ALL;

  const hasActiveFilters = 
    filterState.subcategory !== null ||
    filterState.minDiscount > 0 ||
    filterState.minRating > 0 ||
    filterState.maxPrice < 10000 ||
    filterState.minPrice > 0 ||
    filterState.searchQuery !== '';

  return (
    <div className="bg-white border-y border-neutral-200 py-4 px-4 sm:px-6 lg:px-8 space-y-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Subcategory horizontal tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          {currentSubcategories.map((subcat) => {
            const isSelected =
              subcat === 'All Styles'
                ? filterState.subcategory === null
                : filterState.subcategory === subcat;

            return (
              <button
                key={subcat}
                onClick={() =>
                  onUpdateFilters({
                    subcategory: subcat === 'All Styles' ? null : subcat
                  })
                }
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {subcat}
              </button>
            );
          })}
        </div>

        {/* Right: Quick Price Range, Discount, & Sorting Controls */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between md:justify-end shrink-0 text-xs">
          
          {/* Discount Dropdown */}
          <div className="flex items-center gap-1 bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => onUpdateFilters({ minDiscount: 0 })}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                filterState.minDiscount === 0
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              All Deals
            </button>
            <button
              onClick={() => onUpdateFilters({ minDiscount: 50 })}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                filterState.minDiscount === 50
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              50%+ OFF
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5 bg-neutral-100 rounded-lg px-2.5 py-1.5 border border-neutral-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={filterState.sortBy}
              onChange={(e) => onUpdateFilters({ sortBy: e.target.value as any })}
              className="bg-transparent border-0 text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer"
            >
              <option value="popular">Recommended</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="newest">New Arrivals</option>
            </select>
          </div>

        </div>

      </div>

      {/* Active Filter Indicators & Results Count */}
      <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-500 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-neutral-800">
            {totalProductsCount} {totalProductsCount === 1 ? 'item' : 'items'} found
          </span>
          {filterState.searchQuery && (
            <span className="text-neutral-500">
              for "{filterState.searchQuery}"
            </span>
          )}
          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="ml-2 text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline"
            >
              <X className="w-3 h-3" />
              <span>Clear All Filters</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
