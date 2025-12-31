// --- VALIDAÇÕES LÓGICAS ---

function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.substring(10, 11));
}

function validarIdade(data) {
    const nasc = new Date(data);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade >= 18;
}

// --- MÁSCARAS ---
const masks = {
    cpf: v => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1'),
    tel: v => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1'),
    cep: v => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1')
};

// Aplicar máscaras e validação instantânea
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
        const id = e.target.id;
        if (masks[id] || id.includes('tel')) {
            e.target.value = masks[id.includes('tel') ? 'tel' : id](e.target.value);
        }
    });

    // Verificação Instantânea (ao sair do campo)
    input.addEventListener('blur', (e) => {
        const val = e.target.value;
        if (e.target.id === 'cpf') {
            const errorSpan = document.getElementById('cpf-error');
            if (val && !validarCPF(val)) {
                e.target.classList.add('invalid');
                errorSpan.innerText = "CPF Inválido";
            } else if (val) {
                e.target.classList.remove('invalid');
                e.target.classList.add('valid');
                errorSpan.innerText = "";
            }
        }

        if (e.target.id === 'nascimento') {
            const errorSpan = document.getElementById('date-error');
            if (val && !validarIdade(val)) {
                e.target.classList.add('invalid');
                errorSpan.innerText = "Necessário ser maior de 18 anos";
            } else if (val) {
                e.target.classList.remove('invalid');
                e.target.classList.add('valid');
                errorSpan.innerText = "";
            }
        }
    });
});

// --- BUSCA CEP ---
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(r => r.json())
            .then(d => {
                if (!d.erro) {
                    document.getElementById('endereco').value = d.logradouro;
                    document.getElementById('bairro').value = d.bairro;
                    document.getElementById('cidade').value = d.localidade;
                    document.getElementById('numero').focus();
                }
            });
    }
});

// --- SUBMIT FINAL ---
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    const cpf = document.getElementById('cpf').value;
    const nasc = document.getElementById('nascimento').value;

    if (!validarCPF(cpf) || !validarIdade(nasc)) {
        alert("Por favor, corrija os erros em vermelho antes de enviar.");
        e.preventDefault();
        return;
    }
    
    alert("Cadastro validado e enviado com sucesso!");
});