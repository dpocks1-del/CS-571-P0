import PriceFilter from './PriceFilter'
import KeywordFilter from './KeywordFilter'

const SOURCE_OPTIONS = [
  { value: 'ebay', label: 'eBay' },
  { value: 'facebook', label: 'Facebook Marketplace' },
  { value: 'offerup', label: 'OfferUp' },
]

const CONDITION_OPTIONS = ['New', 'Used', 'Certified - Refurbished']

export default function FilterPanel({
  filters,
  setFilters,
  priceBounds,
  items,
  onToggleSource,
  onToggleCondition,
  onAddKeyword,
  onRemoveKeyword,
  showSavedOnly = true,
  children,
}) {
  return (
    <div className="border rounded p-3">
      <h5>Filters</h5>

      <KeywordFilter
        keywords={filters.keywords}
        onAdd={onAddKeyword}
        onRemove={onRemoveKeyword}
      />

      <div className="mb-3">
        <label className="form-label d-block">Source</label>
        {SOURCE_OPTIONS.map((opt) => (
          <div className="form-check" key={opt.value}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`source-${opt.value}`}
              checked={filters.sources.includes(opt.value)}
              onChange={() => onToggleSource(opt.value)}
            />
            <label
              className="form-check-label"
              htmlFor={`source-${opt.value}`}
            >
              {opt.label}
            </label>
          </div>
        ))}
      </div>

      <div className="mb-3">
        <label className="form-label d-block">Condition</label>
        {CONDITION_OPTIONS.map((cond) => (
          <div className="form-check" key={cond}>
            <input
              type="checkbox"
              className="form-check-input"
              id={`condition-${cond}`}
              checked={filters.conditions.includes(cond)}
              onChange={() => onToggleCondition(cond)}
            />
            <label className="form-check-label" htmlFor={`condition-${cond}`}>
              {cond}
            </label>
          </div>
        ))}
      </div>

      {filters.priceRange && (
        <PriceFilter
          items={items}
          min={priceBounds.min}
          max={priceBounds.max}
          value={filters.priceRange}
          onChange={(range) =>
            setFilters((f) => ({ ...f, priceRange: range }))
          }
        />
      )}

      {children}

      {showSavedOnly && (
        <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="savedOnly"
            checked={filters.savedOnly}
            onChange={(e) =>
              setFilters((f) => ({ ...f, savedOnly: e.target.checked }))
            }
          />
          <label className="form-check-label" htmlFor="savedOnly">
            Show saved only
          </label>
        </div>
      )}
    </div>
  )
}