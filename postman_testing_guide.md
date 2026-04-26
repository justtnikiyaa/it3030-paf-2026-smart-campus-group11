# Smart Campus - Complete Postman Testing Guide

## ⚠️ BEFORE YOU START: Get Your Session Cookie

Since the app uses Google OAuth with Spring Sessions (not JWT), follow these steps:

1. Open `http://localhost:5173` in your browser and **log in with Google**
2. After login, press **F12** → **Application** tab → **Cookies** → click `http://localhost:5173`
3. Copy the value of the **`JSESSIONID`** cookie

In every Postman request, add this header:
| Header Key | Header Value |
|---|---|
| `Cookie` | `JSESSIONID=PASTE_YOUR_VALUE_HERE` |

> Base URL for all requests: `http://localhost:8081`

---

## MODULE 1: Authentication

### ✅ Test 1.1 — Get Current Logged-In User
```
GET http://localhost:8081/api/auth/me
```
**Expected:** `200 OK` with your user info (id, email, name, roles)

---

## MODULE 2: Resources (Facilities)

### ✅ Test 2.1 — Get All Resources
```
GET http://localhost:8081/api/resources
```
**Expected:** `200 OK` with list of all campus resources

### ✅ Test 2.2 — Filter Resources by Type
```
GET http://localhost:8081/api/resources?type=ROOM
```
**Expected:** `200 OK` with filtered list

### ✅ Test 2.3 — Get Resource by ID
```
GET http://localhost:8081/api/resources/1
```
**Expected:** `200 OK` with single resource details

### ✅ Test 2.4 — Create a New Resource (Admin only)
```
POST http://localhost:8081/api/resources
Content-Type: application/json

{
  "name": "Conference Room B",
  "type": "ROOM",
  "location": "Block C, Floor 2",
  "capacity": 20,
  "description": "Large conference room with projector"
}
```
**Expected:** `201 Created`

### ✅ Test 2.5 — Update Resource Status (Admin only)
```
PATCH http://localhost:8081/api/resources/1/status
Content-Type: application/json

{
  "status": "MAINTENANCE"
}
```
**Expected:** `200 OK`

### ✅ Test 2.6 — Delete Resource (Admin only)
```
DELETE http://localhost:8081/api/resources/1
```
**Expected:** `204 No Content`

---

## MODULE 3: Bookings

### ✅ Test 3.1 — Create a Booking
```
POST http://localhost:8081/api/bookings
Content-Type: application/json

{
  "resourceId": 1,
  "startTime": "2026-04-25T09:00:00",
  "endTime": "2026-04-25T11:00:00",
  "purpose": "Team meeting"
}
```
**Expected:** `201 Created` with booking details and status `PENDING`

### ✅ Test 3.2 — Get My Bookings
```
GET http://localhost:8081/api/bookings/me
```
**Expected:** `200 OK` with list of your bookings

### ✅ Test 3.3 — Cancel a Booking
```
PATCH http://localhost:8081/api/bookings/1/cancel
```
**Expected:** `200 OK` with status changed to `CANCELLED`

### ✅ Test 3.4 — Get All Bookings (Admin only)
```
GET http://localhost:8081/api/admin/bookings
```
**Expected:** `200 OK` with all bookings in the system

### ✅ Test 3.5 — Approve a Booking (Admin only)
```
PATCH http://localhost:8081/api/admin/bookings/1/approve
```
**Expected:** `200 OK` with status changed to `APPROVED`
> 💡 After this, check notifications — a BOOKING_APPROVED notification should be created!

### ✅ Test 3.6 — Reject a Booking (Admin only)
```
PATCH http://localhost:8081/api/admin/bookings/2/reject
Content-Type: application/json

{
  "reason": "Facility under maintenance"
}
```
**Expected:** `200 OK` with status changed to `REJECTED`

---

## MODULE 4: Maintenance Tickets

### ✅ Test 4.1 — Create a Ticket
```
POST http://localhost:8081/api/tickets
Content-Type: application/json

{
  "title": "Broken projector in Room 101",
  "description": "The projector is not turning on since morning",
  "location": "Room 101, Block A",
  "priority": "HIGH"
}
```
**Expected:** `201 Created` with status `OPEN`

### ✅ Test 4.2 — Get All Tickets (Admin/Technician)
```
GET http://localhost:8081/api/tickets
```
**Expected:** `200 OK` with all tickets

### ✅ Test 4.3 — Get My Submitted Tickets
```
GET http://localhost:8081/api/tickets/my
```
**Expected:** `200 OK` with tickets you created

### ✅ Test 4.4 — Get Tickets Assigned to Me (Technician)
```
GET http://localhost:8081/api/tickets/assigned
```
**Expected:** `200 OK` with tickets assigned to you

### ✅ Test 4.5 — Get Ticket by ID
```
GET http://localhost:8081/api/tickets/1
```
**Expected:** `200 OK` with full ticket details

### ✅ Test 4.6 — Update Ticket Status (Technician/Admin)
```
PUT http://localhost:8081/api/tickets/1/status
Content-Type: application/json

{
  "status": "IN_PROGRESS"
}
```
**Expected:** `200 OK` with updated status
> 💡 After this, check notifications — a TICKET_UPDATED notification should be created!

### ✅ Test 4.7 — Assign Ticket to Technician (Admin only)
```
PUT http://localhost:8081/api/tickets/1/assign
Content-Type: application/json

{
  "technicianId": 2
}
```
**Expected:** `200 OK`

---

## MODULE 5: Comments on Tickets

### ✅ Test 5.1 — Add a Comment to a Ticket
```
POST http://localhost:8081/api/tickets/1/comments
Content-Type: application/json

{
  "content": "I have checked the issue and ordered a replacement part."
}
```
**Expected:** `201 Created` with comment details
> 💡 After this, check notifications — a NEW_COMMENT notification should be created!

### ✅ Test 5.2 — Edit a Comment
```
PUT http://localhost:8081/api/tickets/1/comments/1
Content-Type: application/json

{
  "content": "Replacement part has arrived. Will fix tomorrow."
}
```
**Expected:** `200 OK` with updated comment

### ✅ Test 5.3 — Delete a Comment
```
DELETE http://localhost:8081/api/tickets/1/comments/1
```
**Expected:** `204 No Content`

---

## MODULE 6: Notifications (Member 4's Module)

### ✅ Test 6.1 — Get All My Notifications
```
GET http://localhost:8081/api/notifications/my
```
**Expected:** `200 OK` with list of your notifications

### ✅ Test 6.2 — Get Unread Count
```
GET http://localhost:8081/api/notifications/my/unread-count
```
**Expected:** `200 OK` with a count like `{"count": 3}`

### ✅ Test 6.3 — Mark One Notification as Read
```
PATCH http://localhost:8081/api/notifications/1/read
```
**Expected:** `200 OK`

### ✅ Test 6.4 — Mark All Notifications as Read
```
PATCH http://localhost:8081/api/notifications/my/read-all
```
**Expected:** `200 OK`

### ✅ Test 6.5 — Delete a Notification
```
DELETE http://localhost:8081/api/notifications/1
```
**Expected:** `204 No Content`

### ✅ Test 6.6 — Broadcast a Notification (Admin only)
```
POST http://localhost:8081/api/notifications/broadcast
Content-Type: application/json

{
  "message": "Campus will be closed on Friday for maintenance.",
  "type": "GENERAL"
}
```
**Expected:** `200 OK`

---

## MODULE 7: Notification Preferences

### ✅ Test 7.1 — Get My Notification Preferences
```
GET http://localhost:8081/api/notification-preferences/me
```
**Expected:** `200 OK` with your current preferences

### ✅ Test 7.2 — Update My Notification Preferences
```
PUT http://localhost:8081/api/notification-preferences/me
Content-Type: application/json

{
  "bookingUpdates": true,
  "ticketUpdates": true,
  "commentUpdates": false
}
```
**Expected:** `200 OK` with updated preferences

---

## MODULE 8: Admin — User Management (Member 4's Module)

### ✅ Test 8.1 — Get All Users (Admin only)
```
GET http://localhost:8081/api/admin/users
```
**Expected:** `200 OK` with all registered users

### ✅ Test 8.2 — Get All Technicians (Admin only)
```
GET http://localhost:8081/api/admin/users/technicians
```
**Expected:** `200 OK` with users who have TECHNICIAN role

### ✅ Test 8.3 — Change a User's Role (Admin only)
```
PUT http://localhost:8081/api/admin/users/2/role
Content-Type: application/json

{
  "role": "TECHNICIAN"
}
```
**Expected:** `200 OK` with updated user role

---

## ✅ End-to-End Test Flow (Do This to Show Everything Works Together)

Run these requests **in order** to demonstrate the full system flow:

| Step | Request | What to Verify |
|---|---|---|
| 1 | `GET /api/auth/me` | You are authenticated |
| 2 | `GET /api/resources` | Resources are loaded |
| 3 | `POST /api/bookings` | Booking created with PENDING |
| 4 | `PATCH /api/admin/bookings/1/approve` | Booking is APPROVED |
| 5 | `GET /api/notifications/my` | BOOKING_APPROVED notification exists ✔ |
| 6 | `POST /api/tickets` | Ticket created with OPEN |
| 7 | `PUT /api/tickets/1/status` body: IN_PROGRESS | Ticket status updated |
| 8 | `GET /api/notifications/my` | TICKET_UPDATED notification exists ✔ |
| 9 | `POST /api/tickets/1/comments` | Comment added |
| 10 | `GET /api/notifications/my` | NEW_COMMENT notification exists ✔ |
| 11 | `GET /api/notifications/my/unread-count` | Count > 0 ✔ |
| 12 | `PATCH /api/notifications/my/read-all` | All marked as read |
| 13 | `GET /api/notifications/my/unread-count` | Count = 0 ✔ |

---

## Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `401 Unauthorized` | Session expired or cookie missing | Re-login in browser, copy new JSESSIONID |
| `403 Forbidden` | Your role can't access that endpoint | Log in with an Admin account |
| `404 Not Found` | Wrong ID in the URL | Use ID 1 or check with GET first |
| `400 Bad Request` | Missing or wrong JSON fields | Check the request body format above |
