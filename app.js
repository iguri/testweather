const PORT = process.env.PORT || 3000;
const fs = require('fs');
const requests = require('requests');
const http = require('http');
const url = require('url');

const homefile = fs.readFileSync('index.html', 'utf-8');
const finaldata = (indexdata, val) => {
    if(val.cod == 404){
        return "city not found";
    }
    const min = Math.floor(val.main.temp_min/10);
    const max = Math.floor(val.main.temp_max/10);
    const temp = Math.floor(val.main.temp/10);
    let output = indexdata.replace('{%temploc%}', val.name);
    output = output.replace('{%tempmin%}', min);
    output = output.replace('{%tempmax%}', max);
    output = output.replace('{%tempval%}', temp);
    output = output.replace('{%tempcon%}', val.sys.country);
    output = output.replace("{%status%}", val.weather[0].main);
    return output;
}


const server = http.createServer((req , res)=>{
    const queryObjectall = url.parse(req.url,true);
    const queryObject = queryObjectall.query;
    const path = queryObjectall.pathname;
        if (path == "/"){
            requests(`http://api.openweathermap.org/data/2.5/weather?q=Delhi&appid=2bb223741facb37bec9eb8ee8d8f917c`)
            .on('data', (chunk) =>{
                const objdata = JSON.parse(chunk);
                const arrydata = [objdata];
                const realTime = arrydata.map((val)=> finaldata(homefile, val))
                res.write(realTime.join(''));
                })
            .on('end', (err) =>{
                if (err){
                    console.log(err);
                }
               res.end();
            })
        }else if (path == '/login'){
        requests(`http://api.openweathermap.org/data/2.5/weather?q=${queryObject.my}&appid=2bb223741facb37bec9eb8ee8d8f917c`)
        .on('data', (chunk) =>{
            const objdata = JSON.parse(chunk);
            const arrydata = [objdata];
            const realTime = arrydata.map((val)=> finaldata(homefile, val))
            res.write(realTime.join(''));
            })
        .on('end', (err) =>{
            if (err){
                console.log(err);
            }
           res.end();
        })
    }else{
        res.end('404');
    }
});
server.listen(PORT, () => {
    console.log(`Our app is running on port ${ PORT }`);
});