// ====== OTP Logic ======
document.getElementById("sendOtp").onclick = async () => {
  const phone = document.getElementById("phone").value;
  if (!phone) return alert("Enter phone number");

  const res = await fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });

  const data = await res.json();
  alert(data.message);
};

document.getElementById("verifyOtp").onclick = async () => {
  const phone = document.getElementById("phone").value;
  const otp = document.getElementById("otp").value;
  if (!otp) return alert("Enter OTP");

  const res = await fetch("/api/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });

  const data = await res.json();
  alert(data.message);
};

// ====== Fetch & Display Products ======
async function loadProducts() {
  const container = document.getElementById("productList");
  try {
    const res = await fetch("/api/product");
    const products = await res.json();

    if (products.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = "";
    products.forEach((p) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${p.name} (${p.brand})</h3>
        <p>Price: ₹${p.price} | Stock: ${p.stock}</p>
        <button onclick="editProduct('${p._id}')">Edit</button>
        <button onclick="deleteProduct('${p._id}')">Delete</button>
        <hr/>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    container.innerHTML = "<p>Error loading products.</p>";
    console.error(err);
  }
}

// ====== Edit & Delete Functions ======
async function editProduct(id) {
  const newName = prompt("Enter new product name:");
  if (!newName) return;

  try {
    await fetch(`/api/product/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    alert("Product updated!");
    loadProducts();
  } catch (err) {
    alert("Failed to update product.");
    console.error(err);
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await fetch(`/api/product/${id}`, { method: "DELETE" });
    alert("Product deleted!");
    loadProducts();
  } catch (err) {
    alert("Failed to delete product.");
    console.error(err);
  }
}

// ====== Initial Load ======
loadProducts(); 