import { useState, useEffect, useMemo } from 'react'
import Row from 'react-bootstrap/Row'
import Pagination from 'react-bootstrap/Pagination'
import { mockEbayResponse } from '../mockData'
import ListingCard from '../components/ListingCard'
import FilterPanel from '../components/FilterPanel'

const STORAGE_KEY = 'savedListingIds'
const PAGE_SIZE_OPTIONS = [25, 50, 100]
const SOURCE_VALUES = ['ebay', 'facebook', 'offerup']
const CONDITION_VALUES = ['New', 'Used', 'Certified - Refurbished']

export default function Purchase() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [savedIds, setSavedIds] = useState([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const [filters, setFilters] = useState({
    conditions: [...CONDITION_VALUES],
    keywords: [],
    savedOnly: false,
    priceRange: null,
    sources: [...SOURCE_VALUES],
    localOnly: false,
    maxDistance: null,
  })

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    setSavedIds(raw ? JSON.parse(raw) : [])
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockEbayResponse.itemSummaries)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const priceBounds = useMemo(() => {
    if (items.length === 0) return { min: 0, max: 0 }
    const prices = items.map((item) => Number(item.price.value))
    return {
      min: Math.floor(Math.min(...prices)),
      max: Math.ceil(Math.max(...prices)),
    }
  }, [items])

  const distanceBounds = useMemo(() => {
    const distances = items
      .map((item) => item.distanceMiles)
      .filter((d) => d != null)
    if (distances.length === 0) return { min: 0, max: 0 }
    return {
      min: Math.floor(Math.min(...distances)),
      max: Math.ceil(Math.max(...distances)),
    }
  }, [items])

  useEffect(() => {
    if (items.length > 0 && filters.priceRange === null) {
      setFilters((f) => ({
        ...f,
        priceRange: [priceBounds.min, priceBounds.max],
      }))
    }
  }, [items, priceBounds, filters.priceRange])

  useEffect(() => {
    if (items.length > 0 && filters.maxDistance === null) {
      setFilters((f) => ({
        ...f,
        maxDistance: distanceBounds.max,
      }))
    }
  }, [items, distanceBounds, filters.maxDistance])

  const toggleSave = (itemId) => {
    setSavedIds((prev) => {
      const updated = prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const toggleSource = (source) => {
    setFilters((f) => {
      const isSelected = f.sources.includes(source)
      const updated = isSelected
        ? f.sources.filter((s) => s !== source)
        : [...f.sources, source]
      return { ...f, sources: updated }
    })
  }

  const toggleCondition = (condition) => {
    setFilters((f) => {
      const isSelected = f.conditions.includes(condition)
      const updated = isSelected
        ? f.conditions.filter((c) => c !== condition)
        : [...f.conditions, condition]
      return { ...f, conditions: updated }
    })
  }

  const addKeyword = (word) => {
    setFilters((f) => ({ ...f, keywords: [...f.keywords, word] }))
  }

  const removeKeyword = (word) => {
    setFilters((f) => ({
      ...f,
      keywords: f.keywords.filter((k) => k !== word),
    }))
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCondition = filters.conditions.includes(item.condition)
      const titleLower = item.title.toLowerCase()
      const matchesKeywords = filters.keywords.every((word) =>
        titleLower.includes(word)
      )
      const matchesSaved = !filters.savedOnly || savedIds.includes(item.itemId)
      const matchesSource = filters.sources.includes(item.source)
      const price = Number(item.price.value)
      const matchesPrice =
        !filters.priceRange ||
        (price >= filters.priceRange[0] && price <= filters.priceRange[1])
      const matchesLocation =
        !filters.localOnly ||
        (item.distanceMiles != null &&
          (filters.maxDistance == null ||
            item.distanceMiles <= filters.maxDistance))
      return (
        matchesCondition &&
        matchesKeywords &&
        matchesSaved &&
        matchesSource &&
        matchesPrice &&
        matchesLocation
      )
    })
  }, [items, filters, savedIds])

  useEffect(() => {
    setPage(1)
  }, [filters, pageSize])

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize))

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, page, pageSize])

  if (loading) return <div className="container mt-4">Loading...</div>
  if (error) return <div className="container mt-4 text-danger">{error}</div>

  return (
    <div className="container mt-4">
      <h1>Purchase</h1>
      <div className="row">
        <div className="col-md-3">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            priceBounds={priceBounds}
            distanceBounds={distanceBounds}
            items={items}
            onToggleSource={toggleSource}
            onToggleCondition={toggleCondition}
            onAddKeyword={addKeyword}
            onRemoveKeyword={removeKeyword}
            showLocalFilter
          />
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small" style={{ flex: '1 0 0' }}>
              {filteredItems.length} result
              {filteredItems.length === 1 ? '' : 's'}
            </span>

            <div style={{ flex: '0 0 auto' }}>
              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>

            <div
              className="d-flex align-items-center gap-2 justify-content-end"
              style={{ flex: '1 0 0' }}
            >
              <label className="form-label mb-0 small">Per page</label>
              <select
                className="form-select form-select-sm w-auto"
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <ResultsList
            items={paginatedItems}
            savedIds={savedIds}
            onToggleSave={toggleSave}
          />

          <PaginationControls
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="justify-content-center mt-4"
          />
        </div>
      </div>
    </div>
  )
}

function ResultsList({ items, savedIds, onToggleSave }) {
  if (items.length === 0) return <p>No results found.</p>

  return (
    <Row xs={1} md={2} lg={3} className="g-3">
      {items.map((item) => (
        <ListingCard
          key={item.itemId}
          item={item}
          saved={savedIds.includes(item.itemId)}
          onToggleSave={onToggleSave}
        />
      ))}
    </Row>
  )
}

function PaginationControls({ page, totalPages, onPageChange, className }) {
  if (totalPages <= 1) return null

  const items = []
  for (let i = 1; i <= totalPages; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === page}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    )
  }

  return (
    <Pagination className={className || 'mb-0'}>
      <Pagination.Prev
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      />
      {items}
      <Pagination.Next
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      />
    </Pagination>
  )
}