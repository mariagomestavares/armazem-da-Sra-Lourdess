// Carrinho
let carrinho = [];
let total = 0;

function adicionarAoCarrinho(nomeProduto, precoProduto) {
    carrinho.push({ nome: nomeProduto, preco: precoProduto });
    atualizarCarrinho();
    total += precoProduto;
    document.getElementById("total").innerText = total.toFixed(2);
    atualizarItensCarrinho();
}

function atualizarCarrinho() {
    const cartCount = document.getElementById("cartCount");
    cartCount.innerText = carrinho.length;

    const carrinhoElement = document.getElementById("carrinho");
    if (carrinho.length > 0) {
        carrinhoElement.classList.remove("carrinho-fechado");
        carrinhoElement.classList.add("carrinho-aberto");
    } else {
        carrinhoElement.classList.remove("carrinho-aberto");
        carrinhoElement.classList.add("carrinho-fechado");
    }
}

function atualizarItensCarrinho() {
    const itensCarrinho = document.getElementById("itensCarrinho");
    itensCarrinho.innerHTML = '';

    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;
        itensCarrinho.appendChild(li);
    });

    atualizarItensPedido();
}

function atualizarItensPedido() {
    const listaPedido = document.getElementById("cart-items");
    listaPedido.innerHTML = '';

    carrinho.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.nome} - R$${item.preco.toFixed(2)}`;
        listaPedido.appendChild(li);
    });

    let totalEl = document.getElementById("cart-total");
    if (!totalEl) {
        totalEl = document.createElement("p");
        totalEl.id = "cart-total";
        document.getElementById("cart").appendChild(totalEl);
    }
    totalEl.innerHTML = `<strong>Total:</strong> R$${total.toFixed(2)}`;
}

function toggleCarrinho() {
    const carrinhoElement = document.getElementById("carrinho");
    carrinhoElement.classList.toggle("carrinho-aberto");
    carrinhoElement.classList.toggle("carrinho-fechado");
}

function finalizarPedido() {
    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    const pedido = carrinho.map(item => `${item.nome} - R$${item.preco.toFixed(2)}`).join('\n');
    const mensagem = `Olá, gostaria de fazer um pedido:\n\n${pedido}\n\nTotal: R$${total.toFixed(2)}`;
    const whatsappUrl = `https://wa.me/5543996795604?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsappUrl, "_blank");
}

document.getElementById("checkout-button").addEventListener("click", finalizarPedido);


function calcularCRC16(payload) {
    let polinomio = 0x1021;
    let resultado = 0xFFFF;

    for (let i = 0; i < payload.length; i++) {
        resultado ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((resultado <<= 1) & 0x10000) resultado ^= polinomio;
            resultado &= 0xFFFF;
        }
    }
    return resultado.toString(16).toUpperCase().padStart(4, '0');
}


document.getElementById("gerar-qr-button").addEventListener("click", function() {
    if (total === 0) {
        alert("O carrinho está vazio. Adicione produtos antes de gerar o QR Code.");
        return;
    }

    const valorPIX = total.toFixed(2);

    const pixData = {
        chave: "14958480943",         
        nome: "Maria",        
        cidade: "Rio Branco",         
    };

   
    let payloadSemCRC =
        "000201" +
        "010211" +
        "26370016BR.GOV.BCB.PIX" +
        `0113${pixData.chave}` +
        "52040000" +
        "5303986" +  // BRL
        `54${valorPIX.length === 4 ? '0' : ''}${valorPIX}` +
        "5802BR" +
        `5913${pixData.nome}` +
        `6009${pixData.cidade}` +
        "62070503***" +
        "6304";

   
    const crc16 = calcularCRC16(payloadSemCRC);
    const payloadFinal = payloadSemCRC + crc16;

    
    QRCode.toCanvas(document.getElementById("qrcode"), payloadFinal, function (error) {
        if (error) console.error(error);
        else console.log("QR Code gerado com sucesso!");
    });
});
