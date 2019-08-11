import fs from 'fs';

export default data => fs.writeFileSync('diff.json', JSON.stringify(data));
