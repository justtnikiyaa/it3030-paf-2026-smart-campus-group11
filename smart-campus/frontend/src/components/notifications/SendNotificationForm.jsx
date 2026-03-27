import React from "react";

export default function SendNotificationForm() {
  return (
    <form>
      <label htmlFor="title">Title</label>
      <input id="title" name="title" />
      <label htmlFor="message">Message</label>
      <textarea id="message" name="message" />
      <button type="submit">Send</button>
    </form>
  );
}
