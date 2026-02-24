const https = require('https');
https.get('https://wandbox.org/api/list.json', res => {
    let body = '';
    res.on('data', d => body += d);
    res.on('end', () => {
        const list = JSON.parse(body);
        const py = list.filter(c => c.language === 'Python' && !c.name.includes('head')).map(c => c.name);
        const c = list.filter(c => c.language === 'C' && !c.name.includes('head') && c.name.includes('gcc')).map(c => c.name);
        const java = list.filter(c => c.language === 'Java' && !c.name.includes('head')).map(c => c.name);
        console.log('Py:', py[0]);
        console.log('C:', c[0]);
        console.log('Java:', java[0]);
    });
});
