const path = require('path');
const fs = require('fs')

const express = require('express');
const app = express();

const port = 8100;


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../index.html'));
});

app.use('/media', (req, res) => {
    const path = '../static' + req._parsedUrl.pathname;
	const stat = fs.statSync(path);
	const fileSize = stat.size;
    // console.log(req.headers)
    // console.log(path)

    const range = req.headers.range;
	if (range) {
		//有range头才使用206状态码
		const parts = range.replace(/bytes=/, '').split('-');
		const start = parseInt(parts[0], 10);
		// end 在最后取值为 fileSize - 1
		const end = start + 2000000 > fileSize ? fileSize - 1 : start + 2000000;
		const chunksize = (end - start) + 1;
		const file = fs.createReadStream(path, { start, end });
		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'audio/mp4',
		};
		res.writeHead(206, head);
		file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Range': `bytes 0-2000000/${fileSize}`,
			'Content-Type': 'audio/mp4',
		};
		res.writeHead(206, head);
		fs.createReadStream(path).pipe(res);
	}
    // next();
});

app.use(express.static('../static'));
app.listen(port, () => console.log(`serve start at port ${port}`));
