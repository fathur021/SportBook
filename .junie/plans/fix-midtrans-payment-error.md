---
sessionId: session-261102-195647-yokh
---

# Diagnosis and Fix

### Problem Found

Error `Uncaught (in promise) SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON` means the frontend called `/bookings/${bookingId}/pay` but the server returned an HTML page (a 404 error page) instead of JSON.

### Root Cause

**`bookingId` is empty in the checkout URL.**

In `components/booking/booking-summary.tsx`, the "Continue to Checkout" button uses a plain `<Link>` which **does not create a booking** first. The URL generated is:

```
/checkout?venue=xxx&court=xxx&date=xxx&time=xxx&duration=1
```

**No `bookingId`** in this URL. So in `checkout/page.tsx`:

    const bookingId = firstParam(sp.bookingId); // → empty ""

When the user clicks "Pay Now" in `payment-method-card.tsx`:

    const res = await fetch(`/bookings/${bookingId}/pay`, {...});
    // bookingId = "", so URL = "/bookings//pay" → 404 HTML!

Next.js returns a 404 HTML page → `res.json()` fails with `Unexpected token '<'`.

### Solution

Change `booking-summary.tsx` to:
1. **Create booking via API** (`POST /api/bookings`) when user clicks "Continue to Checkout"
2. API returns `bookingId`
3. Navigate to `/checkout?bookingId=xxx&...` with a valid `bookingId`

### File to Fix

- `components/booking/booking-summary.tsx` — add create booking logic before navigating to checkout

### Flow After Fix

    User clicks "Continue to Checkout"
        ↓
    POST /api/bookings → booking created (status: PENDING)
        ↓
    API returns { data: { id: "booking_123", ... } }
        ↓
    Navigate to /checkout?bookingId=booking_123&...
        ↓
    User clicks "Pay Now"
        ↓
    POST /bookings/booking_123/pay → payment record created ✓
        ↓
    Midtrans popup opens
