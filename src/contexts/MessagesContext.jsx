import { createContext, useContext, useCallback, useState } from 'react';
import { listings as initialListings, conversations as initialConversations } from '../mockCommunicationsData';

const MessagesContext = createContext(null);

export function MessagesProvider({ children }) {
  const [listings, setListings] = useState(initialListings);
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? null);

  // Called when a "Message seller" button is clicked on a Purchase-page listing card.
  // Returns the conversation id it opened, but callers don't need it —
  // selectedId is set here so Communications picks it up on its own.
  const startConversationWithSeller = useCallback(
    (item) => {
      const listingId = item.itemId;
      const contactName = item.seller?.username ?? 'Seller';

      setListings((prev) =>
        prev.some((l) => l.id === listingId)
          ? prev
          : [
              ...prev,
              {
                id: listingId,
                title: item.title,
                price: item.price?.value ?? 0,
                platform: item.source,
                status: 'active',
              },
            ]
      );

      // Deterministic id (one conversation per listing) — deliberately not using
      // Date.now() or reading state back out of a setState updater, since both
      // are unreliable under React 18 StrictMode's double-invoke behavior.
      const existing = conversations.find(
        (c) => c.listingId === listingId && c.contactName === contactName
      );

      if (existing) {
        setSelectedId(existing.id);
        return existing.id;
      }

      const newId = `conv-${listingId}`;
      const newConversation = {
        id: newId,
        listingId,
        platform: item.source,
        contactName,
        role: 'buying',
        unread: 0,
        lastTime: new Date().toISOString(),
        messages: [],
      };

      setConversations((prev) => [newConversation, ...prev]);
      setSelectedId(newId);
      return newId;
    },
    [conversations]
  );

  const value = {
    listings,
    conversations,
    setConversations,
    selectedId,
    setSelectedId,
    startConversationWithSeller,
  };

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessages() {
  const ctx = useContext(MessagesContext);
  if (!ctx) {
    throw new Error('useMessages must be used within a MessagesProvider');
  }
  return ctx;
}