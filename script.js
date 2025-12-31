// --- VALIDAÇÃO CPF E IDADE ---
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

document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', (e) => {
        const id = e.target.id;
        if (masks[id] || id.includes('tel')) {
            e.target.value = masks[id.includes('tel') ? 'tel' : id](e.target.value);
        }
    });

    input.addEventListener('blur', (e) => {
        const val = e.target.value;
        if (e.target.id === 'cpf' && val) {
            const isValid = validarCPF(val);
            e.target.classList.toggle('invalid', !isValid);
            e.target.classList.toggle('valid', isValid);
            document.getElementById('cpf-error').innerText = isValid ? "" : "CPF Inválido";
        }
        if (e.target.id === 'nascimento' && val) {
            const isAdult = validarIdade(val);
            e.target.classList.toggle('invalid', !isAdult);
            e.target.classList.toggle('valid', isAdult);
            document.getElementById('date-error').innerText = isAdult ? "" : "Titular deve ser maior de 18 anos";
        }
    });
});

// --- BUSCA CEP ---
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        // Feedback visual de carregamento
        document.getElementById('endereco').value = "Buscando...";
        
        fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json()).then(d => {
            if (!d.erro) {
                document.getElementById('endereco').value = d.logradouro;
                document.getElementById('bairro').value = d.bairro;
                document.getElementById('cidade').value = d.localidade;
                document.getElementById('numero').focus();
            } else {
                document.getElementById('endereco').value = "";
                alert("CEP não encontrado.");
            }
        });
    }
});

// --- ENVIO WHATSAPP ---
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const nasc = document.getElementById('nascimento').value;

    if (!validarCPF(cpf) || !validarIdade(nasc)) {
        alert("Por favor, corrija os campos em vermelho antes de enviar.");
        return;
    }

    const f = new FormData(this);
    const d = Object.fromEntries(f.entries());

    // Ícones e formatação para o WhatsApp
    let msg = `*NOVA SOLICITAÇÃO DE CADASTRO* 🚀\n\n`;
    msg += `👤 *NOME:* ${d.nome}\n`;
    msg += `📄 *CPF:* ${d.cpf}\n`;
    msg += `🎂 *NASCIMENTO:* ${d.nascimento.split('-').reverse().join('/')}\n`;
    msg += `📧 *E-MAIL:* ${d.email}\n`;
    msg += `📱 *TELEFONE 1:* ${d.tel1}\n`;
    msg += `📱 *TELEFONE 2:* ${d.tel2 || '--'}\n\n`;
    msg += `📍 *ENDEREÇO DE INSTALAÇÃO*\n`;
    msg += `CEP: ${d.cep}\n`;
    msg += `RUA: ${d.endereco}, Nº ${d.numero}\n`;
    msg += `BAIRRO: ${d.bairro}\n`;
    msg += `CIDADE: ${d.cidade}\n`;
    msg += `COMPLEMENTO: ${d.complemento || '--'}\n`;
    msg += `REF: ${d.referencia || '--'}\n\n`;
    msg += `📡 *PLANO:* ${d.plano}\n`;
    msg += `💰 *INSTALAÇÃO:* ${d.pagamento}\n`;
    msg += `📅 *VENCIMENTO:* Dia ${d.vencimento}\n`;
    msg += `🗣️ *CONHECEU:* ${d.conheceu}\n\n`;
    msg += `✅ *Aceite LGPD Confirmado*`;

    // SEU NÚMERO AQUI (Mantenha o 55 e o DDD)
    const telefone = "5522997295233"; 
    
    window.open(`https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(msg)}`, '_blank');
});