import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import { useNavigate } from 'react-router-dom'
import { useMessages } from '../contexts/MessagesContext.jsx'

const SOURCE_LABELS = {
  ebay: 'eBay',
  facebook: 'Facebook Marketplace',
  offerup: 'OfferUp',
}

const SOURCE_COLORS = {
  ebay: '#F5C518', // yellow
  facebook: '#1877F2', // blue
  offerup: '#8B3FE8', // purple
}

export default function ListingCard({ item, saved, onToggleSave }) {
  const navigate = useNavigate()
  const { startConversationWithSeller } = useMessages()

  function handleMessageSeller() {
    startConversationWithSeller(item)
    navigate('/communications')
  }

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
          <Badge
            bg=""
            style={{
                position: 'absolute',
                top: 8,
                left: 8,
                backgroundColor: SOURCE_COLORS[item.source],
                color: item.source === 'ebay' ? '#000' : '#fff',
            }}
            >
            {SOURCE_LABELS[item.source]}
            </Badge>
        </div>
        <Card.Body>
          <Card.Title as="h6">{item.title}</Card.Title>
          <Card.Text>
            ${item.price.value} {item.price.currency}
          </Card.Text>
          <Card.Text className="text-muted small">
            {item.condition} · {item.seller.username} (
            {item.seller.feedbackPercentage}%)
          </Card.Text>
          {item.distanceMiles != null && (
            <Card.Text className="small text-success mb-2">
              📍 Local · {item.distanceMiles} mi away
            </Card.Text>
          )}
          <div className="d-flex gap-2 flex-wrap">
            <Button
              href={item.itemWebUrl}
              target="_blank"
              rel="noreferrer"
              variant="outline-primary"
              size="sm"
            >
              View listing
            </Button>
            <Button
              onClick={() => onToggleSave(item.itemId)}
              variant={saved ? 'secondary' : 'outline-secondary'}
              size="sm"
            >
              {saved ? 'Saved' : 'Save'}
            </Button>
            <Button onClick={handleMessageSeller} variant="outline-dark" size="sm">
              Message seller
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}