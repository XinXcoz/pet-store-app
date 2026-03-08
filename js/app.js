// 购物车数据
let cart = [];

// 页面切换
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(pageId).classList.add('active');
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 更新标题
    const titles = {
        'dashboard': '首页',
        'member': '会员管理',
        'appointment': '预约管理',
        'cashier': '收银台',
        'inventory': '库存管理',
        'statistics': '数据统计'
    };
    document.querySelector('.page-title').textContent = titles[pageId];
}

// 登录
function login() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
}

// 侧边栏切换
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

// 弹窗控制
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// 添加到购物车
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    
    // 显示提示
    showToast(`已添加 ${name}`);
}

// 更新购物车UI
function updateCartUI() {
    const cartList = document.getElementById('cart-list');
    
    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart">
                <i class="ri-shopping-cart-line"></i>
                <p>购物车是空的</p>
            </div>
        `;
    } else {
        cartList.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">¥${item.price}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
                </div>
                <div class="cart-item-total">¥${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');
    }
    
    // 更新汇总
    updateCartSummary();
}

// 更新数量
function updateQty(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartUI();
}

// 清空购物车
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('确定清空购物车吗？')) {
        cart = [];
        updateCartUI();
    }
}

// 更新购物车汇总
function updateCartSummary() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const original = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 会员折扣（假设金卡9折）
    const discount = original * 0.1;
    const total = original - discount;
    
    document.getElementById('cart-count').textContent = count + '件';
    document.getElementById('cart-original').textContent = '¥' + original.toFixed(2);
    document.getElementById('cart-discount').textContent = '-¥' + discount.toFixed(2);
    document.getElementById('cart-total').textContent = '¥' + total.toFixed(2);
}

// 结算
function checkout() {
    if (cart.length === 0) {
        showToast('购物车是空的', 'error');
        return;
    }
    
    const total = document.getElementById('cart-total').textContent;
    
    if (confirm(`确认收款 ${total} ？`)) {
        showToast('收款成功！', 'success');
        cart = [];
        updateCartUI();
    }
}

// 显示提示
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        z-index: 10000;
        animation: slideDown 0.3s ease;
    `;
    
    if (type === 'success') {
        toast.style.background = '#52c41a';
    } else if (type === 'error') {
        toast.style.background = '#ff4d4f';
    } else {
        toast.style.background = '#333';
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

// 生成日历
generateCalendar();

function generateCalendar() {
    const calendarGrid = document.querySelector('.calendar-grid');
    const days = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 已添加星期标题在HTML中
    // 这里生成日期
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // 空白格子
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // 日期格子
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.innerHTML = `<span class="day-number">${day}</span>`;
        
        // 标记今天
        if (day === today.getDate()) {
            dayEl.classList.add('today');
        }
        
        // 模拟一些预约标记
        if ([8, 10, 15, 20].includes(day)) {
            dayEl.classList.add('has-appointment');
            dayEl.innerHTML += `<span class="appointment-dot"></span>`;
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

// 标签切换
document.querySelectorAll('.product-tabs .tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.product-tabs .tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');
    });
});

// 筛选按钮
document.querySelectorAll('.stats-filter .btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.stats-filter .btn').forEach(b => {
            b.classList.remove('btn-primary');
            b.classList.add('btn-default');
        });
        this.classList.remove('btn-default');
        this.classList.add('btn-primary');
    });
});

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            transform: translateX(-50%) translateY(-20px);
            opacity: 0;
        }
        to {
            transform: translateX(-50%) translateY(0);
            opacity: 1;
        }
    }
    
    .calendar-day {
        aspect-ratio: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        cursor: pointer;
        position: relative;
    }
    
    .calendar-day:hover {
        background: var(--bg-color);
    }
    
    .calendar-day.today {
        background: var(--primary-color);
        color: white;
    }
    
    .calendar-day.today .day-number {
        font-weight: 600;
    }
    
    .appointment-dot {
        width: 6px;
        height: 6px;
        background: var(--primary-color);
        border-radius: 50%;
        position: absolute;
        bottom: 6px;
    }
    
    .calendar-day.today .appointment-dot {
        background: white;
    }
`;
document.head.appendChild(style);

// 注册Service Worker（PWA支持）
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(registration => {
      console.log('Service Worker 注册成功');
    })
    .catch(error => {
      console.log('Service Worker 注册失败:', error);
    });
}

// 初始化
console.log('宠物管家系统已加载');