let tokenCounter = 1;
let identifierCounter = 401;
let constantCounter = 600;

function analyze() {
    const inputText = document.getElementById('inputText').value;
    const lines = inputText.split('\n');
    let tokenTableModel = '';
    let identifierTableModel = '';
    let constantTableModel = '';

    lines.forEach((line, lineCount) => {
        line = line.trim();
        if (line !== '') {
            const tokens = line.split(/\b|(?<=[,.=])|(?=[,.=])/);
            tokens.forEach(token => {
                if (token !== '') {
                    const info = getTokenInfo(token);
                    if (info[0] !== 'Inválido') {
                        const code = getCode(token, info[0]);
                        tokenTableModel += `<tr><td>${tokenCounter++}</td><td>${lineCount + 1}</td><td>${token}</td><td>${info[0]}</td><td>${code}</td></tr>`;
                        if (info[0] === 'Identificador') {
                            identifierTableModel += `<tr><td>${token}</td><td>${identifierCounter++}</td><td>${lineCount + 1}</td></tr>`;
                        } else if (info[0] === 'Constante') {
                            constantTableModel += `<tr><td>${constantCounter++}</td><td>${token}</td><td>String</td><td>${code}</td></tr>`;
                        }
                    }
                }
            });
        }
    });

    const result = `
        <div class="tab-pane active">
            <table>
                <thead>
                    <tr><th>No.</th><th>Línea</th><th>TOKEN</th><th>Tipo</th><th>Código</th></tr>
                </thead>
                <tbody>${tokenTableModel}</tbody>
            </table>
        </div>
        <div class="tab-pane">
            <table>
                <thead>
                    <tr><th>Identificador</th><th>Valor</th><th>Línea</th></tr>
                </thead>
                <tbody>${identifierTableModel}</tbody>
            </table>
        </div>
        <div class="tab-pane">
            <table>
                <thead>
                    <tr><th>No.</th><th>Constante</th><th>Tipo</th><th>Valor</th></tr>
                </thead>
                <tbody>${constantTableModel}</tbody>
            </table>
        </div>
    `;
    document.getElementById('result').innerHTML = result;
}

function getTokenInfo(token) {
    if (['SELECT', 'FROM', 'WHERE', 'AND'].includes(token)) {
        return ['Palabras Reservadas', '1'];
    } else if (['ANOMBRE', 'CALIFICACION', 'TURNO', 'ALUMNOS', 'INSCRITOS', 'MATERIAS', 'CARRERAS', 'MNOMBRE', 'CNOMBRE', 'SEMESTRE'].includes(token)) {
        return ['Identificador', '4'];
    } else if ([',', '='].includes(token)) {
        return ['Operador', '5'];
    } else if (token.match(/'[^']*'/)) {
        return ['Constante', '6'];
    } else if (token.match(/[><]=?/)) {
        return ['Relacionales', '84'];
    } else if (token.match(/^\d+$/)) {
        return ['Constante', '61'];
    } else if (token.match(/\b\w+\b/)) {
        return ['Palabra', '99'];
    } else {
        return ['Inválido', '-1'];
    }
}

const tokenCounts = new Map();
const initialCodes = new Map();

function getCode(token, type) {
    if (!tokenCounts.has(token)) {
        initialCodes.set(token, tokenCounter);
        tokenCounts.set(token, 0);
    }
    const currentCount = tokenCounts.get(token);
    tokenCounts.set(token, currentCount + 1);
    return initialCodes.get(token) + currentCount;
}