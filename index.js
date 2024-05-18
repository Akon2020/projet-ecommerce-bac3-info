import { data } from "./data.js";
import {
  generateDialogHTML,
  generateProductHTML,
  generatePanier,
} from "./functions.js";

// selection des elements
const productsContainer = document.querySelector(".produits");
const dialog = document.querySelector("#dialog");
const cartNumber = document.querySelector(".nombre");

let currentItem = null;

// Items in cart
let cartItems = [];
cartNumber.textContent = cartItems.length;
let produitAffciher = data;

// Code pour looper différents produits et les afficher

const afficherProduit = (produits) => {
  produits.forEach((product) => {
    const productHTML = document.createElement("div");
    productHTML.classList.add("carte-produit");
    //Ajout de l'id pour identifier chaque produit cliqué
    productHTML.setAttribute("data-id", product.id);
    productHTML.innerHTML = generateProductHTML(product);
    productsContainer.appendChild(productHTML);
  });
};

afficherProduit(produitAffciher);

// Recherche des produits
const input = document.querySelector(".recherche");

input.addEventListener("keyup", (e) => {
  console.log(e.target.value);
  const resultat = data.filter((p) =>
    p.nom.toLocaleLowerCase().includes(e.target.value)
  );
  productsContainer.innerHTML = "";
  if (resultat.length > 0) {
    afficherProduit(resultat);
    actionProduit();
  } else {
    const vide = document.createElement("div");
    // vide.textContent = "Aucun produit trouvé";
    // productsContainer.appendChild(vide);
    const empty = `<div class="rien"><i class="fa-solid fa-shop-slash"></i>
            <h2>Aucun produit trouvé</h2></div>`;
    productsContainer.innerHTML = empty;
  }
});
// Fonction pour tester si une fois un produit existe dans le panier

const testerSiExiste = (produit, arr) => {
  const ele = arr.find((p) => p.id === produit.id);
  return ele ? true : false;
};

const actionProduit = () => {
  // Ajout de l'action pour afficher la boite de dialogue
  const cards = document.querySelectorAll(".carte-produit");

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Selection des elements
      const dialog = document.querySelector("dialog");

      // Effacer le contenu d'avant
      const dialogContent = document.querySelector(".dialog-menu");

      dialogContent && dialogContent.remove();
      dialog.showModal();
      dialog.scrollTo(0, 0);
      const section = document.createElement("section");
      section.classList.add("dialog-menu");
      currentItem = data.filter((i) => i.id == card.dataset.id)[0];
      section.innerHTML = generateDialogHTML(currentItem);
      dialog.appendChild(section);

      // Selection element carte
      const btnAdd = document.querySelector(".ajouter");
      const qte = document.querySelector(".qte");
      let existedeja = false;
      const numberOfTimeIncart = cartItems.filter(
        (item) => item.id === currentItem.id
      );
      qte.textContent = numberOfTimeIncart.length;

      // Incrémenter la valeur
      const btnDimunuer = document.querySelector(".counter .fa-minus");
      const btnAjouter = document.querySelector(".counter .fa-plus");

      btnAjouter.addEventListener("click", () => {
        qte.textContent = numberOfTimeIncart.length++;
      });

      btnDimunuer.addEventListener("click", () => {
        if (parseInt(qte.textContent) > 0) {
          qte.textContent = numberOfTimeIncart.length--;
        }
      });

      // Ajouter dans le panier
      if (testerSiExiste(currentItem, cartItems)) {
        btnAdd.textContent = "Efface du panier";
        btnAdd.classList.add("ajoute");
        qte.textContent = 1;
      }

      btnAdd.addEventListener("click", () => {
        if (testerSiExiste(currentItem, cartItems)) {
          const b = `  <div class="icon"><i class="fa-solid fa-plus"></i></div>
            <p>Ajouter au panier</p>`;
          btnAdd.innerHTML = b;
          cartItems = cartItems.filter((item) => item.id !== currentItem.id);
          qte.textContent = 0;
          btnAdd.classList.remove("ajoute");
        } else {
          cartNumber.textContent = cartItems.length;
          btnAdd.textContent = "Efface du panier";
          btnAdd.classList.add("ajoute");
          qte.textContent = 1;
          console.log(cartItems);
          existedeja = true;
          cartItems.push(currentItem);
        }
        cartNumber.textContent = cartItems.length;
        console.log(btnAdd.dataset);
      });

      const bgPng = document.querySelector(".gauche");
      // Colors
      const colors = document.querySelectorAll(".color.change");
      colors.forEach((item, key) => {
        item.addEventListener("click", () => {
          switch (key) {
            case 0:
              bgPng.style.background = "#ff6b58";
              break;
            case 1:
              bgPng.style.background = "#3333";
              console.log(key);
            case 2:
              bgPng.style.background = "#3BC59A";
            default:
              break;
          }
        });
      });
    });
  });
};

actionProduit();

// Close popover
const btnClose = document.querySelector(".close");
btnClose.addEventListener("click", () => {
  dialog.close();
});

// Affichage des éléments du panier
const panier = document.querySelector(".carte");
const dialogy = document.querySelector("#dialogy");
const dialogyClose = document.querySelector("#dialogy .close");
const dialogyContainer = document.querySelector("#dialogy .container");

panier.addEventListener("click", () => {
  dialogy.showModal();
  dialogy.scrollTo(0, 0);
  if (cartItems.length === 0) {
    console.log(cartItems.length);
    const nothing = `<div class="rien"><i class="fa-solid fa-shop-slash"></i>
              <h2>Vous n'avez pas de produit dans votre panier</h2></div>`;
    dialogyContainer.innerHTML = nothing;
  } else {
    const montantTotal = cartItems.reduce(
      (total, item) => total + item.prix,
      0
    );
    const itemsHTML = `<div class="dialogyItem">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Designation du produit</th>
                <th>Prix</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems
                .map((item, i) => {
                  return `<tr>
                    <td>${i + 1}</td>
                    <td>${item.nom}</td>
                    <td>$ ${item.prix}</td>
                    <td><i class="fa-solid fa-trash" style="cursor: pointer;" onclick="supprimerProd(${
                      item.id
                    })"></i></td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>`;
    const info = `<div class="info">
      <h2>Panier - Bukavu COP</h2>
      <div class="paiementTot"> Montant total à payer: $ ${montantTotal}</div>
      </div>`;
    dialogyContainer.innerHTML = info + itemsHTML;
    // Add payment button
    const paiementBtn = document.createElement("button");
    paiementBtn.textContent = "Paiement sécurisé";
    paiementBtn.classList.add("paiementBtn");
    dialogyContainer.appendChild(paiementBtn);
    const paiementBox = document.getElementById("paiementBox");
    paiementBtn.addEventListener("click", () => {
      dialogy.close();
      paiementBox.showModal();
      paiementBox.scrollTo(0, 0);
    });
    /* dialogyContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("carte-produit");
      cartItem.innerHTML = generateProductHTML(item);
      dialogyContainer.appendChild(cartItem);
    }); */
  }
});
const supprimerProd = (elm) => {
  cartItems = cartItems.filter((sup) => sup !== elm);
};

// Add this line to make the supprimerProd function accessible globally
window.supprimerProd = supprimerProd;
panier.addEventListener("click", () => {
  dialogy.showModal();
  dialogy.scrollTo(0, 0);
  if (cartItems.length === 0) {
    console.log(cartItems.length);
    const nothing = `<div class="rien"><i class="fa-solid fa-shop-slash"></i>
              <h2>Vous n'avez pas de produit dans votre panier</h2></div>`;
    dialogyContainer.innerHTML = nothing;
  } else {
    const montantTotal = cartItems.reduce(
      (total, item) => total + item.prix,
      0
    );
    const itemsHTML = `<div class="dialogyItem">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Designation du produit</th>
                <th>Prix</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${cartItems
                .map((item, i) => {
                  return `<tr>
                    <td>${i + 1}</td>
                    <td>${item.nom}</td>
                    <td>$ ${item.prix}</td>
                    <td><i class="fa-solid fa-trash" style="cursor: pointer;" id="supprim" onclick="supprimerProd(${
                      item.id
                    })"></i></td>
                  </tr>`;
                })
                .join("")}
            </tbody>
          </table>
        </div>`;
    const info = `<div class="info">
      <h2>Panier - Bukavu COP</h2>
      <div class="paiementTot"> Montant total à payer: $ ${montantTotal}</div>
      </div>`;
    dialogyContainer.innerHTML = info + itemsHTML;
    const trash = document.getElementById("supprim");
    trash.addEventListener("click", (e) => {
      supprimerProd(e);
    });

    // Add payment button
    const paiementBtn = document.createElement("button");
    paiementBtn.textContent = "Paiement sécurisé";
    paiementBtn.classList.add("paiementBtn");
    dialogyContainer.appendChild(paiementBtn);

    const paiementBox = document.getElementById("paiementBox");
    paiementBtn.addEventListener("click", () => {
      dialogy.close();
      paiementBox.showModal();
      paiementBox.scrollTo(0, 0);
    });
    const quitterBtn = document.querySelector(".quitter");
    const payonsForm = document.querySelector("#payonsForm");
    const payonsBtn = document.querySelector(".payonsBtn");
    const others = document.querySelector(".others");
    payonsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      payonsBtn.textContent = "Paiement accepté";
      alert("Paiement reçu avec succès");
      cartItems.length = 0;
      cartItems = [];
      payonsForm.reset();
      paiementBox.close();
    });
    quitterBtn.addEventListener("click", () => {
      paiementBox.close();
    });
    others.addEventListener("click", () => {
      alert(
        "Cette fonctionnalité est indisponible pour le moment\nMerci de d'utiliser le paiement par carte en attendant"
      );
    });

    /* dialogyContainer.innerHTML = "";
    cartItems.forEach((item) => {
      const cartItem = document.createElement("div");
      cartItem.classList.add("carte-produit");
      cartItem.innerHTML = generateProductHTML(item);
      dialogyContainer.appendChild(cartItem);
    }); */
  }
});

dialogyClose.addEventListener("click", () => {
  dialogy.close();
});
