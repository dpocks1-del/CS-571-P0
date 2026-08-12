import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { mockListingsResponse } from '../mockListings'


const STORAGE_KEY = 'userListings'
const OVERRIDES_KEY = 'listingOverrides'

const SOURCE_OPTIONS = [
  { value: 'ebay', label: 'eBay' },
  { value: 'facebook', label: 'Facebook Marketplace' },
  { value: 'offerup', label: 'OfferUp' },
]

const CONDITION_OPTIONS = ['New', 'Used', 'Certified - Refurbished']


function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}


export default function EditListing() {
  const navigate = useNavigate()
  const { itemId } = useParams()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState(CONDITION_OPTIONS[0])
  const [sources, setSources] = useState([])
  const [images, setImages] = useState([])

  const [status, setStatus] = useState('draft')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const [originalListing, setOriginalListing] = useState(null)


  useEffect(() => {
    const userRaw = localStorage.getItem(STORAGE_KEY)
    const userListings = userRaw ? JSON.parse(userRaw) : []

    const overridesRaw = localStorage.getItem(OVERRIDES_KEY)
    const overrides = overridesRaw ? JSON.parse(overridesRaw) : {}

    // First look for a user-created listing
    let listing = userListings.find((item) => item.itemId === itemId)

    // If it isn't a user listing, look in the mock data
    if (!listing) {
      listing = mockListingsResponse.itemSummaries.find(
        (item) => item.itemId === itemId
      )
    }

    // Apply any previous edits to a mock listing
    if (listing && overrides[itemId]) {
      listing = {
        ...listing,
        ...overrides[itemId],
      }
    }

    if (!listing) {
      setErrorMsg('Listing not found.')
      setLoading(false)
      return
    }

    setOriginalListing(listing)

    setTitle(listing.title || '')
    setDescription(listing.description || '')
    setPrice(listing.price?.value || '')
    setCondition(listing.condition || CONDITION_OPTIONS[0])
    setSources(listing.sources || [])
    setStatus(listing.status || 'draft')

    if (Array.isArray(listing.images) && listing.images.length > 0) {
      setImages(listing.images)
    } else if (listing.image?.imageUrl) {
      setImages([listing.image.imageUrl])
    } else {
      setImages([])
    }

    setLoading(false)
  }, [itemId])


  const toggleSource = (source) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    )
  }


  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    try {
      const dataUrls = await Promise.all(files.map(fileToDataUrl))
      setImages((prev) => [...prev, ...dataUrls])
    } catch {
      setErrorMsg('Unable to load one or more images.')
    }

    e.target.value = ''
  }


  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }


  const saveListing = async (newStatus) => {
    setErrorMsg(null)

    if (!title.trim() || !price || sources.length === 0) {
      setErrorMsg(
        'Title, price, and at least one destination site are required.'
      )
      return
    }

    if (!originalListing) {
      setErrorMsg('Listing could not be found.')
      return
    }

    setSubmitting(true)

    const updatedListing = {
      ...originalListing,

      sources,

      sourceUrls: {
        ...originalListing.sourceUrls,
        ...Object.fromEntries(
          sources.map((source) => [
            source,
            originalListing.sourceUrls?.[source] || '#',
          ])
        ),
      },

      title: title.trim(),

      description: description.trim(),

      price: {
        value: Number(price).toFixed(2),
        currency: originalListing.price?.currency || 'USD',
      },

      image: {
        imageUrl: images[0] || '',
      },

      images,

      condition,

      status: newStatus,
    }


    const userRaw = localStorage.getItem(STORAGE_KEY)
    const userListings = userRaw ? JSON.parse(userRaw) : []

    const isUserListing = userListings.some(
      (item) => item.itemId === itemId
    )


    if (isUserListing) {
      // Update an existing user-created listing
      const updatedUserListings = userListings.map((item) =>
        item.itemId === itemId ? updatedListing : item
      )

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedUserListings)
      )
    } else {
      // Store an override for a mock listing
      const overridesRaw = localStorage.getItem(OVERRIDES_KEY)
      const overrides = overridesRaw ? JSON.parse(overridesRaw) : {}

      overrides[itemId] = updatedListing

      localStorage.setItem(
        OVERRIDES_KEY,
        JSON.stringify(overrides)
      )
    }


    setTimeout(() => {
      setSubmitting(false)
      navigate('/list')
    }, 300)
  }


  const handleSave = (e) => {
    e.preventDefault()
    saveListing(status)
  }


  const handlePublish = () => {
    saveListing('active')
  }


  if (loading) {
    return (
      <div className="container mt-4" style={{ maxWidth: 700 }}>
        Loading listing...
      </div>
    )
  }


  if (errorMsg && !originalListing) {
    return (
      <div className="container mt-4" style={{ maxWidth: 700 }}>
        <div className="alert alert-danger">{errorMsg}</div>

        <Button
          variant="outline-secondary"
          onClick={() => navigate('/list')}
        >
          Back to Listings
        </Button>
      </div>
    )
  }


  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h1>Edit Listing</h1>

      {errorMsg && (
        <div className="alert alert-danger">
          {errorMsg}
        </div>
      )}

      <Form onSubmit={handleSave}>
        <Form.Group className="mb-3">
          <Form.Label>Photos</Form.Label>

          <Form.Control
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <Row xs={3} className="g-2 mt-2">
              {images.map((src, i) => (
                <Col key={i}>
                  <div style={{ position: 'relative' }}>
                    <img
                      src={src}
                      alt={`upload-${i}`}
                      style={{
                        width: '100%',
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 4,
                      }}
                    />

                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        padding: '0 6px',
                      }}
                    >
                      ×
                    </Button>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>

          <Form.Control
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Canon AE-1 35mm Film Camera"
            required
          />
        </Form.Group>


        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>

          <Form.Control
            as="textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Condition details, included accessories, etc."
          />
        </Form.Group>


        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price ($)</Form.Label>

              <Form.Control
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Condition</Form.Label>

              <Form.Select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
              >
                {CONDITION_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>


        <Form.Group className="mb-4">
          <Form.Label className="d-block">
            List on
          </Form.Label>

          {SOURCE_OPTIONS.map((opt) => (
            <Form.Check
              key={opt.value}
              inline
              type="checkbox"
              id={`source-${opt.value}`}
              label={opt.label}
              checked={sources.includes(opt.value)}
              onChange={() => toggleSource(opt.value)}
            />
          ))}
        </Form.Group>


        <div className="d-flex gap-2">
          <Button
            type="submit"
            variant="primary"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>

          {status === 'draft' && (
            <Button
              type="button"
              variant="success"
              disabled={submitting}
              onClick={handlePublish}
            >
              {submitting ? 'Publishing...' : 'Publish Listing'}
            </Button>
          )}

          <Button
            type="button"
            variant="outline-secondary"
            onClick={() => navigate('/list')}
            disabled={submitting}
          >
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}