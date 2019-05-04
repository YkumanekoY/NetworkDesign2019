const request = axios.create({
    baseURL: 'https://api.github.com'
})

request.get('/users/YkumanekoY') // ***部分を自分のアカウント名に置き換える
    .then(res => res.data)
    .then(console.log)
    .then(alert)