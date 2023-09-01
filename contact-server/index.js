const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const contactModel = require("./model/contactModel");
const mongoose = require("mongoose");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("http://localhost", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.get("/api/data", async (req, res) => {
  try {
    const contacts = await contactModel.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/data", async (req, res) => {
  try {
    const newContact = new contactModel(req.body);
    await newContact.save();
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error in contacts:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Duplicate email or phone" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.put("/api/data/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const updatedContact = await contactModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
      }
    );
    console.log(updatedContact);
    if (!updatedContact) {
      res.status(404).json({ error: "Contact not found" });
    } else {
      res.json(updatedContact);
    }
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Duplicate email or phone" });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

app.delete("/api/data/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deletedContact = await contactModel.findOneAndDelete({ _id: id });
    if (!deletedContact) {
      res.status(404).json({ error: "Contact not found" });
    } else {
      res.json("Contact deleted successfully");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
