import PriceFilter from './PriceFilter'
import DistanceFilter from './DistanceFilter'
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
  distanceBounds = { min: 0, max: 0 },
  items,
  onToggleSource,
  onToggleCondition,
  onAddKeyword,
  onRemoveKeyword,
  showSavedOnly = true,
  showLocalFilter = false,
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

      {showLocalFilter && (
        <div className="mb-3">
          <label className="form-label d-block">Location</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="localOnly"
              role="switch"
              checked={filters.localOnly}
              onChange={(e) =>
                setFilters((f) => ({ ...f, localOnly: e.target.checked }))
              }
            />
            <label className="form-check-label" htmlFor="localOnly">
              Local listings only
            </label>
          </div>

          {filters.localOnly && filters.maxDistance != null && (
            <DistanceFilter
              min={distanceBounds.min}
              max={distanceBounds.max}
              value={filters.maxDistance}
              onChange={(val) =>
                setFilters((f) => ({ ...f, maxDistance: val }))
              }
            />
          )}
        </div>
      )}

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