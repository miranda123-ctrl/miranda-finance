// 데이터 배열 초기화
let transactions = [];
let projects = [];
let clients = [];
let invoices = [];

// 섹션 전환
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        
        // 모든 섹션 숨기기
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // 선택된 섹션만 표시
        document.getElementById(targetId).classList.add('active');
        
        // 활성 링크 변경
        document.querySelectorAll('.nav-link').forEach(l => {
            l.classList.remove('active');
        });
        link.classList.add('active');
        
        // 선택된 섹션의 데이터만 업데이트
        switch(targetId) {
            case 'transactions':
                updateTransactionList();
                break;
            case 'projects':
                updateProjectList();
                updateProjectSelects();
                break;
            case 'clients':
                updateClientList();
                updateClientSelects();
                break;
            case 'reports':
                updateCharts();
                break;
            case 'invoices':
                updateInvoiceList();
                break;
        }
    });
});

// 초기 섹션 표시 (거래 내역만)
document.addEventListener('DOMContentLoaded', () => {
    // 모든 섹션 숨기기
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // 거래 내역 섹션 표시
    document.getElementById('transactions').classList.add('active');
    
    // 초기 데이터 로드
    updateTransactionList();
    updateProjectList();
    updateClientList();
    updateInvoiceList();
    updateCharts();
    updateProjectSelects();
    updateClientSelects();
});

// 거래 저장
document.getElementById('transactionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const transaction = {
        id: Date.now(),
        type: formData.get('type'),
        category: formData.get('category'),
        amount: parseFloat(formData.get('amount')),
        currency: formData.get('currency'),
        project: formData.get('project'),
        description: formData.get('description'),
        date: new Date().toISOString().split('T')[0],
        receipt: formData.get('receipt')
    };
    
    transactions.push(transaction);
    updateTransactionList();
    e.target.reset();
});

// 프로젝트 저장
document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const project = {
        id: Date.now(),
        name: formData.get('name'),
        client: formData.get('client'),
        startDate: formData.get('startDate'),
        endDate: formData.get('endDate'),
        budget: parseFloat(formData.get('budget')),
        currency: formData.get('currency'),
        hourlyRate: parseFloat(formData.get('hourlyRate'))
    };
    
    projects.push(project);
    updateProjectList();
    updateProjectSelects();
    e.target.reset();
});

// 고객 저장
document.getElementById('clientForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const client = {
        id: Date.now(),
        name: formData.get('name'),
        contact: formData.get('contact'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        paymentTerms: formData.get('paymentTerms')
    };
    
    clients.push(client);
    updateClientList();
    updateClientSelects();
    e.target.reset();
});

// 인보이스 저장
document.getElementById('invoiceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const invoice = {
        id: Date.now(),
        client: formData.get('client'),
        project: formData.get('project'),
        issueDate: formData.get('issueDate'),
        dueDate: formData.get('dueDate'),
        amount: parseFloat(formData.get('amount')),
        currency: formData.get('currency'),
        description: formData.get('description'),
        status: 'pending'
    };
    
    invoices.push(invoice);
    updateInvoiceList();
    e.target.reset();
});

// 거래 내역 업데이트
function updateTransactionList() {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';
    
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach(transaction => {
            const item = document.createElement('div');
            item.className = 'list-group-item';
            item.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${transaction.description || '거래'}</h6>
                        <small class="text-muted">${transaction.date}</small>
                    </div>
                    <div class="text-end">
                        <span class="badge ${transaction.type === 'income' ? 'bg-success' : 'bg-danger'}">
                            ${formatCurrency(transaction.amount)} ${transaction.currency}
                        </span>
                        <div class="text-muted small">${transaction.category}</div>
                    </div>
                </div>
            `;
            list.appendChild(item);
        });
}

// 프로젝트 목록 업데이트
function updateProjectList() {
    const list = document.getElementById('projectList');
    list.innerHTML = '';
    
    projects.forEach(project => {
        const client = clients.find(c => c.id === project.client);
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${project.name}</h6>
                    <small class="text-muted">${client ? client.name : '고객 없음'}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-primary">
                        ${formatCurrency(project.budget)} ${project.currency}
                    </span>
                    <div class="text-muted small">${project.startDate} ~ ${project.endDate || '진행중'}</div>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// 고객 목록 업데이트
function updateClientList() {
    const list = document.getElementById('clientList');
    list.innerHTML = '';
    
    clients.forEach(client => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${client.name}</h6>
                    <small class="text-muted">${client.contact}</small>
                </div>
                <div class="text-end">
                    <span class="badge bg-info">${client.paymentTerms}</span>
                    <div class="text-muted small">${client.email}</div>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// 인보이스 목록 업데이트
function updateInvoiceList() {
    const list = document.getElementById('invoiceList');
    list.innerHTML = '';
    
    invoices.forEach(invoice => {
        const client = clients.find(c => c.id === invoice.client);
        const project = projects.find(p => p.id === invoice.project);
        const item = document.createElement('div');
        item.className = 'list-group-item';
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${project ? project.name : '프로젝트 없음'}</h6>
                    <small class="text-muted">${client ? client.name : '고객 없음'}</small>
                </div>
                <div class="text-end">
                    <span class="badge ${getStatusColor(invoice.status)}">${invoice.status}</span>
                    <div class="text-muted small">${formatCurrency(invoice.amount)} ${invoice.currency}</div>
                </div>
            </div>
        `;
        list.appendChild(item);
    });
}

// 프로젝트 선택 옵션 업데이트
function updateProjectSelects() {
    const selects = document.querySelectorAll('select[name="project"]');
    selects.forEach(select => {
        select.innerHTML = '<option value="">프로젝트 선택</option>';
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
    });
}

// 고객 선택 옵션 업데이트
function updateClientSelects() {
    const selects = document.querySelectorAll('select[name="client"]');
    selects.forEach(select => {
        select.innerHTML = '<option value="">고객사 선택</option>';
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            select.appendChild(option);
        });
    });
}

// 차트 업데이트
function updateCharts() {
    // 프로젝트별 수익성 차트
    const projectProfitCtx = document.getElementById('projectProfitChart').getContext('2d');
    new Chart(projectProfitCtx, {
        type: 'bar',
        data: {
            labels: projects.map(p => p.name),
            datasets: [{
                label: '예산',
                data: projects.map(p => p.budget),
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 월별 수입/지출 차트
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
            datasets: [{
                label: '수입',
                data: [1200000, 1900000, 3000000, 5000000, 2000000, 3000000],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }, {
                label: '지출',
                data: [800000, 1200000, 1500000, 2000000, 1000000, 1500000],
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 카테고리별 지출 차트
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(categoryCtx, {
        type: 'pie',
        data: {
            labels: ['소프트웨어', '하드웨어', '사무용품', '마케팅', '기타'],
            datasets: [{
                data: [3000000, 2000000, 1000000, 1500000, 500000],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// 통화 포맷팅
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
}

// 상태에 따른 배지 색상
function getStatusColor(status) {
    switch(status) {
        case 'paid': return 'bg-success';
        case 'pending': return 'bg-warning';
        case 'overdue': return 'bg-danger';
        default: return 'bg-secondary';
    }
}
