const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      authorization: 'Basic emtfZGV2X2U2YjVkMjBlMDIyNjRhNDA5ZDgwYWViYTI1ZjAzYmVjOg=='
    }
  };
  
  fetch('https://api.zerion.io/v1/wallets/0xbFE963775C57FE0B1d0c4F80a8a2CE1e431168A0/positions/?currency=usd&filter[trash]=only_non_trash&sort=value', options)
    .then(response => response.json())
    .then(response => console.log(response))
    .catch(err => console.error(err));

    // fetch('https://api.zerion.io/v1/wallets/0xbFE963775C57FE0B1d0c4F80a8a2CE1e431168A0/portfolio?currency=usd', options)
    // .then(response => response.json())
    // .then(response => console.log(response))
    // .catch(err => console.error(err));
