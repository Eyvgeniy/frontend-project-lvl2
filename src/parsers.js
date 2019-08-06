import ini from 'ini';
import yaml from 'js-yaml';

const typeFile = {
  '.yaml': data => yaml.safeLoad(data),
  '.json': data => JSON.parse(data),
  '.ini': data => ini.parse(data),
};
export default (data, ext) => {
  const process = typeFile[ext];
  return process(data);
};
