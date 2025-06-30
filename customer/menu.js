// 購物車資料
let cart = [];
let menuData = null;

// 從 URL 參數取得店家 ID
function getStoreId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('store') || '001'; // 預設為 001
}

// 載入菜單資料
async function loadMenuData() {
    const storeId = getStoreId();
    const menuUrl = `/menus/store_${storeId}.json`;
    
    try {
        const response = await fetch(menuUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        menuData = await response.json();
        renderMenu();
        renderStoreInfo();
    } catch (error) {
        console.error('載入菜單失敗:', error);
        showError('載入菜單失敗，請檢查網路連線或店家編號是否正確');
    }
}

// 顯示錯誤訊息
function showError(message) {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = `<div class="error">${message}</div>`;
}

// 渲染店家資訊
function renderStoreInfo() {
    if (menuData && menuData.storeName) {
        const storeInfo = document.getElementById('storeInfo');
        const storeName = document.getElementById('storeName');
        
        storeName.textContent = menuData.storeName;
        storeInfo.style.display = 'block';
    }
}

// 渲染菜單
function renderMenu() {
    if (!menuData || !menuData.categories) {
        showError('菜單資料格式錯誤');
        return;
    }
    
    const menuContainer = document.getElementById('menuContainer');
    let menuHTML = '';
    
    menuData.categories.forEach(category => {
        menuHTML += `
            <div class="menu-category">
                <h2 class="category-title">${category.name}</h2>
        `;
        
        if (category.items && category.items.length > 0) {
            category.items.forEach(item => {
                menuHTML += `
                    <div class="menu-item">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">NT$${item.price}</span>
                        <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">＋</button>
                    </div>
                `;
            });
        } else {
            menuHTML += '<div style="color: #666; text-align: center; padding: 20px;">此分類暫無商品</div>';
        }
        
        menuHTML += '</div>';
    });
    
    menuContainer.innerHTML = menuHTML;
}

// 加入購物車
function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    updateCartDisplay();
    
    // 顯示加入成功訊息
    showNotification(`${itemName} 已加入購物車`);
}

// 從購物車移除
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// 更新購物車顯示
function updateCartDisplay() {
    const cartContainer = document.getElementById('cartContainer');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        return;
    }
    
    cartContainer.style.display = 'block';
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        cartHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>NT$${item.price}</span>
                <button class="remove-btn" onclick="removeFromCart(${index})">刪除</button>
            </div>
        `;
        total += item.price;
    });
    
    cartItems.innerHTML = cartHTML;
    cartTotal.textContent = `總計: NT$${total}`;
}

// 送出訂單
function submitOrder() {
    if (cart.length === 0) {
        showNotification('購物車是空的，請先選擇商品');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const orderData = {
        storeId: getStoreId(),
        storeName: menuData ? menuData.storeName : '未知店家',
        items: cart,
        total: total,
        timestamp: new Date().toISOString(),
        orderId: generateOrderId()
    };
    
    // 這裡可以加入實際的訂單送出邏輯
    // 例如：發送到後端 API 或 Firebase
    console.log('訂單資料:', orderData);
    
    // 顯示訂單成功訊息
    showNotification(`訂單已送出！訂單編號: ${orderData.orderId}`);
    
    // 清空購物車
    cart = [];
    updateCartDisplay();
}

// 生成訂單編號
function generateOrderId() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORDER${timestamp}${random}`;
}

// 顯示通知訊息
function showNotification(message) {
    // 創建通知元素
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 頁面載入時執行
document.addEventListener('DOMContentLoaded', function() {
    loadMenuData();
});

// 監聽 URL 變化（如果使用 SPA 路由）
window.addEventListener('popstate', function() {
    loadMenuData();
}); 