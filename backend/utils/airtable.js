const axios = require("axios");

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_API_URL = process.env.AIRTABLE_API_URL;

async function createAirtableRecord(baseId, tableId, fields) {
  try {
    const url = `${AIRTABLE_API_URL}/${baseId}/${tableId}`;

    const response = await axios.post(
      url,
      { fields },
      {
        headers: {
          Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (err) {
    console.error("Airtable error:", err.response?.data || err.message);
    throw new Error("Failed to create Airtable record");
  }
}


async function createAirtableTable(baseId, tableName, questions) {
  try {
    const url = `https://api.airtable.com/v0/meta/bases/${baseId}/tables`;

const fields = questions.map((q) => {
  let airtableField = {
    name: q.label || "field",
    type: "singleLineText",
  };

  switch (q.type) {
    case "short_text":
      airtableField.type = "singleLineText";
      break;

    case "long_text":
      airtableField.type = "longText";
      break;

    case "number":
      airtableField.type = "number";
      airtableField.options = { precision: 0 };
      break;

    case "date":
      airtableField.type = "date";
      airtableField.options = { dateFormat: "local" };
      break;

    case "dropdown": 
    case "radio":
      airtableField.type = "singleSelect";
      airtableField.options = {
        choices: (q.options || []).map(opt => ({ name: opt })),
      };
      break;

    case "checkbox": 
      airtableField.type = "multiSelect";
      airtableField.options = {
        choices: (q.options || []).map(opt => ({ name: opt })),
      };
      break;

    default:
      airtableField.type = "singleLineText";
  }

  return airtableField;
});


    const body = {
      name: tableName,
      fields
    };

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; 
  } catch (err) {
    console.error("Airtable TABLE creation error:", err.response?.data || err.message);
    throw new Error("Failed to create Airtable table");
  }
}

module.exports = { 
  createAirtableRecord,
  createAirtableTable 
};

