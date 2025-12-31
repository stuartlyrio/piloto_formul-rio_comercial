// Funções de Máscara
const masks = {
    cpf(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    },
    tel(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    },
    cep(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    }
};

// Aplicar máscaras nos campos em tempo real
document.querySelectorAll('input').forEach(input => {
    const field = input.id;
    if (masks[field] || field.includes('tel')) {
        input.addEventListener('input', (e) => {
            const method = field.includes('tel') ? 'tel' : field;
            e.target.value = masks[method](e.target.value);
        }, false);
    }
});

// Manipulação do envio
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coleta todos os campos
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    console.log("Dados prontos para envio:", data);
    
    alert("Cadastro enviado com sucesso! Verifique o console do navegador para ver os dados capturados.");
    
    // this.reset(); // Opcional: limpa o formulário após enviar
});