// Inserir produtos
document.getElementById("form-produto").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evita recarregar a página

    // Captura os valores do formulário
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const quantidade = parseInt(document.getElementById("quantidade").value);

    // Cria o objeto do produto
    const novoProduto = { name: nome, description: descricao, price: preco, quantity: quantidade };

    // Envia para o backend
    const resposta = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoProduto)
    });

    // Verifica a resposta do servidor
    if (resposta.ok) {
        document.getElementById("mensagem").textContent = "Produto adicionado com sucesso!";
        document.getElementById("form-produto").reset(); // Limpa o formulário
        carregarProdutos(); // Atualiza a lista de produtos automaticamente
    } else {
        document.getElementById("mensagem").textContent = "Erro ao adicionar produto!";
    }
});

// Listar produtos
async function carregarProdutos() {
    try {
        const resposta = await fetch("http://localhost:3000/");
        const produtos = await resposta.json();

        const listaProdutos = document.getElementById("lista-produtos");
        listaProdutos.innerHTML = ""; // Limpar lista antes de adicionar

        produtos.forEach(produto => {
            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${produto.name}</strong> R$${produto.price.toFixed(2)} <br>
                ${produto.description} <br>
                Quantidade: ${produto.quantity} <br>
                <button onclick="editarProduto('${produto._id}', '${produto.name}', '${produto.description}', '${produto.price}', '${produto.quantity}')">Editar</button>
                <button onclick="deletarProduto('${produto._id}')">Deletar</button>
            `;
            listaProdutos.appendChild(li);
        });
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
    }
}

// Alterar produtos
function editarProduto(id, nome, descricao, preco, quantidade) {
    // Preencher os campos do formulário com os dados atuais do produto
    document.getElementById("produto-id").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("descricao").value = descricao;
    document.getElementById("preco").value = preco;
    document.getElementById("quantidade").value = quantidade;
}

async function atualizarProduto() {
    const id = document.getElementById("produto-id").value;
    const nome = document.getElementById("nome").value;
    const descricao = document.getElementById("descricao").value;
    const preco = document.getElementById("preco").value;
    const quantidade = document.getElementById("quantidade").value;

    if (!id) {
        alert("Selecione um produto para editar.");
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: nome,
                description: descricao,
                price: parseFloat(preco),
                quantity: parseInt(quantidade)
            })
        });

        if (resposta.ok) {
            alert("Produto atualizado com sucesso!");
            document.getElementById("form-produto").reset();
            document.getElementById("produto-id").value = "";
            carregarProdutos(); // Atualiza a lista de produtos automaticamente
        } else {
            alert("Erro ao atualizar o produto.");
        }
    } catch (erro) {
        console.error("Erro ao atualizar produto:", erro);
    }
}

// Deletar produtos
async function deletarProduto(id) {
    if (!confirm("Tem certeza que deseja deletar este produto?")) {
        return;
    }

    try {
        const resposta = await fetch(`http://localhost:3000/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            alert("Produto deletado com sucesso!");
            carregarProdutos(); // Atualiza a lista de produtos automaticamente
        } else {
            alert("Erro ao deletar o produto.");
        }
    } catch (erro) {
        console.error("Erro ao deletar produto:", erro);
    }
}

// Chama a função para carregar os produtos assim que a página for carregada
window.onload = carregarProdutos;
