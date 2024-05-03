const express = require("express");
const axios = require("axios");

// Create an instance of Express app
const app = express();

// Use middleware to parse request bodies
app.use(express.json());

const token = "";

//to verify the callback url from dashboard side
app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  const mytoken = "";

  if (mode && token) {
    if (mode === "subscribe" && token === mytoken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (body.object) {
    if (
      body.entry &&
      body.entry[0].changes &&
      body.entry[0].changes[0].value.messages &&
      body.entry[0].messages[0]
    ) {
      let phon_no_id = body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body.entry[0].changes[0].value.messages[0].from;
      let msg_body = body.entry[0].changes[0].value.messages[0].text.body;

      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v18.0/" +
          phon_no_id +
          "/messages?access_token=" +
          token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi I am here!!!",
          },
        },
        headers: {
          "content-type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(4000, () => {
  console.log("Webhook is runnning on port 4000");
});
