import { useState, useMemo } from 'react'
import { Nav, Badge, Form, Button, InputGroup } from 'react-bootstrap'
import '../CSS/CommunicationsTab.css'
import { useMessages } from '../contexts/MessagesContext.jsx'

// Matches ListingCard.jsx exactly, so platform badges look identical across the app.
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

const ROLE_LABELS = {
  selling: 'Selling',
  buying: 'Buying',
}

const ROLE_COLORS = {
  selling: { bg: '#d1e7dd', text: '#0f5132' },
  buying: { bg: '#cfe2ff', text: '#084298' },
}

function PlatformBadge({ source }) {
  return (
    <Badge
      bg=""
      style={{
        backgroundColor: SOURCE_COLORS[source],
        color: source === 'ebay' ? '#000' : '#fff',
      }}
    >
      {SOURCE_LABELS[source]}
    </Badge>
  )
}

function RoleBadge({ role }) {
  const colors = ROLE_COLORS[role]
  return (
    <Badge
      bg=""
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      {ROLE_LABELS[role]}
    </Badge>
  )
}

function initials(title) {
  return title
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

function formatTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const sameDay = d.toDateString() === now.toDateString()

  if (sameDay) {
    return d.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return d.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

export default function CommunicationsTab() {
  const { listings, conversations, setConversations, selectedId, setSelectedId } = useMessages()
  const [view, setView] = useState('inbox')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [draft, setDraft] = useState('')

  const listingById = useMemo(
    () =>
      Object.fromEntries(
        listings.map((l) => [l.id, l])
      ),
    [listings]
  )

  const filtered = useMemo(() => {
    return [...conversations]
      .filter(
        (c) =>
          platformFilter === 'all' ||
          c.platform === platformFilter
      )
      .filter(
        (c) =>
          roleFilter === 'all' ||
          c.role === roleFilter
      )
      .sort(
        (a, b) =>
          new Date(b.lastTime) -
          new Date(a.lastTime)
      )
  }, [conversations, platformFilter, roleFilter])

  const groupedByListing = useMemo(() => {
    const map = new Map()

    filtered.forEach((c) => {
      if (!map.has(c.listingId)) {
        map.set(c.listingId, [])
      }

      map.get(c.listingId).push(c)
    })

    return map
  }, [filtered])

  const selected =
    conversations.find(
      (c) => c.id === selectedId
    ) || null

  const selectedListing = selected
    ? listingById[selected.listingId]
    : null

  function openConversation(id) {
    setSelectedId(id)

    setConversations((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, unread: 0 }
          : c
      )
    )
  }

  function handleSend() {
    const text = draft.trim()

    if (!text || !selected) {
      return
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  id: `m${Date.now()}`,
                  sender: 'me',
                  text,
                  time: new Date().toISOString(),
                },
              ],
              lastTime: new Date().toISOString(),
            }
          : c
      )
    )

    setDraft('')
  }

  function renderListItem(conv) {
    const listing = listingById[conv.listingId]
    const lastMsg =
      conv.messages[conv.messages.length - 1]

    return (
      <div
        key={conv.id}
        className={`comm-list-item${
          conv.id === selectedId ? ' active' : ''
        }`}
        onClick={() => openConversation(conv.id)}
        role="button"
        style={
          conv.id === selectedId
            ? undefined
            : { borderLeft: `3px solid ${ROLE_COLORS[conv.role].text}`, paddingLeft: 9 }
        }
      >
        <div className="comm-thumb">
          {initials(listing.title)}
        </div>

        <div className="comm-list-item-body">
          <div className="comm-list-item-top">
            <span className="comm-buyer-name">
              {conv.contactName}
            </span>

            <span className="comm-time">
              {formatTime(conv.lastTime)}
            </span>
          </div>

          {view === 'inbox' && (
            <div className="comm-list-item-listing">
              {listing.title}
            </div>
          )}

          <div className="comm-snippet">
            {lastMsg
              ? `${lastMsg.sender === 'me' ? 'You: ' : ''}${lastMsg.text}`
              : 'No messages yet'}
          </div>
        </div>

        <div className="d-flex flex-column align-items-end gap-1">
          <RoleBadge role={conv.role} />
          <PlatformBadge source={conv.platform} />

          {conv.unread > 0 && (
            <span
              className="comm-unread-dot"
              title={`${conv.unread} unread`}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className="comm-tab"
      style={{
        flex: '1 1 0',
        minHeight: 0,
        height: '100%',
        width: '100%',
        minWidth: 0,
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* =====================================================
          TOP TOOLBAR
          Does not scroll
         ===================================================== */}
      <div
        className="comm-toolbar"
        style={{
          flex: '0 0 auto',
        }}
      >
        <Nav
          variant="pills"
          className="comm-view-toggle"
          activeKey={view}
          onSelect={(k) => setView(k)}
        >
          <Nav.Item>
            <Nav.Link eventKey="inbox">
              Inbox
            </Nav.Link>
          </Nav.Item>

          <Nav.Item>
            <Nav.Link eventKey="byListing">
              By listing
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Nav
          variant="pills"
          className="comm-view-toggle"
          activeKey={roleFilter}
          onSelect={(k) => setRoleFilter(k)}
        >
          {['all', 'selling', 'buying'].map((r) => (
            <Nav.Item key={r}>
              <Nav.Link eventKey={r}>
                {r === 'all' ? 'All' : ROLE_LABELS[r]}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Nav
          variant="pills"
          className="comm-view-toggle"
          activeKey={platformFilter}
          onSelect={(k) =>
            setPlatformFilter(k)
          }
        >
          {[
            'all',
            'ebay',
            'facebook',
            'offerup',
          ].map((p) => (
            <Nav.Item key={p}>
              <Nav.Link eventKey={p}>
                {p === 'all'
                  ? 'All'
                  : SOURCE_LABELS[p]}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* =====================================================
          MAIN WORKSPACE
          Fills every remaining pixel
         ===================================================== */}
      <div
        className="comm-content"
        style={{
          flex: '1 1 0',
          minHeight: 0,
          minWidth: 0,
          width: '100%',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        {/* ===================================================
            INBOX
            Independent scrollbar
           =================================================== */}
        <div
          className="comm-sidebar"
          style={{
            width: 340,
            flex: '0 0 340px',
            minHeight: 0,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {view === 'inbox' &&
            filtered.map((conv) =>
              renderListItem(conv)
            )}

          {view === 'byListing' &&
            Array.from(
              groupedByListing.entries()
            ).map(([listingId, convs]) => {
              const listing =
                listingById[listingId]

              return (
                <div key={listingId}>
                  <div className="comm-listing-group-header">
                    <span>
                      {listing.title}
                    </span>

                    <span className="comm-listing-price">
                      ${listing.price}
                    </span>
                  </div>

                  {convs.map((conv) =>
                    renderListItem(conv)
                  )}
                </div>
              )
            })}

          {filtered.length === 0 && (
            <div className="comm-empty-state">
              <div>
                No conversations for this
                filter yet.
              </div>
            </div>
          )}
        </div>

        {/* ===================================================
            ACTIVE CONVERSATION
           =================================================== */}
        <div
          className="comm-thread"
          style={{
            flex: '1 1 0',
            minWidth: 0,
            minHeight: 0,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {selected ? (
            <>
              {/* Fixed conversation header */}
              <div
                className="comm-thread-header"
                style={{
                  flex: '0 0 auto',
                }}
              >
                <div className="comm-thumb">
                  {initials(
                    selectedListing.title
                  )}
                </div>

                <div className="flex-grow-1">
                  <div
                    className="fw-semibold"
                    style={{
                      fontSize: '0.95rem',
                    }}
                  >
                    {selectedListing.title}
                  </div>

                  <div className="d-flex align-items-center gap-2">
                    <RoleBadge role={selected.role} />
                    <PlatformBadge
                      source={
                        selectedListing.platform
                      }
                    />

                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6B6559',
                      }}
                    >
                      with{' '}
                      {selected.contactName}
                    </span>
                  </div>
                </div>

                <div className="comm-listing-price">
                  ${selectedListing.price}
                </div>
              </div>

              {/* =================================================
                  MESSAGE BODY
                  Independent scrollbar
                 ================================================= */}
              <div
                className="comm-thread-body"
                style={{
                  flex: '1 1 0',
                  minHeight: 0,
                  height: 'auto',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}
              >
                {selected.messages.length === 0 && (
                  <div className="text-muted small">
                    No messages yet — say hello about{' '}
                    {selectedListing.title}.
                  </div>
                )}

                {selected.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`comm-bubble comm-bubble-${
                      m.sender === 'me'
                        ? 'me'
                        : 'buyer'
                    }`}
                  >
                    {m.text}

                    <span className="comm-bubble-time">
                      {formatTime(m.time)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Fixed composer */}
              <div
                className="comm-composer"
                style={{
                  flex: '0 0 auto',
                }}
              >
                <InputGroup>
                  <Form.Control
                    placeholder={`Message ${selected.contactName}`}
                    value={draft}
                    onChange={(e) =>
                      setDraft(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSend()
                      }
                    }}
                  />

                  <Button
                    variant="dark"
                    onClick={handleSend}
                    disabled={!draft.trim()}
                  >
                    Send
                  </Button>
                </InputGroup>
              </div>
            </>
          ) : (
            <div className="comm-empty-state">
              <div>
                Select a conversation to view
                messages.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}