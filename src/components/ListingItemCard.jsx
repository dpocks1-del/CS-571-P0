import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'

const SOURCE_LABELS = {
  ebay: 'eBay',
  facebook: 'Facebook Marketplace',
  offerup: 'OfferUp',
}

const SOURCE_COLORS = {
  ebay: '#F5C518',
  facebook: '#1877F2',
  offerup: '#8B3FE8',
}

const STATUS_VARIANTS = {
  active: 'success',
  sold: 'secondary',
  draft: 'warning',
}

export default function ListingItemCard({ item, onEdit, onDelete }) {
  return (
    <Col>
      <Card className="h-100">
        <div style={{ position: 'relative' }}>
          <Card.Img
            variant="top"
            src={item.image.imageUrl}
            alt={item.title}
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div
            className="d-flex flex-wrap gap-1"
            style={{ position: 'absolute', top: 8, left: 8, maxWidth: '75%' }}
          >
            {item.sources.map((source) => (
              <a
                key={source}
                href={item.sourceUrls[source]}
                target="_blank"
                rel="noreferrer"
                style={{ textDecoration: 'none' }}
              >
                <Badge
                  bg=""
                  style={{
                    backgroundColor: SOURCE_COLORS[source],
                    color: source === 'ebay' ? '#000' : '#fff',
                  }}
                >
                  {SOURCE_LABELS[source]}
                </Badge>
              </a>
            ))}
          </div>
          <Badge
            bg={STATUS_VARIANTS[item.status]}
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            {item.status}
          </Badge>
        </div>
        <Card.Body>
          <Card.Title as="h6">{item.title}</Card.Title>
          <Card.Text>
            ${item.price.value} {item.price.currency}
          </Card.Text>
          <Card.Text className="text-muted small">
            {item.condition} · {item.views} views
          </Card.Text>
          <div className="d-flex gap-2">
            <Button
              onClick={() => onEdit(item.itemId)}
              variant="outline-primary"
              size="sm"
            >
              Edit
            </Button>
            <Button
              onClick={() => onDelete(item.itemId)}
              variant="outline-danger"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}