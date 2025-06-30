export * from '../../shared/menuData';

function getMenuFromLocalStorage() {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('shared_menu');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return getDefaultMenu();
      }
    }
  }
  return getDefaultMenu();
}

function getDefaultMenu() {
  return [
    { id: 1, name: '起司蛋餅', price: 55 },
    { id: 2, name: '火腿蛋餅', price: 45 },
    { id: 3, name: '蘿蔔糕', price: 35 },
    { id: 4, name: '香草奶茶', price: 40 },
    { id: 5, name: '巧克力奶茶', price: 40 },
    { id: 6, name: '美式咖啡', price: 50 },
    { id: 7, name: '拿鐵咖啡', price: 65 },
  ];
}

export function getMenu() {
  return getMenuFromLocalStorage();
} 