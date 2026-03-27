import React from "react";

export default function SessionExpiredModal({ open }) {
  if (!open) return null;
  return (
    <div>
      <h2>Session expired</h2>
      <p>Please sign in again.</p>
    </div>
  );
}
