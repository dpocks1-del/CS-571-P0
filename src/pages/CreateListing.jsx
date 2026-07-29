import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const STORAGE_KEY = 'userListings'
const SOURCE_OPTIONS = [
  { value: 'ebay', label: 'eBay' },
  { value: 'facebook', label: 'Facebook Marketplace' },
  { value: 'offerup', label: 'OfferUp' },
]
const CONDITION_OPTIONS = ['New', 'Used', 'Certified - Refurbished']

// Converts a File to a base64 data URL so it can be stored as JSON/localStorage
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function CreateListing() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState(CONDITION_OPTIONS[0])
  const [sources, setSources] = useState([])
  const [images, setImages] = useState([]) // array of data URLs
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const toggleSource = (source) => {
    setSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    )
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    const dataUrls = await Promise.all(files.map(fileToDataUrl))
    setImages((prev) => [...prev, ...dataUrls])
  }

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim() || !price || sources.length === 0) {
      setErrorMsg(
        'Title, price, and at least one destination site are required.'
      )
      return
    }

    setSubmitting(true)

    const newListing = {
      itemId: `listing|${Date.now()}|0`,
      sources,
      sourceUrls: Object.fromEntries(sources.map((s) => [s, '#'])), // placeholder until real API posting exists
      title: title.trim(),
      description: description.trim(),
      price: { value: Number(price).toFixed(2), currency: 'USD' },
      image: { imageUrl: images[0] || '' },
      images,
      condition,
      status: 'draft',
      views: 0,
      categories: [],
      createdAt: new Date().toISOString(),
    }

    // Simulate an API call - this is the spot to swap in a real POST request later
    const existingRaw = localStorage.getItem(STORAGE_KEY)
    const existing = existingRaw ? JSON.parse(existingRaw) : []
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newListing]))

    setTimeout(() => {
      setSubmitting(false)
      navigate('/list')
    }, 300)
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 700 }}>
      <h1>Create Listing</h1>

      {errorMsg && <div className="alert alert-danger">{errorMsg}</div>}

      <Form onSubmit={handleSubmit}>
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
          <Form.Label className="d-block">List on</Form.Label>
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
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Listing'}
          </Button>
          <Button variant="outline-secondary" onClick={() => navigate('/list')}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  )
}