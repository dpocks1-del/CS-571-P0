import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Row from 'react-bootstrap/Row'
import Pagination from 'react-bootstrap/Pagination'
import Button from 'react-bootstrap/Button'
import { mockListingsResponse } from '../mockListings'
import ListingItemCard from '../components/ListingItemCard'
import FilterPanel from '../components/FilterPanel'

const USER_LISTINGS_KEY = 'userListings'
const PAGE_SIZE_OPTIONS = [25, 50, 100]
const SOURCE_VALUES = ['ebay', 'facebook', 'offerup']
const CONDITION_VALUES = ['New', 'Used', 'Certified - Refurbished']
const STATUS_OPTIONS = ['active', 'sold', 'draft']

export default function List() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)

  const [filters, setFilters] = useState({
    conditions: [...CONDITION_VALUES],
    keywords: [],
    priceRange: null,
    sources: [...SOURCE_VALUES],
    statuses: [...STATUS_OPTIONS],
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const userRaw = localStorage.getItem(USER_LISTINGS_KEY)
      const userListings = userRaw ? JSON.parse(userRaw) : []
      setItems([...userListings, ...mockListingsResponse.itemSummaries])
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

  useEffect(() => {
    if (items.length > 0 && filters.priceRange === null) {
      setFilters((f) => ({
        ...f,
        priceRange: [priceBounds.min, priceBounds.max],
      }))
    }
  }, [items, priceBounds, filters.priceRange])

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

  const toggleStatus = (status) => {
    setFilters((f) => {
      const isSelected = f.statuses.includes(status)
      const updated = isSelected
        ? f.statuses.filter((s) => s !== status)
        : [...f.statuses, status]
      return { ...f, statuses: updated }
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

  const handleEdit = (itemId) => {
    console.log('Edit listing:', itemId)
    // TODO: open edit form/modal
  }

  const handleDelete = (itemId) => {
    setItems((prev) => prev.filter((item) => item.itemId !== itemId))

    // Also remove from localStorage if it's a user-created listing
    const userRaw = localStorage.getItem(USER_LISTINGS_KEY)
    if (userRaw) {
      const userListings = JSON.parse(userRaw)
      const updated = userListings.filter((item) => item.itemId !== itemId)
      localStorage.setItem(USER_LISTINGS_KEY, JSON.stringify(updated))
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCondition = filters.conditions.includes(item.condition)
      const titleLower = item.title.toLowerCase()
      const matchesKeywords = filters.keywords.every((word) =>
        titleLower.includes(word)
      )
      const matchesSource = item.sources.some((s) =>
        filters.sources.includes(s)
      )
      const matchesStatus = filters.statuses.includes(item.status)
      const price = Number(item.price.value)
      const matchesPrice =
        !filters.priceRange ||
        (price >= filters.priceRange[0] && price <= filters.priceRange[1])
      return (
        matchesCondition &&
        matchesKeywords &&
        matchesSource &&
        matchesStatus &&
        matchesPrice
      )
    })
  }, [items, filters])

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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">List</h1>
        <Button variant="primary" onClick={() => navigate('/list/create')}>
          Create Listing
        </Button>
      </div>

      <div className="row">
        <div className="col-md-3">
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            priceBounds={priceBounds}
            items={items}
            onToggleSource={toggleSource}
            onToggleCondition={toggleCondition}
            onAddKeyword={addKeyword}
            onRemoveKeyword={removeKeyword}
            showSavedOnly={false}
          >
            <div className="mb-3">
              <label className="form-label d-block">Status</label>
              {STATUS_OPTIONS.map((status) => (
                <div className="form-check" key={status}>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`status-${status}`}
                    checked={filters.statuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                  />
                  <label
                    className="form-check-label text-capitalize"
                    htmlFor={`status-${status}`}
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </FilterPanel>
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-muted small" style={{ flex: '1 0 0' }}>
              {filteredItems.length} listing
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
            onEdit={handleEdit}
            onDelete={handleDelete}
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

function ResultsList({ items, onEdit, onDelete }) {
  if (items.length === 0) return <p>No listings found.</p>

  return (
    <Row xs={1} md={2} lg={3} className="g-3">
      {items.map((item) => (
        <ListingItemCard
          key={item.itemId}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
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