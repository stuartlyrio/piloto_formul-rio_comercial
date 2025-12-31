// --- FUNÇÕES DE MÁSCARA ---
const masks = {
    cpf(value) {
        return value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
    },
    tel(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1');
    },
    cep(value) {
        return value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
    }
};

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
        const field = e.target.id;
        if (masks[field] || field.includes('tel')) {
            const method = field.includes('tel') ? 'tel' : field;
            e.target.value = masks[method](e.target.value);
        }
    });
});

// --- BUSCA DE CEP (ViaCEP) ---
const cepInput = document.getElementById('cep');

cepInput.addEventListener('blur', () => {
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        // Sinaliza que está carregando
        const originalLabel = document.querySelector('label[for="cep"]').innerText;
        document.querySelector('label[for="cep"]').innerText = "CEP - Buscando...";

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro;
                    document.getElementById('bairro').value = data.bairro;
                    document.getElementById('cidade').value = data.localidade;
                    document.getElementById('numero').focus(); // Foca no número para o cliente continuar
                } else {
                    alert("CEP não encontrado.");
                }
            })
            .catch(error => {
                console.error("Erro ao buscar CEP:", error);
                alert("Erro ao buscar o CEP. Tente preencher manualmente.");
            })
            .finally(() => {
                document.querySelector('label[for="cep"]').innerText = "CEP";
            });
    }
});

// --- ENVIO DO FORMULÁRIO ---
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    console.log("Dados capturados:", data);
    alert("Cadastro enviado com sucesso!");
});