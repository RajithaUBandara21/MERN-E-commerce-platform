const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "AY6Mfmarj_ri3q4HFJHtSkfklKJyIBaKLHWKeyMvbVsvbzu2B8mGCgAOrIngmP290XDlFSSV_gJMTXIe",
  client_secret: "EPHn1LTM6XDPZ-kmNTrbXkqWMpiRSHE-IgZuLEHoAlobDud20LFeCKTxomkci34FnnNZepWJdti8pgFq",
});

module.exports = paypal;
