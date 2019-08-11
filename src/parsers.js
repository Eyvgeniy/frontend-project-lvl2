import ini from 'ini';
import yaml from 'js-yaml';

const typeFile = {
  '.yaml': yaml.safeLoad,
  '.json': JSON.parse,
  '.ini': ini.parse,
};
export default (data, ext) => {
  const process = typeFile[ext];
  return process(data);
};
