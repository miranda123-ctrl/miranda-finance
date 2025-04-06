// 데이터 저장소
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let projects = JSON.parse(localStorage.getItem('projects')) || [];
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let invoices = JSON.parse(localStorage.getItem('invoices')) || [];

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', () => {
    // 초기 데이터 로드
    updateTransactionList();
    updateProjectList();
    updateClientList();
    updateInvoiceList();
    updateProjectSelects();
    updateClientSelects();
    initializeCharts();
});

// 네비게이션 이벤트 리스너
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
        
        // 차트 업데이트
        if (targetId === 'reports') {
            updateCharts();
        }
    });
});

// 거래 내역 폼 제출
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
        date: new Date().toISOString().split('T')[0]
    };
    
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    updateTransactionList();
    updateCharts();
    e.target.reset();
});

// 프로젝트 폼 제출
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
    
    projects.unshift(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    updateProjectList();
    updateProjectSelects();
    e.target.reset();
});

// 고객 폼 제출
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
    
    clients.unshift(client);
    localStorage.setItem('clients', JSON.stringify(clients));
    
    updateClientList();
    updateClientSelects();
    e.target.reset();
});

// 인보이스 폼 제출
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
    
    invoices.unshift(invoice);
    localStorage.setItem('invoices', JSON.stringify(invoices));
    
    updateInvoiceList();
    e.target.reset();
});

// 거래 내역 목록 업데이트
function updateTransactionList() {
    const list = document.getElementById('transactionList');
    list.innerHTML = '';
    
    transactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        
        const project = projects.find(p => p.id === parseInt(transaction.project));
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${transaction.description || '(설명 없음)'}</h6>
                    <small class="text-muted">
                        ${project ? project.name : ''} · ${transaction.date}
                    </small>
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
        const client = clients.find(c => c.id === parseInt(project.client));
        const item = document.createElement('div');
        item.className = 'list-group-item';
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${project.name}</h6>
                    <small class="text-muted">
                        ${client ? client.name : '고객사 없음'}
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge bg-primary">
                        ${formatCurrency(project.budget)} ${project.currency}
                    </span>
                    <div class="text-muted small">
                        ${project.startDate} ~ ${project.endDate || '진행중'}
                    </div>
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
                    <div class="text-muted small">${client.email}</div>
                    <div class="text-muted small">${client.phone}</div>
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
        const client = clients.find(c => c.id === parseInt(invoice.client));
        const project = projects.find(p => p.id === parseInt(invoice.project));
        const item = document.createElement('div');
        item.className = 'list-group-item';
        
        item.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${project ? project.name : '프로젝트 없음'}</h6>
                    <small class="text-muted">
                        ${client ? client.name : '고객사 없음'} · ${invoice.issueDate}
                    </small>
                </div>
                <div class="text-end">
                    <span class="badge ${getStatusColor(invoice.status)}">
                        ${formatCurrency(invoice.amount)} ${invoice.currency}
                    </span>
                    <div class="text-muted small">마감일: ${invoice.dueDate}</div>
                </div>
            </div>
        `;
        
        list.appendChild(item);
    });
}

// 프로젝트 선택 옵션 업데이트
function updateProjectSelects() {
    document.querySelectorAll('select[name="project"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">프로젝트 선택</option>';
        
        projects.forEach(project => {
            const option = document.createElement('option');
            option.value = project.id;
            option.textContent = project.name;
            select.appendChild(option);
        });
        
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// 고객 선택 옵션 업데이트
function updateClientSelects() {
    document.querySelectorAll('select[name="client"]').forEach(select => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">고객사 선택</option>';
        
        clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            select.appendChild(option);
        });
        
        if (currentValue) {
            select.value = currentValue;
        }
    });
}

// 차트 초기화 및 업데이트
function initializeCharts() {
    // 프로젝트별 수익성 차트
    const projectProfitCtx = document.getElementById('projectProfitChart').getContext('2d');
    window.projectProfitChart = new Chart(projectProfitCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: '수익',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 월별 수입/지출 차트
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    window.monthlyChart = new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: '수입',
                    data: [],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: '지출',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // 카테고리별 지출 차트
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    window.categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
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

// 차트 데이터 업데이트
function updateCharts() {
    // 프로젝트별 수익성 업데이트
    const projectData = projects.map(project => {
        const income = transactions
            .filter(t => t.project === project.id.toString() && t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions
            .filter(t => t.project === project.id.toString() && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            name: project.name,
            profit: income - expenses
        };
    });

    window.projectProfitChart.data.labels = projectData.map(p => p.name);
    window.projectProfitChart.data.datasets[0].data = projectData.map(p => p.profit);
    window.projectProfitChart.update();

    // 월별 수입/지출 업데이트
    const months = getLastSixMonths();
    const monthlyData = months.map(month => {
        const monthTransactions = transactions.filter(t => t.date.startsWith(month));
        return {
            income: monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0),
            expenses: monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0)
        };
    });

    window.monthlyChart.data.labels = months.map(formatMonth);
    window.monthlyChart.data.datasets[0].data = monthlyData.map(d => d.income);
    window.monthlyChart.data.datasets[1].data = monthlyData.map(d => d.expenses);
    window.monthlyChart.update();

    // 카테고리별 지출 업데이트
    const expensesByCategory = {};
    transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
            expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
        });

    window.categoryChart.data.labels = Object.keys(expensesByCategory);
    window.categoryChart.data.datasets[0].data = Object.values(expensesByCategory);
    window.categoryChart.update();
}

// 유틸리티 함수들
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR').format(amount);
}

function getStatusColor(status) {
    switch(status) {
        case 'paid': return 'bg-success';
        case 'pending': return 'bg-warning';
        case 'overdue': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

function getLastSixMonths() {
    const months = [];
    const date = new Date();
    for (let i = 0; i < 6; i++) {
        const month = date.getMonth() - i;
        const year = date.getFullYear() + Math.floor(month / 12);
        const adjustedMonth = ((month % 12) + 12) % 12;
        months.unshift(`${year}-${String(adjustedMonth + 1).padStart(2, '0')}`);
    }
    return months;
}

function formatMonth(yearMonth) {
    const [year, month] = yearMonth.split('-');
    return `${year}년 ${month}월`;
}
