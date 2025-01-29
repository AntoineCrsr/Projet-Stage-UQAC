const form = document.querySelector("#signupForm");

form.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const data = {
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        password: document.getElementById("password").value,
    };

    fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Assurez-vous d'avoir ce header
        },
        body: JSON.stringify(data), // Transformez les données en JSON
    })
        .then((response) => response.json())
        .then((data) => console.log("Success:", data))
        .catch((error) => console.error("Error:", error));
});

const formLogin = document.querySelector("#loginForm");

formLogin.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le rechargement de la page

    const data = {
        email: document.getElementById("emailLogin").value,
        password: document.getElementById("passwordLogin").value,
    };

    fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json", // Assurez-vous d'avoir ce header
        },
        body: JSON.stringify(data), // Transformez les données en JSON
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Success:", data)
            const token = data.token
            console.log(`Token: ${token}`)
            
            if (token !== undefined) {
                // Gestion des voitures:
                fetch("http://localhost:3000/api/car", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json", // Assurez-vous d'avoir ce header
                        "Authorization": `Bearer ${token}`, // Ajoute le token dans les headers
                    }})
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log(data); // Le tableau des voitures
                            showCreateCar(); // Afficher le form pour créer des voitures
                        
                            document.getElementById("carForm").addEventListener("submit", async (e) => {
                                e.preventDefault(); // Empêche le rechargement de la page
                        
                                const formData = new FormData(); // permet d'envoyer à la fois des images ET des datas
                                formData.append("car", JSON.stringify({
                                    name: document.getElementById("carName").value,
                                    marque: document.getElementById("carMarque").value,
                                    immatriculation: document.getElementById("carImmatriculation").value,
                                }));
                        
                                // Récupération de l'image
                                const imageFile = document.getElementById("carImage").files[0];
                                if (imageFile) {
                                    formData.append("image", imageFile);
                                }
                        
                                fetch("http://localhost:3000/api/car", {
                                    method: "POST",
                                    headers: {
                                        "Authorization": `Bearer ${token}`, // Ajoute le token dans les headers
                                    },
                                    body: formData, // Envoie les données avec `FormData`
                                }).then(response => {
                                    console.log("Success:", response);
                                })
                            });
                        })
                        .catch((error) => console.error("Error:", error));                        
            }
        })
        .catch((error) => console.error("Error:", error));
});

function showCreateCar() {
    const htmlForm = `
    <form id="carForm" method="post" action="http://localhost:3000/api/car" style="display: flex; flex-direction: column;">
        <h1>Create a car</h1>

        <label for="carName">Name:</label>
        <input id="carName" type="text" name="name">

        <label for="carMarque">Marque:</label>
        <input id="carMarque" type="text" name="marque">
        
        <label for="carImmatriculation">Immatriculation:</label>
        <input id="carImmatriculation" type="text" name="immatriculation">
        
        <label for="carImage">Image:</label>
        <input id="carImage" type="file" name="carImage">

        <input type="submit" value="Submit">
    </form>
    `
    document.getElementById("formCar").innerHTML = htmlForm
}