let APIcontent = document.querySelector("#APIcontent");

fetch("http://localhost:3001")
  .then(r => r.json())
  .then(data => {
    APIcontent.textContent = data.message;
  })
  .catch(err => {
    console.error("Errore nella richiesta al backend:", err);
  });
