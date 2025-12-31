// Funções de Validação Algorítmica
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

// Máscaras de Input
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
            document.getElementById('date-error').innerText = isAdult ? "" : "Menor de 18 anos";
        }
    });
});

// Busca CEP
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r => r.json()).then(d => {
            if (!d.erro) {
                document.getElementById('endereco').value = d.logradouro;
                document.getElementById('bairro').value = d.bairro;
                document.getElementById('cidade').value = d.localidade;
                document.getElementById('numero').focus();
            }
        });
    }
});

// ENVIO PARA WHATSAPP
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const cpf = document.getElementById('cpf').value;
    const nasc = document.getElementById('nascimento').value;

    if (!validarCPF(cpf) || !validarIdade(nasc)) {
        alert("Corrija os erros destacados antes de enviar.");
        return;
    }

    // Coleta dos dados para a mensagem
    const f = new FormData(this);
    const d = Object.fromEntries(f.entries());

    // Formatação da Mensagem conforme sua solicitação
    let mensagem = `*SOLICITAÇÃO DE NOVO CADASTRO*\n\n`;
    mensagem += `📌NOME: ${d.nome}\n`;
    mensagem += `📌CPF: ${d.cpf}\n`;
    mensagem += `📌DATA DE NASCIMENTO: ${d.nascimento.split('-').reverse().join('/')}\n`;
    mensagem += `📌E-MAIL: ${d.email}\n`;
    mensagem += `📌TELEFONE 1: ${d.tel1}\n`;
    mensagem += `📌TELEFONE 2: ${d.tel2 || 'Não informado'}\n`;
    mensagem += `📌CEP: ${d.cep}\n`;
    mensagem += `📌ENDEREÇO: ${d.endereco}\n`;
    mensagem += `📌NÚMERO: ${d.numero}\n`;
    mensagem += `📌BAIRRO: ${d.bairro}\n`;
    mensagem += `📌CIDADE: ${d.cidade}\n`;
    mensagem += `📌PONTO DE REFERENCIA: ${d.referencia || 'N/A'}\n`;
    mensagem += `📌COMPLEMENTO: ${d.complemento || 'N/A'}\n`;
    mensagem += `📌PLANO ESCOLHIDO: ${d.plano}\n`;
    mensagem += `📌FORMA DE PAGAMENTO: ${d.pagamento}\n`;
    mensagem += `📌DATA DE VENCIMENTO: ${d.vencimento}\n`;
    mensagem += `📌COMO CONHECEU: ${d.conheceu}\n\n`;
    mensagem += `*Cliente declarou estar de acordo com a LGPD e as informações acima.* ✅`;

    // Número do WhatsApp (apenas números com código do país)
    const numeroWhats = "5522997295233";
    const url = `https://api.whatsapp.com/send?phone=${numeroWhats}&text=${encodeURIComponent(mensagem)}`;

    window.open(url, '_blank');
});