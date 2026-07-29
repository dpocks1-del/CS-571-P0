import { useState } from 'react'
import Badge from 'react-bootstrap/Badge'

export default function KeywordFilter({ keywords, onAdd, onRemove }) {
  const [input, setInput] = useState('')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      const trimmed = input.trim().toLowerCase()
      if (!keywords.includes(trimmed)) {
        onAdd(trimmed)
      }
      setInput('')
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">Keywords</label>
      <input
        type="text"
        className="form-control"
        placeholder="Type a keyword and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      {keywords.length > 0 && (
        <div className="d-flex flex-wrap gap-2 mt-2">
          {keywords.map((word) => (
            <Badge
              key={word}
              bg=""
              style={{
                backgroundColor: '#e9ecef',
                color: '#212529',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 'normal',
                padding: '6px 10px',
              }}
            >
              {word}
              <span
                role="button"
                onClick={() => onRemove(word)}
                style={{ cursor: 'pointer', fontWeight: 'bold' }}
              >
                ×
              </span>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}