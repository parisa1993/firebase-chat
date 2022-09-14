import React from "react";
import Attachment from "./Attachment";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export default function MessageForm({ handleSubmit, text, setText, setImg }) {
  return (
    <div>
         <Form className="message-form" onSubmit={handleSubmit}>
            {/* <label htmlFor="img"> <Attachment /> </label> */}
        <Form.Label htmlFor="img"> <Attachment /></Form.Label>
        <Form.Group className="mb-3">
          <Form.Control
            onChange={(e) => setImg(e.target.files[0])}
            type="file"
            id="img"
            accept="image/*"
            style={{ display: "none" }}
          />
        </Form.Group>

        <Form.Group className="mb-3" >
          <Form.Control
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" >
            Send
        </Button>
      </Form>
    </div>
  )
}
