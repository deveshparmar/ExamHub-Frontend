export const checkUser = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const authorities = user ? user.authorities : null;
  
    if (!token || token === 'undefined' || !user) {
      return [false];
    }
  
    if (token && authorities.length > 0 && authorities[0].authority === 'NORMAL') {
      return [true,"NORMAL"];
    } else if (token && authorities.length > 0 && authorities[0].authority === 'ADMIN') {
      return [true,"ADMIN"];
    }
    return [false];
  };
  